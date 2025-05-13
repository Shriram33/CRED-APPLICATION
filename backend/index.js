const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: 'db', // name of the PostgreSQL service in Docker Compose
  user: 'postgres',
  password: 'postgres',
  database: 'customers',
  port: 5432
});

app.post('/names', async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO names(name) VALUES($1)', [name]);
    res.status(200).send('Name stored!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error storing name');
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
