from marshmallow import (
    ValidationError,
    fields,
)
from marshmallow import validate as validators
from marshmallow import validates
from marshmallow_sqlalchemy import field_for
from marshmallow_sqlalchemy.fields import Nested

from ..extensions import schemas
from . import models


class UserSchema(schemas.ModelSchema):
    username = fields.String(
        required=True,
        validate=[validators.Length(min=3, max=255)],
    )
    password = field_for(
        models.User,
        'password',
        required=True,
        load_only=True,
    )
    created_at = field_for(models.User, 'created_at', dump_only=True)

    class Meta:
        model = models.User
        fields = (
            'id',
            'username',
            'password',
            'created_at',
            'is_child',
        )

    @validates('username')
    def validate_username(self, value, **kwargs):
        if models.User.query.filter_by(username=value).scalar():
            raise ValidationError('User with given username already exists')


class ChildSchema(UserSchema):
    parents = Nested(UserSchema, many=True)

    class Meta(UserSchema.Meta):
        fields = (*UserSchema.Meta.fields, 'parents')


class ParentSchema(UserSchema):
    children = Nested(UserSchema, many=True)

    class Meta(UserSchema.Meta):
        fields = (*UserSchema.Meta.fields, 'children')
