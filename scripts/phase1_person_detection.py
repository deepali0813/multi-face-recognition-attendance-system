# ==========================================================
# INTEGRATED PHASE 1
# YOLO + ByteTrack + SCRFD + Eye Alignment + ArcFace
# ==========================================================

import os
import cv2
import time
import numpy as np
import pandas as pd
import supervision as sv

from ultralytics import YOLO

# ----------------------------------------------------------
# IMPORT YOUR MODULES
# ----------------------------------------------------------

from modules.face_detector import detect_face
from modules.eye_alignment import align_face
from modules.recognizer import recognize_face
from modules.attendance import mark_attendance

# ==========================================================
# PATHS
# ==========================================================

INPUT_FOLDER = "input"

OUTPUT_FOLDER = "output"

PERSON_FOLDER = os.path.join(
    OUTPUT_FOLDER,
    "person_crop"
)

VIDEO_FOLDER = os.path.join(
    OUTPUT_FOLDER,
    "annotated_video"
)

CSV_FOLDER = os.path.join(
    OUTPUT_FOLDER,
    "csv"
)

# ==========================================================
# MODEL
# ==========================================================

MODEL_PATH = "weights/yolo26s.pt"

# ==========================================================
# SETTINGS
# ==========================================================

CONFIDENCE = 0.50

IMG_SIZE = 640

DEVICE = "cpu"

SAVE_INTERVAL = 10

MIN_WIDTH = 100

MIN_HEIGHT = 180

# ----------------------------
# Face Quality Parameters
# ----------------------------

MIN_FACE_WIDTH = 60

MIN_FACE_HEIGHT = 60

MIN_BLUR = 40

MIN_BRIGHTNESS = 20

MAX_BRIGHTNESS = 240

# ==========================================================
# CREATE OUTPUT FOLDERS
# ==========================================================

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

os.makedirs(PERSON_FOLDER, exist_ok=True)

os.makedirs(VIDEO_FOLDER, exist_ok=True)

os.makedirs(CSV_FOLDER, exist_ok=True)

# ==========================================================
# LOAD YOLO
# ==========================================================

print("\nLoading YOLO11 Model...\n")

model = YOLO(MODEL_PATH)

print("YOLO Loaded Successfully\n")

# ==========================================================
# INITIALIZE BYTETRACK
# ==========================================================

tracker = sv.ByteTrack(
    track_activation_threshold=0.5,
    lost_track_buffer=30,
    minimum_matching_threshold=0.8,
    frame_rate=30
)

print("ByteTrack Initialized\n")

# ==========================================================
# TRACK CACHE
# ==========================================================

# Track ID -> Student Name
recognized_tracks = {}

# Track ID -> Similarity
track_similarity = {}

# Last frame saved for crop
last_saved = {}

# ==========================================================
# CSV STORAGE
# ==========================================================

csv_rows = []

# ==========================================================
# QUALITY FUNCTIONS
# ==========================================================

