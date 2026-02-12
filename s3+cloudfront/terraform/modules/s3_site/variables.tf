variable "site_name" {
  description = "Base name used to create the S3 bucket name."
  type        = string
}

variable "tags" {
  description = "Tags to apply to S3 resources."
  type        = map(string)
  default     = {}
}
