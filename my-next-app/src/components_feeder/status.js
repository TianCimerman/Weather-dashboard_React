"use client";
import { useEffect, useState } from "react";

export default function Status() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = () => {
      fetch("/api/feeder/status", { cache: "no-store" })
        .then(r => r.json())
        .then(setStatus)
        .catch(() => {});
    };

    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  function isConnected(heartbeat) {
    if (!heartbeat) return false;
    const diff = Date.now() - new Date(heartbeat).getTime();
    return diff < 10000; // 10 seconds
  }

  const connected = status ? isConnected(status.heartbeat) : false;

return (
  <div className="min-h-screen  z-20 mt-0 pt-5 pl-16 hss:pt-0 hss:pl-0 sl:p-0       border-[2.5px] border-solid border-[#FFA500]/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]
  bg-transparent ">
    <div className="flex items-center gap-5 border-[3px] border-white/40" >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 999,
          background: connected ? "lime" : "red",
        }}
      />
      <span className="text-red">
        {connected ? "Connected" : "Offline"}
      </span>
      
      
    </div>
    <div className="w-20  bg-red-500 border-4 border-yellow-400" />
  </div>
);


}
