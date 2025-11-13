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

// Create a new mail item (package) by employee
router.post("/parcels/create", async (req, res) => {
  const {
    barcodeNo,
    type,
    mode, // 'Incoming' | 'Outgoing' | 'Internal'
    senderName = null,
    senderAddress = null,
    receiverEmail = null, // will resolve to PersonID if provided
    expectedDeliveryDate = null,
    handledBy,
  } = req.body || {};

  if (!barcodeNo || !type || !mode || !handledBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let receiverId = null;
    if (receiverEmail) {
      const [people] = await pool.query(
        "SELECT PersonID FROM Person WHERE Email = ?",
        [receiverEmail]
      );
      receiverId = people[0]?.PersonID || null;
    }

    const [result] = await pool.query(
      `INSERT INTO MailItem (BarcodeNo, Type, Mode, SenderName, SenderAddress, ReceiverID, ExpectedDeliveryDate, CurrentStatus, HandledBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [barcodeNo, type, mode, senderName, senderAddress, receiverId, expectedDeliveryDate, handledBy]
    );

    // initial tracking event
    await pool.query(
      "INSERT INTO TrackingEvent (MailID, Timestamp, EventType, Location, Remarks, HandledBy) VALUES (?, NOW(), 'Received', 'Post Office', 'Created by employee', ?)",
      [result.insertId, handledBy]
    );

    res.json({ success: true, mailId: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Barcode already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;