def blur_score(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    return cv2.Laplacian(
        gray,
        cv2.CV_64F
    ).var()


def brightness(image):

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    return np.mean(gray)


def is_good_face(face):

    if face is None:
        return False

    h, w = face.shape[:2]

    if w < MIN_FACE_WIDTH:
        return False

    if h < MIN_FACE_HEIGHT:
        return False

    blur = blur_score(face)

    if blur < MIN_BLUR:
        return False

    bright = brightness(face)

    if bright < MIN_BRIGHTNESS:
        return False

    if bright > MAX_BRIGHTNESS:
        return False

    return True

# ==========================================================
# FIND VIDEOS
# ==========================================================

video_files = sorted([

    file

    for file in os.listdir(INPUT_FOLDER)

    if file.endswith((".mp4", ".avi", ".mov"))

])

print(f"Videos Found : {len(video_files)}")
# ==========================================================
# START PROCESSING
# ==========================================================

for video_name in video_files:

    print("\n" + "=" * 60)
    print(f"Processing : {video_name}")

    video_path = os.path.join(
        INPUT_FOLDER,
        video_name
    )

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():

        print("Cannot Open Video")

        continue

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fps = cap.get(cv2.CAP_PROP_FPS)

    total_frames = int(
        cap.get(cv2.CAP_PROP_FRAME_COUNT)
    )

    output_video = os.path.join(
        VIDEO_FOLDER,
        "annotated_" + video_name
    )

    writer = cv2.VideoWriter(
        output_video,
        cv2.VideoWriter_fourcc(*"mp4v"),
        fps,
        (width, height)
    )

    frame_number = 0

    # ------------------------------------------
    # PROCESS FRAME
    # ------------------------------------------

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame_number += 1

        print(
            f"Frame : {frame_number}/{total_frames}",
            end="\r"
        )

        start_time = time.time()

        # ------------------------------------------
        # YOLO PERSON DETECTION
        # ------------------------------------------

        results = model.predict(

            source=frame,

            conf=CONFIDENCE,

            imgsz=IMG_SIZE,

            classes=[0],      # Person only

            device=DEVICE,

            verbose=False

        )

        result = results[0]

        detections = sv.Detections.from_ultralytics(
            result
        )

        detections = tracker.update_with_detections(
            detections
        )

        # ------------------------------------------
        # LOOP THROUGH DETECTIONS
        # ------------------------------------------

        if detections.tracker_id is not None:

            for (
                box,
                confidence,
                class_id,
                track_id

            ) in zip(

                detections.xyxy,
                detections.confidence,
                detections.class_id,
                detections.tracker_id

            ):

                x1, y1, x2, y2 = map(
                    int,
                    box
                )

                width_box = x2 - x1
                height_box = y2 - y1

                # ----------------------------------
                # Ignore small persons
                # ----------------------------------

                if width_box < MIN_WIDTH:
                    continue

                if height_box < MIN_HEIGHT:
                    continue

                # ----------------------------------
                # Crop Person
                # ----------------------------------

                person_crop = frame[
                    max(0, y1):min(height, y2),
                    max(0, x1):min(width, x2)
                ]

                if person_crop.size == 0:
                    continue

                # ----------------------------------
                # Save crop every N frames
                # ----------------------------------

                if track_id not in last_saved:
                    last_saved[track_id] = -SAVE_INTERVAL

                if (
                    frame_number
                    - last_saved[track_id]
                    >= SAVE_INTERVAL
                ):

                    person_folder = os.path.join(
                        PERSON_FOLDER,
                        f"person_{track_id:04d}"
                    )

                    os.makedirs(
                        person_folder,
                        exist_ok=True
                    )

                    image_name = os.path.join(
                        person_folder,
                        f"frame_{frame_number}.jpg"
                    )

                    cv2.imwrite(
                        image_name,
                        person_crop
                    )

                    last_saved[track_id] = frame_number

                # ==================================================
                # FROM HERE STARTS FACE DETECTION + RECOGNITION
                # ==================================================
                                # ----------------------------------
                # Already Recognized?
                # ----------------------------------

                if track_id in recognized_tracks:

                    student = recognized_tracks[track_id]
                    similarity = track_similarity[track_id]

                else:

                    # ----------------------------------
                    # SCRFD Face Detection
                    # ----------------------------------

                    success, face_crop, left_eye, right_eye, bbox = detect_face(
                        person_crop
                    )

                    if not success:
                        continue

                    # ----------------------------------
                    # Face Quality Check
                    # ----------------------------------

                    if not is_good_face(face_crop):
                        continue

                    # ----------------------------------
                    # Eye Alignment
                    # ----------------------------------

                    aligned_face = align_face(
                        face_crop,
                        left_eye,
                        right_eye
                    )

                    if aligned_face is None:
                        continue

                    # ----------------------------------
                    # ArcFace Recognition
                    # ----------------------------------

                    student, similarity = recognize_face(
                        aligned_face
                    )

                    # ----------------------------------
                    # Save Track Cache
                    # ----------------------------------

                    if student != "Unknown":

                        recognized_tracks[track_id] = student

                        track_similarity[track_id] = similarity

                        # Mark attendance only once
                        mark_attendance(
                            student,
                            similarity
                        )

                # ----------------------------------
                # Display Label
                # ----------------------------------

                if student == "Unknown":

                    label = "Unknown"

                    color = (0, 0, 255)

                else:

                    label = (
                        f"{student} "
                        f"({similarity:.2f})"
                    )

                    color = (0, 255, 0)

                # ----------------------------------
                # Draw Bounding Box
                # ----------------------------------

                cv2.rectangle(

                    frame,

                    (x1, y1),

                    (x2, y2),

                    color,

                    2

                )

                # ----------------------------------
                # Draw Label
                # ----------------------------------

                cv2.putText(

                    frame,

                    label,

                    (x1, y1 - 10),

                    cv2.FONT_HERSHEY_SIMPLEX,

                    0.7,

                    color,

                    2

                )

                # ----------------------------------
                # CSV Entry
                # ----------------------------------

                csv_rows.append({

                    "video": video_name,

                    "frame": frame_number,

                    "track_id": int(track_id),

                    "student": student,

                    "similarity": round(similarity, 4),

                    "x1": x1,

                    "y1": y1,

                    "x2": x2,

                    "y2": y2

                })

                        # ==========================================================
        # FPS DISPLAY
        # ==========================================================

        end_time = time.time()

        inference_time = end_time - start_time

        fps_display = (
            1 / inference_time
            if inference_time > 0
            else 0
        )

        cv2.putText(

            frame,

            f"FPS : {fps_display:.2f}",

            (20, 35),

            cv2.FONT_HERSHEY_SIMPLEX,

            1,

            (0, 0, 255),

            2

        )

        # ==========================================================
        # WRITE FRAME
        # ==========================================================

        writer.write(frame)

    # ==========================================================
    # END OF VIDEO
    # ==========================================================

    cap.release()

    writer.release()

    print(f"\nFinished Processing : {video_name}")

# ==========================================================
# SAVE CSV
# ==========================================================

print("\nSaving CSV...")

csv_path = os.path.join(

    CSV_FOLDER,

    "recognition_results.csv"

)

df = pd.DataFrame(csv_rows)

df.to_csv(

    csv_path,

    index=False

)

# ==========================================================
# SUMMARY
# ==========================================================

print("\n" + "=" * 60)

print("INTEGRATED PIPELINE COMPLETED SUCCESSFULLY")

print("=" * 60)

print(f"Videos Processed : {len(video_files)}")

print(f"Total Frames Logged : {len(csv_rows)}")

if not df.empty:

    unique_tracks = len(df["track_id"].unique())

    unique_students = len(
        df[df["student"] != "Unknown"]["student"].unique()
    )

else:

    unique_tracks = 0

    unique_students = 0

print(f"Unique Tracks : {unique_tracks}")

print(f"Recognized Students : {unique_students}")

print(f"Annotated Videos : {VIDEO_FOLDER}")

print(f"Person Crops : {PERSON_FOLDER}")

print(f"Recognition CSV : {csv_path}")

print("=" * 60)

cv2.destroyAllWindows() 