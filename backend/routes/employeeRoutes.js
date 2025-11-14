// // import express from "express";
// // import pool from "../db.js";
// // import { notifyPackageEvent } from "../services/notificationService.js";
// // const router = express.Router();

// // // Get employee profile
// // router.get("/profile/:id", async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT 
// //          e.*,
// //          po.Name AS PostOfficeName,
// //          po.Location AS PostOfficeLocation
// //        FROM Employee e
// //        LEFT JOIN PostOffice po ON e.PostOfficeID = po.PostOfficeID
// //        WHERE e.EmployeeID = ?`,
// //       [req.params.id]
// //     );
// //     res.json(rows[0] || {});
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Parcels assigned to employee
// // router.get("/parcels/assigned/:id", async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT 
// //          m.*,
// //          p.Name AS ReceiverName,
// //          p.Email AS ReceiverEmail
// //        FROM MailItem m
// //        LEFT JOIN Person p ON m.ReceiverID = p.PersonID
// //        WHERE m.HandledBy = ?
// //          AND m.CurrentStatus IN ('Pending','In Transit','Waiting')
// //        ORDER BY m.DateReceived DESC`,
// //       [req.params.id]
// //     );
// //     res.json(rows);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Update parcel status
// // router.post("/parcels/update-status", async (req, res) => {
// //   const { mailId, newStatus, empId } = req.body;
// //   try {
// //     await pool.query(
// //       "UPDATE MailItem SET CurrentStatus = ?, HandledBy = ? WHERE MailID = ?",
// //       [newStatus, empId, mailId]
// //     );
// //     await pool.query(
// //       "INSERT INTO TrackingEvent (MailID, Timestamp, EventType, Location, Remarks, HandledBy) VALUES (?, NOW(), ?, 'Post Office', 'Updated by employee', ?)",
// //       [mailId, newStatus, empId]
// //     );

// //     await notifyPackageEvent({
// //       mailId,
// //       eventType: newStatus,
// //       remarks: "Status updated by employee",
// //       status: newStatus,
// //     });

// //     res.json({ success: true });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Create a new mail item (package) by employee
// // router.post("/parcels/create", async (req, res) => {
// //   const {
// //     barcodeNo,
// //     type,
// //     mode, // 'Incoming' | 'Outgoing' | 'Internal'
// //     senderName = null,
// //     senderAddress = null,
// //     receiverEmail = null, // will resolve to PersonID if provided
// //     expectedDeliveryDate = null,
// //     handledBy,
// //   } = req.body || {};

// //   if (!barcodeNo || !type || !mode || !handledBy) {
// //     return res.status(400).json({ error: "Missing required fields" });
// //   }

// //   try {
// //     let receiverId = null;
// //     if (receiverEmail) {
// //       const [people] = await pool.query(
// //         "SELECT PersonID FROM Person WHERE Email = ?",
// //         [receiverEmail]
// //       );
// //       receiverId = people[0]?.PersonID || null;
// //     }

// //     const [result] = await pool.query(
// //       `INSERT INTO MailItem (BarcodeNo, Type, Mode, SenderName, SenderAddress, ReceiverID, ExpectedDeliveryDate, CurrentStatus, HandledBy)
// //        VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
// //       [barcodeNo, type, mode, senderName, senderAddress, receiverId, expectedDeliveryDate, handledBy]
// //     );

// //     // initial tracking event
// //     await pool.query(
// //       "INSERT INTO TrackingEvent (MailID, Timestamp, EventType, Location, Remarks, HandledBy) VALUES (?, NOW(), 'Received', 'Post Office', 'Created by employee', ?)",
// //       [result.insertId, handledBy]
// //     );

// //     await notifyPackageEvent({
// //       mailId: result.insertId,
// //       eventType: "Created",
// //       remarks: senderName
// //         ? `Sender: ${senderName}${senderAddress ? ` (${senderAddress})` : ""}`
// //         : "",
// //       status: "Pending",
// //     });

