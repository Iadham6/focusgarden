const express = require("express");
const db = require("../db");
const router = express.Router();

// GET all
router.get("/", (req, res) => {
  db.all("SELECT * FROM todos ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, done: !!r.done })));
  });
});

// POST create
router.post("/", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text is required" });

  db.run("INSERT INTO todos(text) VALUES(?)", [text], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, text, done: false });
  });
});

// PUT toggle
router.put("/:id/toggle", (req, res) => {
  const { id } = req.params;

  db.get("SELECT done FROM todos WHERE id=?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "todo not found" });

    const newDone = row.done ? 0 : 1;
    db.run("UPDATE todos SET done=? WHERE id=?", [newDone, id], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ id: Number(id), done: !!newDone });
    });
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM todos WHERE id=?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes > 0 });
  });
});

module.exports = router;
