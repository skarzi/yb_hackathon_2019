from marshmallow import fields

from ..extensions import schemas
from . import models


class QuestionSchema(schemas.ModelSchema):
    image_url = fields.Url()
    correct_answer = fields.Method('get_correct_answer')
    options = fields.Method('get_options')

    class Meta:
        model = models.Question
        fields = (
            'id',
            'text',
            'reward',
            'options',
            'correct_answer',
            'image_url',
        )

    def get_correct_answer(self, obj):
        return next(
            i for i, answer in enumerate(obj.options) if answer.is_correct
        )

    def get_options(self, obj):
        return [answer.text for answer in obj.options]
