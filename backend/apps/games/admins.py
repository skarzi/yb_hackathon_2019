from flask_admin.contrib.sqla import ModelView

from apps.extensions import (
    admin,
    db,
)

from . import models


class QuestionModelView(ModelView):
    inline_models = (models.Answer,)

admin.add_view(ModelView(models.Answer, db.session))
admin.add_view(QuestionModelView(models.Question, db.session))
