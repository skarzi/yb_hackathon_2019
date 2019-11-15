from ..extensions import schemas
from . import models


class QuestionSchema(schemas.ModelSchema):
    class Meta:
        model = models.Question
        fields = (
            'id',
            'text',
            'reward',
            'options',
            'correct_answer',
        )
