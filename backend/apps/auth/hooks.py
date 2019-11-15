from http import HTTPStatus

from flask import jsonify

from apps.users.models import User

from ..extensions import jwt


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_loader_callback_loader
def user_loader_callback(identity):
    user = User.query.get(identity)
    if not getattr(user, 'is_active', False):
        return None
    return user


@jwt.user_loader_error_loader
def user_does_not_exists_handler(identity):
    return (
        jsonify({'message': 'Given token owner does not exist.'}),
        HTTPStatus.NOT_FOUND,
    )
