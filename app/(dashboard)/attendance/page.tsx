"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttendanceRecord {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    rollNumber: string;
    class: string;
    section?: string;
    imageUrls: string[];
  };
  date: string;
  firstSeen: string;
  lastSeen: string;
  confidence: number;
  cameraId: string;
  status: "present" | "late";
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function todayDateStr() {
  return new Date().toISOString().split("T")[0];
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState(todayDateStr());
  const [initialLoad, setInitialLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAttendance = useCallback(async () => {
    try {
      const res = await axios.get("/attendance", {
        params: { date, page, limit: 20 },
      });
      setRecords(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load attendance");
    } finally {
      setInitialLoad(false);
    }
  }, [date, page]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {total} record{total !== 1 ? "s" : ""} for {date}
          </p>
        </div>
        <Input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
          className="w-40"
        />
      </div>

      {initialLoad ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No attendance records for this date.
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>First Seen</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Camera</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>
                    {record.studentId?.imageUrls?.[0] ? (
                      <img
                        src={record.studentId.imageUrls[0]}
                        alt={record.studentId.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {record.studentId?.name || "Unknown"}
                  </TableCell>
                  <TableCell>{record.studentId?.rollNumber}</TableCell>
                  <TableCell>{record.studentId?.class}</TableCell>
                  <TableCell>{formatTime(record.firstSeen)}</TableCell>
                  <TableCell>{formatTime(record.lastSeen)}</TableCell>
                  <TableCell>{(record.confidence * 100).toFixed(0)}%</TableCell>
                  <TableCell>{record.cameraId}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        record.status === "present"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}