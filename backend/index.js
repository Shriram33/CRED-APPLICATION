const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'db', // use 'localhost' if not using Docker
  database: 'customers',
  password: 'postgres',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Health check ---
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1'); // check DB connection
    res.send('Backend and DB are healthy');
  } catch (err) {
    console.error("Health check DB error:", err);
    res.status(500).send('Backend is up, but DB connection failed');
  }
});

// --- POST /register ---
app.post('/register', async (req, res) => {
  const { username, password, email, dob } = req.body;

  if (!username || !password || !email || !dob) {
    return res.status(400).send('All fields are required');
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).send('Username or email already exists');
    }

    await pool.query(
      'INSERT INTO users (username, password, email, dob) VALUES ($1, $2, $3, $4)',
      [username, password, email, dob]
    );

    res.send('Registration successful! You can now log in.');
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send('Server error during registration');
  }
});

// --- POST /login ---
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password required');
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    res.send(`Login successful. Welcome, ${username}!`);
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send('Server error during login');
  }
});

// --- POST /names ---
app.post('/names', async (req, res) => {
  const { name } = req.body;

  console.log("Received POST /names with:", name);

  try {
    const result = await pool.query(
      'INSERT INTO names (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.send(`Name "${result.rows[0].name}" stored successfully.`);
  } catch (err) {
    console.error("Error inserting name:", err);
    res.status(500).send('Error saving name');
  }
});

// --- GET /names ---
app.get('/names', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM names');
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching names:", err);
    res.status(500).send('Error retrieving names');
  }
});

// --- Start server ---
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
