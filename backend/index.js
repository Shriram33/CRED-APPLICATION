const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'db', // Docker Compose service name for the database
  database: 'customers',
  password: 'postgres',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- POST /names: Store a name ---
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

// --- GET /names: Return today's date ---
app.get('/names', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    res.send(`Today's date is ${today}`);
  } catch (err) {
    console.error("Error generating date:", err);
    res.status(500).send('Error retrieving date');
  }
});

// --- POST /register: Create a new user ---
app.post('/register', async (req, res) => {
  const { username, password, dob } = req.body;

  if (!username || !password || !dob) {
    return res.status(400).send('All fields are required');
  }

  try {
    const existing = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (existing.rows.length > 0) {
      return res.status(400).send('Username already exists');
    }

    await pool.query(
      'INSERT INTO users (username, password, dob) VALUES ($1, $2, $3)',
      [username, password, dob]
    );

    res.send('User registered successfully');
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send('Error registering user');
  }
});

// --- POST /login: Authenticate user ---
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
    console.error("Error logging in:", err);
    res.status(500).send('Error during login');
  }
});

// --- Start server ---
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
