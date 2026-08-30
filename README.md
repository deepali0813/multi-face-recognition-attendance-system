# Multi-Face Recognition Attendance System

> An AI-powered attendance system that automatically detects, tracks, recognizes, and records multiple students from classroom videos.

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688.svg)](https://fastapi.tiangolo.com/)
[![OpenCV](https://img.shields.io/badge/OpenCV-Computer%20Vision-red.svg)](https://opencv.org/)

---

## Overview

The **Multi-Face Recognition Attendance System** is an AI-based classroom attendance solution designed to automate the process of identifying students and recording their attendance from classroom videos.

Traditional attendance systems require manual identification of students, which can be time-consuming and prone to errors. This project uses computer vision and face recognition techniques to detect multiple people in a classroom environment, recognize known students, and automatically mark their attendance.

The system consists of a modern web interface built with **Next.js** and a **FastAPI-based Python backend** responsible for running the computer vision and face recognition pipeline.

The application processes an uploaded classroom video through multiple stages including person detection, face detection, face alignment, face recognition, and attendance marking.

---

## Features

- **Multi-face detection** — Detect multiple people/faces in classroom videos.
- **Person detection and tracking** — Detect and track people across video frames.
- **Face alignment** — Align detected faces using eye landmarks before recognition.
- **Face recognition** — Generate face embeddings and compare them against known students.
- **Automatic attendance marking** — Mark attendance for successfully recognized students.
- **Similarity scores** — Display recognition similarity/confidence information.
- **Annotated video generation** — Generate a processed video containing recognition information.
- **CSV-based results** — Store recognition and attendance results in CSV files.
- **Web-based interface** — Upload classroom videos directly through the frontend.
- **FastAPI backend** — Provides API endpoints for communication between the frontend and recognition pipeline.

---

## Live Demo

The project is currently intended to be run locally.

### Frontend

```text
http://localhost:3000
