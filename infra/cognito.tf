# ----------------------------------------------------------------------    
# Cognito User pool 
# ----------------------------------------------------------------------    
resource "aws_cognito_user_pool" "cognito_user_pool" {
  name = var.cognito_user_pool_name 

  username_attributes = ["email"]
  auto_verified_attributes = ["email"]
 
  # No MFA
  mfa_configuration = "OFF"

  # # Uncheck self-service account recovery
  # admin_create_user_config {
  #   allow_admin_create_user_only = true # Only admin can create users
  #   # allow_admin_create_user_only = false # Allow users to sign up themselves
  # } 

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
  
  # Email to use for emailing users 
  # TODO: Set up SES to send emails from own email 
  # TODO: Currently this is using the Cognito default email which is good for testing out in develepment purposes
  # TODO: Cognito will send ~50 emails per day for free for testing purposes
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT" 
  }

  # Verification message templates
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject = "Fantasy Playoff Showdown Account Confirmation"
    email_message = "Welcome to the 2025 Fantasy Playoff Showdown! Verify your registration with the confirmation code {####}"
    # default_email_option = "CONFIRM_WITH_LINK"
    # email_subject_by_link = "Verify Your Account"
    # email_message_by_link = "Click the link below to verify your email address. {##Click Here##}"
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }

  }
}

# ----------------------------------------------------------------------    
# Cognito User pool client
# ----------------------------------------------------------------------    

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name         = var.cognito_user_pool_client_name 
  user_pool_id = aws_cognito_user_pool.cognito_user_pool.id
  generate_secret = false
  refresh_token_validity = 60
  prevent_user_existence_errors = "ENABLED"
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_scopes = [
    "email",
    "openid",
    # "phone",
    "profile",
    "aws.cognito.signin.user.admin",
  ]

  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH", # to enable the authentication tokens to be refreshed.
    "ALLOW_USER_PASSWORD_AUTH", # to enable user authentication by username(email?) and password 
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",` # to enable user authentication with credentials created by the admin.
    "ALLOW_USER_SRP_AUTH",
    ]
    
  # TODO: frontend's callback URL
  # TODO: Need a redirect URL to send the user to after login 
  # TODO: Make sure this subdomain is covered by the ACM cert  
  # callback_urls = [var.callback_subdomain_name] # TODO: frontend's callback URL
  callback_urls = ["http://localhost:8000/callback/"] # Update with your frontend's callback oURL
  supported_identity_providers         = ["COGNITO"]
}

# ----------------------------------------------------------------------    
# Cognito Domain / Route 53
# TODO: Get Cognito Domain setup 
# ----------------------------------------------------------------------    
variable "cognito_user_pool_domain_name" {
  default = "playoff-showdown"
}

resource "aws_cognito_user_pool_domain" "cognito_user_pool_domain" {
  domain       = var.cognito_user_pool_domain_name
  user_pool_id = aws_cognito_user_pool.cognito_user_pool.id
}

# NOTE: Using ACM cert for custom domain
# resource "aws_cognito_user_pool_domain" "user_pool_domain" {
#   domain       = var.login_subdomain_name 
#   certificate_arn = aws_acm_certificate.cert.arn
#   user_pool_id = aws_cognito_user_pool.cognito_user_pool.id
# }

# resource "aws_cognito_user_pool_ui_customization" "cognito_ui_customization" {
#   client_id = aws_cognito_user_pool_client.user_pool_client.id

#   css        = ".label-customizable {font-weight: 400;}"
#   # image_file = filebase64("logo.png")

#   # Refer to the aws_cognito_user_pool_domain resource's
#   # user_pool_id attribute to ensure it is in an 'Active' state
#   user_pool_id = aws_cognito_user_pool_domain.user_pool_domain.user_pool_id
# }

# resource "aws_route53_record" "login_site_record" {
#   provider = aws.origin_region
#   name    = var.login_subdomain_name
#   type    = "CNAME"
#   zone_id = data.aws_route53_zone.hosted_zone.zone_id
  
#   alias {
#     evaluate_target_health = false
#     name    = aws_cognito_user_pool_domain.user_pool_domain.cloudfront_distribution
#     zone_id = aws_cognito_user_pool_domain.user_pool_domain.cloudfront_distribution_zone_id
#   }
# }
