variable "site_name" {
  description = "Name prefix for CloudFront resources."
  type        = string
}

variable "price_class" {
  description = "CloudFront price class."
  type        = string
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
