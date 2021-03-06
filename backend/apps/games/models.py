import typing

from flask import current_app

from sqlalchemy import (
    Boolean,
    Column,
    Float,
    ForeignKey,
    String,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from apps.common.models import UUIDable
from . import upload_sets


class Question(UUIDable):
    text = Column(String, nullable=False)
    reward = Column(Float, default=1, nullable=False)
    image_filename = Column(String(length=255), unique=True)

    options = relationship(
        'Answer',
        back_populates='question',
        lazy='selectin',
    )

    def __str__(self) -> str:
        return f'{self.text} - {self.reward}$'

    @property
    def correct_answer(self) -> 'Answer':
        return next(answer for answer in self.options if answer.is_correct)

    @property
    def image_url(self):
        return upload_sets.questions.url(self.image_filename)

    @property
    def image_path(self):
        if self.image_filename is None:
            return
        return upload_sets.questions.path(self.image_filename)


class Answer(UUIDable):
    text = Column(String(length=255), nullable=False)
    is_correct = Column(Boolean, default=False)
    question_id = Column(
        UUID(as_uuid=True),
        ForeignKey(f'{Question.__tablename__}.id'),
        nullable=False,
    )
    question = relationship(
        'Question',
        back_populates='options',
    )

    def __str__(self) -> str:
        prefix = '✓ ' if self.is_correct else ''
        return f'{prefix}{self.text}'
