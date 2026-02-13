variable "site_name" {
  description = "Name prefix for CloudFront resources."
  type        = string
}

variable "price_class" {
  description = "CloudFront price class."
  type        = string
}

variable "enable_waf" {
  description = "Enable AWS WAF on CloudFront."
  type        = bool
  default     = true
}

variable "waf_rate_limit" {
  description = "Max requests per 5 minutes per IP before block."
  type        = number
  default     = 2000
}

variable "enable_shield_advanced" {
  description = "Enable Shield Advanced on CloudFront distribution."
  type        = bool
  default     = false
}

variable "bucket_id" {
  description = "S3 bucket ID used as CloudFront origin."
  type        = string
}

variable "bucket_arn" {
  description = "S3 bucket ARN used in bucket policy."
  type        = string
}

variable "bucket_regional_domain_name" {
  description = "Regional domain name for the S3 origin."
  type        = string
}

variable "tags" {
  description = "Tags to apply to CloudFront resources."
  type        = map(string)
  default     = {}
}
