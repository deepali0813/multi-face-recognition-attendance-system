import os
import cv2

from modules.face_detector import detect_face
from modules.eye_alignment import align_face
from modules.recognizer import recognize_face
from modules.attendance import mark_attendance

INPUT_FOLDER = "input"

print("="*60)
print("FACE RECOGNITION ATTENDANCE SYSTEM")
print("="*60)

if not os.path.exists(INPUT_FOLDER):
    print("Input folder not found!")
    exit()

images = sorted(os.listdir(INPUT_FOLDER))

for image_name in images:

    image_path = os.path.join(INPUT_FOLDER, image_name)

    person_crop = cv2.imread(image_path)

    if person_crop is None:
        continue

    print(f"\nProcessing : {image_name}")

    # --------------------------------------------------
    # FACE DETECTION
    # --------------------------------------------------

    success, face_crop, left_eye, right_eye, bbox = detect_face(person_crop)

    if not success:

        print("No face detected.")
        continue

    # --------------------------------------------------
    # EYE ALIGNMENT
    # --------------------------------------------------

    aligned_face = align_face(
        face_crop,
        left_eye,
        right_eye
    )

    if aligned_face is None:

        print("Alignment Failed")
        continue

    # --------------------------------------------------
    # FACE RECOGNITION
    # --------------------------------------------------

    student_name, similarity = recognize_face(aligned_face)

    print(f"Recognized : {student_name}")
    print(f"Similarity : {similarity:.4f}")

    # --------------------------------------------------
    # ATTENDANCE
    # --------------------------------------------------

    mark_attendance(
        student_name,
        similarity
    )

    # --------------------------------------------------
    # DISPLAY
    # --------------------------------------------------

    cv2.imshow("Person", person_crop)
    cv2.imshow("Aligned Face", aligned_face)

    key = cv2.waitKey(500)

    if key == 27:
        break

cv2.destroyAllWindows()

print("\n")
print("="*60)
print("Attendance Completed")
print("="*60)