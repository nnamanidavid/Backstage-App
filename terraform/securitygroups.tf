resource "aws_security_group" "backstage_rds_sg" {
  name        = "backstage-rds-sg"
  description = "Allows Postgres access only from EKS worker nodes"
  vpc_id      = aws_vpc.backstage_VPC.id

  tags = {
    Name = "${var.default_tags["Project"]}-rds-sg"
  }
}


resource "aws_security_group_rule" "rds_from_eks_nodes" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.backstage_rds_sg.id
  source_security_group_id = aws_eks_cluster.backstage.vpc_config[0].cluster_security_group_id
}

resource "aws_security_group_rule" "rds_egress_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.backstage_rds_sg.id
}


resource "aws_security_group" "eks_nodes_sg" {
  name        = "backstage-eks-node-sg"
  description = "Security group for Backstage EKS worker nodes"
  vpc_id      = aws_vpc.backstage_VPC.id

  tags = {
    Name = "backstage-eks-node-sg"
  }
}

resource "aws_security_group_rule" "nodes_self_ingress" {
  type                     = "ingress"
  from_port                = 0
  to_port                  = 0
  protocol                 = "-1"
  security_group_id        = aws_security_group.eks_nodes_sg.id
  source_security_group_id = aws_security_group.eks_nodes_sg.id
}


resource "aws_security_group_rule" "eks_nodes_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.eks_nodes_sg.id
}

