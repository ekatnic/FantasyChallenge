terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.48"
    }
  }
}

variable "region" {
  type    = string
  default = "us-east-1"
}

provider "aws" {
  region = var.region
  profile = var.aws_profile
}

# # cloud provider for ACM certificate (has to be us-east-1)
# provider "aws" {
#   alias  = "cert_region"
#   region = var.cert_aws_region
#   profile = var.aws_profile
# }

# ----------------------------------------------
# Local variables
# ----------------------------------------------

locals {
  # deployment zip file
  app_zip = "../app.zip"
 
  # name tag for resources
  name_tag = "playoff-showdown"
}