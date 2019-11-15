from flask import current_app

from flask_uploads import (
    IMAGES,
    UploadSet,
    configure_uploads,
)

questions = UploadSet(name='questions', extensions=IMAGES)
configure_uploads(current_app, (questions,))
