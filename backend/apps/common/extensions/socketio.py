from flask_socketio import SocketIO as BaseSocketIO

DEFAULT_SOCKETIO_SETTINGS_NAMESPACE = 'SOCKETIO_'


class SocketIO(BaseSocketIO):
    def init_app(self, app, **kwargs):
        namespace = app.config.get(
            'SOCKETIO_SETTINGS_NAMESPACE',
            DEFAULT_SOCKETIO_SETTINGS_NAMESPACE,
        )
        kwargs.update(app.config.get_namespace(namespace, lowercase=True))
        return super().init_app(app, **kwargs)
