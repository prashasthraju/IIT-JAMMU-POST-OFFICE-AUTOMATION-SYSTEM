import express from "express";
import pool from "../db.js";
const router = express.Router();

// Get employee profile
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

// Parcels assigned to employee
router.get("/parcels/assigned/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM MailItem WHERE HandledBy = ? AND CurrentStatus IN ('Pending','In Transit','Waiting')`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update parcel status
router.post("/parcels/update-status", async (req, res) => {
  const { mailId, newStatus, empId } = req.body;
  try {
    await pool.query(
      "UPDATE MailItem SET CurrentStatus = ?, HandledBy = ? WHERE MailID = ?",
      [newStatus, empId, mailId]
    );
    await pool.query(
      "INSERT INTO TrackingEvent (MailID, Timestamp, EventType, Location, Remarks, HandledBy) VALUES (?, NOW(), ?, 'Post Office', 'Updated by employee', ?)",
      [mailId, newStatus, empId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
