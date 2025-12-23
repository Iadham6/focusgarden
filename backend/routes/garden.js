const express = require("express");
const db = require("../db");
const router = express.Router();

/*
  Expected table: garden_plants
  id | name | level | sessions | minutes | createdAt
*/

// GET all plants
router.get("/", (req, res) => {
  db.all(
    "SELECT * FROM garden_plants ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// POST create new plant
router.post("/", (req, res) => {
  const { name = "Oak" } = req.body;

  db.run(
    `INSERT INTO garden_plants (name, level, sessions, minutes)
     VALUES (?, 1, 0, 0)`,
    [name],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: this.lastID,
        name,
        level: 1,
        sessions: 0,
        minutes: 0,
      });
    }
  );
});

// POST grow plant (call after focus session)
router.post("/:id/grow", (req, res) => {
  const minutes = Number(req.body.minutes ?? 25);

  db.get(
    "SELECT * FROM garden_plants WHERE id = ?",
    [req.params.id],
    (err, plant) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!plant) return res.status(404).json({ error: "Plant not found" });

      const sessions = (plant.sessions || 0) + 1;
      const totalMinutes = (plant.minutes || 0) + minutes;
      const level = Math.floor(sessions / 4) + 1; // level up every 4 sessions

      db.run(
        "UPDATE garden_plants SET sessions=?, minutes=?, level=? WHERE id=?",
        [sessions, totalMinutes, level, req.params.id],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            message: "Plant updated",
            plant: {
              ...plant,
              sessions,
              minutes: totalMinutes,
              level,
            },
          });
        }
      );
    }
  );
});

// DELETE plant (optional)
router.delete("/:id", (req, res) => {
  db.run(
    "DELETE FROM garden_plants WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Plant deleted" });
    }
  );
});

module.exports = router;
