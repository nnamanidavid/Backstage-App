resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.backstage_VPC.id
  service_name      = "com.amazonaws.${var.aws_region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = [aws_route_table.backstage_private_rt.id]

  tags = {
    Name = "${var.default_tags["Project"]}-s3-endpoint"
  }
}
