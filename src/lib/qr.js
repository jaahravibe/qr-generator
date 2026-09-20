import QRCodeStyling from "qr-code-styling";
import qrcode from "qrcode-generator";

export const EC_CAPACITY = { L: 2953, M: 2331, Q: 1663, H: 1273 };

export const EC_LEVELS = ["L", "M", "Q", "H"];

export const MAX_VERSION = 40;

export function qrGrid(version) {
  return 17 + 4 * version;
}

export function qrMeta(payload, ecLevel, forced) {
  if (!payload) return null;
  try {
    const q = qrcode(0, ecLevel);
    q.addData(payload);
    q.make();
    const required = (q.getModuleCount() - 17) / 4;
    const fits = forced > 0 && forced <= MAX_VERSION ? forced >= required : true;
    const version = fits && forced > 0 ? forced : required;
    return { version, moduleCount: qrGrid(version), fits: forced > 0 ? fits : true, required };
  } catch {
    return null;
  }
}

export const DOT_STYLES = [
  { v: "square", label: "Square" },
  { v: "dots", label: "Dots" },
  { v: "rounded", label: "Rounded" },
  { v: "extra-rounded", label: "Extra rounded" },
  { v: "classy", label: "Classy" },
  { v: "classy-rounded", label: "Classy rounded" },
];

export const CORNER_STYLES = [
  { v: "", label: "Follow dots" },
  { v: "square", label: "Square" },
  { v: "dot", label: "Dot" },
  { v: "extra-rounded", label: "Extra rounded" },
];

export const CORNER_FILLS = [
  { v: "solid", label: "Solid" },
  { v: "gradient", label: "Gradient" },
  { v: "image", label: "Image" },
];

function makeGradient(from, to) {
  return {
    type: "linear",
    rotation: Math.PI / 4,
    colorStops: [
      { offset: 0, color: from },
      { offset: 1, color: to },
    ],
  };
}

export function buildQROptions(s) {
  return {
    width: s.size,
    height: s.size,
    margin: s.margin,
    data: s.payload,
    image: s.logoUrl || undefined,
    imageOptions: {
      imageSize: s.logoSize,
      margin: 8,
      hideBackgroundDots: true,
      saveAsBlob: true,
    },
    qrOptions: {
      typeNumber: s.version || 0,
      mode: undefined,
      errorCorrectionLevel: s.ecLevel,
    },
    dotsOptions: {
      type: s.dotStyle,
      color: s.fgColor,
      gradient:
        s.fgType === "gradient" && s.fgColor2 ? makeGradient(s.fgColor, s.fgColor2) : undefined,
    },
    cornersSquareOptions: s.cornerStyle
      ? {
          type: s.cornerStyle,
          color: s.cornerFill === "gradient" ? undefined : s.cornerColor,
          gradient:
            s.cornerFill === "gradient" && s.cornerColor2
              ? makeGradient(s.cornerColor, s.cornerColor2)
              : undefined,
        }
      : undefined,
    cornersDotOptions: s.cornerStyle
      ? {
          type: s.cornerStyle === "dot" ? "dot" : s.cornerStyle === "square" ? "square" : undefined,
          color: s.cornerFill === "gradient" ? undefined : s.cornerColor,
          gradient:
            s.cornerFill === "gradient" && s.cornerColor2
              ? makeGradient(s.cornerColor, s.cornerColor2)
              : undefined,
        }
      : undefined,
    backgroundOptions: {
      color: s.bgColor,
      gradient:
        s.bgType === "gradient" && s.bgColor2 ? makeGradient(s.bgColor, s.bgColor2) : undefined,
    },
  };
}

const SVG_NS = "http://www.w3.org/2000/svg";

function ensurePattern(defs, id, imageUri, w, h) {
  let pattern = defs.querySelector(`#${id}`);
  if (!pattern) {
    pattern = document.createElementNS(SVG_NS, "pattern");
    pattern.setAttribute("id", id);
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.setAttribute("width", w);
    pattern.setAttribute("height", h);
    const img = document.createElementNS(SVG_NS, "image");
    img.setAttribute("href", imageUri);
    img.setAttribute("x", "0");
    img.setAttribute("y", "0");
    img.setAttribute("width", w);
    img.setAttribute("height", h);
    img.setAttribute("preserveAspectRatio", "xMidYMid slice");
    pattern.appendChild(img);
    defs.appendChild(pattern);
  }
  return pattern;
}

