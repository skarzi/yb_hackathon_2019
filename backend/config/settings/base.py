import datetime

import environ

# (`hackathon/backend/config/settings/base.py` - 3 = `hackathon/backend`)
# or inside docker container - `/app`
APPS_DIR = environ.Path(__file__) - 3

env = environ.Env()
# `backend/config/settings/base.py` - 3 = `backend/` or inside docker `/app`
BASE_DIR = environ.Path(__file__) - 3


# FLASK
DEBUG = env.bool('FLASK_DEBUG', default=False)
ENV = env('FLASK_ENV', default='production')
TESTING = False


# BLUEPRINTS
INSTALLED_BLUEPRINTS = (
    'apps.auth:auth_app',
    'apps.users:users_app',
    'apps.detections:detections_app',
    'apps.games:games_app',
)


# DATABASES
DB_USER = env('POSTGRES_USER', default='')
DB_PASSWORD = env('POSTGRES_PASSWORD', default='')
DB_PORT = env('POSTGRES_PORT', default='')
DB_NAME = env('POSTGRES_DB', default='')
DB_HOST = env('POSTGRES_HOST', default='')
SQLALCHEMY_DATABASE_URI = (
    f'postgres://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
)
SQLALCHEMY_ECHO = DEBUG
SQLALCHEMY_TRACK_MODIFICATIONS = False
MIGRATIONS_DIRECTORY = str(BASE_DIR.path('apps', 'migrations'))


# MIDDLEWARES
MIDDLEWARE = []


# HTTP
JSON_SORT_KEYS = False
SERVER_NAME = env('FLASK_SERVER_NAME', default='')


# SECURITY
PASSWORD_SCHEMES = (
    'bcrypt_sha256',
    'pbkdf2_sha512',
    'md5_crypt',
)


# AUTHENTICATION
JWT_TOKEN_LOCATION = ('headers',)
JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(
    seconds=env.int(
        'JWT_ACCESS_TOKEN_EXPIRES',
        default=datetime.timedelta(hours=24).total_seconds(),
    ),
)
JWT_SECRET_KEY = env('JWT_SECRET_KEY', default='')
JWT_IDENTITY_CLAIM = 'sub'
JWT_ERROR_MESSAGE_KEY = 'detail'
JWT_JSON_KEY = 'access_token'
JWT_BLACKLIST_ENABLED = False
AUTH_USER_MODEL = 'users_user'


# CELERY
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default='')
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND_URL', default='')
# TODO: how to add localization to flask?
# if USE_TZ:
#     CELERY_TIMEZONE = TIME_ZONE
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
# TODO: set to whatever value is adequate in your circumstances
CELERYD_TASK_TIME_LIMIT = 5 * 60
# TODO: set to whatever value is adequate in your circumstances
CELERYD_TASK_SOFT_TIME_LIMIT = 60


# SOCKET.IO
SOCKETIO_ASYNC_MODE = env('SOCKETIO_ASYNC_MODE', default='eventlet')
SOCKETIO_CORS_ALLOWED_ORIGINS = '*'
SOCKETIO_CORS_CREDENTIALS = True
SOCKETIO_ALWAYS_CONNECT = False


# FLASK-UPLOADS
UPLOADED_FILES_DEST = str(APPS_DIR.path('shared', 'media'))
UPLOADS_DEFAULT_DEST = UPLOADED_FILES_DEST
