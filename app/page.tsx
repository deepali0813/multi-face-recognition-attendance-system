import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanFace, Users, CalendarCheck, Shield } from "lucide-react";

export default function HomePage() {
  const features = [
    { icon: ScanFace, title: "Face Recognition", desc: "CCTV-based multiface detection and matching" },
    { icon: CalendarCheck, title: "Auto Attendance", desc: "Real-time attendance marking, no manual entry" },
    { icon: Users, title: "Student Management", desc: "Simple enrollment with photo-based profiles" },
    { icon: Shield, title: "Secure Dashboard", desc: "Admin-only access with full attendance history" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary">
            <ScanFace className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold">AISOC</span>
        </div>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Multiface Recognition <span className="text-primary">Attendance System</span>
          </h1>
          <p className="text-muted-foreground text-base">
            An AI-powered attendance system that recognizes students directly
            from CCTV feeds — no manual roll calls, no ID cards.
          </p>
          <Link href="/login">
            <Button size="lg" className="mt-2">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-14 max-w-2xl w-full">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card text-left"
            >
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 shrink-0">
                <f.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border">
        AISOC Attendance System — Built for smarter campuses
      </footer>
    </div>
  );
}