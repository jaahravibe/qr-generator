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

export const PRESETS = {
  custom: {
    label: "Custom",
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
      return n ? `sms:${n}${message ? `?body=${encodeURIComponent(message)}` : ""}` : "";
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
    ],
    defaults: { scheme: "bitcoin", address: "", amount: "" },
    build: ({ scheme = "bitcoin", address = "", amount = "" }) => {
      const a = address.trim();
      return a ? `${scheme}:${a}${amount ? `?amount=${amount.trim()}` : ""}` : "";
    },
  },
};

export const PRESET_ORDER = Object.keys(PRESETS);