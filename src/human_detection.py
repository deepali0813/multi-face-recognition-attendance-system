from ultralytics import YOLO
import cv2
import random

random.seed(42)

colors = [
    (
        random.randint(0,255),
        random.randint(0,255),
        random.randint(0,255)
    )
    for _ in range(100)
]

model = YOLO("yolov8s.pt")

cap = cv2.VideoCapture("data/video/video1.mp4")

width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS))

out = cv2.VideoWriter(
    "outputs/video1result.mp4",
    cv2.VideoWriter_fourcc(*'mp4v'),
    fps,
    (width, height)
)

while cap.isOpened():

    success, frame = cap.read()

    if not success:
        break

    results = model(frame)

    person_count = 0

    for result in results:

        for box in result.boxes:

            cls = int(box.cls[0])
            confidence = float(box.conf[0])

            if cls == 0 and confidence > 0.5:

                person_count += 1

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                color = colors[person_count % len(colors)]

                cv2.rectangle(
                    frame,
                    (x1, y1),
                    (x2, y2),
                    color,
                    1
                )

                cv2.putText(
                    frame,
                    f"P{person_count}",
                    (x1, y1 - 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.4,
                    color,
                    1
                )

    out.write(frame)

    cv2.imshow("Human Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
out.release()
cv2.destroyAllWindows()

print("Video saved successfully!")