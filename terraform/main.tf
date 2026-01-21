provider "aws" {
  region = var.aws_region
}

# CloudFront 证书必须在 us-east-1
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}

variable "aws_region" {
  default = "us-west-2"
}

variable "bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "domain_name" {
  description = "The custom domain name (e.g., example.com)"
  type        = string
}

# 1. 申请 ACM 证书
resource "aws_acm_certificate" "cert" {
  provider          = aws.us-east-1
  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# 新增：告诉 Terraform 等待证书验证完成
resource "aws_acm_certificate_validation" "cert" {
  provider                = aws.us-east-1
  certificate_arn         = aws_acm_certificate.cert.arn
}

# S3 Bucket
resource "aws_s3_bucket" "website_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "website_bucket" {
  bucket = aws_s3_bucket.website_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "s3-oac"
  description                       = "S3 OAC"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = "S3Origin"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_200" # 包含亚洲节点（香港、东京、新加坡等）

  # 绑定自定义域名
  aliases = [var.domain_name]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"
    compress         = true # 开启 Gzip/Brotli 自动压缩

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400    # 24小时 (原来是1小时)
    max_ttl                = 31536000 # 1年 (原来是24小时)
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # 使用 ACM 证书
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.cert.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

# S3 Bucket Policy
resource "aws_s3_bucket_policy" "allow_access_from_cloudfront" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = data.aws_iam_policy_document.allow_access_from_cloudfront.json
}

data "aws_iam_policy_document" "allow_access_from_cloudfront" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website_bucket.arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.s3_distribution.arn]
    }
  }
}

# 输出 DNS 验证信息
output "certificate_dns_validation" {
  description = "Add these DNS records to verify domain ownership"
  value       = aws_acm_certificate.cert.domain_validation_options
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}
