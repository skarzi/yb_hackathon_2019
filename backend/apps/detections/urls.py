from . import (
    detections_app,
    views,
)

detections_app.add_url_rule(
    'users/<user_id>/transactions',
    'transaction-list',
    views.TransactionCreateListView.as_view('transaction-list'),
)
