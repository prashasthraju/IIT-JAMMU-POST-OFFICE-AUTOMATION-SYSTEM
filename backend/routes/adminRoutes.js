import express from "express";
import pool from "../db.js";
const router = express.Router();

// Get admin/employee profile by EmployeeID
router.get("/profile/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Employee WHERE EmployeeID = ?",
      [req.params.id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Summary of mail statuses
router.get("/summary", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT CurrentStatus, COUNT(*) AS Count FROM MailItem GROUP BY CurrentStatus"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All parcels with optional filters
router.get("/parcels", async (req, res) => {
  const { status } = req.query;
  try {
    const [rows] = await pool.query(
      status
        ? "SELECT * FROM MailItem WHERE CurrentStatus = ?"
        : "SELECT * FROM MailItem",
      status ? [status] : []
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
