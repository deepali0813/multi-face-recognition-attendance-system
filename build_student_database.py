from insightface.app import FaceAnalysis
import os
import cv2
import pickle
import numpy as np

# =====================================================
# CHANGE ONLY THIS
# =====================================================

ALIGNMENT = "Eyes"
# Options:
# None
# Eyes
# 5Point

# =====================================================
# DATASET PATH
# =====================================================

GALLERY_FOLDER = os.path.join(
    "data",
    "FaceData"
)

# =====================================================
# OUTPUT DATABASE
# =====================================================

OUTPUT_FILE = os.path.join(
    "database",
    "student_database.pkl"
)

os.makedirs("database", exist_ok=True)

# =====================================================
# LOAD ARCFACE
# =====================================================

app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

app.prepare(ctx_id=-1)

# =====================================================
# BUILD DATABASE
# =====================================================

database = {}

total_images = 0
successful_embeddings = 0

print("=" * 60)
print("BUILDING STUDENT DATABASE")
print("=" * 60)

# =====================================================
# LOOP THROUGH STUDENTS
# =====================================================

for student in sorted(os.listdir(GALLERY_FOLDER)):

    student_folder = os.path.join(
        GALLERY_FOLDER,
        student
    )

    if not os.path.isdir(student_folder):
        continue

    print(f"\nStudent : {student}")

    embeddings = []

    for image_name in sorted(os.listdir(student_folder)):

        image_path = os.path.join(
            student_folder,
            image_name
        )

        image = cv2.imread(image_path)

        if image is None:
            print(f"❌ Could not read {image_name}")
            continue

        total_images += 1

        faces = app.get(image)

        if len(faces) == 0:

            print(f"❌ No face : {image_name}")
            continue

        if len(faces) > 1:

            print(f"⚠ Multiple faces detected in {image_name}. Using largest face.")

        largest = max(
            faces,
            key=lambda f:
            (f.bbox[2] - f.bbox[0]) *
            (f.bbox[3] - f.bbox[1])
        )

        embedding = largest.normed_embedding

        embedding = embedding / np.linalg.norm(embedding)

        embeddings.append(embedding)

        successful_embeddings += 1

        print(f"✅ {image_name}")

    if len(embeddings) > 0:

        database[student] = embeddings

        print(f"Saved {len(embeddings)} embeddings.")

    else:

        print("No valid embeddings found.")

# =====================================================
# SAVE DATABASE
# =====================================================

with open(
    OUTPUT_FILE,
    "wb"
) as f:

    pickle.dump(
        database,
        f
    )

# =====================================================
# SUMMARY
# =====================================================

print("\n")
print("=" * 60)
print("DATABASE CREATED SUCCESSFULLY")
print("=" * 60)

print(f"Alignment Method      : {ALIGNMENT}")
print(f"Students Enrolled     : {len(database)}")
print(f"Images Processed      : {total_images}")
print(f"Embeddings Generated  : {successful_embeddings}")

print("=" * 60)

print("\nDatabase saved to:")
print(OUTPUT_FILE)