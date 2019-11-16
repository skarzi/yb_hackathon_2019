from flask import current_app

from sqlalchemy import (
    Boolean,
    Column,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy_utils import PasswordType

from apps.common.models import (
    Timestampable,
    UUIDable,
)
from apps.users.models import User

from . import (
    enums,
    upload_sets,
)


class DetectionObject(Timestampable, UUIDable):
    label = Column(String, unique=True)
    price = Column(Float)
    image_filename = Column(String(length=255), unique=True)

    def __str__(self) -> str:
        return f'{self.label} - {self.price}$'

    @property
    def image_url(self):
        return upload_sets.detections.url(self.image_filename)

    @property
    def image_path(self):
        if self.image_filename is None:
            return ''
        return upload_sets.detections.path(self.image_filename)



class Transaction(Timestampable, UUIDable):
    amount = Column(Float)
    type = Column(Enum(enums.TransactionType))
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey(f'{User.__tablename__}.id'),
    )
    detection_object_id = Column(
        UUID(as_uuid=True),
        ForeignKey(f'{DetectionObject.__tablename__}.id'),
        nullable=True,
    )

    detection_object = relationship(
        'DetectionObject',
        backref='transactions',
    )
    user = relationship(
        User,
        backref='transactions',
    )

    def __str__(self) -> str:
        prefix = '-'
        if self.type == enums.TransactionType.INCOME:
            prefix = '+'
        amount_slug = f'{prefix}{self.amount}$'
        return f'{self.type.name} {amount_slug} by {self.user.username}'
