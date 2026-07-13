import cv2
import numpy as np
from config import FACE_SIZE
# ==========================================================
# CONFIGURATION
# ==========================================================


TARGET_LEFT = np.array([38, 38], dtype=np.float32)
TARGET_RIGHT = np.array([74, 38], dtype=np.float32)

# ==========================================================
# 2-POINT EYE ALIGNMENT
# ==========================================================

def align_face(face_crop, left_eye, right_eye):

    """
    Align face using only the two eye landmarks.

    Parameters
    ----------
    face_crop : numpy.ndarray
    left_eye : numpy.ndarray
    right_eye : numpy.ndarray

    Returns
    -------
    aligned_face : numpy.ndarray
    """

    dx = right_eye[0] - left_eye[0]
    dy = right_eye[1] - left_eye[1]

    current_dist = np.sqrt(dx * dx + dy * dy)

    if current_dist < 1:
        return None

    target_dist = TARGET_RIGHT[0] - TARGET_LEFT[0]

    scale = target_dist / current_dist

    angle = np.degrees(np.arctan2(dy, dx))

    eye_center = (
        (left_eye[0] + right_eye[0]) / 2,
        (left_eye[1] + right_eye[1]) / 2
    )

    M = cv2.getRotationMatrix2D(
        eye_center,
        -angle,
        scale
    )

    target_center = (
        (TARGET_LEFT[0] + TARGET_RIGHT[0]) / 2,
        (TARGET_LEFT[1] + TARGET_RIGHT[1]) / 2
    )

    M[0,2] += target_center[0] - eye_center[0]
    M[1,2] += target_center[1] - eye_center[1]

    aligned = cv2.warpAffine(
        face_crop,
        M,
        (FACE_SIZE, FACE_SIZE),
        flags=cv2.INTER_LINEAR,
        borderMode=cv2.BORDER_REPLICATE
    )

    return aligned