from google.cloud import vision
from google.cloud.vision import types

from typing import List, Dict


class VisionClient:
    def __init__(self):
        self.gcv_client = vision.ImageAnnotatorClient()

    def localize_objects(self, img_bytes, to_dict=True):
        gcv_img = self.bytes_to_gcv_img(img_bytes)
        response = self.gcv_client.object_localization(image=gcv_img)
        objects = response.localized_object_annotations
        return self.objects_to_list_of_dicts(objects) if to_dict else objects

    @staticmethod
    def objects_to_list_of_dicts(objects):
        output = []
        for object_ in objects:
            entry = {'obj_name': object_.name, 'confidence': object_.score}
            vertices = []
            for vertex in object_.bounding_poly.normalized_vertices:
                vertices.append({'x': vertex.x, 'y': vertex.y})
            entry['bb_vertices'] = vertices
            output.append(entry)
        return output

    @staticmethod
    def print_localized_objects(objects):
        print('Number of objects found: {}'.format(len(objects)))
        for object_ in objects:
            print('\n{} (confidence: {})'.format(object_.name, object_.score))
            print('Normalized bounding polygon vertices: ')
            for vertex in object_.bounding_poly.normalized_vertices:
                print(' - ({}, {})'.format(vertex.x, vertex.y))

    @staticmethod
    def bytes_to_gcv_img(img_bytes):
        return types.Image(content=img_bytes)


def bb_norm_to_corner_pixels(bb_vertices, img_shape):
    """Takes in a list of {'x': x_val, 'y': y_val} dicts and transforms the values to fit pixel values of an img."""
    y_pix, x_pix = img_shape[0], img_shape[1]
    width_pix = int((bb_vertices[1]['x'] - bb_vertices[0]['x']) * x_pix)
    height_pix = int((bb_vertices[2]['y'] - bb_vertices[1]['y']) * y_pix)
    upper_left_x = int(bb_vertices[0]['x'] * x_pix)
    upper_left_y = int(bb_vertices[0]['y'] * y_pix)
    upper_right_x = upper_left_x + width_pix
    upper_right_y = upper_left_y
    lower_left_x = upper_left_x
    lower_left_y = upper_left_y + height_pix
    lower_right_x = lower_left_x + width_pix
    lower_right_y = lower_left_y

    return [
        {'x': upper_left_x, 'y': upper_left_y},
        {'x': upper_right_x, 'y': upper_right_y},
        {'x': lower_right_x, 'y': lower_right_y},
        {'x': lower_left_x, 'y': lower_left_y}
    ]


def objects_dict_coords_to_pic(object_detections, img_shape):
    """Inplace."""
    if not isinstance(object_detections, list):
        raise ValueError('Only works if objects detected has been converted dict.')
    for detection in object_detections:
        detection['bb_vertices'] = bb_norm_to_corner_pixels(detection['bb_vertices'], img_shape)
