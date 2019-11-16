from marshmallow import fields
from marshmallow_sqlalchemy import field_for
from marshmallow_sqlalchemy.fields import (
    Nested,
    Related,
)

from ..extensions import schemas, db
from . import models


class DetectionObjectSchema(schemas.ModelSchema):
    created_at = field_for(models.DetectionObject, 'created_at', dump_only=True)
    image_url = fields.Url(dump_only=True)
    image = fields.Str(load_only=True)

    class Meta:
        model = models.DetectionObject
        fields = (
            'id',
            'label',
            'price',
            'created_at',
            'image_url',
            'image',
        )


class TransactionSchema(schemas.ModelSchema):
    created_at = field_for(models.Transaction, 'created_at', dump_only=True)
    detection_object =  Nested(DetectionObjectSchema, dump_only=True)
    detection_object_id = Related(
        column='id',
        attribute='detection_object',
        load_only=True,
    )

    class Meta:
        model = models.Transaction
        sqla_session = db.session
        fields = (
            'id',
            'created_at',
            'amount',
            'type',
            'detection_object',
            'detection_object_id',
        )
