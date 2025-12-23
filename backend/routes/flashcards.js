const express = require("express");
const db = require("../db");
const router = express.Router();

// GET all decks
router.get("/decks", (req, res) => {
  db.all("SELECT * FROM decks ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST create deck
router.post("/decks", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  db.run("INSERT INTO decks(name) VALUES(?)", [name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name });
  });
});

// GET cards in deck
router.get("/decks/:deckId/cards", (req, res) => {
  db.all(
    "SELECT * FROM cards WHERE deckId=?",
    [req.params.deckId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// POST add card
router.post("/decks/:deckId/cards", (req, res) => {
  const { front, back } = req.body;
  if (!front || !back)
    return res.status(400).json({ error: "front and back required" });

  db.run(
    "INSERT INTO cards(deckId, front, back) VALUES(?,?,?)",
    [req.params.deckId, front, back],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, front, back });
    }
  );
});

module.exports = router;
