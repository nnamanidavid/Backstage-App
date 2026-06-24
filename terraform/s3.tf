resource "aws_s3_bucket" "backstage_media" {
  bucket = "backstage-media-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name = "${var.default_tags["Project"]}-media"
  }
}


resource "aws_s3_bucket_public_access_block" "backstage_media" {
  bucket = aws_s3_bucket.backstage_media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backstage_media" {
  bucket = aws_s3_bucket.backstage_media.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}


resource "aws_s3_bucket_versioning" "backstage_media" {
  bucket = aws_s3_bucket.backstage_media.id

  versioning_configuration {
    status = "Enabled"
  }
}