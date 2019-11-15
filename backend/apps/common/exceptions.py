from http import HTTPStatus

from flask import (
    Response,
    current_app,
    json,
)

from marshmallow import ValidationError


@current_app.errorhandler(ValidationError)
def handle_marshmallo_ValidationError(exception):
    return Response(
        json.dumps(exception.data),
        HTTPStatus.BAD_REQUEST,
        headers={'Content-Type': 'application/json'},
    )
