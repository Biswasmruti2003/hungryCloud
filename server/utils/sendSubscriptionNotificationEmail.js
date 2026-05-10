const nodemailer = require("nodemailer");

function normalizeSmtpPass(pass) {
  if (!pass || typeof pass !== "string") return pass;
  return pass.replace(/\s+/g, "");
}

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = normalizeSmtpPass(process.env.SMTP_PASS);
  if (!user || !pass) return null;

  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure,
    auth: { user, pass },
  });
}

function formatINR(n) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(n));
  } catch {
    return `₹${n}`;
  }
}

function orderRef(sub) {
  const id = sub?._id ? String(sub._id) : "";
  return id ? `HC-${id.slice(-6).toUpperCase()}` : "—";
}

function buildBody(user, sub) {
  const addr = sub.address || {};
  const ref = orderRef(sub);
  const discount = Number(sub.discount || 0);
  const lines = [
    `Hi ${user.name || "there"},`,
    "",
    "Thank you for choosing HungryCloud. Your order is confirmed and we're preparing to serve you great meals.",
    "",
    `ORDER REFERENCE: ${ref}`,
    "",
    `Plan: ${sub.plan}`,
    `Slot: ${sub.slot}`,
    `Meal: ${sub.mealOption}`,
    `Duration: ${sub.duration} (${sub.days} delivery days)`,
    `Starts: ${new Date(sub.startDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}`,
    `Delivery days: ${(sub.selectedDays || []).join(", ") || "—"}`,
    `Payment: ${sub.paymentMode || "COD"}`,
    ...(discount > 0
      ? [`Discount applied: ${formatINR(discount)}`]
      : []),
    `Amount paid: ${formatINR(sub.totalPrice)}`,
    "",
    "DELIVERY ADDRESS",
    `${addr.at || ""}, ${addr.po || ""}`,
    `${addr.dist || ""} — PIN ${addr.pin || ""}`,
    "",
    "View orders and download receipts anytime: sign in to your HungryCloud profile.",
    "",
    "Questions? Reply to this email or use the Contact page on our website.",
    "",
    "— Team HungryCloud",
  ];
  return lines.join("\n");
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildHtml(user, sub) {
  const addr = sub.address || {};
  const ref = orderRef(sub);
  const discount = Number(sub.discount || 0);
  const rows = [
    ["Plan", sub.plan],
    ["Slot", sub.slot],
    ["Meal type", sub.mealOption],
    ["Duration", `${sub.duration} · ${sub.days} delivery days`],
    [
      "Start date",
      new Date(sub.startDate).toLocaleDateString("en-IN", { dateStyle: "long" }),
    ],
    ["Delivery days", (sub.selectedDays || []).join(", ") || "—"],
    ["Payment", sub.paymentMode || "COD"],
  ];
  if (discount > 0) {
    rows.push(["Discount", `− ${formatINR(discount)}`]);
  }
  rows.push(["Total", formatINR(sub.totalPrice)]);

  const tableRows = rows
    .map(([k, v], i) => {
      const isTotal = k === "Total";
      const bg = i % 2 === 0 ? "#f8fafc" : "#ffffff";
      return `<tr style="background:${bg};">
        <td style="padding:14px 18px;font-size:13px;color:#64748b;font-family:Segoe UI,system-ui,sans-serif;width:42%;border-bottom:1px solid #e2e8f0;">${escapeHtml(
          k
        )}</td>
        <td style="padding:14px 18px;font-size:14px;color:#0f172a;font-family:Segoe UI,system-ui,sans-serif;font-weight:${isTotal ? "700" : "600"};border-bottom:1px solid #e2e8f0;">${escapeHtml(
          v
        )}</td>
      </tr>`;
    })
    .join("");

  const addressBlock = `${escapeHtml(addr.at || "")}, ${escapeHtml(addr.po || "")}<br/><span style="color:#475569;">${escapeHtml(
    addr.dist || ""
  )} · PIN ${escapeHtml(String(addr.pin || ""))}</span>`;

  const preheader = `Order ${ref} confirmed — ${sub.plan}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Order confirmed — HungryCloud</title>
</head>
<body style="margin:0;background:#e2e8f0;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;color:transparent;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#ecfdf5 0%,#e2e8f0 45%,#e2e8f0 100%);padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(15,23,42,0.15);">
        <tr>
          <td style="padding:0;background:linear-gradient(135deg,#059669 0%,#0d9488 50%,#ca8a04 100%);">
            <table role="presentation" width="100%"><tr>
              <td style="padding:28px 32px;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">HungryCloud</p>
                <p style="margin:8px 0 0;font-family:Segoe UI,system-ui,sans-serif;font-size:14px;color:rgba(255,255,255,0.92);">Fresh meals, delivered</p>
              </td>
              <td style="padding:28px 32px;text-align:right;vertical-align:middle;">
                <div style="display:inline-block;background:rgba(255,255,255,0.2);backdrop-filter:blur(8px);border-radius:999px;padding:10px 16px;font-family:Segoe UI,system-ui,sans-serif;font-size:13px;font-weight:600;color:#ffffff;">Confirmed ✓</div>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 8px;font-family:Segoe UI,system-ui,sans-serif;">
            <p style="margin:0;font-size:16px;color:#0f172a;line-height:1.5;">Hi <strong>${escapeHtml(user.name || "there")}</strong>,</p>
            <p style="margin:16px 0 0;font-size:15px;color:#475569;line-height:1.65;">
              Your order is <strong style="color:#059669;">confirmed</strong>. We’ve attached your reference and full summary below—keep this email for your records.
            </p>
            <div style="margin:24px 0 0;padding:16px 20px;background:linear-gradient(135deg,#ecfdf5,#f0fdfa);border-radius:14px;border:1px solid #a7f3d0;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;color:#047857;text-transform:uppercase;">Order reference</p>
              <p style="margin:6px 0 0;font-size:22px;font-weight:800;color:#065f46;font-family:ui-monospace,Consolas,monospace;letter-spacing:0.06em;">${escapeHtml(ref)}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 28px;">
            <p style="margin:0 0 12px;font-family:Segoe UI,system-ui,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;color:#64748b;text-transform:uppercase;">Order summary</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
              ${tableRows}
            </table>
            <div style="margin:24px 0 0;padding:18px 20px;background:#f8fafc;border-radius:14px;border:1px solid #e2e8f0;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;color:#64748b;text-transform:uppercase;font-family:Segoe UI,system-ui,sans-serif;">Delivery address</p>
              <p style="margin:0;font-size:14px;line-height:1.55;color:#0f172a;font-family:Segoe UI,system-ui,sans-serif;">${addressBlock}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px;background:#0f172a;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8;font-family:Segoe UI,system-ui,sans-serif;">
              Receipts and past orders are available in your <strong style="color:#e2e8f0;">profile</strong> on HungryCloud.
            </p>
            <p style="margin:16px 0 0;font-size:12px;color:#64748b;font-family:Segoe UI,system-ui,sans-serif;">
              © ${new Date().getFullYear()} HungryCloud · This is an automated confirmation for your order.
            </p>
          </td>
        </tr>
      </table>
      <p style="margin:20px 0 0;font-size:12px;color:#64748b;font-family:Segoe UI,system-ui,sans-serif;text-align:center;max-width:480px;">
        If you didn’t place this order, contact us immediately.
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Sends order confirmation email. Returns { sent, reason?, to?, messageId? } — does not throw.
 */
async function sendSubscriptionNotificationEmail(user, subscription) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "[email] Order confirmation skipped — set SMTP_USER and SMTP_PASS in .env"
    );
    return { sent: false, reason: "smtp_not_configured" };
  }

  const from =
    process.env.EMAIL_FROM || `"HungryCloud" <${process.env.SMTP_USER}>`;
  const to = user?.email;
  if (!to) {
    console.warn("[email] Order confirmation skipped — no user email");
    return { sent: false, reason: "no_email" };
  }

  const text = buildBody(user, subscription);
  const html = buildHtml(user, subscription);
  const ref = orderRef(subscription);

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: `✓ Order confirmed — ${ref} · HungryCloud`,
      text,
      html,
    });
    console.log(`[email] Order confirmation sent to ${to} (${ref})`);
    return {
      sent: true,
      to,
      orderRef: ref,
      messageId: info.messageId || undefined,
    };
  } catch (err) {
    console.error("[email] Order confirmation failed:", err.message);
    return {
      sent: false,
      reason: "send_failed",
      message: err.message,
    };
  }
}

module.exports = { sendSubscriptionNotificationEmail };
