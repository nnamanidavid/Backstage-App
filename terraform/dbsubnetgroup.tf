resource "aws_db_subnet_group" "backstage_db_sub_group" {
  name       = "backstage-db-subnet-group"
  subnet_ids = aws_subnet.backstage_private_subnet[*].id

  tags = {
    Name = "${var.default_tags["Project"]}-db-subnet-group"
  }
}