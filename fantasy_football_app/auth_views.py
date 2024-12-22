# -------------------------------------------------------------------------
# ----- Django REST Auth endpoints -----
# TODO: An idea i have is to just not even bother signing in / out of 
# TODO: Cognito service. We are NOT using teh Cognito access tokens or anything
# TODO: We are just using the Django sessions by default and ONLY using 
# TODO: Cognito to give easy Forgot password email sending so who cares about keeping signed in / out of Cognito
# TODO: The only problem might be if you are required to be "signed in" to Cognito to do certain actions but I dont think you do... 
# -------------------------------------------------------------------------

from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth import login as django_login
from django.contrib.auth import logout as django_logout
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from .serializers import (
    UserSerializer, 
    SignupSerializer, 
    LoginSerializer, 
    ForgotPasswordSerializer, 
    ConfirmForgotPasswordSerializer,
    ChangePasswordSerializer
    )

# NOTE: import cognito service instance
from .cognito_idp import cognito_service

@method_decorator(ensure_csrf_cookie, name = "post")
class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                # Register with Cognito
                cognito_service.sign_up_user(
                    user_name=serializer.validated_data['email'],
                    password=serializer.validated_data['password1'],
                    user_email=serializer.validated_data['email']
                )
                
                # Confirm the user in Cognito
                cognito_service.admin_confirm_user_sign_up(
                    user_name=serializer.validated_data['email']
                )
                
                # Create Django user
                user = serializer.save()
                
                return Response({
                    'success': True,
                    'message': 'Account created successfully',
                    'user': UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)
                
            except cognito_service.cognito_idp_client.exceptions.UsernameExistsException:
                return Response({
                    'success': False,
                    'errors': {'username': ['Username already exists in Cognito']}
                }, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({
                    'success': False,
                    'errors': {'server': [str(e)]}
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(ensure_csrf_cookie, name = "post")
class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            print(f"Authing {username} w/ pass: {password}")
            user = authenticate(request, username=username, password=password)
            
            if user:
                try:
                    # Authenticate with Cognito
                    response = cognito_service.start_sign_in(username, password)
                    print(f"Response from cognito: {response}")
                    if response.get("ChallengeName") == "NEW_PASSWORD_REQUIRED":
                        return Response({
                            'success': False,
                            'requiresPasswordReset': True,
                            'message': 'Password reset required'
                        }, status=status.HTTP_401_UNAUTHORIZED)
                    
                    django_login(request, user)
                    
                    return Response({
                        'success': True,
                        'user': UserSerializer(user).data
                    })
                    
                except Exception as e:
                    return Response({
                        'success': False,
                        'errors': {'server': [str(e)]}
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({
                'success': False,
                'errors': {'credentials': ['Invalid username or password']}
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(ensure_csrf_cookie, name = "post")
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get the actual username string from the user object
        username = str(request.user)

        # TODO: Idea: dont even bother signing into/out of Cognito if we are not using the access_tokens from Cognito
        # TODO: 
        logout_resp = cognito_service.admin_sign_out(user_name=username)
        
        django_logout(request)

        return Response({
            'success': True,
            'message': 'Successfully logged out'
        })

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                # Verify user exists in Django DB
                User.objects.get(email=email)
                
                # Initiate Cognito forgot password flow
                forgot_resp = cognito_service.forgot_password(user_name=email)
                
                return Response({
                    'success': True,
                    'message': 'Password reset code sent to your email',
                    'details': forgot_resp
                })
                
            except User.DoesNotExist:
                return Response({
                    'success': False,
                    'errors': {'email': ['No account found with this email address']}
                }, status=status.HTTP_404_NOT_FOUND)
                
            except Exception as e:
                return Response({
                    'success': False,
                    'errors': {'server': [str(e)]}
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ConfirmForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ConfirmForgotPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            confirmation_code = serializer.validated_data['confirmation_code']
            new_password = serializer.validated_data['password']
            
            try:
                # First confirm with Cognito
                confirm_resp = cognito_service.confirm_forgot_password(
                    user_name=email,
                    confirmation_code=confirmation_code,
                    password=new_password
                )
                
                # If Cognito confirms successfully, update Django user password
                try:
                    user = User.objects.get(email=email)
                    user.set_password(new_password)
                    user.save()
                    
                    return Response({
                        'success': True,
                        'message': 'Password reset successful',
                        'details': confirm_resp
                    })
                    
                except User.DoesNotExist:
                    # This shouldn't happen if the earlier flow worked correctly
                    return Response({
                        'success': False,
                        'errors': {'email': ['User not found in system']}
                    }, status=status.HTTP_404_NOT_FOUND)
                
            except Exception as e:
                return Response({
                    'success': False,
                    'errors': {'server': [str(e)]}
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            try:
                user = request.user
                new_password = serializer.validated_data['new_password']
                
                # Update password in Cognito
                cognito_response = cognito_service.admin_set_user_password(
                    user_name=user.email,  # Using email as username
                    password=new_password,
                    permanent=True
                )
                
                # If Cognito update successful, update Django password
                user.set_password(new_password)
                user.save()
                
                # Update session to prevent logout
                update_session_auth_hash(request, user)
                
                return Response({
                    'success': True,
                    'message': 'Password successfully changed',
                    'details': cognito_response
                })
                
            except Exception as e:
                return Response({
                    'success': False,
                    'errors': {'server': [str(e)]}
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

# @ensure_csrf_cookie
class AuthStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'isAuthenticated': True,
                'user': UserSerializer(request.user).data
            })
        return Response({'isAuthenticated': False})
    