from flask import current_app

from flask_uploads import (
    IMAGES,
    UploadSet,
    configure_uploads,
)

detections = UploadSet(name='detections', extensions=IMAGES)
configure_uploads(current_app, (detections,))
