# ---- Setting up DNS to go through an S3 bucket/cloudfront to

# S3 bucket for redirecting apex domain to www
resource "aws_s3_bucket" "redirect" {
  bucket = var.root_domain_name
}

resource "aws_s3_bucket_website_configuration" "redirect" {
  bucket = aws_s3_bucket.redirect.id

  redirect_all_requests_to {
    host_name = "www.${var.root_domain_name}"
    protocol  = "https"
  }
}

# ACM Certificate
resource "aws_acm_certificate" "cert" {
  domain_name               = var.root_domain_name
  subject_alternative_names = ["www.${var.root_domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# DNS Validation records for ACM
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.hosted_zone.zone_id
}

# cert validation
resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# cloudFront distro
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.redirect.website_endpoint
    origin_id   = "S3-${var.root_domain_name}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  
  aliases = [var.root_domain_name]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.root_domain_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

  viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    # default_ttl            = 3600
    # max_ttl                = 86400
    default_ttl            = 60
    max_ttl                = 120
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.cert.arn
    ssl_support_method  = "sni-only"
  }
}

# record for www.ourdomain.com to point to the <heroku-domain>.com
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.hosted_zone.zone_id
  name    = "www.${var.root_domain_name}"
  type    = "CNAME"
  ttl     = 60
  records = [var.heroku_domain]
}

# Route53 Records
resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.hosted_zone.zone_id
  name    = var.root_domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# Outputs
output "cloudfront_domain" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "website_endpoint" {
  value = aws_s3_bucket_website_configuration.redirect.website_endpoint
}

# terraform destroy \
#   -target=aws_s3_bucket.redirect \
#   -target=aws_s3_bucket_website_configuration.redirect \
#   -target=aws_acm_certificate.cert \
#   -target=aws_route53_record.cert_validation \
#   -target=aws_acm_certificate_validation.cert \
#   -target=aws_cloudfront_distribution.s3_distribution \
#   -target=aws_route53_record.apex \
#   -target=aws_route53_record.www