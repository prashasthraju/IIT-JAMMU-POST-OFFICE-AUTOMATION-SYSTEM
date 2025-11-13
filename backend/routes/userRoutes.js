// import express from "express";
// import pool from "../db.js";
// const router = express.Router();

// // Get profile by UserID (id from frontend)
// router.get("/profile/:id", async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       "SELECT * FROM User WHERE UserID = ?",
//       [req.params.id]
//     );
//     res.json(rows[0] || {});
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create user account (signup)
// router.post("/signup", async (req, res) => {
//   const {
//     name,
//     email,
//     password,
//     contactNumber = null,
//   } = req.body || {};

//   if (!name || !email || !password) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   // try {
//   //   const [result] = await pool.query(
//   //     `INSERT INTO User (Name, Email, ContactNumber, PasswordHash)
//   //      VALUES (?, ?, ?, ?)`,
//   //     [name, email, contactNumber, password]
//   //   );
//   //   res.json({ success: true, userId: result.insertId });
//   // } catch (err) {
//   //   if (err.code === "ER_DUP_ENTRY") {
//   //     return res.status(409).json({ error: "Email already registered" });
//   //   }
//   //   res.status(500).json({ error: err.message });
//   // }
//   try {
//   const [result] = await pool.query(
//     `INSERT INTO Person 
//       (Name, Role, Email, ContactNumber, DeptID, BuildingID, RoomNumber, PasswordHash) 
//      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       name,
//       role,              // 'Student', 'Faculty', or 'Staff'
//       email,
//       contactNumber,
//       deptId || null,
//       buildingId || null,
//       roomNumber || null,
//       passwordHash
//     ]
//   );

//   res.json({ success: true, personId: result.insertId });

// } catch (err) {

//   if (err.code === "ER_DUP_ENTRY") {
//     return res.status(409).json({ error: "Email already registered" });
//   }

//   res.status(500).json({ error: err.message });
// }
// });

// // Parcels in transit for user
// router.get("/parcels/in-transit/:id", async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT * FROM MailItem WHERE ReceiverID = ? AND CurrentStatus = 'In Transit'`,
//       [req.params.id]
//     );
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // All previous parcels
// router.get("/parcels/history/:id", async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT * FROM MailItem WHERE ReceiverID = ? ORDER BY DateReceived DESC`,
//       [req.params.id]
//     );
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
import express from "express";
import pool from "../db.js";

const router = express.Router();

/* ============================================================
   GET USER PROFILE
============================================================ */
router.get("/profile/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         p.*,
         d.DeptName,
         b.BuildingName
       FROM Person p
       LEFT JOIN Department d ON p.DeptID = d.DeptID
       LEFT JOIN Building b ON p.BuildingID = b.BuildingID
       WHERE p.PersonID = ?`,
      [req.params.id]
    );

    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ============================================================
   USER SIGNUP  →  PERFECT MATCH FOR YOUR FRONTEND
============================================================ */
router.post("/signup", async (req, res) => {
  const {
    name,
    role,
    email,
    password,
    contactNumber,
    deptId,
    buildingId,
    roomNumber
  } = req.body || {};

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // no hashing → store password as-is (your requirement)
    const passwordHash = password;

    const [result] = await pool.query(
      `INSERT INTO Person 
        (Name, Role, Email, ContactNumber, DeptID, BuildingID, RoomNumber, PasswordHash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        role,
        email,
        contactNumber || null,
        deptId || null,
        buildingId || null,
        roomNumber || null,
        passwordHash
      ]
    );

    res.json({
      success: true,
      personId: result.insertId
    });

  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already registered" });
    }

    res.status(500).json({ error: err.message });
  }
});


/* ============================================================
   PARCELS IN TRANSIT FOR USER
============================================================ */
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


/* ============================================================
   PARCEL HISTORY
============================================================ */
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

/* ============================================================
   UPCOMING PARCELS (Pending/Waiting/In Transit)
============================================================ */
router.get("/parcels/upcoming/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT MailID, BarcodeNo, Type, ExpectedDeliveryDate, CurrentStatus
       FROM MailItem
       WHERE ReceiverID = ?
         AND CurrentStatus IN ('Pending','Waiting','In Transit')
       ORDER BY ExpectedDeliveryDate IS NULL, ExpectedDeliveryDate ASC, MailID DESC
       LIMIT 10`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   RECENT TRACKING EVENTS FOR USER PARCELS
============================================================ */
router.get("/parcels/recent-events/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         te.EventID,
         te.MailID,
         te.Timestamp,
         te.EventType,
         te.Location,
         te.Remarks,
         m.BarcodeNo
       FROM TrackingEvent te
       INNER JOIN MailItem m ON te.MailID = m.MailID
       WHERE m.ReceiverID = ?
       ORDER BY te.Timestamp DESC
       LIMIT 20`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   DELIVERY RECORDS FOR USER
============================================================ */
router.get("/delivery-records/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         dr.DeliveryID,
         dr.MailID,
         dr.DeliveryTime,
         dr.DeliveryStatus,
         dr.Remarks,
         m.BarcodeNo
       FROM DeliveryRecord dr
       INNER JOIN MailItem m ON dr.MailID = m.MailID
       WHERE m.ReceiverID = ?
       ORDER BY dr.DeliveryTime DESC
       LIMIT 20`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================================
   NOTIFICATIONS FOR USER
============================================================ */
router.get("/notifications/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         n.NotificationID,
         n.MailID,
         n.Message,
         n.SentTime,
         n.Status,
         m.BarcodeNo,
         m.CurrentStatus
       FROM Notification n
       LEFT JOIN MailItem m ON n.MailID = m.MailID
       WHERE n.PersonID = ?
       ORDER BY n.SentTime DESC
       LIMIT 20`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
