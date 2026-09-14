const CRYPTO_SCHEMES = [
  { v: "bitcoin", label: "Bitcoin" },
  { v: "ethereum", label: "Ethereum" },
  { v: "litecoin", label: "Litecoin" },
  { v: "dogecoin", label: "Dogecoin" },
  { v: "monero", label: "Monero" },
  { v: "solana", label: "Solana" },
  { v: "tron", label: "Tron" },
  { v: "ripple", label: "XRP" },
  { v: "stellar", label: "Stellar" },
  { v: "tezos", label: "Tezos" },
  { v: "cosmos", label: "Cosmos" },
];

const escVCard = (s) => s.replace(/\\/g, "").replace(/;/g, ",").replace(/[\r\n]+/g, " ").trim();
const escWifi = (s) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/:/g, "\\:").replace(/"/g, '\\"');
const escMeCard = (s) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/:/g, "\\:").replace(/"/g, '\\"').replace(/[\r\n]+/g, " ").trim();

const stripDigits = (s) => s.replace(/\D/g, "");
const stripFormatting = (s) => s.replace(/[\s().-]/g, "");

export const CUSTOM_TYPES = [
  { v: "text", label: "Text", inputType: "text" },
  { v: "number", label: "Number", inputType: "number" },
  { v: "url", label: "URL", inputType: "url" },
  { v: "email", label: "Email", inputType: "email" },
  { v: "tel", label: "Phone", inputType: "tel" },
  { v: "date", label: "Date", inputType: "date" },
  { v: "time", label: "Time", inputType: "time" },
  { v: "datetime", label: "DateTime", inputType: "datetime-local" },
];

export const blankField = () => ({
  id: (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())),
  label: "",
  type: "text",
  value: "",
});

