"use client";

import Status from "@/components_feeder/status";
import Navbar from '@/components/navbar';
import Header from "@/components_feeder/header";
import Schedules from "@/components_feeder/scheedules_edit";
import Logs from "@/components_feeder/logs";
import Fill from "@/components_feeder/fill";


export default function FeederDashboard() {
  return (
    <div className="feeder-bg fixed inset-0 overflow-hidden flex flex-row h-full w-full">
      <div className="flex-1 flex flex-col">
        <h1 className="relative z-10 text-white text-4xl font-bold text-center p-5">Feeder Dashboard</h1>
        <div className="relative z-10 w-full items-center">
          <Header />
        </div>
        <div className="relative z-10 flex gap-20 h-full overflow-hidden p-6 hss:gap-10">
          <div className="w-1/4">
            <Status />
          </div>
          <div className="w-2/6 gap-6 flex flex-col">
            <Schedules />
            <Fill />
          </div>
          <div className="w-2/6">
            <Logs />
          </div>
        </div>

      </div>
      <div className="w-[100px] min-w-[88px] z-10 h-full flex-shrink-0 fixed right-0 top-0">
        <Navbar />
      </div>
    </div>
  );
}






