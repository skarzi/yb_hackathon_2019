from flask import current_app

from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    String,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy_utils import PasswordType

from apps.common.models import (
    Timestampable,
    UUIDable,
)
from apps.extensions import db


class ParentChildAssociation(Timestampable):
    parent_id = Column(
            UUID(as_uuid=True),
            ForeignKey('users_user.id'),
            primary_key=True,
    )
    child_id = Column(
            UUID(as_uuid=True),
            ForeignKey('users_user.id'),
            primary_key=True,
    )

class User(Timestampable, UUIDable):
    username = Column(String(length=255), unique=False)
    password = Column(
        PasswordType(
            max_length=255,
            onload=(
                lambda **kwargs: {
                    **kwargs,
                    'schemes': current_app.config['PASSWORD_SCHEMES'],
                }
            ),
        ),
        nullable=False,
        unique=False,
    )
    is_active = Column(Boolean, default=True)
    is_child = Column(Boolean, default=False)

    parents = relationship(
        'User',
        secondary=ParentChildAssociation.__table__,
        primaryjoin=f'User.id == ParentChildAssociation.child_id',
        secondaryjoin=f'User.id == ParentChildAssociation.parent_id',
        backref='children',
    )

    def __str__(self) -> str:
        prefix = '[C] ' if self.is_child else '[P] '
        return f'{prefix}{self.username}'
