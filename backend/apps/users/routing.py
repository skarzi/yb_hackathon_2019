from ..extensions import socketio
from . import consumers

socketio.on_namespace(consumers.UserSelfConsumer('/users'))
socketio.on_error_default(consumers.exception_handler)
