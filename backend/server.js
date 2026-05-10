const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

let todos = [];

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const task = req.body.task;
  todos.push({ id: Date.now(), task });
  res.json({ message: "Task added", todos });
});

app.delete("/todos/:id", (req, res) => {
  todos = todos.filter(todo => todo.id != req.params.id);
  res.json({ message: "Task deleted", todos });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});