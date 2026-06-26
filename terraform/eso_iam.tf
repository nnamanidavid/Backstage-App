resource "aws_iam_role" "eso_secrets_access" {
  name               = "backstage-eso-role"
  assume_role_policy = data.aws_iam_policy_document.eso_irsa_trust.json
}

data "aws_iam_policy_document" "eso_secrets_permissions" {
  statement {
    effect    = "Allow"
    actions   = ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"]
    resources = [aws_secretsmanager_secret.backstage_rds_credentials.arn]
  }
}

resource "aws_iam_policy" "eso_secrets_permissions" {
  name   = "backstage-eso-policy"
  policy = data.aws_iam_policy_document.eso_secrets_permissions.json
}

resource "aws_iam_role_policy_attachment" "eso_secrets_attach" {
  role       = aws_iam_role.eso_secrets_access.name
  policy_arn = aws_iam_policy.eso_secrets_permissions.arn
}