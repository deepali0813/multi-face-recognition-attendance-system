import os
import cv2
from insightface.app import FaceAnalysis

# ===========================================
# PATHS
# ===========================================

PERSON_FOLDER = "output/person_crop"
FACE_FOLDER = "output/faces"

os.makedirs(FACE_FOLDER, exist_ok=True)

# ===========================================
# LOAD SCRFD
# ===========================================

print("Loading SCRFD...")

app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

app.prepare(
    ctx_id=0,
    det_size=(640, 640)
)

print("SCRFD Loaded Successfully!")

# ===========================================
# PROCESS EACH PERSON
# ===========================================

person_list = sorted(os.listdir(PERSON_FOLDER))

total_faces = 0

for person in person_list:

    person_path = os.path.join(
        PERSON_FOLDER,
        person
    )

    if not os.path.isdir(person_path):
        continue

    output_person = os.path.join(
        FACE_FOLDER,
        person
    )

    os.makedirs(
        output_person,
        exist_ok=True
    )

    images = sorted(os.listdir(person_path))

    print(f"\nProcessing {person}")

    for image_name in images:

        image_path = os.path.join(
            person_path,
            image_name
        )

        image = cv2.imread(image_path)

        if image is None:
            continue

        faces = app.get(image)

        if len(faces) == 0:
            continue

        largest_face = max(
            faces,
            key=lambda x:
            (x.bbox[2]-x.bbox[0]) *
            (x.bbox[3]-x.bbox[1])
        )

        x1, y1, x2, y2 = map(
            int,
            largest_face.bbox
        )

        x1 = max(0, x1)
        y1 = max(0, y1)
        x2 = min(image.shape[1], x2)
        y2 = min(image.shape[0], y2)

        face_crop = image[y1:y2, x1:x2]

        if face_crop.size == 0:
            continue

        save_name = image_name.replace(
            ".jpg",
            "_face.jpg"
        )

        save_path = os.path.join(
            output_person,
            save_name
        )

        cv2.imwrite(
            save_path,
            face_crop
        )

        total_faces += 1

print("\n===================================")
print("FACE EXTRACTION COMPLETED")
print("===================================")
print("Persons :", len(person_list))
print("Faces Saved :", total_faces)
print("Output Folder :", FACE_FOLDER)