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
    Recognize an aligned face using multiple gallery embeddings
    (Maximum Cosine Similarity).
    """

    if aligned_face is None:
        return None, 0.0

    faces = app.get(aligned_face)

    if len(faces) == 0:
        return None, 0.0

    probe_embedding = faces[0].normed_embedding
    probe_embedding = probe_embedding / np.linalg.norm(probe_embedding)

    best_student = None
    best_similarity = -1

    # -------------------------------------------------------
    # Compare against every student's embeddings
    # -------------------------------------------------------

    for student, gallery_embeddings in gallery_database.items():

        student_best = -1

        for gallery_embedding in gallery_embeddings:

            similarity = np.dot(
                probe_embedding,
                gallery_embedding
            )

            if similarity > student_best:
                student_best = similarity

        if student_best > best_similarity:
            best_similarity = student_best
            best_student = student

    # -------------------------------------------------------
    # Recognition Threshold
    # -------------------------------------------------------

    THRESHOLD = 0.40

    if best_similarity < THRESHOLD:
        return "Unknown", float(best_similarity)

    return best_student, float(best_similarity)