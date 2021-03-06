"""Add Many to Many relation between user itself

Revision ID: b791c8e8bf6e
Revises: 112f79c0dd53
Create Date: 2019-11-15 13:14:57.329909

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b791c8e8bf6e'
down_revision = '112f79c0dd53'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('parent_child_association',
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('parent_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('child_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.ForeignKeyConstraint(['child_id'], ['users_user.id'], ),
    sa.ForeignKeyConstraint(['parent_id'], ['users_user.id'], ),
    sa.PrimaryKeyConstraint('parent_id', 'child_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('parent_child_association')
    # ### end Alembic commands ###
