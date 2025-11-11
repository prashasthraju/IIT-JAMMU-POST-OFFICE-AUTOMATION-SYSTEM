import express from "express";
import pool from "../db.js";
const router = express.Router();

// Get profile by PersonID (id from frontend)
router.get("/profile/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Person WHERE PersonID = ?",
      [req.params.id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Parcels in transit for user
router.get("/parcels/in-transit/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM MailItem WHERE ReceiverID = ? AND CurrentStatus = 'In Transit'`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All previous parcels
router.get("/parcels/history/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM MailItem WHERE ReceiverID = ? ORDER BY DateReceived DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
