from http import HTTPStatus

from flask import Response

from flask_jwt_extended import (
    current_user,
    jwt_required,
)
from sqlalchemy.sql.expression import func

from apps.common.views import APIView

from ..extensions import db
from . import (
    models,
    schemas,
)


class QuestionRandomView(APIView):
    method_decorators = [jwt_required]

    def get(self):
        question = models.Question.query.order_by(func.random()).first()
        if question:
            response_data = schemas.QuestionSchema().dumps(question)
        else:
            response_data = '{}'
        return Response(
            response_data,
            HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
        )
