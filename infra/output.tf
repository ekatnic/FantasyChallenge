output "user_pool_id" {
  value = aws_cognito_user_pool.cognito_user_pool.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.user_pool_client.id
}

output "hosted_ui_url" {
    value = "https://${aws_cognito_user_pool_domain.cognito_user_pool_domain.domain}.auth.${var.region}.amazoncognito.com/login?client_id=${aws_cognito_user_pool_client.user_pool_client.id}&response_type=code&scope=email+openid+profile&redirect_uri=${tolist(aws_cognito_user_pool_client.user_pool_client.callback_urls)[0]}"
#   value = "https://${aws_cognito_user_pool_domain.cognito_user_pool_domain.domain}.auth.${var.region}.amazoncognito.com/login?client_id=${aws_cognito_user_pool_client.user_pool_client.id}&response_type=code&scope=email+openid+profile&redirect_uri=${aws_cognito_user_pool_client.user_pool_client.callback_urls[0]}"
}