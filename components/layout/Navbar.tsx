// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import axios from "@/lib/axios";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Menu, LayoutDashboard, Users, CalendarCheck, Camera, LogOut, ScanFace } from "lucide-react";

// const navItems = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { label: "Students", href: "/students", icon: Users },
//   { label: "Attendance", href: "/attendance", icon: CalendarCheck },
//   { label: "Cameras", href: "/cameras", icon: Camera },
// ];

// const pageTitles: Record<string, string> = {
//   "/dashboard": "Dashboard",
//   "/students": "Students",
//   "/attendance": "Attendance",
//   "/cameras": "Cameras",
// };

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const currentTitle =
//     Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ||
//     "AISOC";

//   const handleLogout = async () => {
//     await axios.post("/auth/logout");
//     toast.success("Logged out");
//     router.push("/login");
//   };

//   return (
//     <header className="flex items-center justify-between border-b border-border bg-card px-4 sm:px-6 py-3 sticky top-0 z-10">
//       <div className="flex items-center gap-3">
//         {/* Menu dropdown */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <Menu className="h-5 w-5" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="start" className="w-52">
//             {navItems.map((item) => {
//               const isActive = pathname.startsWith(item.href);
//               return (
//                 <DropdownMenuItem key={item.href} asChild>
//                   <Link
//                     href={item.href}
//                     className={`flex items-center gap-2 cursor-pointer ${
//                       isActive ? "text-primary font-medium" : ""
//                     }`}
//                   >
//                     <item.icon className="h-4 w-4" />
//                     {item.label}
//                   </Link>
//                 </DropdownMenuItem>
//               );
//             })}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* Logo + current page */}
//         <div className="flex items-center gap-2">
//           <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary">
//             <ScanFace className="h-4 w-4 text-primary-foreground" />
//           </div>
//           <span className="text-sm font-semibold hidden sm:inline">AISOC</span>
//           <span className="text-sm text-muted-foreground hidden sm:inline">/</span>
//           <span className="text-sm font-medium">{currentTitle}</span>
//         </div>
//       </div>

//       <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
//         <LogOut className="h-4 w-4 mr-2" />
//         Logout
//       </Button>
//     </header>
//   );
// }



// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import axios from "@/lib/axios";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Menu, LayoutDashboard, Users, CalendarCheck, Camera, LogOut, ScanFace } from "lucide-react";

// const navItems = [
//   { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { label: "Students", href: "/students", icon: Users },
//   { label: "Attendance", href: "/attendance", icon: CalendarCheck },
//   { label: "Cameras", href: "/cameras", icon: Camera },
// ];

// const pageTitles: Record<string, string> = {
//   "/dashboard": "Dashboard",
//   "/students": "Students",
//   "/attendance": "Attendance",
//   "/cameras": "Cameras",
// };

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const currentTitle =
//     Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ||
//     "AISOC";

//   const handleLogout = async () => {
//     await axios.post("/auth/logout");
//     toast.success("Logged out");
//     router.push("/login");
//   };

//   return (
//     <header className="flex items-center justify-between border-b border-border bg-card px-4 sm:px-6 py-3 sticky top-0 z-10">
//       <div className="flex items-center gap-3">
//         <DropdownMenu>
//           <DropdownMenuTrigger className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors">
//             <Menu className="h-5 w-5" />
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="start" className="w-52">
//             {navItems.map((item) => {
//               const isActive = pathname.startsWith(item.href);
//               return (
//                 <DropdownMenuItem
//                   key={item.href}
//                   onClick={() => router.push(item.href)}
//                   className={`flex items-center gap-2 cursor-pointer ${
//                     isActive ? "text-primary font-medium" : ""
//                   }`}
//                 >
//                   <item.icon className="h-4 w-4" />
//                   {item.label}
//                 </DropdownMenuItem>
//               );
//             })}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <div className="flex items-center gap-2">
//           <div className="flex items-center justify-center h-7 w-7 rounded-md bg-primary">
//             <ScanFace className="h-4 w-4 text-primary-foreground" />
//           </div>
//           <span className="text-sm font-semibold hidden sm:inline">AISOC</span>
//           <span className="text-sm text-muted-foreground hidden sm:inline">/</span>
//           <span className="text-sm font-medium">{currentTitle}</span>
//         </div>
//       </div>

//       <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
//         <LogOut className="h-4 w-4 mr-2" />
//         Logout
//       </Button>
//     </header>
//   );
// }



// components/layout/Navbar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LayoutDashboard, Users, CalendarCheck, Camera, LogOut, ScanFace } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/students", icon: Users },
  { label: "Attendance", href: "/attendance", icon: CalendarCheck },
  { label: "Cameras", href: "/cameras", icon: Camera },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/students": "Students",
  "/attendance": "Attendance",
  "/cameras": "Cameras",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const currentTitle =
    Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ||
    "Dashboard";

  const handleLogout = async () => {
    await axios.post("/auth/logout");
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 sm:px-6 py-3.5 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors">
            <Menu className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <DropdownMenuItem
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    isActive ? "text-primary font-medium" : ""
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary">
            <ScanFace className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">{currentTitle}</span>
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </header>
  );
}