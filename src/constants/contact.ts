/**
 * Public contact endpoints. Optional overrides in `.env.local` (`NEXT_PUBLIC_*`).
 * Defaults match Tip - Top Education’s public phone, Telegram, Viber, and Facebook profile.
 */

const DEFAULT_PHONE_DISPLAY = "09988658887";

/** E.164 for Viber deep link (same handset as default phone). */
const DEFAULT_VIBER_E164 = "+959988658887";

/** Telegram: @infotiptopeducation */
const DEFAULT_TELEGRAM_URL = "https://t.me/infotiptopeducation";

/** Opens Viber chat with this number (mobile / desktop app). */
const DEFAULT_VIBER_URL = `viber://chat?number=${encodeURIComponent(DEFAULT_VIBER_E164)}`;

/** Facebook profile (Messenger / messages on web). */
const DEFAULT_MESSENGER_URL =
  "https://web.facebook.com/profile.php?id=100090302821312";

function trim(v: string | undefined): string {
  return (v ?? "").trim();
}

/** Myanmar mobiles often shown as 09… — normalize to E.164 +95… for tel: */
function phoneToTelHref(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "tel:";
  if (digits.startsWith("95")) return `tel:+${digits}`;
  if (digits.startsWith("09") && digits.length >= 10) {
    return `tel:+95${digits.slice(1)}`;
  }
  if (digits.startsWith("9") && digits.length >= 9) {
    return `tel:+95${digits}`;
  }
  return digits.startsWith("+") ? `tel:${digits}` : `tel:+${digits}`;
}

export function getContactEmail(): string {
  return trim(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "tt.tech.developer@gmail.com";
}

export function getContactPhone(): { display: string; href: string } | null {
  const raw = trim(process.env.NEXT_PUBLIC_CONTACT_PHONE) || DEFAULT_PHONE_DISPLAY;
  if (!raw) return null;
  return { display: raw, href: phoneToTelHref(raw) };
}

export function getContactTelegramUrl(): string {
  return trim(process.env.NEXT_PUBLIC_CONTACT_TELEGRAM_URL) || DEFAULT_TELEGRAM_URL;
}

export function getContactViberUrl(): string {
  return trim(process.env.NEXT_PUBLIC_CONTACT_VIBER_URL) || DEFAULT_VIBER_URL;
}

export function getContactMessengerUrl(): string {
  return trim(process.env.NEXT_PUBLIC_CONTACT_MESSENGER_URL) || DEFAULT_MESSENGER_URL;
}
