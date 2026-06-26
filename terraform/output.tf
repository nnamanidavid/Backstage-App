output "vpc_id" {
  value = aws_vpc.backstage_VPC.id
}

output "public_subnet_ids" {
  value = aws_subnet.backstage_public_subnet[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.backstage_private_subnet[*].id
}

output "eks_cluster_name" {
  value = aws_eks_cluster.backstage.name
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.backstage.endpoint
}

output "eks_oidc_provider_arn" {
  value = aws_iam_openid_connect_provider.eks.arn
}

output "s3_bucket_arn" {
  value = aws_s3_bucket.backstage_media.arn
}

output "backend_s3_role_arn" {
  value = aws_iam_role.backend_s3_access.arn
}


output "ecr_backend_repo_url" {
  value = aws_ecr_repository.backstage_backend.repository_url
}

output "ecr_frontend_repo_url" {
  value = aws_ecr_repository.backstage_frontend.repository_url
}


output "eso_role_arn" {
  value = aws_iam_role.eso_secrets_access.arn
}