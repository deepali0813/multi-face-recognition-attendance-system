// import Sidebar from "@/components/layout/Sidebar";
// import Topbar from "@/components/layout/Topbar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex min-h-screen bg-background">
//       <Sidebar />
//       <div className="flex flex-1 flex-col">
//         <Topbar />
//         <main className="flex-1 p-6">{children}</main>
//       </div>
//     </div>
//   );
// }


import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
    </div>
  );
}