// //     res.json({ success: true, mailId: result.insertId });
// //   } catch (err) {
// //     if (err.code === "ER_DUP_ENTRY") {
// //       return res.status(409).json({ error: "Barcode already exists" });
// //     }
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Recent events handled by employee
// // router.get("/parcels/recent-events/:id", async (req, res) => {
// //   try {
// //     const [rows] = await pool.query(
// //       `SELECT 
// //          te.EventID,
// //          te.MailID,
// //          te.Timestamp,
// //          te.EventType,
// //          te.Location,
// //          te.Remarks,
// //          m.BarcodeNo
// //        FROM TrackingEvent te
// //        INNER JOIN MailItem m ON te.MailID = m.MailID
// //        WHERE te.HandledBy = ? OR m.HandledBy = ?
// //        ORDER BY te.Timestamp DESC
// //        LIMIT 25`,
// //       [req.params.id, req.params.id]
// //     );
// //     res.json(rows);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // export default router;



// import express from "express";
// import pool from "../db.js"; // Make sure this path to your db.js is correct

// const router = express.Router();

// // ============================================================
// // 1. Get admin/employee profile by EmployeeID
// // ============================================================
// router.get("/profile/:id", async (req, res) => {
//   console.log(`[GET /profile/:id] Request received for ID: ${req.params.id}`);
  
//   const query = `
//     SELECT 
//       e.*,
//       po.Name AS PostOfficeName
//     FROM Employee e
//     LEFT JOIN PostOffice po ON e.PostOfficeID = po.PostOfficeID
//     WHERE e.EmployeeID = ?
//   `;
  
//   try {
//     console.log(`[GET /profile/:id] Running query: ${query.substring(0, 100)}...`); // Log a snippet
//     const [rows] = await pool.query(query, [req.params.id]);
    
//     const result = rows[0] || {};
//     console.log(`[GET /profile/:id] Query successful. Sending result:`, result);
    
//     // Return the found user or an empty object if not found
//     res.json(result);
//   } catch (err) {
//     console.error(`[GET /profile/:id] Error:`, err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ============================================================
// // 2. Summary of mail statuses
// // ============================================================
// router.get("/summary", async (req, res) => {
//   console.log(`[GET /summary] Request received.`);
  
//   const query = "SELECT CurrentStatus, COUNT(*) AS Count FROM MailItem GROUP BY CurrentStatus";
  
//   try {
//     console.log(`[GET /summary] Running query: ${query}`);
//     const [rows] = await pool.query(query);
    
//     console.log(`[GET /summary] Query successful. Sending ${rows.length} rows.`);
//     res.json(rows);
//   } catch (err) {
//     console.error(`[GET /summary] Error:`, err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ============================================================
// // 3. Dashboard metrics
// // ============================================================
// router.get("/metrics", async (_req, res) => {
//   console.log(`[GET /metrics] Request received.`);
  
//   const query = `
//       SELECT
//         (SELECT COUNT(*) FROM MailItem) AS totalParcels,
//         (SELECT COUNT(*) FROM MailItem WHERE CurrentStatus IN ('Pending','Waiting','In Transit')) AS pendingParcels,
//         (SELECT COUNT(*) FROM TrackingEvent WHERE EventType = 'Delivered' AND DATE(Timestamp) = CURDATE()) AS deliveredToday,
//         (SELECT COUNT(*) FROM TrackingEvent WHERE EventType = 'Returned' AND DATE(Timestamp) = CURDATE()) AS returnedToday,
//         (SELECT COUNT(*) FROM Person) AS totalUsers,
//         (SELECT COUNT(*) FROM Employee WHERE HasAccess = TRUE) AS activeEmployees,
//         (SELECT COALESCE(AVG(TIMESTAMPDIFF(HOUR, m.DateReceived, dr.DeliveryTime)), 0)
//          FROM MailItem m
//          INNER JOIN DeliveryRecord dr ON dr.MailID = m.MailID
//         ) AS avgDeliveryHours
//     `;
  
