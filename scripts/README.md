# Multi-Face Recognition Attendance System

## Project Overview

This project is an AI-based automated attendance system that detects and recognizes multiple faces from images and CCTV video streams.

The system uses YOLO for person detection and face recognition techniques to identify registered students and mark attendance automatically.

---

## Features

- Face Detection
- Multi-person Detection
- Attendance Automation
- Video Processing
- Image Processing
- Bounding Box Annotation
- Attendance Record Generation

---

## Project Structure

```
ExamAttendance/
│
├── faces/
│   ├── Student Images
│
├── input/
│   ├── Input Videos
│
├── output/
│   ├── Annotated Videos
│
├── scripts/
│   ├── Detection Scripts
│   ├── Recognition Scripts
│
├── weights/
│   ├── Model Files
│
├── download_model.py
├── yolo26s.pt
└── README.md
```

---

## Technologies Used

- Python
- OpenCV
- YOLO
- NumPy
- Face Recognition
- Deep Learning

---

## Installation

Clone the repository

```bash
git clone https://github.com/deepali0813/multi-face-recognition-attendance-system.git
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run

```bash
python scripts/main.py
```

---

## Future Work

- Live CCTV Monitoring
- Real-Time Attendance
- Face Tracking
- Database Integration
- Web Dashboard

---

## Author

Hitesh Jain