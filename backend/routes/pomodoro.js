const express = require("express");
const router = express.Router();

router.post("/start", (req, res) => {
  const { mode, durationMin } = req.body;
  res.json({ id: Date.now(), mode, durationMin, completed: 0 });
});

router.post("/complete", (req, res) => {
  res.json({
    message: "completed",
    plant: { name: "Oak", level: 1 },
    stats: { sessions: 1, minutes: 25 }
  });
});

module.exports = router;
