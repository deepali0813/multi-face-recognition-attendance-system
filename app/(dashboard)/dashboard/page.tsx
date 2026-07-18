"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  attendancePercentage: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/dashboard");
        setStats(res.data.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // const cards = [
  //   {
  //     label: "Total Students",
  //     value: stats?.totalStudents ?? 0,
  //     icon: Users,
  //     color: "text-primary bg-primary/10",
  //   },
  //   {
  //     label: "Present Today",
  //     value: stats?.presentToday ?? 0,
  //     icon: UserCheck,
  //     color: "text-success bg-success/10",
  //   },
  //   {
  //     label: "Absent Today",
  //     value: stats?.absentToday ?? 0,
  //     icon: UserX,
  //     color: "text-destructive bg-destructive/10",
  //   },
  //   {
  //     label: "Attendance %",
  //     value: `${stats?.attendancePercentage ?? 0}%`,
  //     icon: TrendingUp,
  //     color: "text-warning bg-warning/10",
  //   },
  // ];

  // return (
  //   <div className="space-y-4">
  //     <div>
  //       <h1 className="text-xl font-medium">Dashboard</h1>
  //       <p className="text-sm text-muted-foreground">Today's overview</p>
  //     </div>

  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  //       {cards.map((card) => (
  //         <Card key={card.label}>
  //           <CardContent className="pt-6">
  //             <div className="flex items-center justify-between">
  //               <div>
  //                 <p className="text-sm text-muted-foreground">{card.label}</p>
  //                 <p className="text-2xl font-medium mt-1">
  //                   {isLoading ? "—" : card.value}
  //                 </p>
  //               </div>
  //               <div className={`p-2.5 rounded-lg ${card.color}`}>
  //                 <card.icon className="h-5 w-5" />
  //               </div>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       ))}
  //     </div>
  //   </div>
  // );
  const cards = [
    {
      label: "Total Students",
      value: stats?.totalStudents ?? 0,
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Present Today",
      value: stats?.presentToday ?? 0,
      icon: UserCheck,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    {
      label: "Absent Today",
      value: stats?.absentToday ?? 0,
      icon: UserX,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
    {
      label: "Attendance",
      value: `${stats?.attendancePercentage ?? 0}%`,
      icon: TrendingUp,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      showBar: true,
      barValue: stats?.attendancePercentage ?? 0,
    },
  ];

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-lg ${card.iconBg}`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">{card.label}</p>
            <p className="text-3xl font-semibold mt-1 tracking-tight">
              {isLoading ? (
                <span className="inline-block h-8 w-12 bg-muted rounded animate-pulse" />
              ) : (
                card.value
              )}
            </p>
            {card.showBar && !isLoading && (
              <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full transition-all duration-500"
                  style={{ width: `${card.barValue}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {!isLoading && stats?.totalStudents === 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No students enrolled yet. Head to the Students page to add your first student.
          </p>
        </div>
      )}
    </div>
  );
}

