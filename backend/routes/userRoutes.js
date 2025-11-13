import express from "express";
import pool from "../db.js";
const router = express.Router();

// Get profile by UserID (id from frontend)
router.get("/profile/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM User WHERE UserID = ?",
      [req.params.id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user account (signup)
router.post("/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    contactNumber = null,
  } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // try {
  //   const [result] = await pool.query(
  //     `INSERT INTO User (Name, Email, ContactNumber, PasswordHash)
  //      VALUES (?, ?, ?, ?)`,
  //     [name, email, contactNumber, password]
  //   );
  //   res.json({ success: true, userId: result.insertId });
  // } catch (err) {
  //   if (err.code === "ER_DUP_ENTRY") {
  //     return res.status(409).json({ error: "Email already registered" });
  //   }
  //   res.status(500).json({ error: err.message });
  // }
  try {
  const [result] = await pool.query(
    `INSERT INTO Person 
      (Name, Role, Email, ContactNumber, DeptID, BuildingID, RoomNumber, PasswordHash) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      role,              // 'Student', 'Faculty', or 'Staff'
      email,
      contactNumber,
      deptId || null,
      buildingId || null,
      roomNumber || null,
      passwordHash
    ]
  );

  res.json({ success: true, personId: result.insertId });

} catch (err) {

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Email already registered" });
  }

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
