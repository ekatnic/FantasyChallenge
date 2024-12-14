# -----------------------------------------------------------
# S3 bucket for storing emails (needed for SES)
# -----------------------------------------------------------

resource "aws_s3_bucket" "emails_bucket" {
    bucket = var.email_bucket_name
}

resource "aws_s3_bucket_policy" "emails_bucket_policy" {
  bucket = "${aws_s3_bucket.emails_bucket.id}"

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowSESPuts",
            "Effect": "Allow",
            "Principal": {
                "Service": "ses.amazonaws.com"
            },
            "Action": "s3:PutObject",
            "Resource" : "arn:aws:s3:::${aws_s3_bucket.emails_bucket.id}/*",
        }
    ]
}
POLICY
  depends_on = [
    null_resource.delay
  ]
}
