resource "aws_iam_policy" "server_user_policy" {
  name        = "PlayoffShowdownServerPolicy"
  description = "Policy to allow users to perform Cognito actions like sign-up, MFA registration, sign-in, and password management."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowSignUpAndSignIn"
        Effect    = "Allow"
        Action    = [
          "cognito-idp:SignUp",
          "cognito-idp:InitiateAuth",
          "cognito-idp:RespondToAuthChallenge",
          "cognito-idp:ConfirmSignUp",
          "cognito-idp:ResendConfirmationCode"
        ]
        Resource = "*"
      },
      {
        Sid       = "AllowAdminUserManagement"
        Effect    = "Allow"
        Action    = [
          "cognito-idp:AdminConfirmSignUp",
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminUpdateUserAttributes"
        ]
        Resource = aws_cognito_user_pool.cognito_user_pool.arn
      },
      {
        Sid       = "AllowPasswordManagement"
        Effect    = "Allow"
        Action    = [
          "cognito-idp:ForgotPassword",
          "cognito-idp:ConfirmForgotPassword",
          "cognito-idp:ChangePassword"
        ]
        Resource = "*"
      },
      {
        Sid       = "AllowMFARegistration"
        Effect    = "Allow"
        Action    = [
          "cognito-idp:AssociateSoftwareToken",
          "cognito-idp:VerifySoftwareToken"
        ]
        Resource = "*"
      }
    ]
  })
}

# IAM User
resource "aws_iam_user" "server_iam_user" {
  name = var.server_iam_user_name
}

# Attach Policy to User
resource "aws_iam_user_policy_attachment" "cognito_user_policy_attachment" {
  user       = aws_iam_user.server_iam_user.name
  policy_arn = aws_iam_policy.server_user_policy.arn
}

# # IAM Access Keys for User
# resource "aws_iam_access_key" "cognito_user_access_key" {
#   user = aws_iam_user.cognito_user.name
# }

# output "access_key_id" {
#   value = aws_iam_access_key.cognito_user_access_key.id
# }

# output "secret_access_key" {
#   value = aws_iam_access_key.cognito_user_access_key.secret
#   sensitive = true
# }