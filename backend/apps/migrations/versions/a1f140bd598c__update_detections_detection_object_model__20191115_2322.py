"""update_detections_detection_object_model

Revision ID: a1f140bd598c
Revises: 7dbf3e5254f9
Create Date: 2019-11-15 23:22:15.999108

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'a1f140bd598c'
down_revision = '7dbf3e5254f9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('detections_detectionobject', sa.Column('price', sa.Float(), nullable=True))
    op.drop_column('detections_detectionobject', 'score')
    op.drop_column('detections_detectionobject', 'y_pos')
    op.drop_column('detections_detectionobject', 'x_pos')
    op.drop_column('detections_detectionobject', 'height')
    op.drop_column('detections_detectionobject', 'width')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('detections_detectionobject', sa.Column('width', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('detections_detectionobject', sa.Column('height', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True))
    op.add_column('detections_detectionobject', sa.Column('x_pos', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('detections_detectionobject', sa.Column('y_pos', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('detections_detectionobject', sa.Column('score', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True))
    op.drop_column('detections_detectionobject', 'price')
    # ### end Alembic commands ###
