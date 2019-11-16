import os

from flask import current_app

from flask_admin.contrib.sqla import ModelView

from apps.extensions import (
    admin,
    db,
)

from apps.common.admins import ImageUploadField
from . import (
    models,
    upload_sets,
)


class QuestionModelView(ModelView):
    inline_models = (models.Answer,)
    form_extra_fields = {
        'image_filename': ImageUploadField(
            upload_set=upload_sets.questions,
            label='Image',
            base_path=os.path.join(
                current_app.config['UPLOADS_DEFAULT_DEST'],
                'questions',
            ),
            thumbnail_size=(200, 200, True),
        ),
    }

admin.add_view(ModelView(models.Answer, db.session))
admin.add_view(QuestionModelView(models.Question, db.session))
