require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Create table on startup
pool.query(`
  CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT false
  )
`);

// GET all todos
app.get('/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY id');
  res.json(result.rows);
});

// POST new todo
app.post('/todos', async (req, res) => {
  const { task } = req.body;
  const result = await pool.query(
    'INSERT INTO todos (task) VALUES ($1) RETURNING *', [task]
  );
  res.json(result.rows[0]);
});

// PUT update todo
app.put('/todos/:id', async (req, res) => {
  const { task, completed } = req.body;
  const result = await pool.query(
    'UPDATE todos SET task=$1, completed=$2 WHERE id=$3 RETURNING *',
    [task, completed, req.params.id]
  );
  res.json(result.rows[0]);
});

// DELETE todo
app.delete('/todos/:id', async (req, res) => {
  await pool.query('DELETE FROM todos WHERE id=$1', [req.params.id]);
  res.json({ message: 'Deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));