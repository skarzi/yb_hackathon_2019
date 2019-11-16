import base64
import io
import json
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
from PIL import Image
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.datastructures import FileStorage

from apps.common.views import APIView
from apps.users.models import User

from ..extensions import db
from . import (
    models,
    schemas,
    upload_sets,
)
from .object_detection import detect_objects


class TransactionCreateListView(APIView):
    method_decorators = [jwt_required]

    def post(self, user_id):
        if user_id == 'self':
            user = current_user
        else:
            user = User.query.get(user_id)
        data = dict(request.json)
        transaction = schemas.TransactionSchema().load(data)
        transaction.amount = (
            transaction.amount
            or getattr(transaction.detection_object, 'price', 0)
        )
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
        return Response(
            schemas.TransactionSchema(many=True).dumps(user.transactions),
            HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
        )


class ObjectDetectionView(APIView):
    def post(self):
        base64_encoded_image = request.json['image']
        image_data = base64.b64decode(base64_encoded_image)
        image = Image.open(io.BytesIO(image_data))
        response_data = detect_objects(image)
        return Response(
            json.dumps(response_data),
            HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
        )


class DetectionObjectCreateListView(APIView):
    method_decorators = [jwt_required]

    def post(self):
        detection_object = schemas.DetectionObjectSchema().load(request.json)
        base64_encoded_image = request.json['image']
        image_data = base64.b64decode(base64_encoded_image)
        file_ = FileStorage(
            io.BytesIO(image_data),
            filename=f'{uuid.uuid4().hex}.jpg',
        )
        filename = upload_sets.detections.save(file_)
        detection_object.image_filename = filename
        db.session.add(detection_object)
        try:
            db.session.commit()
        except IntegrityError as exc:
            orig_exc = str(exc.orig)
            if 'label' in orig_exc and 'duplicate key' in orig_exc:
                db.session.rollback()
                detection_object = models.DetectionObject.query.filter_by(
                    label=exc.params['label'],
                ).first()
            else:
                raise
        return Response(
            schemas.DetectionObjectSchema().dumps(detection_object),
            HTTPStatus.CREATED,
            headers={'Content-Type': 'application/json'},
        )

    def get(self):
        filter_args = []
        label = request.args.get('label', '')
        if label:
            filter_args.append(
                models.DetectionObject.label.ilike(f'%{label}%'),
            )
        detection_objects = models.DetectionObject.query.filter(*filter_args)
        return Response(
            schemas.DetectionObjectSchema(many=True).dumps(detection_objects),
            HTTPStatus.OK,
            headers={'Content-Type': 'application/json'},
        )


class DetectionObjectDeleteView(APIView):
    method_decorators = [jwt_required]

    def delete(self, detection_object_id):
        detection_object = models.DetectionObject.query.get(
            detection_object_id,
        )
        if detection_object:
            db.session.delete(detection_object)
            db.session.commit()
        return Response(status=HTTPStatus.OK)
