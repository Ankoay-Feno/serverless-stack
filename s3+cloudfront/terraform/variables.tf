variable "aws_region" {
  description = "AWS region for the S3 bucket."
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Prefix used for naming resources."
  type        = string
  default     = "react-static-site"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "build_dir" {
  description = "Path to the React build output (relative to iac directory)."
  type        = string
  default     = "../react-app/dist"
}

variable "price_class" {
  description = "CloudFront price class."
  type        = string
  default     = "PriceClass_100"
}

variable "tags" {
  description = "Additional tags to apply to resources."
  type        = map(string)
  default     = {}
}
