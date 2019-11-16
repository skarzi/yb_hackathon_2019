import os

from flask import current_app

from flask_admin.contrib.sqla import ModelView

from apps.common.admins import ImageUploadField
from apps.extensions import (
    admin,
    db,
)

from . import (
    models,
    upload_sets,
)


class DetectionObjectModelView(ModelView):
    form_extra_fields = {
        'image_filename': ImageUploadField(
            upload_set=upload_sets.detections,
            label='Image',
            base_path=os.path.join(
                current_app.config['UPLOADS_DEFAULT_DEST'],
                'detections',
            ),
            thumbnail_size=(200, 200, True),
        ),
    }


admin.add_view(DetectionObjectModelView(models.DetectionObject, db.session))
admin.add_view(ModelView(models.Transaction, db.session))
