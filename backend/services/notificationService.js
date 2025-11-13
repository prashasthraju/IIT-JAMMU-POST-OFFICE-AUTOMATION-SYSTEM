import pool from "../db.js";
import { sendEmail } from "./emailService.js";

function buildMessage({ barcodeNo, eventType, remarks, status, expectedDate }) {
  const base =
    eventType === "Created"
      ? `A new package (${barcodeNo}) has been registered for you.`
      : `Package ${barcodeNo} is now marked as ${status || eventType}.`;

  const details = [];
  if (remarks) details.push(remarks);
  if (expectedDate)
    details.push(`Expected delivery: ${new Date(expectedDate).toLocaleString()}`);

  return [base, ...details].join(" ");
}

export async function notifyPackageEvent({
  mailId,
  eventType,
  remarks = "",
  status = "",
}) {
  if (!mailId) {
    console.warn("[notificationService] mailId missing for notification.");
    return { success: false, reason: "missing-mail-id" };
  }

  try {
    const [rows] = await pool.query(
      `SELECT 
         m.MailID,
         m.BarcodeNo,
         m.CurrentStatus,
         m.ExpectedDeliveryDate,
         p.PersonID,
         p.Email,
         p.Name
       FROM MailItem m
       LEFT JOIN Person p ON m.ReceiverID = p.PersonID
       WHERE m.MailID = ?`,
      [mailId]
    );

    if (rows.length === 0) {
      console.warn(
        `[notificationService] No mail item found for MailID=${mailId}`
      );
      return { success: false, reason: "mail-not-found" };
    }

    const mail = rows[0];
    if (!mail.PersonID) {
      console.warn(
        `[notificationService] MailID=${mailId} has no associated receiver.`
      );
      return { success: false, reason: "no-receiver" };
    }

    const message = buildMessage({
      barcodeNo: mail.BarcodeNo,
      eventType,
      remarks,
      status: status || mail.CurrentStatus,
      expectedDate: mail.ExpectedDeliveryDate,
    });

    await pool.query(
      `INSERT INTO Notification (MailID, PersonID, Message, Status)
       VALUES (?, ?, ?, 'Sent')`,
      [mail.MailID, mail.PersonID, message]
    );

    if (mail.Email) {
      await sendEmail({
        to: mail.Email,
        subject: `Update on your package ${mail.BarcodeNo}`,
        text: message,
        category: "package-event",
      });
    }

    return { success: true };
  } catch (err) {
    console.error(
      "[notificationService] Failed to emit package notification:",
      err
    );
    return { success: false, reason: "error", error: err };
  }
}


