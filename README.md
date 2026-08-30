# Multi-Face Recognition Attendance System

> An AI-powered attendance system that automatically detects, tracks, recognizes, and records multiple students from classroom videos.

![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688.svg)
![OpenCV](https://img.shields.io/badge/OpenCV-Computer%20Vision-red.svg)

---

## Overview

The **Multi-Face Recognition Attendance System** is an AI-based classroom attendance solution designed to automate the process of identifying students and recording their attendance from classroom videos.

Traditional attendance systems require manual identification of students, which can be time-consuming and prone to errors. This project uses computer vision and face recognition techniques to detect multiple people in a classroom environment, recognize known students, and automatically mark their attendance.

The system consists of a modern web interface built with **Next.js** and a **FastAPI-based Python backend** responsible for running the computer vision and face recognition pipeline.

The application processes an uploaded classroom video through multiple stages including person detection, tracking, face detection, face alignment, face recognition, and attendance marking.

---

## Features

- **Multi-face detection** — Detect multiple people and faces in classroom videos.
- **Person detection and tracking** — Detect and track people across video frames.
- **Face alignment** — Align detected faces using eye landmarks before recognition.
- **Face recognition** — Generate face embeddings and compare them against known students.
- **Automatic attendance marking** — Mark attendance for successfully recognized students.
- **Similarity scores** — Display recognition similarity scores for identified students.
- **Annotated video generation** — Generate a processed video containing recognition information.
- **CSV-based results** — Store recognition and attendance results in CSV files.
- **Web-based interface** — Upload classroom videos directly through the frontend.
- **FastAPI backend** — Provides API endpoints for communication between the frontend and recognition pipeline.

---

## Demo

The application currently runs locally.

### Frontend

```text
http://localhost:3000
```
### Python Backend
```
http://127.0.0.1:8000
```
### FastAPI Documentation
```
http://127.0.0.1:8000/docs
```
## Screenshots : 

### Dashboard

<img width="1919" height="815" alt="image" src="https://github.com/user-attachments/assets/278784d9-4dbd-4483-bf1c-921c602691b1" />

### Enroll students

<img width="1828" height="955" alt="image" src="https://github.com/user-attachments/assets/7b3052b6-162a-463a-80ea-17e64b9eb519" />

### Attendance Processing
<img width="1352" height="760" alt="image" src="https://github.com/user-attachments/assets/290af5ec-07cb-482a-a78d-94522adb3340" />




Recognition Results

### Tech Stack
```
| Layer             | Technologies               |
| ----------------- | -------------------------- |
| Frontend          | Next.js, React, TypeScript |
| UI                | Tailwind CSS, shadcn/ui    |
| Backend           | Python, FastAPI            |
| Computer Vision   | OpenCV                     |
| Person Detection  | YOLO                       |
| Tracking          | ByteTrack                  |
| Face Recognition  | InsightFace                |
| Data Processing   | Pandas, NumPy              |
| API Communication | REST API                   |
| Version Control   | Git, GitHub                |
```
### Architecture

The system follows a frontend-backend architecture where the Next.js application communicates with a Python FastAPI service.
```
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Next.js Frontend  │
                         │                     │
                         │ Video Upload / UI   │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP
                                    ▼
                         ┌─────────────────────┐
                         │    FastAPI Backend  │
                         │                     │
                         │ /process-video      │
                         │ /recognize          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌──────────────────────────────┐
                    │     Recognition Pipeline     │
                    │                              │
                    │ Person Detection             │
                    │        ↓                     │
                    │ Tracking                     │
                    │        ↓                     │
                    │ Face Detection               │
                    │        ↓                     │
                    │ Eye Alignment                │
                    │        ↓                     │
                    │ Face Recognition             │
                    │        ↓                     │
                    │ Student Identification       │
                    │        ↓                     │
                    │ Attendance Marking           │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │           Outputs            │
                    │                              │
                    │ Recognition CSV              │
                    │ Attendance CSV               │
                    │ Annotated Video              │
                    └──────────────────────────────┘
```
### Recognition Pipeline
```
Classroom Video
       │
       ▼
Person Detection
       │
       ▼
Multi-Object Tracking
       │
       ▼
Face Detection
       │
       ▼
Eye Landmark Detection
       │
       ▼
Face Alignment
       │
       ▼
Face Embedding
       │
       ▼
Face Recognition
       │
       ▼
Student Identification
       │
       ▼
Attendance Marking
       │
       ▼
CSV + Annotated Video
```
### Project Structure
```
Multi-Face-Recognition-Attendance-System/
│
├── app/                              # Next.js application
│   ├── (dashboard)/                  # Dashboard pages
│   ├── api/                          # Next.js API routes
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
│
├── components/                       # Reusable frontend components
│   ├── layout/                       # Layout components
│   └── ui/                           # UI components
│
├── lib/                              # Application utilities
│   ├── auth.ts                       # Authentication utilities
│   ├── axios.ts                      # Axios configuration
│   ├── cloudinary.ts                 # Cloudinary integration
│   ├── db.ts                         # Database utilities
│   ├── pythonService.ts              # Python backend communication
│   ├── utils.ts                      # Shared utilities
│   └── validations/                  # Validation schemas
│
├── models/                           # Application data models
│   ├── admin.ts
│   ├── attendance.ts
│   ├── camera.ts
│   └── student.ts
│
├── modules/                          # Face recognition modules
│   ├── face_detector.py              # Face detection
│   ├── eye_alignment.py              # Face alignment
│   ├── recognizer.py                 # Face recognition
│   └── attendance.py                 # Attendance handling
│
├── scripts/                          # Processing scripts
│   └── phase1_person_detection.py    # Person detection pipeline
│
├── data/                             # Recognition dataset
├── input/                            # Input files
├── output/                           # Generated results
├── weights/                          # Model weights
│
├── backend.py                        # FastAPI application
├── config.py                         # Configuration
├── requirements.txt                  # Python dependencies
├── package.json                      # Frontend dependencies
├── postcss.config.mjs                # PostCSS configuration
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Project documentation
```
### Getting Started
#### Prerequisites

Make sure the following are installed:

Python 3.12+
Node.js
npm
Git

A system capable of running the required computer vision and machine learning models is recommended.
Installation
1. Clone the Repository
 ```
git clone <REPOSITORY_URL>
cd Multi-Face-Recognition-Attendance-System
```
2. Create a Python Virtual Environment
On Windows:
```
python -m venv venv
```
Activate the environment:
```
.\venv\Scripts\activate
```
3. Install Python Dependencies
```
pip install -r requirements.txt
```
4. Install Frontend Dependencies
```
npm install
```
Environment Variables

Create a .env.local file in the project root.

Example:
```
# Python backend
PYTHON_API_URL=http://127.0.0.1:8000

# Add other project-specific environment variables here if required.
```
Never commit .env.local or any file containing secrets, passwords, API keys, or database credentials to GitHub.
Running Locally

The application requires both the Python backend and the Next.js frontend.

Start the Python Backend

Open a terminal and activate the Python environment:
```
.\venv\Scripts\activate
```
Start the FastAPI server:
```
uvicorn backend:app --reload --port 8000
```
The backend will be available at:
```
http://127.0.0.1:8000
```
FastAPI interactive documentation:
```
http://127.0.0.1:8000/docs
```
Start the Frontend

Open a second terminal in the project directory:
```
npm run dev
```
The frontend will be available at:
```
http://localhost:3000
```
### Usage
1.Start the Python FastAPI backend.

2.Start the Next.js development server.

3.Open the application in your browser.

4.Navigate to the attendance processing page.

5.Upload a classroom video.

6.The frontend sends the video to the FastAPI backend.

7.The backend starts the recognition pipeline.

8.People are detected and tracked.

9.Faces are detected and aligned.

10.Detected faces are compared with known student embeddings.

11.Recognized students are identified.

12.Attendance is marked for recognized students.

13.Recognition results are returned to the frontend.

14.An annotated video is generated.

15.Recognition and attendance information is stored in CSV format.

### API Reference

The FastAPI backend currently exposes the following primary endpoints.

Health Check
```
GET /
```
Returns the current status of the backend.

Example response:
```
{
  "success": true,
  "message": "Face Attendance Python API is running"
}
```
### Recognize Image
```
POST /recognize
```
Accepts an uploaded image and runs the face recognition pipeline.
```
Image
  ↓
Face Detection
  ↓
Eye Alignment
  ↓
Face Recognition
  ↓
Attendance Marking
```
Example response:
```
{
  "success": true,
  "student": "Student Name",
  "similarity": 0.87,
  "attendance_marked": true
}
```
### Process Video
```
POST /process-video
```
Accepts a classroom video and runs the complete recognition pipeline.
Example response:
```
{
  "success": true,
  "message": "Video processed successfully",
  "recognized_students": [
    {
      "student": "Student Name",
      "similarity": 0.87
    }
  ],
  "attendance_marked": true,
  "annotated_video": "/output/annotated_video/example.mp4",
  "recognition_csv": "/output/csv/recognition_results.csv"
}
```
### Output

The system generates the following outputs.

Recognition Results
```
output/csv/recognition_results.csv
```
Contains information about recognized students and their similarity scores.

Attendance
```
output/attendance.csv
```
Stores attendance records generated by the recognition pipeline.

Annotated Video
```
output/annotated_video/
```
Contains processed classroom videos with recognition annotations.
### Face Recognition

The recognition pipeline consists of several stages.

Face Detection

Faces are detected from input images or video frames using computer vision techniques.

Eye Alignment

Detected faces are aligned using eye landmarks. This helps normalize differences in face orientation before recognition.

Face Embeddings

The recognition module generates numerical representations of detected faces.

Similarity Matching

The generated face embedding is compared against stored student embeddings.

Student Identification

If the similarity score satisfies the configured recognition threshold, the corresponding student is identified.

Attendance

Once a student is successfully recognized, their attendance is recorded.
### Current Status
### Completed
 Next.js frontend
 
 FastAPI backend
 
 Classroom video upload
 
 Person detection
 
 Multi-object tracking
 
 Face detection
 
 Eye-based face alignment
 
 Face recognition
 
 Similarity scoring
 
 Automatic attendance marking
 
 Recognition CSV generation
 
 Annotated video generation
 
 Frontend-backend integration

### Future Improvements
 Database integration
 
 Persistent student management
 
 Production deployment
 
 Real-time camera-based attendance
 
 Performance optimization for long classroom videos
 
 Improved recognition speed
 
 Advanced attendance analytics
 ### Contributors
| Name         | Role                                         |
| ------------ | ---------------------------------------------|
| Deepali Garg |AI/ML Research, Computer Vision Pipeline      |
|              | Development(Recognition pipeline),           |
|              | Backend & Full-Stack Integration             |
| Hitesh Jain  | Video processing pipeline /Research work     |
| Kristy Rajput| UI/Frontend                                  |

## Acknowledgements

- [OpenCV](https://opencv.org/) for computer vision functionality.
- [FastAPI](https://fastapi.tiangolo.com/) for the Python API backend.
- [Next.js](https://nextjs.org/) for the web application framework.
- [Ultralytics](https://www.ultralytics.com/) for YOLO-based object detection.
- [InsightFace](https://github.com/deepinsight/insightface) for face recognition functionality.
- [ByteTrack](https://github.com/ifzhang/ByteTrack) for multi-object tracking.
- [shadcn/ui](https://ui.shadcn.com/) for UI components.
- PClub UIET for the project platform and mentorship.