//   try {
//     console.log(`[GET /metrics] Running all-in-one metrics query...`);
//     // This query is long, so we'll just log that it's running
    
//     const [[metrics]] = await pool.query(query);

//     // Format the avgDeliveryHours to one decimal place
//     const formattedMetrics = {
//       ...metrics,
//       avgDeliveryHours: Number(metrics.avgDeliveryHours).toFixed(1),
//     };

//     console.log(`[GET /metrics] Query successful. Sending metrics:`, formattedMetrics);
//     res.json(formattedMetrics);
//   } catch (err)
//  {
//     console.error(`[GET /metrics] Error:`, err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ============================================================
// // 4. Daily statistics for last 7 days
// // ============================================================
// router.get("/daily-stats", async (_req, res) => {
//   console.log(`[GET /daily-stats] Request received.`);
  
//   const query = `
//       WITH date_span AS (
//           SELECT CURDATE() - INTERVAL seq DAY AS day
//           FROM (
//             SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL 
//             SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
//           ) AS seqs
//         ),
//         received AS (
//           SELECT DATE(DateReceived) AS day, COUNT(*) AS cnt
//           FROM MailItem
//           WHERE DateReceived >= CURDATE() - INTERVAL 6 DAY
//           GROUP BY DATE(DateReceived)
//         ),
//         delivered AS (
//           SELECT DATE(Timestamp) AS day, COUNT(*) AS cnt
//           FROM TrackingEvent
//           WHERE EventType = 'Delivered'
//             AND Timestamp >= CURDATE() - INTERVAL 6 DAY
//           GROUP BY DATE(Timestamp)
//         ),
//         returned AS (
//           SELECT DATE(Timestamp) AS day, COUNT(*) AS cnt
//           FROM TrackingEvent
//           WHERE EventType = 'Returned'
//             AND Timestamp >= CURDATE() - INTERVAL 6 DAY
//           GROUP BY DATE(Timestamp)
//         )
//         SELECT 
//           DATE_FORMAT(ds.day, '%Y-%m-%d') AS date,
//           COALESCE(r.cnt, 0) AS received,
//           COALESCE(d.cnt, 0) AS delivered,
//           COALESCE(rt.cnt, 0) AS returned
//         FROM date_span ds
//         LEFT JOIN received r ON ds.day = r.day
//         LEFT JOIN delivered d ON ds.day = d.day
//         LEFT JOIN returned rt ON ds.day = rt.day
//         ORDER BY ds.day ASC
//     `;

//   try {
//     console.log(`[GET /daily-stats] Running 7-day statistics query...`);
//     const [rows] = await pool.query(query);

//     console.log(`[GET /daily-stats] Query successful. Sending ${rows.length} rows.`);
//     res.json(rows);
//   } catch (err) {
//     console.error(`[GET /daily-stats] Error:`, err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ============================================================
// // 5. All parcels with optional filters
// // ============================================================
// router.get("/parcels", async (req, res) => {
//   const { status } = req.query;
//   console.log(`[GET /parcels] Request received. Status filter: ${status || 'None'}`);

//   try {
//     // Base query
//     let query = `
//       SELECT m.*, p.Name AS ReceiverName, p.Email AS ReceiverEmail
//       FROM MailItem m
//       LEFT JOIN Person p ON m.ReceiverID = p.PersonID
//     `;
//     const queryParams = [];

//     // Add filter if it exists
//     if (status) {
//       query += " WHERE m.CurrentStatus = ?";
//       queryParams.push(status);
//     }
    
//     console.log(`[GET /parcels] Running query with ${queryParams.length} param(s).`);
//     const [rows] = await pool.query(query, queryParams);
    
