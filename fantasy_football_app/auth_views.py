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
from django.middleware.csrf import get_token
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.http import JsonResponse

import typing 
from typing import Dict, Any 
import logging

from .serializers import (
    UserSerializer, 
    SignupSerializer, 
    ConfirmSignupSerializer,
    LoginSerializer, 
    ForgotPasswordSerializer, 
    ConfirmForgotPasswordSerializer,
    ChangePasswordSerializer
    )

# NOTE: import instantiaed CognitoIdentityProvider class 
from .cognito_idp import cognito_service

logger = logging.getLogger(__name__)

class APIErrorResponse:
    @staticmethod
    def validation_error(errors: Dict[str, Any]) -> Response:
        return Response({
            'success': False,
            'error_type': 'VALIDATION_ERROR',
            'errors': errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @staticmethod
    def cognito_error(error_type: str, message: str, status_code: int) -> Response:
        return Response({
            'success': False,
            'error_type': error_type,
            'message': message
        }, status=status_code)
    
    @staticmethod
    def server_error(message: str = "An unexpected error occurred") -> Response:
        return Response({
            'success': False,
            'error_type': 'SERVER_ERROR',
            'message': message
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(ensure_csrf_cookie, name="post")
class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return APIErrorResponse.validation_error(serializer.errors)

            signup_resp = cognito_service.sign_up_user(
                user_name=serializer.validated_data['email'],
                password=serializer.validated_data['password1'],
                user_email=serializer.validated_data['email']
            )
            # TODO: Comment out to test out ConfirmSignupView that requires user to provide confirmation_code
            # # Confirm the user in Cognito
            # cognito_service.admin_confirm_user_sign_up(
            #     user_name=serializer.validated_data['email']
            # )

            # TODO: Comment out to test out ConfirmSignupView that requires user to provide confirmation_code
            # Update the users email to be marked as True 
            # The alternative is to send an email with a Confirm code that the user needs to provide to verify email
            # update_user_attrs_resp = cognito_service.admin_update_user_attributes(
            #     user_name=serializer.validated_data['email'],
            #     user_attributes=[ 
            #         {"Name" : "email_verified", "Value" : "true"}
            #         ] 
            #         ) 

            # # Create Django user
            # user = serializer.save()
            return Response({
                'success': True,
                'message': 'Account created in pending state. Awaiting email verification confirmation.',
            }, status=status.HTTP_201_CREATED)

        except cognito_service.cognito_idp_client.exceptions.UsernameExistsException:
            return APIErrorResponse.cognito_error(
                error='USERNAME_EXISTS',
                message='An account with this email already exists.',
                status=status.HTTP_400_BAD_REQUEST
            )
        except cognito_service.cognito_idp_client.exceptions.InvalidPasswordException as e:
            return APIErrorResponse.cognito_error(
                error_type='INVALID_PASSWORD',
                # 'Password does not meet requirements.',
                message=e.response["Error"]["Message"],
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Signup error: {str(e)}", exc_info=True)
            return APIErrorResponse.server_error()

@method_decorator(ensure_csrf_cookie, name="post")
class ConfirmSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = ConfirmSignupSerializer(data=request.data)
            if not serializer.is_valid():
                return APIErrorResponse.validation_error(serializer.errors)

            validated_data = serializer.validated_data
            confirm_signup_resp = cognito_service.confirm_user_sign_up(
                user_name=validated_data['email'],
                confirmation_code=validated_data['confirmation_code']
            )

            user = User.objects.create(
                username=validated_data['email'].lower(),
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name']
            )
            user.set_password(validated_data['password1'])
            user.save()

            return Response({
                'success': True,
                'message': 'Signup confirmation successful.',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)

        except cognito_service.cognito_idp_client.exceptions.CodeMismatchException:

            return APIErrorResponse.cognito_error(
                'INVALID_CODE',
                'Invalid confirmation code.',
                status.HTTP_400_BAD_REQUEST
            )
        except cognito_service.cognito_idp_client.exceptions.ExpiredCodeException:
            return APIErrorResponse.cognito_error(
                'EXPIRED_CODE',
                'Confirmation code has expired.',
                status.HTTP_400_BAD_REQUEST
            )
        except cognito_service.cognito_idp_client.exceptions.UserNotFoundException:
            return APIErrorResponse.cognito_error(
                'USER_NOT_FOUND',
                'User not found.',
                status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Confirm signup error: {str(e)}", exc_info=True)
            return APIErrorResponse.server_error()
         
@method_decorator(ensure_csrf_cookie, name="post")
class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            if not serializer.is_valid():
                return APIErrorResponse.validation_error(serializer.errors)

            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=username, password=password)
            if not user:
                return APIErrorResponse.cognito_error(
                    'INVALID_CREDENTIALS',
                    'Invalid username or password',
                    status.HTTP_401_UNAUTHORIZED
                )

            django_login(request, user)
            return Response({
                'success': True,
                'user': UserSerializer(user).data
            })
        except Exception as e:
            logger.error(f"Login error: {str(e)}", exc_info=True)
            return APIErrorResponse.server_error()

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try: 
            # Get the actual username string from the user object
            username = str(request.user)

            # TODO: Idea: dont even bother signing into/out of Cognito if we are not using the access_tokens from Cognito
            # TODO: 
            # logout_resp = cognito_service.admin_sign_out(user_name=username)
            
            django_logout(request)

            return Response({
                'success': True,
                'message': 'Successfully logged out'
            })
        except Exception as e:
            logger.error(f"Login error: {str(e)}", exc_info=True)
            return APIErrorResponse.server_error()

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return APIErrorResponse.validation_error(serializer.errors)

        email = serializer.validated_data['email']
        
        try:
            # Verify user exists in Django DB
            User.objects.get(email=email)
            
            # Initiate Cognito forgot password flow
            forgot_resp = cognito_service.forgot_password(user_name=email)
            
            return Response({
                'success': True,
                'message': 'Password reset code sent to your email',
                'delivery_details': forgot_resp.get('CodeDeliveryDetails', {})
            })
            
        except User.DoesNotExist:
            return APIErrorResponse.cognito_error(
                'USER_NOT_FOUND',
                'No account found with this email address',
                status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Unexpected error in forgot password flow: {str(e)}", exc_info=True)
            return APIErrorResponse.server_error()
        
class ConfirmForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ConfirmForgotPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return APIErrorResponse.validation_error(serializer.errors)

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
            
            try:
                # Update Django user password if Cognito confirms successfully
                user = User.objects.get(email=email)
                user.set_password(new_password)
                user.save()
                
                return Response({
                    'success': True,
                    'message': 'Password reset successful'
                })
                
            except User.DoesNotExist:
                logger.error(f"User {email} exists in Cognito but not in Django DB")
                return APIErrorResponse.cognito_error(
                    'USER_SYNC_ERROR',
                    'User account sync error. Please contact support.',
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except cognito_service.cognito_idp_client.exceptions.CodeMismatchException as e:
            return APIErrorResponse.cognito_error(
                "INVALID_CODE",
                e.response["Error"]["Message"],
                status.HTTP_400_BAD_REQUEST
            ) 
        except Exception as e:
            logger.error(f"Unexpected error in confirm forgot password: {str(e)}", exc_info=True)
            return APIErrorResponse.server_error()

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return APIErrorResponse.validation_error(serializer.errors)
        
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
    
class CSRFTokenView(APIView):
    # permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        response = JsonResponse({'detail': 'CSRF cookie set'})
        response['X-CSRFToken'] = get_token(request)
        return response
    