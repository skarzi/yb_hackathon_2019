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
        return Response(
            schemas.QuestionSchema().dumps(question),
            HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
        )