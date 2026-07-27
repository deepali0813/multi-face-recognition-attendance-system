# ==========================================================
# PHASE 1
# Person Detection + ByteTrack + Person Crop
# ==========================================================

import os
import cv2
import time
import pandas as pd
import supervision as sv
from ultralytics import YOLO

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

MODEL_PATH = "weights/yolo11s.pt"

# ==========================================================
# SETTINGS
# ==========================================================

CONFIDENCE = 0.50

IMG_SIZE = 640

DEVICE = "cpu"

SAVE_INTERVAL = 10

MIN_WIDTH = 100

MIN_HEIGHT = 180

# ==========================================================
# CREATE OUTPUT FOLDERS
# ==========================================================

os.makedirs(
    OUTPUT_FOLDER,
    exist_ok=True
)

os.makedirs(
    PERSON_FOLDER,
    exist_ok=True
)

os.makedirs(
    VIDEO_FOLDER,
    exist_ok=True
)

os.makedirs(
    CSV_FOLDER,
    exist_ok=True
)

# ==========================================================
# LOAD YOLO11
# ==========================================================

print("\nLoading YOLO11 Model...\n")

model = YOLO(MODEL_PATH)

print("Model Loaded Successfully\n")

# ==========================================================
# INITIALIZE BYTETRACK
# ==========================================================

tracker = sv.ByteTrack(
    track_activation_threshold=0.5,
    lost_track_buffer=30,
    minimum_matching_threshold=0.8,
    frame_rate=30
)

# ==========================================================
# CSV STORAGE
# ==========================================================

csv_rows = []

# ==========================================================
# FIND ALL VIDEOS
# ==========================================================

video_files = sorted([
    file
    for file in os.listdir(INPUT_FOLDER)
    if file.endswith((".mp4", ".avi", ".mov"))
])

print(f"Videos Found : {len(video_files)}\n")

# ==========================================================
# START PROCESSING
# ==========================================================

for video_name in video_files:

    print("=" * 60)
    print("Processing :", video_name)

    video_path = os.path.join(
        INPUT_FOLDER,
        video_name
    )

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():

        print("Cannot Open Video")

        continue

    width = int(
        cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    )

    height = int(
        cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    )

    fps = cap.get(
        cv2.CAP_PROP_FPS
    )

    total_frames = int(
        cap.get(
            cv2.CAP_PROP_FRAME_COUNT
        )
    )

    output_video = os.path.join(
        VIDEO_FOLDER,
        "annotated_" + video_name
    )

    writer = cv2.VideoWriter(

        output_video,

        cv2.VideoWriter_fourcc(*'mp4v'),

        fps,

        (width, height)

    )

    frame_number = 0

    last_saved = {}

    print(
        f"Frames : {total_frames}"
    )

    # =====================================
    # FRAME LOOP STARTS HERE
    # =====================================

    while True:

        ret, frame = cap.read()

        if not ret:

            break

        frame_number += 1

        print(
            f"Processing Frame : {frame_number}/{total_frames}",
            end="\r"
        )
        # =====================================
        # START TIMER
        # =====================================

        start_time = time.time()

        # =====================================
        # YOLO PERSON DETECTION
        # =====================================

        results = model.predict(
            source=frame,
            conf=CONFIDENCE,
            imgsz=IMG_SIZE,
            classes=[0],          # Person class only
            device=DEVICE,
            verbose=False
        )

        result = results[0]

        # =====================================
        # CONVERT TO SUPERVISION DETECTIONS
        # =====================================

        detections = sv.Detections.from_ultralytics(result)

        # =====================================
        # UPDATE BYTETRACK
        # =====================================

        detections = tracker.update_with_detections(
            detections
        )

        # =====================================
        # LOOP OVER TRACKED PERSONS
        # =====================================

        if detections.tracker_id is not None:

            for box, confidence, class_id, track_id in zip(

                    detections.xyxy,
                    detections.confidence,
                    detections.class_id,
                    detections.tracker_id
            ):

                x1, y1, x2, y2 = map(int, box)

                width_box = x2 - x1
                height_box = y2 - y1

                # Ignore very small detections
                if width_box < MIN_WIDTH:
                    continue

                if height_box < MIN_HEIGHT:
                    continue

                # =====================================
                # CREATE PERSON FOLDER
                # =====================================

                person_folder = os.path.join(
                    PERSON_FOLDER,
                    f"person_{track_id:04d}"
                )

                os.makedirs(
                    person_folder,
                    exist_ok=True
                )

                # =====================================
                # SAVE EVERY N FRAMES
                # =====================================

                if track_id not in last_saved:
                    last_saved[track_id] = -SAVE_INTERVAL

                if frame_number - last_saved[track_id] >= SAVE_INTERVAL:

                    crop = frame[
                        max(0, y1):min(height, y2),
                        max(0, x1):min(width, x2)
                    ]

                    if crop.size > 0:

                        image_name = os.path.join(
                            person_folder,
                            f"frame_{frame_number}.jpg"
                        )

                        cv2.imwrite(
                            image_name,
                            crop
                        )

                        last_saved[track_id] = frame_number

                # =====================================
                # DRAW BOUNDING BOX
                # =====================================

                cv2.rectangle(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    2
                )

                # =====================================
                # LABEL
                # =====================================

                label = (
                    f"ID:{track_id} "
                    f"{confidence:.2f}"
                )

                cv2.putText(
                    frame,
                    label,
                    (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 255, 0),
                    2
                )

                # =====================================
                # CSV ENTRY
                # =====================================

                csv_rows.append({

                    "video": video_name,

                    "frame": frame_number,

                    "track_id": int(track_id),

                    "confidence": float(confidence),

                    "x1": x1,

                    "y1": y1,

                    "x2": x2,

                    "y2": y2

                })

        # =====================================
        # CALCULATE FPS
        # =====================================

        end_time = time.time()

        inference_time = end_time - start_time

        fps_display = 1 / inference_time if inference_time > 0 else 0

        cv2.putText(

            frame,

            f"FPS : {fps_display:.2f}",

            (20, 35),

            cv2.FONT_HERSHEY_SIMPLEX,

            1,

            (0, 0, 255),

            2

        )

        # =====================================
        # WRITE FRAME
        # =====================================

        writer.write(frame)
        
            # =====================================
    # END OF FRAME LOOP
    # =====================================

    cap.release()
    writer.release()

    print(f"\nFinished Processing : {video_name}")

# ==========================================================
# SAVE CSV FILE
# ==========================================================

print("\nSaving CSV File...")

csv_path = os.path.join(
    CSV_FOLDER,
    "person_detection_results.csv"
)

df = pd.DataFrame(csv_rows)

df.to_csv(
    csv_path,
    index=False
)

print("CSV Saved Successfully")

# ==========================================================
# PROJECT SUMMARY
# ==========================================================

print("\n" + "=" * 60)

print("PHASE 1 COMPLETED SUCCESSFULLY")

print("=" * 60)

print(f"Videos Processed : {len(video_files)}")

print(f"Total Detections : {len(csv_rows)}")

unique_tracks = len(df["track_id"].unique()) if not df.empty else 0

print(f"Unique Persons : {unique_tracks}")

print(f"Annotated Videos : {VIDEO_FOLDER}")

print(f"Person Crops : {PERSON_FOLDER}")

print(f"CSV Report : {csv_path}")

print("=" * 60)

print("\nReady For Phase 2 (SCRFD Face Detection)\n")

cv2.destroyAllWindows()