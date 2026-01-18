"use client";

import { useEffect, useState } from "react";

export default function FeederDashboard() {
  const [status, setStatus] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/feeder/status")
      .then(r => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));

    fetch("/api/feeder/schedules")
      .then(r => r.json())
      .then(setSchedules)
      .catch(() => setSchedules([]));
  }, []);

  const feedNow = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/feeder/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: 2000 })
      });

      const data = await res.json();

      if (!data.ok) {
        setMessage(`❌ Feed refused: ${humanReason(data.reason)}`);
      } else {
        setMessage("✅ Feeding started");
      }
    } catch {
      setMessage("❌ Cannot reach feeder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>🐶 Dog Feeder</h1>

      {status && (
        <div>
          <p>Last feed: {status.lastFeed ?? "Never"}</p>
          <p>Feeds today: {status.feedsToday}</p>
        </div>
      )}

      <button onClick={feedNow} disabled={loading}>
        {loading ? "Feeding..." : "Feed now"}
      </button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}

      <h2>Schedules</h2>
      <pre>{JSON.stringify(schedules, null, 2)}</pre>
    </div>
  );
}

function humanReason(code) {
  const map = {
    FEEDING_DISABLED: "Feeding is disabled",
    ALREADY_FEEDING: "Feeder is already running",
    MIN_INTERVAL_NOT_REACHED: "Too soon since last feeding",
    MOTOR_ERROR: "Motor error"
  };

  return map[code] || code;
}
