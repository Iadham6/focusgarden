import { useEffect, useRef, useState } from "react";
import { apiPost } from "../api";

export default function Pomodoro() {
  // durations in minutes (simple student style)
  const FOCUS_MIN = 25;
  const BREAK_MIN = 5;

  const [mode, setMode] = useState("focus"); // "focus" | "break"
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [lastMessage, setLastMessage] = useState("");

  const intervalRef = useRef(null);

  function formatTime(s) {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  // reset time when mode changes (only if not running)
// Reset time ONLY when mode changes AND timer is not running AND session not started
useEffect(() => {
  // لو المؤقت موقوف ومفيش session بدأت -> ساعتها بس نرجع الوقت
  if (!isRunning && currentSessionId === null) {
    setSecondsLeft((mode === "focus" ? FOCUS_MIN : BREAK_MIN) * 60);
  }
}, [mode, isRunning, currentSessionId]);

  // timer tick
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // when time reaches 0 => auto complete
  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft > 0) return;

    clearInterval(intervalRef.current);
    setIsRunning(false);

    // only grow plant when focus session completes
    if (mode === "focus") {
      completeFocusSession();
    } else {
      setLastMessage("Break finished ✅ Switch to focus when ready.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  async function startSession() {
    try {
      setLastMessage("");

      const durationMin = mode === "focus" ? FOCUS_MIN : BREAK_MIN;

      // create session in backend
      const data = await apiPost("/pomodoro/start", {
        mode,
        durationMin,
      });

      setCurrentSessionId(data.id);
      setIsRunning(true);
      setLastMessage(`Started ${mode} session (id=${data.id})`);
    } catch (err) {
      setLastMessage("Error starting session. Check backend is running.");
      console.error(err);
    }
  }

function pause() {
  setIsRunning(false);
  setLastMessage("Paused");
}


function reset() {
  setIsRunning(false);
  clearInterval(intervalRef.current);
  setSecondsLeft((mode === "focus" ? FOCUS_MIN : BREAK_MIN) * 60);
  setCurrentSessionId(null);
  setLastMessage("Reset");
}


  async function completeFocusSession() {
    try {
      // if for some reason no sessionId, just show message
      if (!currentSessionId) {
        setLastMessage("Focus finished ✅ (no sessionId found)");
        return;
      }

      const result = await apiPost("/pomodoro/complete", {
        sessionId: currentSessionId,
      });

      // result contains plant + stats
      const plantName = result?.plant?.name || "Plant";
      const minutes = result?.stats?.minutes ?? "?";
      const sessions = result?.stats?.sessions ?? "?";

      setLastMessage(
        `Focus finished ✅ 🌱 You grew: ${plantName}. Total sessions: ${sessions}, total minutes: ${minutes}`
      );

      // auto switch to break after focus finishes
      setMode("break");
      setSecondsLeft(BREAK_MIN * 60);
      setCurrentSessionId(null);
    } catch (err) {
      setLastMessage("Error completing session. Check /api/pomodoro/complete");
      console.error(err);
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>Pomodoro Timer</h2>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setMode("focus")}
          disabled={isRunning}
          style={{ marginRight: 8 }}
        >
          Focus (25m)
        </button>

        <button onClick={() => setMode("break")} disabled={isRunning}>
          Break (5m)
        </button>
      </div>

      <div
        style={{
          fontSize: 48,
          fontWeight: "bold",
          marginBottom: 12,
          letterSpacing: 2,
        }}
      >
        {formatTime(secondsLeft)}
      </div>

      <div style={{ marginBottom: 12 }}>
        {!isRunning ? (
          <button onClick={startSession} style={{ marginRight: 8 }}>
            Start ▶️
          </button>
        ) : (
          <button onClick={pause} style={{ marginRight: 8 }}>
            Pause ⏸️
          </button>
        )}

        <button onClick={reset}>Reset 🔁</button>
      </div>

      <p>
        <b>Mode:</b> {mode}
        <br />
        <b>Session ID:</b> {currentSessionId ?? "None"}
      </p>

      {lastMessage && (
        <div style={{ marginTop: 10, padding: 10, border: "1px solid #444" }}>
          {lastMessage}
        </div>
      )}

      <p style={{ marginTop: 14, opacity: 0.8 }}>
        Tip: Finish a focus session to grow a plant in your Garden feature.
      </p>
    </div>
  );
}
