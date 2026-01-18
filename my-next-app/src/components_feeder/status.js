"use client";
import { useEffect, useState } from "react";

// If you already have this elsewhere, remove this and import it instead.
function humanReason(reason) {
  if (!reason) return "Unknown";
  return String(reason);
}

function isConnected(heartbeat) {
  if (!heartbeat) return false;
  const diff = Date.now() - new Date(heartbeat).getTime();
  return diff < 10000; // 10 seconds
}

export default function FeederDashboard() {
  const [status, setStatus] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Poll status every 3 seconds
  useEffect(() => {
    const loadStatus = () => {
      fetch("/api/feeder/status", { cache: "no-store" })
        .then((r) => r.json())
        .then(setStatus)
        .catch(() => setStatus(null));
    };

    loadStatus();
    const id = setInterval(loadStatus, 3000);
    return () => clearInterval(id);
  }, []);

  // Load schedules once (optional)
  useEffect(() => {
    fetch("/api/feeder/schedules", { cache: "no-store" })
      .then((r) => r.json())
      .then(setSchedules)
      .catch(() => setSchedules([]));
  }, []);

  const connected = status ? isConnected(status.heartbeat) : false;

  const feedNow = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/feeder/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: 2000 }),
      });

      // If your API route threw an error, Next might return HTML (not JSON)
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { ok: false, error: text }; }

      if (!res.ok) {
        setMessage(`❌ API error (${res.status}): ${data.error || data.reason || text}`);
        return;
      }

      if (!data.ok) {
        setMessage(`❌ Feed refused: ${humanReason(data.error || data.reason)}`);
      } else {
        setMessage("✅ Feeding started");
      }
    } catch (e) {
      setMessage(`❌ Cannot reach feeder API: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        z-20
        border
        border-gray-300
        rounded-[32px]
        w-80
        h-80
        bg-transparent
        shadow-[inset_0_0_0_3px_rgba(255,255,255,0.25)]
        flex
        flex-col
        items-center
        justify-center
        gap-6
      "
    >
      <div className="flex items-center gap-5">
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            background: connected ? "lime" : "red",
          }}
        />
        <div className="text-white">{connected ? "Connected" : "Offline"}</div>
      </div>

      <button
        onClick={feedNow}
        disabled={loading || !connected}
        className="bg-orange-500 px-6 py-4 text-white rounded-xl disabled:opacity-50"
      >
        {loading ? "Feeding..." : "Feed now"}
      </button>

      {message && <div className="text-white">{message}</div>}
    </div>
  );
}
