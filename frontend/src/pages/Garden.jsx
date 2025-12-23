import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../api";

export default function Garden() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlants();
  }, []);

  async function loadPlants() {
    setLoading(true);
    const data = await apiGet("/garden");
    setPlants(data);
    setLoading(false);
  }

  async function addPlant() {
    await apiPost("/garden", { name: "Oak" });
    loadPlants();
  }

  async function growPlant(id) {
    await apiPost(`/garden/${id}/grow`, { minutes: 25 });
    loadPlants();
  }

  async function deletePlant(id) {
    if (!confirm("Remove this plant?")) return;
    await apiDelete(`/garden/${id}`);
    loadPlants();
  }

  return (
    <div>
      <div className="section-title">
        <div>
          <h2>🌱 My Garden</h2>
          <div className="section-hint">
            Complete focus sessions to grow your plants
          </div>
        </div>

        <button className="btn btn-primary" onClick={addPlant}>
          + New Plant
        </button>
      </div>

      {loading && <p className="muted">Loading garden...</p>}

      {!loading && plants.length === 0 && (
        <p className="muted">No plants yet. Start focusing 🌿</p>
      )}

      <ul className="list">
        {plants.map((p) => (
          <li key={p.id} className="item">
            <div className="item-main">
              <div className="item-title">
                🌳 {p.name} — Level {p.level}
              </div>
              <div className="item-meta">
                Sessions: {p.sessions} · Minutes: {p.minutes}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-ghost"
                onClick={() => growPlant(p.id)}
              >
                Grow 🌱
              </button>

              <button
                className="btn btn-danger"
                onClick={() => deletePlant(p.id)}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
