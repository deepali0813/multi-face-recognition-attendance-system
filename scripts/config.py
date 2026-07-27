# ===============================
# PATHS
# ===============================

INPUT_FOLDER = "input"

OUTPUT_FOLDER = "output"

PERSON_FOLDER = "output/person_crop"

VIDEO_FOLDER = "output/annotated_video"

CSV_FOLDER = "output/csv"

MODEL_PATH = "weights/yolo11s.pt"

# ===============================
# YOLO SETTINGS
# ===============================

CONFIDENCE = 0.55

IMG_SIZE = 640

DEVICE = "cpu"

# Save crop every N frames for same track

SAVE_INTERVAL = 10

# Ignore very small persons

MIN_WIDTH = 100

MIN_HEIGHT = 180