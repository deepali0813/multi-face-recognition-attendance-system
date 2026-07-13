from insightface.app import FaceAnalysis
import numpy as np
import cv2
from config import MODEL_NAME
from config import PROVIDER

app = FaceAnalysis(
    name=MODEL_NAME,
    providers=[PROVIDER]
)
# ==========================================================
# LOAD SCRFD (Load only once)
# ==========================================================

app.prepare(ctx_id=-1)

# ==========================================================
# FACE DETECTOR
# ==========================================================

def detect_face(person_crop):

    """
    Detects the largest face inside a person crop.

    Parameters
    ----------
    person_crop : numpy.ndarray
        Person image obtained from YOLO.

    Returns
    -------
    success : bool
    face_crop : numpy.ndarray
    left_eye : numpy.ndarray
    right_eye : numpy.ndarray
    bbox : tuple
    """

    if person_crop is None:
        return False, None, None, None, None

    faces = app.get(person_crop)

    if len(faces) == 0:
        return False, None, None, None, None

    # ----------------------------------------------------
    # Largest Face
    # ----------------------------------------------------

    largest = max(
        faces,
        key=lambda f:
        (f.bbox[2]-f.bbox[0]) *
        (f.bbox[3]-f.bbox[1])
    )

    x1, y1, x2, y2 = largest.bbox.astype(int)

    h, w = person_crop.shape[:2]

    x1 = max(0, x1)
    y1 = max(0, y1)

    x2 = min(w, x2)
    y2 = min(h, y2)

    face_crop = person_crop[y1:y2, x1:x2]

    if face_crop.size == 0:
        return False, None, None, None, None

    # ----------------------------------------------------
    # Eye Coordinates
    # ----------------------------------------------------

    kps = largest.kps

    left_eye = np.array([
        kps[0][0] - x1,
        kps[0][1] - y1
    ], dtype=np.float32)

    right_eye = np.array([
        kps[1][0] - x1,
        kps[1][1] - y1
    ], dtype=np.float32)

    bbox = (x1, y1, x2, y2)

    return (
        True,
        face_crop,
        left_eye,
        right_eye,
        bbox
    )