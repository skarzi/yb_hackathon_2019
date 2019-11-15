import os

from importlib import import_module

import flask

from . import extensions
from .common.blueprints import register_blueprint
from .task_app.celery import celery_app


def create_app(config_module_path: str = ''):
    config_module_path = (
        config_module_path or os.environ['FLASK_SETTINGS_MODULE']
    )
    flask_app = flask.Flask(__name__)
    flask_app.config.from_object(config_module_path)

    for blueprint_path in flask_app.config.get('INSTALLED_BLUEPRINTS', []):
        register_blueprint(flask_app, blueprint_path)

    # TODO: extract it to some function
    extensions.db.init_app(flask_app)
    extensions.migrate.init_app(
        flask_app,
        extensions.db,
        flask_app.config['MIGRATIONS_DIRECTORY'],
    )
    extensions.schemas.init_app(flask_app)
    extensions.celery_extension.init_app(flask_app, celery_app)
    extensions.jwt.init_app(flask_app)
    # TODO: uncomment to run socket.io
    # extensions.socketio.init_app(flask_app)
    extensions.admin.init_app(flask_app)
    extensions.cors.init_app(flask_app)

    with flask_app.app_context():
        import_module('apps.common.exceptions')
        for middleware_module in flask_app.config.get('MIDDLEWARES', []):
            import_module(middleware_module)

    # TODO: extract it to some method etc
    from apps import commands

    flask_app.cli.add_command(commands.run_socketio)

    return flask_app
