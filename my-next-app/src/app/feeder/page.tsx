"use client";

import Status from "@/components_feeder/status";
import Navbar from '@/components/navbar';

export default function FeederDashboard() {
  return (
    <div className="feeder-bg fixed inset-0 overflow-hidden ">
      <div className="relative z-10 flex h-screen w-screen items-stretch">

        <main className="flex-1 h-full overflow-hidden p-6 ">
          <Status />
        </main>

        <div className="w-[100px] min-w-[88px] h-full flex-shrink-0">
          <Navbar />
        </div>

      </div>
    </div>
  );
}






