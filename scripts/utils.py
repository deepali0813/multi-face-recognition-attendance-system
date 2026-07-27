import os
import cv2


def create_folder(path):

    if not os.path.exists(path):

        os.makedirs(path)


def crop_person(frame, box):

    x1, y1, x2, y2 = map(int, box)

    return frame[y1:y2, x1:x2]


def valid_crop(img):

    if img is None:

        return False

    if img.size == 0:

        return False

    return True