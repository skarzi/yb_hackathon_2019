import json

from http import HTTPStatus

from flask import (
    Response,
    request,
    url_for,
)

from flask_jwt_extended import (
    current_user,
    jwt_required,
)
from sqlalchemy.orm.exc import NoResultFound

from apps.common.views import APIView
from apps.users.models import User

from ..extensions import db
from . import (
    models,
    schemas,
)


class TransactionCreateListView(APIView):
    method_decorators = [jwt_required]

    def post(self, user_id):
        if user_id == 'self':
            user = current_user
        else:
            user = User.query.get(user_id)
        data = dict(request.json)
        transaction = schemas.TransactionSchema().load(data)
        transaction.user = user
        db.session.add(transaction)
        db.session.commit()
        return Response(
            schemas.TransactionSchema().dumps(transaction),
            HTTPStatus.CREATED,
            headers={'Content-Type': 'application/json'},
        )

    def get(self, user_id):
        if user_id == 'self':
            user = current_user
        else:
            user = User.query.get(user_id)
        # TODO: fill with logic
        # user.transactions: typing.List[Transaction]
        return Response(
            schemas.TransactionSchema(many=True).dumps(transactions),
            HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
        )
