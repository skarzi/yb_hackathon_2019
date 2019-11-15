import datetime
import uuid

from sqlalchemy import (
    Column,
    DateTime,
    Integer,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declared_attr

from ..extensions import db


class BaseModel(db.Model):
    __abstract__ = True

    id = Column(Integer, autoincrement=True, primary_key=True)

    @declared_attr
    def __tablename__(self):
        modules = self.__module__.split('.')
        app_name = modules[modules.index('models') - 1]
        model_name = self.__name__.lower()
        return f'{app_name}_{model_name}'


class UUIDable(BaseModel):
    __abstract__ = True

    id = db.Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)


class Timestampable(db.Model):
    __abstract__ = True

    created_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        nullable=False,
    )
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
        nullable=False,
    )
