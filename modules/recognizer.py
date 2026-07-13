from insightface.app import FaceAnalysis
import numpy as np
import pickle
from config import DATABASE_PATH
# ==========================================================
# LOAD GALLERY DATABASE
# ==========================================================


with open(DATABASE_PATH, "rb") as f:
    gallery_database = pickle.load(f)

# ==========================================================
# LOAD ARCFACE
# ==========================================================

app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

app.prepare(ctx_id=-1)

# ==========================================================
# RECOGNIZER
# ==========================================================

def recognize_face(aligned_face):

    """
    Recognize an aligned face.

    Returns
    -------
    student_name
    similarity
    """

    if aligned_face is None:
        return None, 0.0

    faces = app.get(aligned_face)

    if len(faces) == 0:
        return None, 0.0

    embedding = faces[0].normed_embedding

    best_student = None
    best_similarity = -1

    for student, gallery_embedding in gallery_database.items():

        similarity = np.dot(
            embedding,
            gallery_embedding
        )

        if similarity > best_similarity:

            best_similarity = similarity
            best_student = student

    THRESHOLD = 0.50

    if best_similarity < THRESHOLD:
      return "Unknown", float(best_similarity)

    return best_student, float(best_similarity)  