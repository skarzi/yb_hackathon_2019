from flask_admin import Admin
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from .task_app.extensions import Celery

db = SQLAlchemy()
migrate = Migrate(db=db)
schemas = Marshmallow()
celery_extension = Celery()
jwt = JWTManager()
# TODO: uncomment for socketio support
# from .common.extensions.socketio import SocketIO
# socketio = SocketIO()
admin = Admin()
cors = CORS()