export const PRESETS = {
  custom: {
    label: "Custom",
    dynamic: true,
    defaults: { fields: [blankField()] },
    build: ({ fields = [] }) =>
      fields
        .map((f) => ({ label: (f?.label || "").trim(), value: (f?.value || "").trim() }))
        .filter((f) => f.value)
        .map((f) => (f.label ? `${f.label}: ${f.value}` : f.value))
        .join("\n"),
  },
  text: {
    label: "Plain text",
    fields: [
      { key: "text", type: "textarea", label: "Content", placeholder: "Any text, URL or note", rows: 4 },
    ],
    defaults: { text: "https://example.com" },
    build: ({ text = "" }) => text.trim(),
  },
  url: {
    label: "URL",
    fields: [{ key: "text", type: "text", label: "Address", placeholder: "https://example.com" }],
    defaults: { text: "https://example.com" },
    build: ({ text = "" }) => {
      const t = text.trim();
      return t && /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : t ? `https://${t}` : "";
    },
  },
  wifi: {
    label: "WiFi",
    fields: [
      { key: "ssid", type: "text", label: "Network name" },
      { key: "password", type: "password", label: "Password" },
      {
        key: "encryption",
        type: "select",
        label: "Encryption",
        options: [
          { v: "WPA", label: "WPA / WPA2" },
          { v: "WEP", label: "WEP" },
          { v: "nopass", label: "None (open)" },
        ],
      },
    ],
    defaults: { ssid: "", password: "", encryption: "WPA" },
    build: ({ ssid = "", password = "", encryption = "WPA" }) => {
      const s = ssid.trim();
      if (!s) return "";
      return `WIFI:T:${encryption};S:${escWifi(s)};P:${escWifi(password)};;`;
    },
  },
  contact: {
    label: "Contact",
    fields: [
      { key: "first", type: "text", label: "First name" },
      { key: "last", type: "text", label: "Last name" },
      { key: "org", type: "text", label: "Company" },
      { key: "phone", type: "text", label: "Phone" },
      { key: "email", type: "text", label: "Email" },
      { key: "url", type: "text", label: "Website" },
    ],
    defaults: { first: "", last: "", org: "", phone: "", email: "", url: "" },
    build: ({ first = "", last = "", org = "", phone = "", email = "", url = "" }) => {
      const lines = ["BEGIN:VCARD", "VERSION:3.0"];
      if (first || last) {
        lines.push(`N:${escVCard(last)};${escVCard(first)};;;`);
        lines.push(`FN:${escVCard([first, last].filter(Boolean).join(" "))}`);
      }
      if (org) lines.push(`ORG:${escVCard(org)}`);
      if (phone) lines.push(`TEL;TYPE=CELL:${escVCard(phone)}`);
      if (email) lines.push(`EMAIL:${escVCard(email)}`);
      if (url) lines.push(`URL:${escVCard(url)}`);
      if (lines.length === 2) return "";
      lines.push("END:VCARD");
      return lines.join("\n");
    },
  },
  email: {
    label: "Email",
    fields: [
      { key: "to", type: "text", label: "To", placeholder: "name@example.com" },
      { key: "subject", type: "text", label: "Subject" },
      { key: "body", type: "textarea", label: "Body", rows: 3 },
    ],
    defaults: { to: "", subject: "", body: "" },
    build: ({ to = "", subject = "", body = "" }) => {
      const t = to.trim();
      if (!/^\S+@\S+\.\S+$/.test(t)) return "";
      const q = new URLSearchParams();
      if (subject) q.set("subject", subject);
      if (body) q.set("body", body);
      const qs = q.toString();
      return `mailto:${t}${qs ? `?${qs}` : ""}`;
    },
  },
  sms: {
    label: "SMS",
    fields: [
      { key: "number", type: "text", label: "Number" },
      { key: "message", type: "text", label: "Message" },
    ],
    defaults: { number: "", message: "" },
    build: ({ number = "", message = "" }) => {
      const n = number.trim();
      return n ? `sms:${n}${message ? `?body=${encodeURIComponent(message.trim())}` : ""}` : "";
    },
  },
  whatsapp: {
    label: "WhatsApp",
    fields: [
      { key: "number", type: "text", label: "Phone number", placeholder: "+1 555 000 1234" },
      { key: "message", type: "textarea", label: "Message · optional", rows: 2 },
    ],
    defaults: { number: "", message: "" },
    build: ({ number = "", message = "" }) => {
      const n = stripDigits(number);
      if (!n) return "";
      return `https://wa.me/${n}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""}`;
    },
  },
  telegram: {
    label: "Telegram",
    fields: [
      { key: "user", type: "text", label: "Username", placeholder: "yourchannel" },
      { key: "message", type: "textarea", label: "Message · optional", rows: 2 },
    ],
    defaults: { user: "", message: "" },
    build: ({ user = "", message = "" }) => {
      const u = user.trim().replace(/^@/, "");
      if (!u) return "";
      return `https://t.me/${u}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""}`;
    },
  },
  signal: {
    label: "Signal",
    fields: [
      { key: "number", type: "text", label: "Phone number", placeholder: "+1 555 000 1234" },
    ],
    defaults: { number: "" },
    build: ({ number = "" }) => {
      const n = stripDigits(number);
      return n ? `https://signal.me/#p/+${n}` : "";
    },
  },
  phone: {
    label: "Phone call",
    fields: [
      { key: "number", type: "text", label: "Number", placeholder: "+1 555 000 1234" },
    ],
    defaults: { number: "" },
    build: ({ number = "" }) => {
      const n = stripFormatting(number);
      return n ? `tel:${n}` : "";
    },
  },
  mecard: {
    label: "Business card (MeCard)",
    fields: [
      { key: "name", type: "text", label: "Name", placeholder: "Jane Doe" },
      { key: "org", type: "text", label: "Company" },
      { key: "phone", type: "text", label: "Phone" },
      { key: "email", type: "text", label: "Email" },
      { key: "url", type: "text", label: "Website" },
    ],
    defaults: { name: "", org: "", phone: "", email: "", url: "" },
    build: ({ name = "", org = "", phone = "", email = "", url = "" }) => {
      const fields = [];
      if (name.trim()) {
        const [namePart = "", ...rest] = name.trim().split(/\s+/);
        const last = rest.join(" ");
        fields.push(`N:${escMeCard(last)},${escMeCard(namePart)}`);
      }
      if (org.trim()) fields.push(`ORG:${escMeCard(org)}`);
      if (phone.trim()) fields.push(`TEL:${escMeCard(phone)}`);
      if (email.trim()) fields.push(`EMAIL:${escMeCard(email)}`);
      if (url.trim()) fields.push(`URL:${escMeCard(url)}`);
      return fields.length ? `MECARD:${fields.join(";")};;` : "";
    },
  },
  geo: {
    label: "Location",
    fields: [
      { key: "lat", type: "number", label: "Latitude", step: "any" },
      { key: "lng", type: "number", label: "Longitude", step: "any" },
    ],
    defaults: { lat: "", lng: "" },
    build: ({ lat = "", lng = "" }) => {
      const a = Number(lat);
      const b = Number(lng);
      return Number.isFinite(a) && Number.isFinite(b) && lat !== "" && lng !== "" ? `geo:${a},${b}` : "";
    },
  },
  calendar: {
    label: "Event",
    fields: [
      { key: "title", type: "text", label: "Title" },
      { key: "location", type: "text", label: "Location" },
      { key: "start", type: "datetime", label: "Starts" },
      { key: "end", type: "datetime", label: "Ends" },
    ],
    defaults: { title: "", location: "", start: "", end: "" },
    build: ({ title = "", location = "", start = "", end = "" }) => {
      const t = title.trim();
      if (!t) return "";
      const esc = (s) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
      const fmt = (v) => (v ? v.replace(/[-:]/g, "").replace("T", "").padEnd(15, "0") : "");
      const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//QR Generator//EN", "BEGIN:VEVENT", `SUMMARY:${esc(t)}`];
      if (location) lines.push(`LOCATION:${esc(location)}`);
      const s = fmt(start);
      const e = fmt(end);
      if (s) lines.push(`DTSTART:${s}`);
      if (e) lines.push(`DTEND:${e}`);
      lines.push("END:VEVENT", "END:VCALENDAR");
      return lines.join("\n");
    },
  },
  totp: {
    label: "2FA (TOTP)",
    fields: [
      { key: "label", type: "text", label: "Account", placeholder: "user@example.com" },
      { key: "issuer", type: "text", label: "Issuer", placeholder: "GitHub" },
      { key: "secret", type: "text", label: "Secret" },
    ],
    defaults: { label: "", issuer: "", secret: "" },
    build: ({ label = "", issuer = "", secret = "" }) => {
      const s = secret.trim().toUpperCase();
      if (!s) return "";
      const q = new URLSearchParams();
      q.set("secret", s);
      if (issuer.trim()) q.set("issuer", issuer.trim());
      q.set("algorithm", "SHA1");
      q.set("digits", "6");
      q.set("period", "30");
      return `otpauth://totp/${encodeURIComponent(label.trim() || "Account")}?${q.toString()}`;
    },
  },
  crypto: {
    label: "Crypto",
    fields: [
      { key: "scheme", type: "select", label: "Network", options: CRYPTO_SCHEMES },
      { key: "address", type: "text", label: "Address" },
      { key: "amount", type: "text", label: "Amount", placeholder: "Optional" },
      { key: "label", type: "text", label: "Label", placeholder: "Optional" },
      { key: "message", type: "text", label: "Message", placeholder: "Optional" },
    ],
    defaults: { scheme: "bitcoin", address: "", amount: "", label: "", message: "" },
    build: ({ scheme = "bitcoin", address = "", amount = "", label = "", message = "" }) => {
      const a = address.trim();
      if (!a) return "";
      const qs = [];
      const pick = (key, val) => {
        const v = val.trim();
        if (v) qs.push(`${key}=${encodeURIComponent(v).replace(/%20/g, "+")}`);
      };
      pick("amount", amount);
      pick("label", label);
      pick("message", message);
      return `${scheme}:${a}${qs.length ? `?${qs.join("&")}` : ""}`;
    },
  },
};

export const PRESET_ORDER = Object.keys(PRESETS);