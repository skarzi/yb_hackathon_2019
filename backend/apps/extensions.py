from flask_admin import Admin
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()
migrate = Migrate(db=db)
schemas = Marshmallow()
jwt = JWTManager()
admin = Admin()
cors = CORS()