//     console.log(`[GET /parcels] Query successful. Sending ${rows.length} rows.`);
//     res.json(rows);
//   } catch (err) {
//     console.error(`[GET /parcels] Error:`, err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
import express from "express";
import pool from "../db.js";
// Make sure this path is correct
// import { notifyPackageEvent } from "../services/notificationService.js"; 
const router = express.Router();

// --- MOCK notifyPackageEvent (if service isn't built yet) ---
// If you don't have this service, uncomment the mock function below
/*
const notifyPackageEvent = async (event) => {
  console.log(`[Notification MOCK]: Event ${event.eventType} for MailID ${event.mailId}`);
  return Promise.resolve();
};
*/
// -----------------------------------------------------------


// Get employee profile
router.get("/profile/:id", async (req, res) => {
  console.log(`[GET /api/employee/profile/:id] ID: ${req.params.id}`);
  try {
    const [rows] = await pool.query(
      `SELECT 
          e.*,
          po.Name AS PostOfficeName,
          po.Location AS PostOfficeLocation
        FROM Employee e
        LEFT JOIN PostOffice po ON e.PostOfficeID = po.PostOfficeID
        WHERE e.EmployeeID = ?`,
      [req.params.id]
    );
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Parcels assigned to employee
router.get("/parcels/assigned/:id", async (req, res) => {
  console.log(`[GET /api/employee/parcels/assigned/:id] ID: ${req.params.id}`);
  try {
    const [rows] = await pool.query(
      `SELECT 
          m.*,
          p.Name AS ReceiverName,
          p.Email AS ReceiverEmail
        FROM MailItem m
        LEFT JOIN Person p ON m.ReceiverID = p.PersonID
        WHERE m.HandledBy = ?
          AND m.CurrentStatus IN ('Pending','In Transit','Waiting')
        ORDER BY m.DateReceived DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update parcel status
router.post("/parcels/update-status", async (req, res) => {
  const { mailId, newStatus, empId } = req.body;
  console.log(`[POST /api/employee/parcels/update-status] MailID: ${mailId}, Status: ${newStatus}`);
  try {
    await pool.query(
      "UPDATE MailItem SET CurrentStatus = ?, HandledBy = ? WHERE MailID = ?",
      [newStatus, empId, mailId]
    );
    await pool.query(
      "INSERT INTO TrackingEvent (MailID, Timestamp, EventType, Location, Remarks, HandledBy) VALUES (?, NOW(), ?, 'Post Office', 'Updated by employee', ?)",
      [mailId, newStatus, empId]
    );

    /*
    // Uncomment this when your notification service is ready
    await notifyPackageEvent({
      mailId,
      eventType: newStatus,
      remarks: "Status updated by employee",
      status: newStatus,
    });
    */

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new mail item (package) by employee
router.post("/parcels/create", async (req, res) => {
  const {
    barcodeNo,
    type,
    mode,
    senderName = null,
    senderAddress = null,
    receiverEmail = null,
    expectedDeliveryDate = null,
    handledBy,
  } = req.body || {};

  console.log(`[POST /api/employee/parcels/create] Barcode: ${barcodeNo}`);

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

    /*
    // Uncomment this when your notification service is ready
    await notifyPackageEvent({
      mailId: result.insertId,
      eventType: "Created",
      remarks: senderName
        ? `Sender: ${senderName}${senderAddress ? ` (${senderAddress})` : ""}`
        : "",
      status: "Pending",
    });
    */

    res.json({ success: true, mailId: result.insertId });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Barcode already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

// Recent events handled by employee
router.get("/parcels/recent-events/:id", async (req, res) => {
  console.log(`[GET /api/employee/parcels/recent-events/:id] ID: ${req.params.id}`);
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
        WHERE te.HandledBy = ? OR m.HandledBy = ?
        ORDER BY te.Timestamp DESC
        LIMIT 25`,
      [req.params.id, req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;