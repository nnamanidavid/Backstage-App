resource "aws_subnet" "backstage_private_subnet" {
  count                   = var.private_sub_count
  vpc_id                  = aws_vpc.backstage_VPC.id
  cidr_block              = cidrsubnet(aws_vpc.backstage_VPC.cidr_block, 8, count.index + 10)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = false
  tags = {
    Name                                         = "${var.default_tags["Project"]}-private-subnet-${data.aws_availability_zones.available.names[count.index]}"
    "kubernetes.io/role/internal-elb"            = "1"
    "kubernetes.io/cluster/${var.cluster_name}"  = "shared"
  }
}