"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Upload,
  Video,
  CheckCircle2,
  Loader2,
  Users,
  PlayCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const PYTHON_API = "http://127.0.0.1:8000";


interface RecognizedStudent {
  student: string;
  similarity: number;
}

interface ProcessResult {
  success: boolean;
  message?: string;
  recognized_students?: RecognizedStudent[];
  attendance_marked?: boolean;
  annotated_video?: string | null;
  recognition_csv?: string;
}


export default function ProcessAttendancePage() {

  const [video, setVideo] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [result, setResult] =
    useState<ProcessResult | null>(null);


  // ========================================================
  // SELECT VIDEO
  // ========================================================

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // Basic format check
    const extension =
      selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !["mp4", "avi", "mov"].includes(
        extension || ""
      )
    ) {

      toast.error(
        "Please select an MP4, AVI or MOV video."
      );

      return;
    }

    setVideo(selectedFile);

    setResult(null);
  };


  // ========================================================
  // PROCESS VIDEO
  // ========================================================

  const handleProcess = async () => {

    if (!video) {

      toast.error(
        "Please select a classroom video first."
      );

      return;
    }

    setIsProcessing(true);

    setResult(null);

    try {

      const formData = new FormData();

      formData.append(
        "file",
        video
      );


      const response =
        await axios.post<ProcessResult>(
          `${PYTHON_API}/process-video`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },

            // Your AI pipeline can take a while
            timeout: 0,
          }
        );


      const data = response.data;


      if (!data.success) {

        toast.error(
          data.message ||
          "Video processing failed."
        );

        return;
      }


      setResult(data);

      toast.success(
        "Attendance processed successfully!"
      );

    } catch (error: any) {

      console.error(
        "Video processing error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Could not process video. Make sure the Python API is running."
      );

    } finally {

      setIsProcessing(false);
    }
  };


  // ========================================================
  // ANNOTATED VIDEO URL
  // ========================================================

  const annotatedVideoUrl =
    result?.annotated_video
      ? `${PYTHON_API}${result.annotated_video}`
      : null;


  // ========================================================
  // PAGE
  // ========================================================

  return (

    <div className="max-w-3xl space-y-6">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div>

        <h1 className="text-2xl font-semibold tracking-tight">
          Process Attendance
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Upload a classroom video to recognize students
          and automatically mark attendance.
        </p>

      </div>


      {/* ================================================== */}
      {/* UPLOAD CARD */}
      {/* ================================================== */}

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <Video className="h-5 w-5" />

            Classroom Video

          </CardTitle>

          <CardDescription>
            Upload an MP4, AVI or MOV classroom video.
          </CardDescription>

        </CardHeader>


        <CardContent className="space-y-5">

          {/* ------------------------------------------------ */}
          {/* UPLOAD AREA */}
          {/* ------------------------------------------------ */}

          <label
            htmlFor="video-upload"
            className="
              flex
              flex-col
              items-center
              justify-center
              border-2
              border-dashed
              border-border
              rounded-xl
              py-12
              cursor-pointer
              hover:bg-accent/50
              transition-colors
            "
          >

            <Upload
              className="
                h-8
                w-8
                text-muted-foreground
                mb-3
              "
            />

            <span className="text-sm font-medium">
              Click to upload classroom video
            </span>

            <span className="text-xs text-muted-foreground mt-1">
              MP4, AVI or MOV
            </span>


            <input
              id="video-upload"
              type="file"
              accept="video/mp4,video/avi,video/quicktime"
              onChange={handleVideoChange}
              className="hidden"
              disabled={isProcessing}
            />

          </label>


          {/* ------------------------------------------------ */}
          {/* SELECTED VIDEO */}
          {/* ------------------------------------------------ */}

          {video && (

            <div
              className="
                flex
                items-center
                justify-between
                rounded-lg
                border
                border-border
                bg-muted/40
                p-4
              "
            >

              <div className="flex items-center gap-3">

                <Video
                  className="
                    h-5
                    w-5
                    text-primary
                  "
                />

                <div>

                  <p className="text-sm font-medium">
                    {video.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {(
                      video.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ------------------------------------------------ */}
          {/* PROCESS BUTTON */}
          {/* ------------------------------------------------ */}

          <Button
            className="w-full"
            size="lg"
            onClick={handleProcess}
            disabled={
              !video ||
              isProcessing
            }
          >

            {isProcessing ? (

              <>
                <Loader2
                  className="
                    mr-2
                    h-4
                    w-4
                    animate-spin
                  "
                />

                Processing Video...
              </>

            ) : (

              <>
                <PlayCircle
                  className="
                    mr-2
                    h-4
                    w-4
                  "
                />

                Process Attendance
              </>

            )}

          </Button>


          {/* ------------------------------------------------ */}
          {/* PROCESSING MESSAGE */}
          {/* ------------------------------------------------ */}

          {isProcessing && (

            <div
              className="
                rounded-lg
                border
                border-border
                bg-muted/30
                p-4
                text-center
              "
            >

              <p className="text-sm font-medium">
                AI processing is in progress...
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                The classroom video is being analyzed.
                This may take a few minutes.
              </p>

            </div>

          )}

        </CardContent>

      </Card>


      {/* ================================================== */}
      {/* RESULTS */}
      {/* ================================================== */}

      {result?.success && (

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <CheckCircle2
                className="
                  h-5
                  w-5
                  text-success
                "
              />

              Attendance Processed

            </CardTitle>

            <CardDescription>
              Students recognized from the classroom video.
            </CardDescription>

          </CardHeader>


          <CardContent className="space-y-5">

            {/* ============================================ */}
            {/* RECOGNIZED STUDENTS */}
            {/* ============================================ */}

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mb-3
                "
              >

                <Users className="h-4 w-4" />

                <p className="text-sm font-medium">
                  Recognized Students
                </p>

              </div>


              {result.recognized_students &&
              result.recognized_students.length > 0 ? (

                <div className="space-y-2">

                  {result.recognized_students.map(
                    (student) => (

                      <div
                        key={student.student}
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-lg
                          border
                          border-border
                          p-3
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <CheckCircle2
                            className="
                              h-4
                              w-4
                              text-success
                            "
                          />

                          <span className="text-sm font-medium">
                            {student.student}
                          </span>

                        </div>


                        <span
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >

                          Similarity:{" "}

                          {(
                            student.similarity *
                            100
                          ).toFixed(1)}
                          %

                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div
                  className="
                    rounded-lg
                    border
                    border-dashed
                    border-border
                    p-6
                    text-center
                  "
                >

                  <p className="text-sm text-muted-foreground">
                    No students were recognized.
                  </p>

                </div>

              )}

            </div>


            {/* ============================================ */}
            {/* ATTENDANCE STATUS */}
            {/* ============================================ */}

            <div
              className="
                rounded-lg
                bg-primary/10
                border
                border-primary/20
                p-4
              "
            >

              <p className="text-sm font-medium">

                {result.attendance_marked
                  ? "✓ Attendance marked successfully"
                  : "No attendance was marked"}

              </p>

            </div>


            {/* ============================================ */}
            {/* ANNOTATED VIDEO */}
            {/* ============================================ */}

            {annotatedVideoUrl && (

              <div className="space-y-3">

                <p className="text-sm font-medium">
                  Annotated Video
                </p>


                <video
                  src={annotatedVideoUrl}
                  controls
                  className="
                    w-full
                    rounded-lg
                    border
                    border-border
                  "
                />

              </div>

            )}

          </CardContent>

        </Card>

      )}

    </div>
  );
}