export function applyImageFills(svg, { ink, bg, corner }) {
  if (!svg) return;
  const defs = svg.querySelector("defs");
  if (!defs) return;
  const w = svg.getAttribute("width") || "256";
  const h = svg.getAttribute("height") || "256";
  const inkPattern = ink ? ensurePattern(defs, "qr-ink", ink, w, h) : null;
  const bgPattern = bg ? ensurePattern(defs, "qr-bg", bg, w, h) : null;
  const cornerPattern = corner ? ensurePattern(defs, "qr-corner", corner, w, h) : null;
  const rects = svg.querySelectorAll("rect[clip-path]");
  for (const r of rects) {
    const cp = r.getAttribute("clip-path") || "";
    if (cornerPattern && cp.includes("corners-")) {
      r.setAttribute("fill", `url(#qr-corner)`);
    } else if (inkPattern && (cp.includes("dot-color") || cp.includes("corners-"))) {
      r.setAttribute("fill", `url(#qr-ink)`);
    } else if (bgPattern && cp.includes("background-color")) {
      r.setAttribute("fill", `url(#qr-bg)`);
    }
  }
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function textLogoDataUrl(text, color, boxColor, px = 360) {
  const c = document.createElement("canvas");
  c.width = px;
  c.height = px;
  const ctx = c.getContext("2d");
  const family = '"Segoe UI", system-ui, -apple-system, sans-serif';
  const measure = (fs) => {
    ctx.font = `700 ${fs}px ${family}`;
    return ctx.measureText(text).width;
  };
  let fs = 110;
  while (measure(fs) > px * 0.74 && fs > 18) fs -= 6;
  const tw = ctx.measureText(text).width;
  const h = fs;
  roundRect(ctx, (px - tw - h * 0.9) / 2, (px - h * 1.7) / 2, tw + h * 0.9, h * 1.7, h * 0.38);
  ctx.fillStyle = boxColor;
  ctx.fill();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, px / 2, px / 2 + h * 0.05);
  return c.toDataURL("image/png");
}

export function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG export failed"))), "image/png");
  });
}

function fitText(ctx, text, maxW) {
  let t = text;
  while (ctx.measureText(t).width > maxW && t.length > 2) t = t.slice(0, -1);
  return t !== text ? `${t}…` : text;
}

export async function exportPNG({ qr, caption, fgColor, bgColor, name = "qr-code" }) {
  if (!caption || !caption.trim()) {
    const blob = await qr.getRawData("png");
    if (!blob) throw new Error("PNG export failed");
    saveBlob(blob, `${name}.png`);
    return;
  }
  const canvas = await qr._getElement("png");
  const capH = Math.round(canvas.height * 0.1);
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height + capH;
  const ctx = out.getContext("2d");
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  ctx.fillStyle = fgColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${Math.round(capH * 0.42)}px "Segoe UI", system-ui, sans-serif`;
  ctx.fillText(fitText(ctx, caption.trim(), out.width - 40), out.width / 2, canvas.height + capH / 2);
  const blob = await canvasToBlob(out);
  saveBlob(blob, `${name}.png`);
}

function appendCaptionToSvg(svg, caption, color) {
  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const capH = 56;
  const fontSize = 20;
  const mH = svg.match(/height="(\d+)"/);
  const mV = svg.match(/viewBox="0 0 ([^ ]+) ([^"]+)"/);
  const H = mH ? parseInt(mH[1], 10) : 256;
  const newH = H + capH;
  let out = svg;
  if (mH) out = out.replace(mH[0], `height="${newH}"`);
  if (mV) out = out.replace(mV[0], `viewBox="0 0 ${mV[1]} ${newH}"`);
  const text = `<text x="${H / 2}" y="${H + capH / 2}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, sans-serif" font-size="${fontSize}" font-weight="600" fill="${color}">${esc(caption)}</text>`;
  return out.replace("</svg>", `${text}\n</svg>`);
}

export async function getSvgString({ qr, caption, fgColor }) {
  const blob = await qr.getRawData("svg");
  if (!blob) throw new Error("SVG export failed");
  let svg = await blob.text();
  if (caption && caption.trim()) svg = appendCaptionToSvg(svg, caption.trim(), fgColor);
  return svg;
}

export async function exportSVG({ qr, caption, fgColor, name = "qr-code" }) {
  const svg = await getSvgString({ qr, caption, fgColor });
  saveBlob(new Blob([svg], { type: "image/svg+xml" }), `${name}.svg`);
  return svg;
}

export { QRCodeStyling };