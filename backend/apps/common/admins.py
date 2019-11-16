from flask_admin import form

from .utils import generate_file_uuid4_name


def _imagename_uuid4_gen(obj, file_data):
    return generate_file_uuid4_name(file_data)


class ImageUploadInput(form.ImageUploadInput):
    def __init__(self, upload_set, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.upload_set = upload_set

    def get_url(self, field):
        if field.thumbnail_size:
            filename = field.thumbnail_fn(field.data)
        else:
            filename = field.data
        if field.url_relative_path:
            filename = urljoin(field.url_relative_path, filename)
        print(self.upload_set.url(filename))
        return self.upload_set.url(filename)


class ImageUploadField(form.ImageUploadField):
    def __init__(self, upload_set, *args, **kwargs):
        self.widget = ImageUploadInput(upload_set=upload_set)
        kwargs['namegen'] = _imagename_uuid4_gen
        super().__init__(*args, **kwargs)
