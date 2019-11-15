from marshmallow import fields
from marshmallow_sqlalchemy import field_for
from marshmallow_sqlalchemy.fields import Nested

from ..extensions import schemas
from . import models


class DetectionObjectSchema(schemas.ModelSchema):
    created_at = field_for(models.DetectionObject, 'created_at', dump_only=True)

    class Meta:
        model = models.DetectionObject
        fields = (
            'id',
            'x_pos',
            'y_pos',
            'width',
            'height',
            'label',
            'score',
            'created_at',
        )


class TransactionSchema(schemas.ModelSchema):
    created_at = field_for(models.Transaction, 'created_at', dump_only=True)
    detection_object =  Nested(DetectionObjectSchema)

    class Meta:
        model = models.Transaction
        fields = (
            'id',
            'created_at',
            'amount',
            'type',
            'detection_object',
        )
