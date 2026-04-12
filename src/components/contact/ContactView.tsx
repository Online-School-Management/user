"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  getContactMessengerUrl,
  getContactPhone,
  getContactTelegramUrl,
  getContactViberUrl,
} from "@/constants/contact";
import { submitContactMessage } from "@/services/contactService";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </svg>
  );
}

function ChatAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337L5.05 21.95l1.537-3.622A8.977 8.977 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
      />
    </svg>
  );
}

type ChannelRow = {
  id: "phone" | "telegram" | "viber" | "messenger";
  label: string;
  href: string | null;
  display: string;
  Icon: typeof PhoneIcon;
};

const PHONE_CLIENT_REGEX = /^[0-9+\-\s]{6,25}$/;

export function ContactView() {
  const t = useTranslations("Contact");

  const channels = useMemo((): ChannelRow[] => {
    const phone = getContactPhone();
    const tg = getContactTelegramUrl();
    const vb = getContactViberUrl();
    const ms = getContactMessengerUrl();
    return [
      {
        id: "phone",
        label: t("channelPhone"),
        href: phone?.href ?? null,
        display: phone?.display ?? "",
        Icon: PhoneIcon,
      },
      {
        id: "telegram",
        label: t("channelTelegram"),
        href: tg || null,
        display: tg ? t("channelOpenTelegram") : "",
        Icon: TelegramIcon,
      },
      {
        id: "viber",
        label: t("channelViber"),
        href: vb || null,
        display: vb ? t("channelOpenViber") : "",
        Icon: ChatAppIcon,
      },
      {
        id: "messenger",
        label: t("channelMessenger"),
        href: ms || null,
        display: ms ? t("channelOpenMessenger") : "",
        Icon: ChatAppIcon,
      },
    ];
  }, [t]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = useCallback(() => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t("formErrorName");
    if (!phone.trim()) next.phone = t("formErrorPhone");
    else if (!PHONE_CLIENT_REGEX.test(phone.trim())) next.phone = t("formErrorPhoneInvalid");
    if (!message.trim()) next.message = t("formErrorMessage");
    else if (message.trim().length < 5) next.message = t("formErrorMessage");
    return next;
  }, [name, phone, message, t]);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setFormError(null);
      setSuccess(false);
      const next = validate();
      setErrors(next);
      if (Object.keys(next).length > 0) return;

      setSubmitting(true);
      const result = await submitContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      setSubmitting(false);

      if (result.ok) {
        setSuccess(true);
        setName("");
        setPhone("");
        setMessage("");
        setErrors({});
        return;
      }

      if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        const mapped: Record<string, string> = {};
        for (const [k, v] of Object.entries(result.fieldErrors)) {
          mapped[k] = v;
        }
        setErrors(mapped);
      }
      setFormError(result.message ?? t("formErrorGeneric"));
    },
    [message, name, phone, t, validate]
  );

  return (
    <div className="min-w-0">
      <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:gap-12">
        <section className="min-w-0 space-y-4" aria-labelledby="contact-channels-heading">
          <h2
            id="contact-channels-heading"
            className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
          >
            {t("channelsTitle")}
          </h2>
          <ul className="space-y-3">
            {channels.map(({ id, label, href, display, Icon }) => {
              const hasLink = Boolean(href);
              const content = (
                <div className="flex items-start gap-4 rounded-2xl border border-white/40 bg-white/60 px-4 py-4 shadow-sm backdrop-blur-xl sm:px-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">{label}</p>
                    {hasLink ? (
                      <p className="mt-1 break-all text-sm text-primary">{display || href}</p>
                    ) : (
                      <p className="mt-1 text-sm text-slate-500">{t("channelNotConfigured")}</p>
                    )}
                  </div>
                </div>
              );
              return (
                <li key={id}>
                  {hasLink ? (
                    <a
                      href={href!}
                      target={href!.startsWith("http") ? "_blank" : undefined}
                      rel={href!.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block rounded-2xl outline-none ring-primary transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="min-w-0 space-y-4" aria-labelledby="contact-form-heading">
          <h2
            id="contact-form-heading"
            className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
          >
            {t("formTitle")}
          </h2>
          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur-xl sm:p-6"
            noValidate
          >
            {success ? (
              <p
                className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
                role="status"
              >
                {t("formSuccess")}
              </p>
            ) : null}
            {formError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                {formError}
              </p>
            ) : null}
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-slate-800">
                {t("formLabelName")}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                disabled={submitting}
                onChange={(e) => {
                  setSuccess(false);
                  setName(e.target.value);
                  if (errors.name) setErrors((o) => ({ ...o, name: "" }));
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-200/90 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
                placeholder={t("formPlaceholderName")}
              />
              {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-800">
                {t("formLabelPhone")}
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                disabled={submitting}
                onChange={(e) => {
                  setSuccess(false);
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((o) => ({ ...o, phone: "" }));
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-200/90 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
                placeholder={t("formPlaceholderPhone")}
              />
              {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone}</p> : null}
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-slate-800">
                {t("formLabelMessage")}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={message}
                disabled={submitting}
                onChange={(e) => {
                  setSuccess(false);
                  setMessage(e.target.value);
                  if (errors.message) setErrors((o) => ({ ...o, message: "" }));
                }}
                className="mt-1.5 w-full resize-y rounded-xl border border-slate-200/90 bg-white/80 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
                placeholder={t("formPlaceholderMessage")}
              />
              {errors.message ? <p className="mt-1 text-sm text-red-600">{errors.message}</p> : null}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? t("formSubmitting") : t("formSubmit")}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
