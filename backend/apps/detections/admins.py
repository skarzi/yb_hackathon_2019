from flask_admin.contrib.sqla import ModelView

from apps.extensions import (
    admin,
    db,
)
from . import models

admin.add_view(ModelView(models.DetectionObject, db.session))
admin.add_view(ModelView(models.Transaction, db.session))
