from flask import current_app

from sqlalchemy import (
    Column,
    Float,
    Integer,
    String,
)
from sqlalchemy.dialects.postgresql import ARRAY

from apps.common.models import UUIDable


class Question(UUIDable):
    text = Column(String)
    reward = Column(Float)
    options = ARRAY(String(length=255), as_tuple=True)
    correct_answer = Column(Integer)
