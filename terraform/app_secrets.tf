
resource "random_password" "jwt_secret" {
  length  = 48
  special = false
}


variable "stripe_secret_key" {
  description = "Stripe secret key from the Stripe dashboard - pass via -var or a .tfvars file that is NOT committed"
  type        = string
  sensitive   = true
}

resource "aws_secretsmanager_secret" "app_secrets" {
  name = "backstage/app/secrets"
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    jwt_secret        = random_password.jwt_secret.result
    stripe_secret_key = var.stripe_secret_key
  })
}