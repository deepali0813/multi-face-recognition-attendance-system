import os
import cv2
from ultralytics import YOLO
from insightface.app import FaceAnalysis

# -------------------------------
# Load Models
# -------------------------------

person_model = YOLO("weights/yolo11s.pt")

face_model = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

face_model.prepare(
    ctx_id=0,
    det_size=(640,640)
)

# -------------------------------

INPUT_FOLDER = "input"

OUTPUT_VIDEO = "output/annotated_videos"

PERSON_FOLDER = "person_crop"

FACE_FOLDER = "faces"

os.makedirs(OUTPUT_VIDEO, exist_ok=True)
os.makedirs(PERSON_FOLDER, exist_ok=True)
os.makedirs(FACE_FOLDER, exist_ok=True)

video_files = sorted(
    [
        f for f in os.listdir(INPUT_FOLDER)
        if f.endswith(".mp4")
    ]
)

person_id = 0
face_id = 0

for video in video_files:

    print(f"\nProcessing {video}")

    path = os.path.join(
        INPUT_FOLDER,
        video
    )

    cap = cv2.VideoCapture(path)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    output_path = os.path.join(
        OUTPUT_VIDEO,
        "detected_" + video
    )

    writer = cv2.VideoWriter(
        output_path,
        cv2.VideoWriter_fourcc(*"mp4v"),
        fps,
        (width,height)
    )

    frame_no = 0

    while True:

        ret, frame = cap.read()

        if not ret:
            break

        frame_no += 1

        results = person_model.predict(
            frame,
            classes=[0],
            conf=0.5,
            verbose=False
        )

        annotated = results[0].plot()

        writer.write(annotated)

        for box in results[0].boxes:

            x1,y1,x2,y2 = map(
                int,
                box.xyxy[0]
            )

            person = frame[y1:y2,x1:x2]

            if person.size == 0:
                continue

            person_name = (
                f"{video[:-4]}_frame{frame_no}_person{person_id}.jpg"
            )

            cv2.imwrite(
                os.path.join(
                    PERSON_FOLDER,
                    person_name
                ),
                person
            )

            faces = face_model.get(person)

            for face in faces:

                fx1,fy1,fx2,fy2 = face.bbox.astype(int)

                face_crop = person[
                    fy1:fy2,
                    fx1:fx2
                ]

                if face_crop.size == 0:
                    continue

                face_name = (
                    f"{video[:-4]}_frame{frame_no}_face{face_id}.jpg"
                )

                cv2.imwrite(
                    os.path.join(
                        FACE_FOLDER,
                        face_name
                    ),
                    face_crop
                )

                face_id += 1

            person_id += 1

    cap.release()
    writer.release()

print("\nFinished Successfully")