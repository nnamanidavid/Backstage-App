resource "aws_route_table" "backstage_public_rt" {
  vpc_id = aws_vpc.backstage_VPC.id

    tags = {
        Name = "${var.default_tags["Project"]}-public-rt"
    }
}

resource "aws_route" "backstage_public_route" {
  route_table_id         = aws_route_table.backstage_public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.backstage_igw.id
}

resource "aws_route_table_association" "backstage_public_rt_assoc" {
  count          = var.public_sub_count
  subnet_id      = aws_subnet.backstage_public_subnet[count.index].id
  route_table_id = aws_route_table.backstage_public_rt.id
}

resource "aws_route_table" "backstage_private_rt" {
  vpc_id = aws_vpc.backstage_VPC.id

  tags = {
    Name = "${var.default_tags["Project"]}-private-rt"
  }
}

resource "aws_route" "backstage_private_route" {
  route_table_id         = aws_route_table.backstage_private_rt.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.backstage_nat.id
}

resource "aws_route_table_association" "backstage_private_rt_assoc" {
  count          = var.private_sub_count
  subnet_id      = aws_subnet.backstage_private_subnet[count.index].id
  route_table_id = aws_route_table.backstage_private_rt.id
}
