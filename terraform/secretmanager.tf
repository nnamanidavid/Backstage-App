resource "random_password" "rds_master" {
  length  = 24
  special = false
}

resource "aws_secretsmanager_secret" "rds_credentials" {
  name = "backstage/rds/credentials"
}

resource "aws_secretsmanager_secret_version" "rds_credentials" {
  secret_id = aws_secretsmanager_secret.rds_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.rds_master.result
    host     = aws_db_instance.backstage.address
    port     = 5432
    dbname   = "backstage_db"
  })
}
