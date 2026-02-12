---
title: "AWS S3 + CloudFront Cost Optimization: Simple Guide + Terraform Hands-On"
subtitle: "Learn how to optimize static website costs and deploy S3 + CloudFront with Terraform"
slug: aws-s3-cloudfront-cost-optimization-terraform
tags: aws, s3, cloudfront, terraform, cloud, devops, cost-optimization, static-site
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1234567890/s3-cloudfront-cover.png
domain: yourblog.hashnode.dev
---

# AWS S3 + CloudFront Cost Optimization (Simple Guide + Terraform Hands-On)

## Table of Contents
- [Why S3 + CloudFront?](#why-s3--cloudfront)
- [Cost Optimization: the real levers](#cost-optimization-the-real-levers)
- [Advantages of S3 + CloudFront](#advantages-of-s3--cloudfront)
- [When to use S3 + CloudFront](#when-to-use-s3--cloudfront)
- [When NOT to use S3 + CloudFront](#when-not-to-use-s3--cloudfront)
- [Hands-on with Terraform (simple)](#hands-on-with-terraform-simple)
- [Clean up](#clean-up)
- [Conclusion](#conclusion)

---

## Why S3 + CloudFront?

S3 + CloudFront is one of the simplest ways to host a fast, secure static website on AWS.  
S3 stores your files, and CloudFront distributes them globally with caching.

You pay mostly for:
- storage (S3)
- requests
- data transfer out (CloudFront)

For many front-end apps, this setup is cheaper and easier to operate than servers.

---

## Cost Optimization: the real levers

S3 + CloudFront costs depend on a few practical levers:

- **Cache hit ratio**: more cache hits = fewer origin requests = lower cost.
- **Data transfer out**: large assets and video increase spend quickly.
- **Invalidations**: frequent full-cache invalidations can add cost after free tier limits.
- **File strategy**: immutable hashed assets (`assets/app.abc123.js`) reduce re-downloads.
- **Price class**: CloudFront `PriceClass_100` can reduce cost if global ultra-low latency is not required.

> **Quick tip**: keep `index.html` short-cache/no-cache, and static assets long-cache + immutable.

---

## Advantages of S3 + CloudFront

- ✅ Low ops overhead (fully managed)
- ✅ Good performance worldwide
- ✅ Secure private S3 origin with OAC
- ✅ Scales automatically
- ✅ Great fit for React/Vue static builds

---

## When to use S3 + CloudFront

Great fit for:

- Static front-end apps (React/Vue/Angular build output)
- Marketing sites and documentation portals
- SPAs with client-side routing
- Workloads with variable global traffic

---

## When NOT to use S3 + CloudFront

Avoid this architecture if:

- ❌ You need server-side business logic (without adding Lambda/API backend)
- ❌ You need dynamic rendering tightly coupled to each request
- ❌ You need WebSocket-heavy real-time backend features

---

## Hands-on with Terraform (simple)

This repo already includes a modular S3 + CloudFront stack:

- private S3 bucket
- CloudFront distribution
- Origin Access Control (OAC)
- bucket policy for CloudFront-only access
- static file upload from `react-app/dist`
- CloudFront invalidation after deploy

### 📦 Source Code

Get the complete code here: [**serverless-stack on GitHub**](https://github.com/Ankoay-Feno/serverless-stack.git)

```bash
git clone https://github.com/Ankoay-Feno/serverless-stack.git
cd serverless-stack
```

### Prerequisites

- AWS account
- AWS CLI configured
- Terraform >= 1.5
- Node.js + npm

### Step 1: Configure AWS CLI

```bash
aws configure
```

### Step 2: Build the React app

```bash
cd s3+cloudfront/react-app
npm install
npm run build
```

### Step 3: Prepare Terraform variables (optional)

```bash
cd ../terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit if needed:
- `aws_region`
- `app_name`
- `environment`
- `price_class`
- `build_dir`

### Step 4: Initialize Terraform

```bash
terraform init
```

### Step 5: Plan and apply

```bash
terraform plan
terraform apply
```

Terraform will:
- create a private S3 bucket
- create CloudFront + OAC
- upload static files
- invalidate CloudFront cache after deployment

### Step 6: Open the website

After apply:

```bash
terraform output website_url
```

You can also check:
- `terraform output cloudfront_domain_name`
- `terraform output bucket_name`

---

## Clean up

To remove all resources:

```bash
terraform destroy
```

---

## Conclusion

S3 + CloudFront is a strong default for static websites: simple, scalable, and cost-efficient.  
To optimize cost, focus on cache strategy, asset sizing, and invalidation discipline.

### 🚀 Next Steps

If you want, I can also add:

- Custom domain + HTTPS (ACM + Route53)
- CI/CD deployment (GitHub Actions)
- Monitoring dashboard (CloudWatch + billing alarms)

---

**Found this helpful?** Don’t forget to star the [GitHub repo](https://github.com/Ankoay-Feno/serverless-stack.git) and share with your team.
