import express from "express";
import pool from "../db.js";
const router = express.Router();

// Get admin/employee profile by EmployeeID
router.get("/profile/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         e.*,
         po.Name AS PostOfficeName
       FROM Employee e
       LEFT JOIN PostOffice po ON e.PostOfficeID = po.PostOfficeID
       WHERE e.EmployeeID = ?`,
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

// Dashboard metrics
router.get("/metrics", async (_req, res) => {
  try {
    const [
      [totalParcelsRow],
      [pendingRow],
      [deliveredTodayRow],
      [returnedTodayRow],
      [totalUsersRow],
      [activeEmployeesRow],
      [avgDeliveryRow],
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) AS totalParcels FROM MailItem"),
      pool.query(
        "SELECT COUNT(*) AS pendingParcels FROM MailItem WHERE CurrentStatus IN ('Pending','Waiting','In Transit')"
      ),
      pool.query(
        `SELECT COUNT(*) AS deliveredToday 
         FROM TrackingEvent 
         WHERE EventType = 'Delivered' 
           AND DATE(Timestamp) = CURDATE()`
      ),
      pool.query(
        `SELECT COUNT(*) AS returnedToday 
         FROM TrackingEvent 
         WHERE EventType = 'Returned' 
           AND DATE(Timestamp) = CURDATE()`
      ),
      pool.query("SELECT COUNT(*) AS totalUsers FROM Person"),
      pool.query(
        "SELECT COUNT(*) AS activeEmployees FROM Employee WHERE HasAccess = TRUE"
      ),
      pool.query(
        `SELECT AVG(TIMESTAMPDIFF(HOUR, m.DateReceived, dr.DeliveryTime)) AS avgDeliveryHours
         FROM MailItem m
         INNER JOIN DeliveryRecord dr ON dr.MailID = m.MailID`
      ),
    ]);

    const metrics = {
      totalParcels: totalParcelsRow[0]?.totalParcels || 0,
      pendingParcels: pendingRow[0]?.pendingParcels || 0,
      deliveredToday: deliveredTodayRow[0]?.deliveredToday || 0,
      returnedToday: returnedTodayRow[0]?.returnedToday || 0,
      totalUsers: totalUsersRow[0]?.totalUsers || 0,
      activeEmployees: activeEmployeesRow[0]?.activeEmployees || 0,
      avgDeliveryHours: avgDeliveryRow[0]?.avgDeliveryHours
        ? Number(avgDeliveryRow[0].avgDeliveryHours).toFixed(1)
        : null,
    };

    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Daily statistics for last 7 days
router.get("/daily-stats", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `WITH date_span AS (
         SELECT CURDATE() - INTERVAL seq DAY AS day
         FROM (
           SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL 
           SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
         ) AS seqs
       ),
       received AS (
         SELECT DATE(DateReceived) AS day, COUNT(*) AS cnt
         FROM MailItem
         WHERE DateReceived >= CURDATE() - INTERVAL 6 DAY
         GROUP BY DATE(DateReceived)
       ),
       delivered AS (
         SELECT DATE(Timestamp) AS day, COUNT(*) AS cnt
         FROM TrackingEvent
         WHERE EventType = 'Delivered'
           AND Timestamp >= CURDATE() - INTERVAL 6 DAY
         GROUP BY DATE(Timestamp)
       ),
       returned AS (
         SELECT DATE(Timestamp) AS day, COUNT(*) AS cnt
         FROM TrackingEvent
         WHERE EventType = 'Returned'
           AND Timestamp >= CURDATE() - INTERVAL 6 DAY
         GROUP BY DATE(Timestamp)
       )
       SELECT 
         DATE_FORMAT(ds.day, '%Y-%m-%d') AS date,
         COALESCE(r.cnt, 0) AS received,
         COALESCE(d.cnt, 0) AS delivered,
         COALESCE(rt.cnt, 0) AS returned
       FROM date_span ds
       LEFT JOIN received r ON ds.day = r.day
       LEFT JOIN delivered d ON ds.day = d.day
       LEFT JOIN returned rt ON ds.day = rt.day
       ORDER BY ds.day ASC`
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
        ? `SELECT m.*, p.Name AS ReceiverName, p.Email AS ReceiverEmail
            FROM MailItem m
            LEFT JOIN Person p ON m.ReceiverID = p.PersonID
            WHERE m.CurrentStatus = ?`
        : `SELECT m.*, p.Name AS ReceiverName, p.Email AS ReceiverEmail
            FROM MailItem m
            LEFT JOIN Person p ON m.ReceiverID = p.PersonID`,
      status ? [status] : []
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
