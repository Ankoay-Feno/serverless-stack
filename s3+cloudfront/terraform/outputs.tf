output "bucket_name" {
  description = "S3 bucket name hosting the site."
  value       = module.s3_site.bucket_id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID."
  value       = module.cloudfront_site.distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain for the deployed website."
  value       = module.cloudfront_site.domain_name
}

output "website_url" {
  description = "Website URL (CloudFront default domain)."
  value       = "https://${module.cloudfront_site.domain_name}"
}
