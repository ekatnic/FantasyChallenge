# import boto3
# from botocore.exceptions import ClientError
# from fastapi import HTTPException
# from pydantic import BaseModel
# import hashlib
# import hmac
# import base64
# import logging

# logger = logging.getLogger(__name__)

# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Purpose

Shows how to use the AWS SDK for Python (Boto3) with Amazon Cognito to
sign up a user, register a multi-factor authentication (MFA) application, sign in
using an MFA code, and sign in using a tracked device.
"""

from django.conf import settings

import logging
import typing
from typing import Optional

import base64
import hashlib
import hmac

from botocore.exceptions import ClientError
import boto3

logger = logging.getLogger(__name__)

class CognitoIdentityProvider:
    """Encapsulates Amazon Cognito actions"""

    def __init__(self, cognito_idp_client, user_pool_id, client_id, client_secret=None):
        """
        :param cognito_idp_client: A Boto3 Amazon Cognito Identity Provider client.
        :param user_pool_id: The ID of an existing Amazon Cognito user pool.
        :param client_id: The ID of a client application registered with the user pool.
        :param client_secret: The client secret, if the client has a secret.
        """
        self.cognito_idp_client = cognito_idp_client
        self.user_pool_id = user_pool_id
        self.client_id = client_id
        self.client_secret = client_secret

    def _secret_hash(self, user_name):
        """
        Calculates a secret hash from a user name and a client secret.

        :param user_name: The user name to use when calculating the hash.
        :return: The secret hash.
        """
        key = self.client_secret.encode()
        msg = bytes(user_name + self.client_id, "utf-8")
        secret_hash = base64.b64encode(
            hmac.new(key, msg, digestmod=hashlib.sha256).digest()
        ).decode()
        # logger.info("Made secret hash for %s: %s.", user_name, secret_hash)
        return secret_hash

    def sign_up_user(self, 
                    user_name :str, 
                    password : str, 
                    user_email : str,       
                    birthdate: Optional[str] = None, 
                    given_name: Optional[str] = None, 
                    family_name: Optional[str] = None
                    ):
        """
        Signs up a new user with Amazon Cognito. This action prompts Amazon Cognito
        to send an email to the specified email address. The email contains a code that
        can be used to confirm the user.

        When the user already exists, the user status is checked to determine whether
        the user has been confirmed.

        :param user_name: The user name that identifies the new user.
        :param password: The password for the new user.
        :param user_email: The email address for the new user.
        :return: True when the user is already confirmed with Amazon Cognito.
                 Otherwise, false.
        """
        try:

            # Email attribute + unpack the optional attributes into the user_attributes list 
            user_attributes = [
                    {"Name": "email", "Value": user_email},
                    *(
                        {"Name": attr_name, "Value": attr_value}
                        for attr_name, attr_value in {
                            "birthdate": birthdate,
                            "given_name": given_name,
                            "family_name": family_name,
                        }.items()
                        if attr_value is not None
                    ),
                ]
             
            kwargs = {
                "ClientId": self.client_id,
                "Username": user_name,
                "Password": password,
                "UserAttributes": user_attributes,
                # "UserAttributes": [{"Name": "email", "Value": user_email}],
            }

            if self.client_secret is not None:
                kwargs["SecretHash"] = self._secret_hash(user_name)
            
            response = self.cognito_idp_client.sign_up(**kwargs)
            confirmed = response["UserConfirmed"]

        except ClientError as err:
            if err.response["Error"]["Code"] == "UsernameExistsException":
                response = self.cognito_idp_client.admin_get_user(
                    UserPoolId=self.user_pool_id, Username=user_name
                )
                logger.warning(
                    "User %s exists and is %s.", user_name, response["UserStatus"]
                )
                confirmed = response["UserStatus"] == "CONFIRMED"
            else:
                logger.error(
                    "Couldn't sign up %s. Here's why: %s: %s",
                    user_name,
                    err.response["Error"]["Code"],
                    err.response["Error"]["Message"],
                )
                raise err
        return confirmed

    def resend_confirmation(self, user_name):
        """
        Prompts Amazon Cognito to resend an email with a new confirmation code.

        :param user_name: The name of the user who will receive the email.
        :return: Delivery information about where the email is sent.
        """
        try:
            kwargs = {"ClientId": self.client_id, "Username": user_name}
            if self.client_secret is not None:
                kwargs["SecretHash"] = self._secret_hash(user_name)
            response = self.cognito_idp_client.resend_confirmation_code(**kwargs)
            delivery = response["CodeDeliveryDetails"]
        except ClientError as err:
            logger.error(
                "Couldn't resend confirmation to %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return delivery

    def confirm_user_sign_up(self, user_name, confirmation_code):
        """
        Confirms a previously created user. A user must be confirmed before they
        can sign in to Amazon Cognito.

        :param user_name: The name of the user to confirm.
        :param confirmation_code: The confirmation code sent to the user's registered
                                  email address.
        :return: True when the confirmation succeeds.
        """
        try:
            kwargs = {
                "ClientId": self.client_id,
                "Username": user_name,
                "ConfirmationCode": confirmation_code,
            }
            if self.client_secret is not None:
                kwargs["SecretHash"] = self._secret_hash(user_name)
            confirmed_user = self.cognito_idp_client.confirm_sign_up(**kwargs)
            
        except ClientError as err:
            logger.error(
                "Couldn't confirm sign up for %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise err
        else:
            return True

    def admin_confirm_user_sign_up(self, user_name):
        """
        Confirms user sign-up as an administrator. Unlike ConfirmSignUp, your IAM credentials authorize user account confirmation. 
        No confirmation code is required.

        This request sets a user account active in a user pool that requires confirmation of new user 
        accounts before they can sign in. You can configure your user pool to not send confirmation codes to new users and 
        instead confirm them with this API operation on the back end.

        :param user_name: The name of the user to confirm.
        :return: True when the confirmation succeeds.
        """
        try:
            kwargs = {
                "UserPoolId": self.user_pool_id,
                "Username": user_name
            }
            # if self.client_secret is not None:
            #     kwargs["SecretHash"] = self._secret_hash(user_name)
            confirmed_user = self.cognito_idp_client.admin_confirm_sign_up(**kwargs)
            print(f"Confirmed user: {confirmed_user}")
        except ClientError as err:
            logger.error(
                "Couldn't confirm sign up for %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return True
        
            
    def forgot_password(self, user_name):
        """
        Start Forgot password flow for a user. Sends a confirmation_code to the users verification email.

        :param user_name: The username of the user that you want to query or modify. 
                            The value of this parameter is typically your user’s username,
                            but it can be any of their alias attributes. If username isn’t an alias attribute 
                            in your user pool, this value must be the sub of a local user or
                            the username of a user from a third-party IdP.
        :return: (The response from Amazon Cognito to a request to reset a password (or Boolean, True if the forgotten password flow was successfully initialized)
        """
        try:
            kwargs = {
                "ClientId": self.client_id,
                "Username": user_name,
            }
            if self.client_secret is not None:
                kwargs["SecretHash"] = self._secret_hash(user_name)
            
            forgot_resp = self.cognito_idp_client.forgot_password(**kwargs)

            print(f"Forgot password for user resp:\n > '{forgot_resp}'")
            
        except ClientError as err:
            logger.error(
                "Couldn't confirm forgot password for %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise err
        else:
            return forgot_resp 

    def confirm_forgot_password(self, user_name, confirmation_code, password):
        """
        Confirms a previously created user claimed they forgot there password. 

        :param user_name: The name of the user to confirm.
        :param confirmation_code: The confirmation code sent to the user's registered
                                  email address.
        :param password: new password user wants to set
        :return: True when the confirmation succeeds.
        """
        try:
            kwargs = {
                "ClientId": self.client_id,
                "Username": user_name,
                "ConfirmationCode": confirmation_code,
                "Password" : password,
            }
            if self.client_secret is not None:
                kwargs["SecretHash"] = self._secret_hash(user_name)
            confirmed_user = self.cognito_idp_client.confirm_forgot_password(**kwargs)
            
            print(f"Confirmed user: {confirmed_user}")

        except ClientError as err:
            logger.error(
                "Couldn't confirm forgot password for %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise err
        else:
            return True
    
    def change_password(self, user_name, old_password, new_password, access_token):
        """
        Change the password for a user in the user pool.

        :param user_name: The name of the user to change the password for.
        :param old_password: The current password for the user.
        :param new_password: The new password for the user.
        :param access_token: The access token for the user.
        """
        try:
            kwargs = {
                "PreviousPassword": old_password,
                "ProposedPassword": new_password,
                "AccessToken": access_token,
            }
            response = self.cognito_idp_client.change_password(**kwargs)
        except ClientError as err:
            logger.error(
                "Couldn't change password for %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return response

    def admin_set_user_password(self, user_name, password, permanent=True):
        """
        Sets the specified user’s password in a user pool. This operation administratively sets a temporary or permanent password for a user. With this operation, 
        you can bypass self-service password changes and permit immediate sign-in with the password that you set. To do this, set Permanent to true.

        :param user_name: The name of the user to change the password for.
        :param password: The current password for the user.
        :param permanent: Boolean whether to set the password permentgatly or not. Default is True.
        """
        try:
            kwargs = {
                "UserPoolId": self.user_pool_id,
                "Username": user_name,
                "Password": password,
                "Permanent": permanent,
            }
            response = self.cognito_idp_client.admin_set_user_password(**kwargs)
        except ClientError as err:
            logger.error(
                "Couldn't change password for %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return response

    def admin_update_user_attributes(self, user_name, user_attributes):
        """
        Admin update a users attributes
        :param user_name: The name of the user to change the password for.
        :param user_attributes: An array of name-value pairs representing user attributes. For custom attributes, you must prepend the custom: prefix to the attribute name.
        """
        try:
            kwargs = {
                "UserPoolId": self.user_pool_id,
                "Username": user_name,
                "UserAttributes": user_attributes
            }
            response = self.cognito_idp_client.admin_update_user_attributes(**kwargs)
        except ClientError as err:
            logger.error(
                "Couldn't change password for %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return response

    def start_sign_in(self, user_name, password):
        """
        Starts the sign-in process for a user by using administrator credentials.
        This method of signing in is appropriate for code running on a secure server.

        If the user pool is configured to require MFA and this is the first sign-in
        for the user, Amazon Cognito returns a challenge response to set up an
        MFA application. When this occurs, this function gets an MFA secret from
        Amazon Cognito and returns it to the caller.

        :param user_name: The name of the user to sign in.
        :param password: The user's password.
        :return: The result of the sign-in attempt. When sign-in is successful, this
                 returns an access token that can be used to get AWS credentials. Otherwise,
                 Amazon Cognito returns a challenge to set up an MFA application,
                 or a challenge to enter an MFA code from a registered MFA application.
        """
        try:
            kwargs = {
                "UserPoolId": self.user_pool_id,
                "ClientId": self.client_id,
                "AuthFlow": "ADMIN_USER_PASSWORD_AUTH",
                "AuthParameters": {"USERNAME": user_name, "PASSWORD": password},
            }
            if self.client_secret is not None:
                kwargs["AuthParameters"]["SECRET_HASH"] = self._secret_hash(user_name)
            
            response = self.cognito_idp_client.admin_initiate_auth(**kwargs)
            
            print(f"Sign in successfull from Cognito!")

            challenge_name = response.get("ChallengeName", None)
            if challenge_name == "MFA_SETUP":
                if (
                    "SOFTWARE_TOKEN_MFA"
                    in response["ChallengeParameters"]["MFAS_CAN_SETUP"]
                ):
                    response.update(self.get_mfa_secret(response["Session"]))
                else:
                    raise RuntimeError(
                        "The user pool requires MFA setup, but the user pool is not "
                        "configured for TOTP MFA. This example requires TOTP MFA."
                    )
        except ClientError as err:
            logger.error(
                "Couldn't start sign in for %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            response.pop("ResponseMetadata", None)
            return response

    def admin_sign_out(self, user_name):
        """
        Signs out a user from all devices.

        :param user_name: The name of the user to sign out.
        """
        try:

            print(f"Trying to admin global user signout user_name: {user_name}")
            kwargs = {
                "UserPoolId": self.user_pool_id,
                "Username": user_name,
            }
            response = self.cognito_idp_client.admin_user_global_sign_out(**kwargs)
            print(f"Cognito response to admin global user sign out: {response}")
        except ClientError as err:
            logger.error(
                "Couldn't sign out for %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return response
        
    def sign_out(self, access_token):
        """
        Sign out a user using a valid user access token  
        :param access_token: valid user access_token
        """
        try:
            kwargs = {
                "AccessToken": access_token,
            }
            response = self.cognito_idp_client.global_sign_out(**kwargs)
        except ClientError as err:
            logger.error(
                "Couldn't sign out for user using given access_token. Here's why: %s: %s",
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return response

    def get_user_by_username(self, user_name):
        try:
            response = self.cognito_idp_client.admin_get_user(
                UserPoolId=self.user_pool_id, Username=user_name
            )
        except ClientError as err:
            logger.error(
                "Couldn't get user data out for %s. Here's why: %s: %s",
                user_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise 
        else: 
            return response
        
# Initialize Cognito client (ensure these are imported from your .emv and put into settings)
cognito_client = boto3.client('cognito-idp', 
                              region_name=settings.AWS_COGNITO_REGION,
                                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                              )
                              
cognito_service = CognitoIdentityProvider(
    cognito_idp_client=cognito_client, 
    user_pool_id=settings.AWS_COGNITO_USER_POOL_ID,
    client_id=settings.AWS_COGNITO_CLIENT_ID,
    client_secret=settings.AWS_COGNITO_CLIENT_SECRET
)