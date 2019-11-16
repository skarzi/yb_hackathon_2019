import os
import typing
import uuid

from werkzeug.utils import secure_filename


def generate_file_uuid4_name(file_: typing.IO) -> str:
    _, ext = os.path.splitext(file_.filename)
    name = uuid.uuid4().hex
    return secure_filename('{}{}'.format(name, ext))
