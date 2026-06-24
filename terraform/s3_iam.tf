resource "aws_iam_role" "backend_s3_access" {
  name               = "backstage-backend-s3-role"
  assume_role_policy = data.aws_iam_policy_document.backend_irsa_trust.json
}


resource "aws_iam_policy" "backend_s3_permissions" {
  name   = "backstage-backend-s3-policy"
  policy = data.aws_iam_policy_document.backend_s3_permissions.json
}

resource "aws_iam_role_policy_attachment" "backend_s3_attach" {
  role       = aws_iam_role.backend_s3_access.name
  policy_arn = aws_iam_policy.backend_s3_permissions.arn
}
