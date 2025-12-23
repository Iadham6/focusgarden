const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes imports (كل واحد مرة واحدة)
const todosRoutes = require("./routes/todos");
const tasksRoutes = require("./routes/tasks");
const flashcardsRoutes = require("./routes/flashcards");
const pomodoroRoutes = require("./routes/pomodoro");
const gardenRoutes = require("./routes/garden");
const aiRoutes = require("./routes/ai");

// test route
app.get("/", (req, res) => {
  res.json({ message: "FocusGarden API is running" });
});

// routes usage
app.use("/api/todos", todosRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/flashcards", flashcardsRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/garden", gardenRoutes);
app.use("/api/ai", aiRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
