locals {
  full_name = "${var.app_name}-${var.environment}"

  merged_tags = merge(
    {
      Application = var.app_name
      Environment = var.environment
      ManagedBy   = "terraform"
    },
    var.tags,
  )

  mime_types = {
    css   = "text/css"
    gif   = "image/gif"
    html  = "text/html"
    ico   = "image/vnd.microsoft.icon"
    jpeg  = "image/jpeg"
    jpg   = "image/jpeg"
    js    = "application/javascript"
    json  = "application/json"
    map   = "application/json"
    png   = "image/png"
    svg   = "image/svg+xml"
    txt   = "text/plain"
    webp  = "image/webp"
    woff  = "font/woff"
    woff2 = "font/woff2"
  }

  site_build_hash = sha1(join(",", [
    for f in sort(fileset(var.build_dir, "**/*")) :
    "${f}:${filemd5("${var.build_dir}/${f}")}"
  ]))
}

module "s3_site" {
  source = "./modules/s3_site"

  site_name = local.full_name
  tags      = local.merged_tags
}

module "cloudfront_site" {
  source = "./modules/cloudfront_site"
  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  site_name                   = local.full_name
  price_class                 = var.price_class
  bucket_id                   = module.s3_site.bucket_id
  bucket_arn                  = module.s3_site.bucket_arn
  bucket_regional_domain_name = module.s3_site.bucket_regional_domain_name
  enable_waf                  = var.enable_waf
  waf_rate_limit              = var.waf_rate_limit
  enable_shield_advanced      = var.enable_shield_advanced
  tags                        = local.merged_tags

  depends_on = [module.s3_site]
}

resource "aws_s3_object" "site_files" {
  for_each = fileset(var.build_dir, "**/*")

  bucket       = module.s3_site.bucket_id
  key          = each.value
  source       = "${var.build_dir}/${each.value}"
  etag         = filemd5("${var.build_dir}/${each.value}")
  content_type = lookup(local.mime_types, reverse(split(".", each.value))[0], "application/octet-stream")

  cache_control = (
    each.value == "index.html" ? "no-cache, no-store, must-revalidate" :
    startswith(each.value, "assets/") ? "public, max-age=31536000, immutable" :
    "public, max-age=300"
  )
}

resource "terraform_data" "site_deploy_invalidation" {
  triggers_replace = [
    module.cloudfront_site.distribution_id,
    local.site_build_hash,
  ]

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${module.cloudfront_site.distribution_id} --paths '/*'"
  }

  depends_on = [aws_s3_object.site_files]
}
