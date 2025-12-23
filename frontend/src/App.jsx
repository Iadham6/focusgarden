import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Todos from "./pages/Todos";
import Tasks from "./pages/Tasks";
import Flashcards from "./pages/Flashcards";
import Pomodoro from "./pages/Pomodoro";
import Garden from "./pages/Garden";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "todos", label: "To-Do" },
    { id: "tasks", label: "Tasks" },
    { id: "flashcards", label: "Flashcards" },
    { id: "pomodoro", label: "Pomodoro" },
    { id: "garden", label: "Garden" },
  ];

  const NavBtn = ({ id, label }) => (
    <button
      onClick={() => setPage(id)}
      className={`btn ${page === id ? "btn-active" : "btn-ghost"}`}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Sticky Header */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-title">FOCUS !!</div>
            <div className="brand-sub">Study smart • Plant your focus</div>
          </div>

          <div className="muted" style={{ fontSize: 12 }}>
            Nile University • CS Project
          </div>
        </div>

        <div className="nav">
          {tabs.map((t) => (
            <NavBtn key={t.id} id={t.id} label={t.label} />
          ))}
        </div>
      </header>

      {/* Page Content */}
      <main className="container">
        <div className="card">
          {page === "dashboard" && <Dashboard />}
          {page === "todos" && <Todos />}
          {page === "tasks" && <Tasks />}
          {page === "flashcards" && <Flashcards />}
          {page === "pomodoro" && <Pomodoro />}
          {page === "garden" && <Garden />}
        </div>
      </main>

      <div className="footer">
        FocusGarden — React + Node + SQLite • Team project demo-ready
      </div>
    </div>
  );
}
