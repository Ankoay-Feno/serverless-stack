# AWS Lambda Cost Optimization (Simple Guide + Terraform Hands-On)



Tags: `aws` `lambda` `serverless` `cost-optimization` `terraform` `best-practices`

---

## Table of Contents
- Why AWS Lambda?
- Cost Optimization: the real levers
- Advantages of Lambda
- When to use Lambda
- When NOT to use Lambda
- Hands-on with Terraform (simple)
- Clean up
- Conclusion

---

## Why AWS Lambda?
AWS Lambda lets you run code without managing servers. You pay only for **requests** and **execution time**. It’s ideal when your traffic is unpredictable or event-driven.

---

## Cost Optimization: the real levers
Lambda cost is not magic. It depends on a few things:

- **Execution time**: shorter runtime = cheaper.
- **Memory size**: more memory costs more, but can reduce runtime.
- **Invocation count**: many small calls can still be expensive.
- **Cold starts**: not always a cost issue, but can impact latency and lead to higher memory needs.

Quick tip: try 256MB, 512MB, 1024MB and compare **cost per request**. Sometimes more memory is cheaper overall because the function finishes faster.

---

## Advantages of Lambda
- No server management
- Auto scaling
- Pay per use
- Easy integration with AWS services
- Fast to deploy

---

## When to use Lambda
Lambda is a great fit for:

- Webhooks and API endpoints
- Event-driven tasks (S3, DynamoDB, SQS, EventBridge)
- Scheduled jobs (cron-like)
- Small microservices
- Irregular or spiky traffic

---

## When NOT to use Lambda
Avoid Lambda if:

- The workload is long-running or heavy (video processing, big ETL)
- Traffic is constant and predictable (often cheaper on EC2 or containers)
- You need a long-lived in-memory state
- You need low-level OS or network control

---

## Hands-on with Terraform (simple)
This repo already includes a minimal Lambda + API Gateway using Terraform.

### Prerequisites
- AWS account
- AWS CLI configured
- Terraform >= 1.5
- Python 3.x or Docker (for packaging dependencies)

### Step 1: Configure AWS CLI
```bash
aws configure
```
Make sure your AWS profile name matches the Terraform variable `aws_profile` in `terraform/variables.tf`.

### Step 2: Review variables (optional)
Open `terraform/variables.tf` and edit if needed:
- `aws_region`
- `project_name`
- `aws_profile`

### Step 3: Initialize Terraform
```bash
cd terraform
terraform init
```

### Step 4: Plan and apply
```bash
terraform plan
terraform apply
```
Terraform will:
- Build the Lambda package using `terraform/build.sh`
- Create IAM role + CloudWatch logs permissions
- Deploy Lambda
- Create HTTP API Gateway

### Step 5: Test the API
After `apply`, Terraform outputs the API URL:
```
api_url = https://xxxxxx.execute-api.us-east-1.amazonaws.com
```
Open it in your browser or curl it.

### Step 6: Cost calculator endpoint (Python)
The Lambda API exposes a simple cost estimator at the `/cost` endpoint.

Example with defaults:
```bash
curl "https://xxxxxx.execute-api.us-east-1.amazonaws.com/cost"
```

Example with custom values:
```bash
curl "https://xxxxxx.execute-api.us-east-1.amazonaws.com/cost?memory_mb=512&requests_per_month=2000000&avg_duration_ms=120"
```

You can also estimate using `hours_month` instead of request duration:
```bash
curl "https://xxxxxx.execute-api.us-east-1.amazonaws.com/cost?memory_mb=1024&hours_month=20"
```

Query parameters:
- `memory_mb` (default 128)
- `requests_per_month` (default 1000000)
- `avg_duration_ms` (default 100)
- `hours_month` (optional, overrides avg duration math)

---

## Clean up
To delete everything:
```bash
terraform destroy
```

---

## Conclusion
AWS Lambda is powerful and cost-efficient when used correctly. The key is to match it to the right workload: short, event-driven, and unpredictable traffic. For stable or heavy workloads, EC2 or containers can be cheaper.

If you want, I can also add:
- Cost examples (1M requests, memory sizing)
- A monitoring section (CloudWatch metrics + alerts)
- A Terraform module layout for production use
