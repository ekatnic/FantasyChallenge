
# --------------------------------------------------------
# Route53 resources
#  - Records
#  - Hosted Zone
# ACM certificate Zone 
# --------------------------------------------------------

# TODO: 
# - TODO: Make a list of all desired subdomains
# - Callback URL for Cognito User Pool Client
# - Login subdomain name for Cognito User Pool Domain
# - Email subdomain for SES 

# --------------------------------------------------------
# Hosted Zone 
# NOTE: this is an already created hosted zone 
# --------------------------------------------------------

data "aws_route53_zone" "hosted_zone" {
    zone_id = var.hosted_zone_id
    private_zone = false
}

# --------------------------------------------------------
# ACM Cert 
# Route 53 record
# ACM cert validation
# --------------------------------------------------------

resource "aws_acm_certificate" "cert" {
    provider = aws.cert_region
    domain_name = var.root_domain_name
    validation_method = "DNS"
    subject_alternative_names = [
    "*.${var.root_domain_name}",
]
}

resource "aws_route53_record" "record_cert_validation" {
    for_each = {
        for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
            name   = dvo.resource_record_name
            record = dvo.resource_record_value
            type   = dvo.resource_record_type
        }
  }
    allow_overwrite = true
    name = each.value.name
    records = [each.value.record]
    ttl = 60
    type = each.value.type
    zone_id = data.aws_route53_zone.hosted_zone.zone_id
}

resource "aws_acm_certificate_validation" "cert_validation" {
   provider = aws.cert_region
    certificate_arn         = aws_acm_certificate.cert.arn
    validation_record_fqdns = [for record in aws_route53_record.record_cert_validation : record.fqdn]
    timeouts {
    create = "45m"
    }
}