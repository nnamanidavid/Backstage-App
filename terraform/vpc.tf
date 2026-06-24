resource "aws_vpc" "backstage_VPC" {
  cidr_block = var.cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.default_tags["Project"]}-vpc"
  }
}

