import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  // NEW: search & filters (frontend-only)
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  async function load() {
    const data = await apiGet("/tasks");
    setTasks(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    await apiPost("/tasks", {
      title,
      priority,
      status: "todo",
      tags: "web",
    });

    setTitle("");
    setPriority("medium");
    load();
  }

  async function setStatus(id, status) {
    await apiPut(`/tasks/${id}`, { status });
    load();
  }

  async function removeTask(id) {
    await apiDelete(`/tasks/${id}`);
    load();
  }

  // NEW: filtered view (does not change backend data)
  const filteredTasks = tasks.filter((t) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || (t.title || "").toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" || (t.status || "todo") === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || (t.priority || "medium") === priorityFilter;

    return matchesQuery && matchesStatus && matchesPriority;
  });

  return (
    <div style={{ padding: 24 }}>
      <h2>Tasks</h2>

      <form onSubmit={addTask} style={{ marginBottom: 12 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>

        <button style={{ marginLeft: 8 }}>Add</button>
      </form>

      {/* NEW: search + quick filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks..."
          style={{ minWidth: 220 }}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All status</option>
          <option value="todo">To-Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">All priority</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setQuery("");
            setStatusFilter("all");
            setPriorityFilter("all");
          }}
        >
          Clear
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : filteredTasks.length === 0 ? (
        <p>No tasks match your filters.</p>
      ) : (
        <ul>
          {filteredTasks.map((t) => (
            <li key={t.id} style={{ marginBottom: 10 }}>
              <b>{t.title}</b> — {t.priority} — <i>{t.status}</i>

              <div style={{ marginTop: 6 }}>
                <button onClick={() => setStatus(t.id, "todo")}>To-Do</button>
                <button onClick={() => setStatus(t.id, "doing")} style={{ marginLeft: 6 }}>
                  Doing
                </button>
                <button onClick={() => setStatus(t.id, "done")} style={{ marginLeft: 6 }}>
                  Done
                </button>

                <button onClick={() => removeTask(t.id)} style={{ marginLeft: 12 }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
