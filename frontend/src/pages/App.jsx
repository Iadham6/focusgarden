import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Todos from "./pages/Todos";
import Tasks from "./pages/Tasks";
import Flashcards from "./pages/Flashcards";
import Pomodoro from "./pages/Pomodoro";
import Garden from "./pages/Garden";
import AISummarizer from "./pages/AISummarizer";


export default function App() {
  const [page, setPage] = useState("dashboard");

  function NavButton({ id, label }) {
    return (
      <button
        onClick={() => setPage(id)}
        style={{
          marginRight: 8,
          padding: "6px 12px",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div style={{ padding: 16, fontFamily: "Arial" }}>
      <h1>FOCUS !!</h1>

      <div style={{ marginBottom: 16 }}>
        <NavButton id="dashboard" label="Dashboard" />
        <NavButton id="todos" label="To-Do" />
        <NavButton id="tasks" label="Tasks" />
        <NavButton id="flashcards" label="Flashcards" />
        <NavButton id="pomodoro" label="Pomodoro" />
        <NavButton id="garden" label="Garden" />
        <NavButton id="ai" label="AI Summarizer" />

      </div>

{page === "dashboard" && <Dashboard />}
{page === "todos" && <Todos />}
{page === "tasks" && <Tasks />}
{page === "flashcards" && <Flashcards />}
{page === "pomodoro" && <Pomodoro />}
{page === "garden" && <Garden />}
{page === "ai" && <AISummarizer />} {/* ✅ */}


    </div>
  );
}
