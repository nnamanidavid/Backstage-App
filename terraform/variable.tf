variable "aws_region" {
  description = "The AWS region"
  type        = string
  default     = "us-east-1"
}

variable "cidr_block" {
    description = "The CIDR block for the VPC"
    type        = string
    default     = "10.28.0.0/16"
}

variable "default_tags" {
   description = "name of infrastructure"
   type        = map(string)

   default = {
    Project     = "Backstage"
   }
}


variable "public_sub_count" {
    description = "number of public subnets"
    type        = number
    default     = 2
}

variable "private_sub_count" {
    description = "number of private subnets"
    type        = number
    default     = 2
}

variable "cluster_name" {
  description = "EKS cluster name - used in subnet tags so the AWS Load Balancer Controller can auto-discover subnets"
  type        = string
  default     = "backstage-cluster"
}


variable "db_username" {
  type    = string
  default = "backstage_admin"
}

variable "stripe_secret_key" {
  description = "Stripe secret key from the Stripe dashboard - pass via -var or a .tfvars file that is NOT committed"
  type        = string
  sensitive   = true
}