from pprint import pprint
import numpy as np
import torch
import torchvision
from pprint import pprint

import cv2
import matplotlib.pyplot as plt

torch.cuda.empty_cache()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
model.eval()

COCO_INSTANCE_CATEGORY_NAMES = [
    '__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus',
    'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'N/A', 'stop sign',
    'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
    'elephant', 'bear', 'zebra', 'giraffe', 'N/A', 'backpack', 'umbrella', 'N/A', 'N/A',
    'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
    'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
    'bottle', 'N/A', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl',
    'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
    'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'N/A', 'dining table',
    'N/A', 'N/A', 'toilet', 'N/A', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
    'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'N/A', 'book',
    'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
]

transform = torchvision.transforms.Compose([torchvision.transforms.ToTensor()])


def get_prediction(img_pil, threshold, limit_n_detects=10):
    """Run the object detection model on an PIL Image img_pil.
    Supply maximum suppression by a given threshold. All detections with scores below that threshold are not considered.
    """
    img = transform(img_pil)

    if torch.cuda.is_available():
        model.to('cuda')
        img = img.to(device)
    pred = model([img])

    pred_class = [COCO_INSTANCE_CATEGORY_NAMES[i] for i in
                  list(pred[0]['labels'].cpu().numpy())]  # Get the Prediction Score

    pred_boxes = [[(i[0], i[1]), (i[2], i[3])] for i in list(pred[0]['boxes'].cpu().detach().numpy())]  # Bounding boxes
    pred_score = list(pred[0]['scores'].cpu().detach().numpy())

    # Limit number of detections
    pred_class = pred_class[:limit_n_detects]
    pred_boxes = pred_boxes[:limit_n_detects]
    pred_score = pred_score[:limit_n_detects]
    pred_ts = [pred_score.index(x) for x in pred_score if x > threshold]

    # Handle case when there are no detections above threshold
    if len(pred_ts) == 0:
        return [], [], []
    pred_t = pred_ts[-1]
    pred_boxes = pred_boxes[:pred_t + 1]
    pred_class = pred_class[:pred_t + 1]
    pred_scores = pred_score[:pred_t + 1]
    torch.cuda.empty_cache()
    return pred_boxes, pred_class, pred_scores


def detect_objects(img, threshold=0.55):
    """Run the actual inference on the network."""
    boxes, pred_cls, pred_score = get_prediction(img, threshold)
    return convert_into_dict(boxes, pred_cls, pred_score, img.size)


def convert_into_dict(boxes, pred_cls, pred_scores, img_shape):
    """Returns list of detection dicts."""
    width, height = img_shape[0], img_shape[1]

    detections = []
    for box, class_, score in zip(boxes, pred_cls, pred_scores):
        top_left, bottom_right = box
        x1 = float(top_left[0] / width)
        y1 = float(top_left[1] / height)
        x3 = float(bottom_right[0] / width)
        y3 = float(bottom_right[1] / height)
        x2 = x3
        y2 = y1
        x4 = x1
        y4 = y3

        entry = {
            'bb_vertices': [
                {'x': x1, 'y': y1},
                {'x': x2, 'y': y2},
                {'x': x3, 'y': y3},
                {'x': x4, 'y': y4},
            ],
            'confidence': float(score),
            'obj_name': class_
        }
        detections.append(entry)
    pprint(detections)
    return detections


def pil2bgr(img_pil):
    """PIL Image to BGR numpy array."""
    return np.asarray(img_pil)[:, :, ::-1].copy()


def plot_results(img, threshold=0.1, rect_th=3, text_size=3, text_th=3):
    """BROKEN!"""
    boxes, pred_cls, pred_score = get_prediction(img, threshold) # Get predictions
    img = pil2bgr(img)
    for i in range(len(boxes)):
        cv2.rectangle(img, boxes[i][0], boxes[i][1],color=(0, 255, 0), thickness=rect_th) # Draw Rectangle with the coordinates
        cv2.putText(img, f'{pred_cls[i]}: {pred_score[i]:.2f}', boxes[i][0],  cv2.FONT_HERSHEY_SIMPLEX, text_size, (0,255,0),thickness=text_th) # Write the prediction class
    plt.figure(figsize=(20, 30)) # display the output image
    plt.imshow(img)
    plt.show()