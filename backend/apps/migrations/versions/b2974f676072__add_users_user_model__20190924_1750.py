"""Add users.User model

Revision ID: b2974f676072
Revises:
Create Date: 2019-09-24 17:50:11.791923

"""
import sqlalchemy as sa
import sqlalchemy_utils

from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b2974f676072'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        'users_user',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column(
            'email',
            sqlalchemy_utils.types.email.EmailType(length=255),
            nullable=False,
        ),
        sa.Column('first_name', sa.String(length=255), nullable=False),
        sa.Column('last_name', sa.String(length=255), nullable=False),
        sa.Column('username', sa.String(length=255), nullable=False),
        sa.Column(
            'password',
            sqlalchemy_utils.types.password.PasswordType(max_length=255),
            nullable=False,
        ),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users_user')
    # ### end Alembic commands ###
