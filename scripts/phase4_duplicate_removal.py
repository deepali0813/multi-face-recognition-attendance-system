# ==========================================================
# PHASE 4
# Duplicate Removal using ArcFace Embeddings
# ==========================================================

import os
import cv2
import shutil
import numpy as np
import pandas as pd

from sklearn.metrics.pairwise import cosine_similarity
from insightface.app import FaceAnalysis

# ==========================================================
# PATHS
# ==========================================================

INPUT_FOLDER = "output/filtered_faces"

OUTPUT_FOLDER = "output/unique_faces"

REPORT_FOLDER = "output"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# ==========================================================
# SETTINGS
# ==========================================================

SIMILARITY_THRESHOLD = 0.90

DET_SIZE = (640,640)

# ==========================================================
# LOAD ARCFACE
# ==========================================================

print("="*60)
print("Loading ArcFace Model...")
print("="*60)

app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

app.prepare(
    ctx_id=0,
    det_size=DET_SIZE
)

print("ArcFace Loaded Successfully\n")

# ==========================================================
# REPORT VARIABLES
# ==========================================================

report = []

total_images = 0

total_saved = 0

total_removed = 0

# ==========================================================
# QUALITY SCORE
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


def quality_score(image):

    h,w = image.shape[:2]

    blur = blur_score(image)

    score = blur + (w*h)/100

    return score

# ==========================================================
# EMBEDDING FUNCTION
# ==========================================================

def get_embedding(image):

    faces = app.get(image)

    if len(faces)==0:

        return None

    embedding = faces[0].embedding

    return embedding.reshape(1,-1)

# ==========================================================
# PERSON LIST
# ==========================================================

persons = sorted(os.listdir(INPUT_FOLDER))

print("Persons Found :",len(persons))
print()

# ==========================================================
# START PROCESSING
# ==========================================================

for person in persons:

    person_path = os.path.join(
        INPUT_FOLDER,
        person
    )

    if not os.path.isdir(person_path):
        continue

    print("=" * 60)
    print(f"Processing : {person}")

    output_person = os.path.join(
        OUTPUT_FOLDER,
        person
    )

    os.makedirs(
        output_person,
        exist_ok=True
    )

    images = sorted([
        img for img in os.listdir(person_path)
        if img.lower().endswith((".jpg", ".jpeg", ".png"))
    ])

    print(f"Images Found : {len(images)}")

    # ------------------------------------------
    # STORE IMAGE INFORMATION
    # ------------------------------------------

    image_data = []

    for image_name in images:

        image_path = os.path.join(
            person_path,
            image_name
        )

        image = cv2.imread(image_path)

        if image is None:
            print(f"Cannot Read : {image_name}")
            continue

        total_images += 1

        embedding = get_embedding(image)

        if embedding is None:
            print(f"No Face Found : {image_name}")
            continue

        score = quality_score(image)

        image_data.append({

            "name": image_name,

            "path": image_path,

            "image": image,

            "embedding": embedding,

            "quality": score

        })

    print(f"Valid Images : {len(image_data)}")

    # ------------------------------------------
    # DUPLICATE REMOVAL
    # ------------------------------------------

    selected_images = []

    for current in image_data:

        duplicate = False

        for saved in selected_images:

            similarity = cosine_similarity(

                current["embedding"],

                saved["embedding"]

            )[0][0]

            # Duplicate Found
            if similarity >= SIMILARITY_THRESHOLD:

                duplicate = True

                total_removed += 1

                # Keep better quality image
                if current["quality"] > saved["quality"]:

                    print(
                        f"Replacing "
                        f"{saved['name']} "
                        f"with "
                        f"{current['name']} "
                        f"(Similarity={similarity:.3f})"
                    )

                    saved["name"] = current["name"]
                    saved["path"] = current["path"]
                    saved["image"] = current["image"]
                    saved["embedding"] = current["embedding"]
                    saved["quality"] = current["quality"]

                break

        if not duplicate:

            selected_images.append(current)

    print(f"Unique Images : {len(selected_images)}")

        # ==========================================================
    # SAVE UNIQUE IMAGES
    # ==========================================================

    for item in selected_images:

        save_path = os.path.join(
            output_person,
            item["name"]
        )

        cv2.imwrite(
            save_path,
            item["image"]
        )

        total_saved += 1

        report.append({

            "person": person,

            "selected_image": item["name"],

            "quality_score": round(
                item["quality"],
                2
            )

        })

# ==========================================================
# SAVE REPORT
# ==========================================================

print("\nSaving Report...")

report_df = pd.DataFrame(report)

report_path = os.path.join(
    REPORT_FOLDER,
    "duplicate_report.csv"
)

report_df.to_csv(
    report_path,
    index=False
)

# ==========================================================
# FINAL SUMMARY
# ==========================================================

print("\n" + "=" * 60)

print("PHASE 4 COMPLETED SUCCESSFULLY")

print("=" * 60)

print(f"Total Images Processed : {total_images}")

print(f"Unique Images Saved : {total_saved}")

print(f"Duplicates Removed : {total_removed}")

print(f"Unique Faces Folder : {OUTPUT_FOLDER}")

print(f"Report Saved : {report_path}")

print("=" * 60)

print("\nReady For Phase 5 (Face Recognition)\n")