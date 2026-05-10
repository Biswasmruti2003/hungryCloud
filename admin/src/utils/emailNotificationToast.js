import { toast } from "react-toastify";

/** Shows toast based on API `emailNotification` after order save. */
export function notifyEmailResult(emailNotification) {
  if (!emailNotification) return;
  if (emailNotification.sent) {
    const addr = emailNotification.to || "your inbox";
    toast.success(
      `Confirmation email sent to ${addr}. Check your inbox (and spam).`,
      { autoClose: 5500 }
    );
    return;
  }
  const reason = emailNotification.reason;
  if (reason === "smtp_not_configured") {
    toast.info(
      "Order saved. Confirmation email is not configured on the server yet.",
      { autoClose: 5000 }
    );
  } else if (reason === "no_email") {
    toast.warning(
      "Order saved. We could not send email because your profile has no email address.",
      { autoClose: 5000 }
    );
  } else {
    toast.warning(
      "Order saved, but we could not send the confirmation email. Your order is still valid—see your profile.",
      { autoClose: 5500 }
    );
  }
}
