import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

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
      tags: "web"
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

  return (
    <div style={{ maxWidth: 620 }}>
      <h2>Task Manager</h2>

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

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((t) => (
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
