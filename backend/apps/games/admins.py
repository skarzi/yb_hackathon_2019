import os
import uuid

from flask import current_app

from flask_admin import form
from flask_admin.contrib.sqla import ModelView
from werkzeug.utils import secure_filename

from apps.extensions import (
    admin,
    db,
)

from . import (
    models,
    upload_sets,
)


def _imagename_uuid4_gen(obj, file_data):
    _, ext = os.path.splitext(file_data.filename)
    name = uuid.uuid4().hex
    return secure_filename('{}{}'.format(name, ext))


class _ImageUploadInput(form.ImageUploadInput):
    def __init__(self, upload_set, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.upload_set = upload_set

    def get_url(self, field):
        if field.thumbnail_size:
            filename = field.thumbnail_fn(field.data)
        else:
            filename = field.data
        if field.url_relative_path:
            filename = urljoin(field.url_relative_path, filename)
        print(self.upload_set.url(filename))
        return self.upload_set.url(filename)

class _ImageUploadField(form.ImageUploadField):
    widget = _ImageUploadInput(upload_set=upload_sets.questions)


class QuestionModelView(ModelView):
    inline_models = (models.Answer,)
    form_extra_fields = {
        'image_filename': _ImageUploadField(
            label='Image',
            base_path=os.path.join(
                current_app.config['UPLOADS_DEFAULT_DEST'],
                'questions',
            ),
            thumbnail_size=(200, 200, True),
            namegen=_imagename_uuid4_gen,
        ),
    }

admin.add_view(ModelView(models.Answer, db.session))
admin.add_view(QuestionModelView(models.Question, db.session))
