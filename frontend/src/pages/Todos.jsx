import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  async function load() {
    const data = await apiGet("/todos");
    setTodos(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await apiPost("/todos", { text });
    setText("");
    load();
  }

  async function toggle(id) {
    await apiPut(`/todos/${id}/toggle`, {});
    load();
  }

  async function remove(id) {
    await apiDelete(`/todos/${id}`);
    load();
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>To-Do List</h2>

      <form onSubmit={addTodo} style={{ marginBottom: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo..."
        />
        <button style={{ marginLeft: 8 }}>Add</button>
      </form>

      {todos.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        <ul>
          {todos.map((t) => (
            <li key={t.id} style={{ marginBottom: 8 }}>
              <span
                onClick={() => toggle(t.id)}
                style={{
                  cursor: "pointer",
                  textDecoration: t.done ? "line-through" : "none",
                }}
              >
                {t.text}
              </span>
              <button onClick={() => remove(t.id)} style={{ marginLeft: 12 }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
