resource "aws_internet_gateway" "backstage_igw" {
  vpc_id = aws_vpc.backstage_VPC.id

  tags = {
    Name = "${var.default_tags["Project"]}-igw"
  }
}

resource "aws_nat_gateway" "backstage_nat" {
  allocation_id = aws_eip.backstage_eip.id
  subnet_id     = aws_subnet.backstage_public_subnet[0].id
  depends_on = [aws_internet_gateway.backstage_igw]

  tags = {
    Name = "${var.default_tags["Project"]}-nat-gateway"
  }
}

resource "aws_eip" "backstage_eip" {
  domain                    = "vpc"

  tags = {
    Name = "${var.default_tags["Project"]}-eip"
  }
}