from . import (
    users_app,
    views,
)

users_app.add_url_rule(
    '/<user_id>',
    'user-detail',
    views.UserRetrieveView.as_view('user-detail'),
)
users_app.add_url_rule(
    '/',
    'user-list',
    views.UserCreateView.as_view('user-list'),
)
users_app.add_url_rule(
    '/self/children',
    'user-children-list',
    views.UserCreateListChildrenView.as_view('user-children-list'),
)
