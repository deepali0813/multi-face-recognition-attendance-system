import csv
import os
from datetime import datetime
from config import OUTPUT_FOLDER
from config import ATTENDANCE_FILE
# ==========================================================
# CONFIGURATION
# ==========================================================


os.makedirs(OUTPUT_FOLDER, exist_ok=True)


# ==========================================================
# CREATE CSV IF NOT EXISTS
# ==========================================================

if not os.path.exists(ATTENDANCE_FILE):

    with open(
        ATTENDANCE_FILE,
        "w",
        newline=""
    ) as file:

        writer = csv.writer(file)

        writer.writerow([
            "Student",
            "Time"
        ])

# ==========================================================
# MARK ATTENDANCE
# ==========================================================

def mark_attendance(student_name,similarity):

    """
    Marks attendance only once.

    Parameters
    ----------
    student_name : str
    """

    if student_name is None:
        return

    if student_name == "Unknown":
        return

    marked_students = set()

    with open(
        ATTENDANCE_FILE,
        "r"
    ) as file:

        reader = csv.reader(file)

        next(reader)

        for row in reader:

            if len(row) > 0:
                marked_students.add(row[0])

    if student_name in marked_students:

        print(f"{student_name} already marked.")

        return

    current_time = datetime.now().strftime(
        "%H:%M:%S"
    )

    with open(
        ATTENDANCE_FILE,
        "a",
        newline=""
    ) as file:

        writer = csv.writer(file)

        writer.writerow([
            student_name,
            current_time,
            round(similarity, 4)
        ])

    print(f"Attendance Marked : {student_name}")