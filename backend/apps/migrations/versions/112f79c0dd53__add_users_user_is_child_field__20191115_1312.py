"""Add users.User.is_child field

Revision ID: 112f79c0dd53
Revises: b2974f676072
Create Date: 2019-11-15 13:12:41.081176

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '112f79c0dd53'
down_revision = 'b2974f676072'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users_user', sa.Column('is_child', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users_user', 'is_child')
    # ### end Alembic commands ###
