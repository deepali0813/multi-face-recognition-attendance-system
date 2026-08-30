from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import cv2
import os
import shutil
import uuid
import subprocess
import sys
import pandas as pd


# ==========================================================
# FASTAPI APP
# ==========================================================

app = FastAPI(
    title="Multi-Face Recognition Attendance API"
)


# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# PROJECT PATHS
# ==========================================================

PROJECT_ROOT = os.path.dirname(
    os.path.abspath(__file__)
)

INPUT_FOLDER = os.path.join(
    PROJECT_ROOT,
    "input"
)

UPLOAD_FOLDER = os.path.join(
    INPUT_FOLDER,
    "frontend_uploads"
)

OUTPUT_FOLDER = os.path.join(
    PROJECT_ROOT,
    "output"
)

CSV_FOLDER = os.path.join(
    OUTPUT_FOLDER,
    "csv"
)

ATTENDANCE_FILE = os.path.join(
    OUTPUT_FOLDER,
    "attendance.csv"
)

VIDEO_OUTPUT_FOLDER = os.path.join(
    OUTPUT_FOLDER,
    "annotated_video"
)


# ==========================================================
# CREATE DIRECTORIES
# ==========================================================

os.makedirs(
    INPUT_FOLDER,
    exist_ok=True
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

os.makedirs(
    OUTPUT_FOLDER,
    exist_ok=True
)

os.makedirs(
    CSV_FOLDER,
    exist_ok=True
)

os.makedirs(
    VIDEO_OUTPUT_FOLDER,
    exist_ok=True
)


# ==========================================================
# SERVE OUTPUT FILES
# ==========================================================

app.mount(
    "/output",
    StaticFiles(
        directory=OUTPUT_FOLDER
    ),
    name="output"
)


# ==========================================================
# HEALTH CHECK
# ==========================================================

@app.get("/")
def root():

    return {
        "success": True,
        "message": "Face Attendance Python API is running"
    }


# ==========================================================
# RECOGNIZE SINGLE IMAGE
# ==========================================================

@app.post("/recognize")
async def recognize_image(
    file: UploadFile = File(...)
):

    # ------------------------------------------------------
    # Import recognition modules
    # ------------------------------------------------------

    from modules.face_detector import detect_face
    from modules.eye_alignment import align_face
    from modules.recognizer import recognize_face
    from modules.attendance import mark_attendance

    # ------------------------------------------------------
    # Save uploaded image temporarily
    # ------------------------------------------------------

    extension = os.path.splitext(
        file.filename or ""
    )[1].lower()

    if extension == "":
        extension = ".jpg"

    filename = (
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )

    image_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    with open(
        image_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # ------------------------------------------------------
    # Read image
    # ------------------------------------------------------

    image = cv2.imread(
        image_path
    )

    if image is None:

        return {
            "success": False,
            "message": "Could not read uploaded image"
        }

    # ------------------------------------------------------
    # Face detection
    # ------------------------------------------------------

    success, face_crop, left_eye, right_eye, bbox = detect_face(
        image
    )

    if not success:

        return {
            "success": False,
            "message": "No face detected"
        }

    # ------------------------------------------------------
    # Eye alignment
    # ------------------------------------------------------

    aligned_face = align_face(
        face_crop,
        left_eye,
        right_eye
    )

    if aligned_face is None:

        return {
            "success": False,
            "message": "Face alignment failed"
        }

    # ------------------------------------------------------
    # Face recognition
    # ------------------------------------------------------

    student, similarity = recognize_face(
        aligned_face
    )

    # ------------------------------------------------------
    # Attendance
    # ------------------------------------------------------

    attendance_marked = False

    if (
        student is not None
        and student != "Unknown"
    ):

        mark_attendance(
            student,
            similarity
        )

        attendance_marked = True

    # ------------------------------------------------------
    # Response
    # ------------------------------------------------------

    return {
        "success": True,
        "student": student,
        "similarity": round(
            float(similarity),
            4
        ),
        "attendance_marked": attendance_marked
    }


# ==========================================================
# PROCESS VIDEO
# ==========================================================

@app.post("/process-video")
async def process_video(
    file: UploadFile = File(...)
):

    # ======================================================
    # VALIDATE FILE
    # ======================================================

    if not file.filename:

        return {
            "success": False,
            "message": "No video selected"
        }

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    allowed_extensions = [
        ".mp4",
        ".avi",
        ".mov"
    ]

    if extension not in allowed_extensions:

        return {
            "success": False,
            "message": (
                "Unsupported video format. "
                "Use MP4, AVI or MOV."
            )
        }

    # ======================================================
    # CLEAN INPUT FOLDER
    #
    # IMPORTANT:
    # Phase 1 scans the entire input folder.
    # Therefore, we remove old videos so that
    # only the newly uploaded video gets processed.
    # ======================================================

    print("\n" + "=" * 60)
    print("CLEANING OLD INPUT VIDEOS")
    print("=" * 60)

    for old_file in os.listdir(INPUT_FOLDER):

        old_path = os.path.join(
            INPUT_FOLDER,
            old_file
        )

        # Only remove actual files
        if not os.path.isfile(old_path):
            continue

        # Do not touch frontend_uploads or other files
        if old_file.lower().endswith(
            (".mp4", ".avi", ".mov")
        ):

            try:

                os.remove(old_path)

                print(
                    f"Removed old video: {old_file}"
                )

            except PermissionError:

                print(
                    f"Could not remove: {old_file}"
                )

    # ======================================================
    # SAVE NEW VIDEO
    # ======================================================

    filename = (
        f"frontend_"
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )

    video_path = os.path.join(
        INPUT_FOLDER,
        filename
    )

    with open(
        video_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    print("\n" + "=" * 60)
    print("VIDEO RECEIVED")
    print("=" * 60)

    print(
        f"Saved video: {video_path}"
    )

    print("=" * 60)

    # ======================================================
    # REMOVE OLD RECOGNITION CSV
    #
    # This prevents results from a previous run
    # being returned if the new run fails.
    # ======================================================

    csv_path = os.path.join(
        CSV_FOLDER,
        "recognition_results.csv"
    )

    if os.path.exists(csv_path):

        try:

            os.remove(csv_path)

            print(
                "Removed old recognition CSV"
            )

        except PermissionError:

            print(
                "Could not remove old recognition CSV"
            )

    # ======================================================
    # RUN EXISTING PHASE 1 PIPELINE
    # ======================================================

    command = [

        sys.executable,

        "-u",

        "-m",

        "scripts.phase1_person_detection",

        "--video",

        video_path
    ]

    print("\n" + "=" * 60)
    print("STARTING PHASE 1")
    print("=" * 60)

    print(
        " ".join(command)
    )

    print("=" * 60)

    try:

        result = subprocess.run(

            command,

            cwd=PROJECT_ROOT,

            capture_output=False,

            text=True,

            timeout=1800

        )

    except subprocess.TimeoutExpired:

        return {

            "success": False,

            "message":
                "Video processing timed out after 30 minutes"
        }

    except Exception as e:

        return {

            "success": False,

            "message":
                "Could not start Phase 1",

            "error":
                str(e)
        }

    # ======================================================
    # CHECK PHASE 1 RESULT
    # ======================================================

    if result.returncode != 0:

        return {

            "success": False,

            "message":
                "Phase 1 processing failed",

            "return_code":
                result.returncode
        }

    # ======================================================
    # READ RECOGNITION CSV
    # ======================================================

    recognized_students = []

    if os.path.exists(csv_path):

        try:

            df = pd.read_csv(
                csv_path
            )

            if (
                not df.empty
                and "student" in df.columns
            ):

                recognized_df = df[
                    df["student"] != "Unknown"
                ]

                if not recognized_df.empty:

                    # Keep one result per student
                    recognized_students = (

                        recognized_df[
                            [
                                "student",
                                "similarity"
                            ]
                        ]

                        .drop_duplicates(
                            subset=[
                                "student"
                            ]
                        )

                        .to_dict(
                            orient="records"
                        )
                    )

        except Exception as e:

            print(
                "CSV read error:",
                e
            )

    # ======================================================
    # FIND ANNOTATED VIDEO
    # ======================================================

    annotated_video = None

    if os.path.exists(
        VIDEO_OUTPUT_FOLDER
    ):

        videos = [

            f

            for f in os.listdir(
                VIDEO_OUTPUT_FOLDER
            )

            if f.lower().endswith(
                (
                    ".mp4",
                    ".avi",
                    ".mov"
                )
            )

        ]

        if videos:

            latest_video = max(

                videos,

                key=lambda f:
                    os.path.getmtime(
                        os.path.join(
                            VIDEO_OUTPUT_FOLDER,
                            f
                        )
                    )
            )

            annotated_video = (
                "/output/annotated_video/"
                + latest_video
            )

    # ======================================================
    # FINAL RESPONSE
    # ======================================================

    print("\n" + "=" * 60)
    print("VIDEO PROCESSING COMPLETED")
    print("=" * 60)

    print(
        "Recognized Students:",
        recognized_students
    )

    print(
        "Annotated Video:",
        annotated_video
    )

    print("=" * 60)

    return {

        "success": True,

        "message":
            "Video processed successfully",

        "recognized_students":
            recognized_students,

        "attendance_marked":
            len(recognized_students) > 0,

        "annotated_video":
            annotated_video,

        "recognition_csv":
            "/output/csv/recognition_results.csv"
    }