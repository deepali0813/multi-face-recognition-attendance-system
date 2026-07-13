import os

# ==========================================================
# PROJECT PATHS
# ==========================================================

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

DATABASE_FOLDER = os.path.join(PROJECT_ROOT, "database")
OUTPUT_FOLDER = os.path.join(PROJECT_ROOT, "output")
INPUT_FOLDER = os.path.join(PROJECT_ROOT, "input")

# ==========================================================
# DATABASE
# ==========================================================

DATABASE_PATH = os.path.join(
    DATABASE_FOLDER,
    "student_database.pkl"
)

# ==========================================================
# OUTPUT FILES
# ==========================================================

ATTENDANCE_FILE = os.path.join(
    OUTPUT_FOLDER,
    "attendance.csv"
)

# ==========================================================
# FACE RECOGNITION
# ==========================================================

FACE_SIZE = 112

SIMILARITY_THRESHOLD = 0.50

# ==========================================================
# INSIGHTFACE MODEL
# ==========================================================

MODEL_NAME = "buffalo_l"

PROVIDER = "CPUExecutionProvider"

# ==========================================================
# YOLO
# ==========================================================

YOLO_MODEL = "yolo26s.pt"

PERSON_CLASS = 0

# ==========================================================
# COLORS (for drawing)
# ==========================================================

BOX_COLOR = (0,255,0)

TEXT_COLOR = (255,255,255)

FONT_SCALE = 0.6

LINE_THICKNESS = 2