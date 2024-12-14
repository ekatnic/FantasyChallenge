terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      # version = "~> 4.0"
    }
  }
}

# cloud provider
provider "aws" {
  alias  = "origin_region"
  region = var.aws_region
  profile = var.aws_profile
}

# ----------------------------------------------
# Local variables
# ----------------------------------------------

locals {
  # deployment zip file
  app_zip = "../app.zip"
 
  # name tag for resources
  name_tag = "playoff-showdown"
}