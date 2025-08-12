// test-db.js
import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

// Create a new Postgres connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for Neon
  },
});

async function main() {
  try {
    // Insert a user without specifying the `id` column
    const insertQuery = `
      INSERT INTO "User" (username, bio, experience, skills)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const username = 'testuser_' + Date.now();
    const bio = 'Test bio';
    const experience = '2 years coding';
    const skills = JSON.stringify(['JavaScript', 'Node.js']);

    const insertResult = await pool.query(insertQuery, [
      username,
      bio,
      experience,
      skills,
    ]);

    console.log('Inserted User:', insertResult.rows[0]);

    // Fetch all users
    const { rows } = await pool.query('SELECT * FROM "User";');
    console.log('All Users:', rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
