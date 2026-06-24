resource "aws_db_instance" "backstage" {
  identifier     = "backstage-db"
  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t4g.micro"

  allocated_storage = 20
  storage_type      = "gp3"

  db_name  = "backstage_db"
  username = var.db_username
  password = random_password.rds_master.result

  db_subnet_group_name   = aws_db_subnet_group.backstage_db_sub_group.name
  vpc_security_group_ids = [aws_security_group.backstage_rds_sg.id]

  multi_az            = false
  publicly_accessible = false
  skip_final_snapshot = true 

  tags = {
    Name = "${var.default_tags["Project"]}-rds-instance"
  }
}