# Terraform: Static React app on S3 + CloudFront (modular)

This stack deploys a static React site (`react-app/dist`) with:
- a private S3 bucket
- a CloudFront distribution
- an Origin Access Control (OAC)
- an S3 bucket policy that allows CloudFront only
- AWS WAF managed rules + per-IP rate limiting
- CloudFront security headers policy (HSTS, X-Frame-Options, etc.)
- a custom 404 page (`/404.html`)
- static build upload to S3

## Modular structure
- `modules/s3_site`: private S3 bucket + access controls + versioning
- `modules/cloudfront_site`: OAC + CloudFront distribution + bucket policy
- root `main.tf`: module wiring + static file upload

## Prerequisites
- AWS credentials configured (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, etc.)
- Terraform >= 1.5
- React build generated in `react-app/dist`

## Usage
1. Build React:
   ```bash
   cd react-app
   npm run build
   cd ..
   ```
2. Prepare variables:
   ```bash
   cd iac
   cp terraform.tfvars.example terraform.tfvars
   ```
3. Deploy:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```
4. Get the URL:
   ```bash
   terraform output website_url
   ```

## Useful variables
- `aws_region`: AWS region for the S3 bucket
- `app_name`: naming prefix
- `environment`: environment suffix (`dev`, `prod`, ...)
- `build_dir`: static assets directory (default: `../react-app/dist`)
- `price_class`: CloudFront price class
- `enable_waf`: enable/disable WAF on CloudFront
- `waf_rate_limit`: request threshold per IP (5-minute window)
- `enable_shield_advanced`: enable Shield Advanced (requires subscription)

## Notes
- The bucket is not public.
- SPA routes are rewritten to `/index.html` with a CloudFront Function.
- Origin errors (`403/404`) return `/404.html` with HTTP `404`.
- CloudFront enforces HTTPS redirect and minimum TLS version `1.2_2021`.
- The distribution uses the default CloudFront certificate (`*.cloudfront.net`).
- For a custom domain, add ACM + CloudFront `aliases` + Route53.
