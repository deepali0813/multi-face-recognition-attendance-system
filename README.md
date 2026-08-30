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
Screenshots : 

Dashboard

Attendance Processing

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
