import nodemailer from "nodemailer";

let cachedTransporter = null;

function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn(
      "[emailService] SMTP environment variables are missing. Emails will be logged instead of sent."
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: port || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user,
      pass,
    },
  });
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  category = "notification",
}) {
  if (!to) {
    console.warn("[emailService] No recipient provided. Skip sending email.");
    return { sent: false, reason: "missing-recipient" };
  }

  if (!cachedTransporter) {
    cachedTransporter = buildTransporter();
  }

  if (!cachedTransporter) {
    console.info(
      `[emailService] (mock:${category}) → ${to} | ${subject}\n${text || html}`
    );
    return { sent: false, reason: "mock-mode" };
  }

  const from =
    process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";

  try {
    const info = await cachedTransporter.sendMail({
      from,
      to,
      subject,
      text,
      html: html || (text ? `<p>${text}</p>` : undefined),
    });

    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error("[emailService] Failed to send email:", err);
    return { sent: false, reason: "send-error", error: err };
  }
}


