from . import (
    games_app,
    views,
)

games_app.add_url_rule(
    '/questions/random',
    'question-random',
    views.QuestionRandomView.as_view('question-random'),
)
