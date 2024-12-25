# -----------------------------------------------------------
# SES Configuration
# # TODO:
# -----------------------------------------------------------

# resource "aws_ses_domain_identity" "ses_domain_id" {
#     domain = var.root_domain_name
# }

# resource "aws_ses_domain_dkim" "ses_domain_dkim" {
#   domain = "${aws_ses_domain_identity.ses_domain_id.domain}"
# }

# resource "null_resource" "delay" {
#   provisioner "local-exec" {
#     command = "sleep 10"
#   }
#   triggers = {
#     "after" = aws_s3_bucket.emails_bucket.id
#   }
# }

# resource "aws_ses_receipt_rule" "store" {
#   name          = "store"
#   rule_set_name = "default-rule-set"
#   enabled       = true
#   scan_enabled  = true

#   add_header_action {
#     header_name  = "Custom-Header"
#     header_value = "Added by SES"
#     position     = 1
#   }

#   s3_action {
#     bucket_name = "${aws_s3_bucket.emails_bucket.id}"
#     object_key_prefix = "incoming"
#     position    = 2
#   }

#   depends_on = [
#     aws_s3_bucket_policy.emails_bucket_policy,
#     aws_ses_receipt_rule.store
#   ]
# }

# # -----------------------------------------------------------
# # SES Domain Verification 
# # TODO: Add Route53 record for SES domain verification
# # -----------------------------------------------------------

# resource "aws_route53_record" "email_site_route53_record" {
#   provider = aws.origin_region
#   zone_id = data.aws_route53_zone.hosted_zone.zone_id
#   name    = "_amazonses.${aws_ses_domain_identity.ses_domain_id.id}"
#   type    = "TXT"
#   ttl     = "600"
   
#   records = [aws_ses_domain_identity.ses_domain_id.verification_token] 
  
#   alias {
#     evaluate_target_health = false
#     name    = aws_cognito_user_pool_domain.recipes_user_pool_domain.cloudfront_distribution
#     zone_id = aws_cognito_user_pool_domain.recipes_user_pool_domain.cloudfront_distribution_zone_id
#   }

# }

# resource "aws_ses_domain_identity_verification" "ses_domain_id_verification" {
#   domain = aws_ses_domain_identity.ses_domain_id.id

#   depends_on = [aws_route53_record.email_site_route53_record]
# }