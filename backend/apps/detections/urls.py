from . import (
    detections_app,
    views,
)

detections_app.add_url_rule(
    'users/<user_id>/transactions',
    'transaction-list',
    views.TransactionCreateListView.as_view('transaction-list'),
)
detections_app.add_url_rule(
    '/detect-objects',
    'detect-objects',
    views.ObjectDetectionView.as_view('detect-objects'),
)
detections_app.add_url_rule(
    '/detection-objects',
    'detection-objects-list',
    views.DetectionObjectCreateListView.as_view('detection-objects-list'),
)
