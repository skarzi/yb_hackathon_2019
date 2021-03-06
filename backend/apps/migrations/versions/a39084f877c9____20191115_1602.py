"""empty message

Revision ID: a39084f877c9
Revises: 3ac614d3736b
Create Date: 2019-11-15 16:02:10.875025

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a39084f877c9'
down_revision = '3ac614d3736b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('detections_detectionobject', sa.Column('score', sa.Float(), nullable=True))
    op.create_unique_constraint(None, 'detections_detectionobject', ['label'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'detections_detectionobject', type_='unique')
    op.drop_column('detections_detectionobject', 'score')
    # ### end Alembic commands ###
