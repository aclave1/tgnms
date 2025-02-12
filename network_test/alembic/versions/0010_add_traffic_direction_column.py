# Copyright (c) 2014-present, Facebook, Inc.
"""add traffic direction column

Revision ID: 0010
Revises: 0009
Create Date: 2021-11-03 17:40:22.900214

"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "0010"
down_revision = "0009"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "network_test_params",
        sa.Column(
            "direction",
            sa.Enum(
                "BIDIRECTIONAL_PARALLEL",
                "BIDIRECTIONAL_SEQUENTIAL",
                name="networktestdirection",
            ),
            server_default="BIDIRECTIONAL_PARALLEL",
        ),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("network_test_params", "direction")
    # ### end Alembic commands ###
