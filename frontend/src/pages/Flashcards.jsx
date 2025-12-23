import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";

export default function Flashcards() {
  const [decks, setDecks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState("sage");

  async function loadDecks() {
    setDecks(await apiGet("/flashcards/decks"));
  }

  useEffect(() => {
    loadDecks();
  }, []);

  async function createDeck(e) {
    e.preventDefault();
    if (!name.trim()) return;

    await apiPost("/flashcards/decks", { name });
    setName("");
    setDesc("");
    setColor("sage");
    setShowModal(false);
    loadDecks();
  }

  return (
    <div>
      <div className="section-title">
        <h2>Flashcards</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Deck
        </button>
      </div>

      <ul className="list">
        {decks.map((d) => (
          <li key={d.id} className="item">
            <div className="item-main">
              <div className="item-title">{d.name}</div>
              <div className="item-meta">Flashcard Deck</div>
            </div>
          </li>
        ))}
      </ul>

      {/* ===== Modal ===== */}
      {showModal && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={createDeck}>
            <div className="modal-header">
              <h2>Create New Deck</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <label>Deck Name</label>
            <input
              placeholder="e.g., Spanish Vocabulary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Description</label>
            <textarea
              placeholder="What will you learn with this deck?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <label>Deck Color</label>
            <div className="color-row">
              <button
                type="button"
                className={`color-btn color-sage ${color === "sage" ? "active" : ""}`}
                onClick={() => setColor("sage")}
              >
                Sage
              </button>
              <button
                type="button"
                className={`color-btn color-amber ${color === "amber" ? "active" : ""}`}
                onClick={() => setColor("amber")}
              >
                Amber
              </button>
              <button
                type="button"
                className={`color-btn color-emerald ${color === "emerald" ? "active" : ""}`}
                onClick={() => setColor("emerald")}
              >
                Emerald
              </button>
              <button
                type="button"
                className={`color-btn color-rose ${color === "rose" ? "active" : ""}`}
                onClick={() => setColor("rose")}
              >
                Rose
              </button>
            </div>

            <button className="modal-submit">Create Deck</button>
          </form>
        </div>
      )}
    </div>
  );
}
