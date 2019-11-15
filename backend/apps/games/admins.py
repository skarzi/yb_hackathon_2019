from flask_admin.contrib.sqla import ModelView
from flask_admin.form.fields import Select2TagsField

from apps.extensions import (
    admin,
    db,
)

from . import models


class Select2StrTagsField(Select2TagsField):
    def process_formdata(self, valuelist):
        super().process_formdata(valuelist)
        self.data = [str(x) for x in self.data]


class QuestionView(ModelView):
    def scaffold_form(self):
        form_class = super().scaffold_form()
        form_class.options = Select2StrTagsField(
            'Options',
            save_as_list=True,
        )
        return form_class


admin.add_view(QuestionView(models.Question, db.session))
