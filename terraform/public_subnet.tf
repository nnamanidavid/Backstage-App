resource "aws_subnet" "backstage_public_subnet" {
    count = var.public_sub_count
    vpc_id = aws_vpc.backstage_VPC.id
    cidr_block              = cidrsubnet(aws_vpc.backstage_VPC.cidr_block, 8, count.index + 4)
    availability_zone       = data.aws_availability_zones.available.names[count.index]
    map_public_ip_on_launch = true

    tags = {
        Name = "${var.default_tags["Project"]}-public-subnet-${data.aws_availability_zones.available.names[count.index]}"
        "kubernetes.io/role/elb"                    = "1"
        "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    }
}