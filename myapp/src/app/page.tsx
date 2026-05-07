"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default function CareerOS() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#020617] flex">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="scanline absolute inset-0 pointer-events-none opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <DashboardContent />
        </div>
      </main>
    </div>
  );
}
