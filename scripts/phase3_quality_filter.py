import os
import cv2
import shutil
import numpy as np
import pandas as pd

# =====================================================
# PATHS
# =====================================================

INPUT_FOLDER = "output/faces"
OUTPUT_FOLDER = "output/filtered_faces"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# =====================================================
# PARAMETERS
# =====================================================

MIN_FACE_WIDTH = 20
MIN_FACE_HEIGHT = 20

MIN_BLUR = 5

MIN_BRIGHTNESS = 10
MAX_BRIGHTNESS = 250

accepted = 0
rejected = 0

report = []

# =====================================================
# FUNCTIONS
# =====================================================

def blur_score(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var()

def brightness(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return np.mean(gray)

# =====================================================
# START
# =====================================================

persons = sorted(os.listdir(INPUT_FOLDER))

for person in persons:

    person_path = os.path.join(INPUT_FOLDER, person)

    if not os.path.isdir(person_path):
        continue

    output_person = os.path.join(OUTPUT_FOLDER, person)

    os.makedirs(output_person, exist_ok=True)

    images = sorted(os.listdir(person_path))

    print(f"\nProcessing {person}")

    for image_name in images:

        image_path = os.path.join(person_path, image_name)

        image = cv2.imread(image_path)

        if image is None:

            rejected += 1

            report.append({
                "person": person,
                "image": image_name,
                "reason": "Cannot Read"
            })

            continue

        h, w = image.shape[:2]

        blur = blur_score(image)

        bright = brightness(image)

        reason = "Accepted"

        # -------------------------
        # Size Check
        # -------------------------

        if w < MIN_FACE_WIDTH or h < MIN_FACE_HEIGHT:

            reason = f"Small Face ({w}x{h})"

        # -------------------------
        # Blur Check
        # -------------------------

        elif blur < MIN_BLUR:

            reason = f"Blur ({blur:.2f})"

        # -------------------------
        # Brightness Check
        # -------------------------

        elif bright < MIN_BRIGHTNESS:

            reason = f"Dark ({bright:.2f})"

        elif bright > MAX_BRIGHTNESS:

            reason = f"Bright ({bright:.2f})"

        # -------------------------
        # SAVE
        # -------------------------

        if reason == "Accepted":

            save_path = os.path.join(
                output_person,
                image_name
            )

            shutil.copy(image_path, save_path)

            accepted += 1

            print(
                f"Accepted : {image_name} | "
                f"{w}x{h} | "
                f"Blur={blur:.2f} | "
                f"Brightness={bright:.2f}"
            )

        else:

            rejected += 1

            print(
                f"Rejected : {image_name} | "
                f"{reason} | "
                f"{w}x{h} | "
                f"Blur={blur:.2f} | "
                f"Brightness={bright:.2f}"
            )

        report.append({

            "person": person,

            "image": image_name,

            "width": w,

            "height": h,

            "blur": round(blur,2),

            "brightness": round(bright,2),

            "status": reason

        })

# =====================================================
# SAVE REPORT
# =====================================================

df = pd.DataFrame(report)

df.to_csv(
    "output/quality_report.csv",
    index=False
)

print("\n========================================")
print("QUALITY FILTER COMPLETED")
print("========================================")

print("Accepted :", accepted)
print("Rejected :", rejected)

print("\nReport Saved : output/quality_report.csv")
print("Filtered Faces :", OUTPUT_FOLDER)