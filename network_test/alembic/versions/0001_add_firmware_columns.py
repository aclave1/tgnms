"""add firmware columns

Revision ID: 0001
Revises: 0000
Create Date: 2020-04-20 21:06:40.380731

"""
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "0001"
down_revision = "0000"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "network_test_result", sa.Column("mcs_avg", sa.Float(), nullable=True)
    )
    op.add_column(
        "network_test_result", sa.Column("rssi_avg", sa.Float(), nullable=True)
    )
    op.add_column(
        "network_test_result", sa.Column("rx_beam_idx", sa.Float(), nullable=True)
    )
    op.add_column(
        "network_test_result", sa.Column("rx_packet_count", sa.Float(), nullable=True)
    )
    op.add_column("network_test_result", sa.Column("rx_per", sa.Float(), nullable=True))
    op.add_column(
        "network_test_result", sa.Column("snr_avg", sa.Float(), nullable=True)
    )
    op.add_column(
        "network_test_result", sa.Column("tx_beam_idx", sa.Float(), nullable=True)
    )
    op.add_column(
        "network_test_result", sa.Column("tx_packet_count", sa.Float(), nullable=True)
    )
    op.add_column("network_test_result", sa.Column("tx_per", sa.Float(), nullable=True))
    op.add_column(
        "network_test_result", sa.Column("tx_pwr_avg", sa.Float(), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("network_test_result", "tx_pwr_avg")
    op.drop_column("network_test_result", "tx_per")
    op.drop_column("network_test_result", "tx_packet_count")
    op.drop_column("network_test_result", "tx_beam_idx")
    op.drop_column("network_test_result", "snr_avg")
    op.drop_column("network_test_result", "rx_per")
    op.drop_column("network_test_result", "rx_packet_count")
    op.drop_column("network_test_result", "rx_beam_idx")
    op.drop_column("network_test_result", "rssi_avg")
    op.drop_column("network_test_result", "mcs_avg")
    # ### end Alembic commands ###