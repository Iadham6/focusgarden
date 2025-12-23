const express = require("express");
const db = require("../db");
const router = express.Router();

// GET tasks
router.get("/", (req, res) => {
  db.all("SELECT * FROM tasks ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST create task
router.post("/", (req, res) => {
  const {
    title,
    description = "",
    priority = "medium",
    dueDate = null,
    status = "todo",
    tags = ""
  } = req.body;

  if (!title) return res.status(400).json({ error: "title is required" });

  db.run(
    "INSERT INTO tasks(title, description, priority, dueDate, status, tags) VALUES(?,?,?,?,?,?)",
    [title, description, priority, dueDate, status, tags],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, title, description, priority, dueDate, status, tags });
    }
  );
});

// PUT update task
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, priority, dueDate, status, tags } = req.body;

  db.run(
    `UPDATE tasks SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      priority = COALESCE(?, priority),
      dueDate = COALESCE(?, dueDate),
      status = COALESCE(?, status),
      tags = COALESCE(?, tags)
     WHERE id=?`,
    [title ?? null, description ?? null, priority ?? null, dueDate ?? null, status ?? null, tags ?? null, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes > 0 });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id=?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes > 0 });
  });
});

module.exports = router;
