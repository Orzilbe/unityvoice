// pages/api/auth/register.js
import pool from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, firstName, lastName, phoneNumber, password, englishLevel, birthYear } = req.body;

    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
    const existingUser = await pool.query(checkUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert the new user
    const insertUserQuery = `
      INSERT INTO users (email, firstName, lastName, phoneNumber, password_hash, englishLevel, birthYear)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, firstName, lastName
    `;

    const values = [email, firstName, lastName, phoneNumber, password_hash, englishLevel, birthYear];
    const result = await pool.query(insertUserQuery, values);

    // Return the new user (without password)
    return res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
}