import uuid

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

from ..extensions import db
from . import (
    models,
    schemas,
)


class UserCreateView(APIView):
    def post(self):
        user = schemas.UserSchema().load(request.json)
        db.session.add(user)
        db.session.commit()
        return Response(
            schemas.UserSchema(exclude=('password',)).dumps(user),
            HTTPStatus.CREATED,
            headers={
                'Location': url_for('.user-detail', user_id=str(user.id)),
                'Content-Type': 'application/json',
            },
        )


class UserRetrieveView(APIView):
    method_decorators = [jwt_required]

    def get(self, user_id):
        if user_id == 'self':
            user = current_user
        else:
            user = models.User.query.get(user_id)
        schema_class = schemas.ParentSchema
        if user.is_child:
            schema_class = schemas.ChildSchema
        return Response(
            schema_class().dumps(user),
            HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
        )


class UserCreateListChildrenView(APIView):
    method_decorators = [jwt_required]

    def get(self):
        return Response(
            schemas.UserSchema(many=True).dumps(current_user.children),
            HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
        )

    def post(self):
        data = dict(request.json)
        data['is_child'] = True
        data['password'] = uuid.uuid4().hex
        child = schemas.UserSchema().load(data)
        child.parents.append(current_user)
        db.session.add(child)
        db.session.commit()
        return Response(
            schemas.UserSchema(exclude=('password',)).dumps(child),
            HTTPStatus.CREATED,
            headers={
                'Location': url_for('.user-detail', user_id=str(child.id)),
                'Content-Type': 'application/json',
            },
        )
