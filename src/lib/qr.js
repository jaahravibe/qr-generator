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
      margin: s.logoMargin ?? 8,
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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}

function canvasToBlob(c, type) {
  return new Promise((resolve, reject) => {
    c.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode image"))), type);
  });
}

/**
 * Exports the rendered QR. When `overlay(w, h)` is provided it must return a
 * PNG data URL for a lockup badge; it is drawn over the raster logo box at
 * full export resolution (text is rendered vector-crisp then downscaled).
 */
export async function exportPNG({ qr, name = "qr-code", overlay = null } = {}) {
  const blob = await qr.getRawData("png");
  if (!blob) throw new Error("PNG export failed");
  if (!overlay) {
    saveBlob(blob, `${name}.png`);
    return;
  }
  const svgStr = await getSvgString({ qr });
  const doc = new DOMParser().parseFromString(svgStr, "image/svg+xml");
  const root = doc.documentElement;
  const w = Number(root.getAttribute("width")) || 0;
  const h = Number(root.getAttribute("height")) || 0;
  if (!w || !h) {
    saveBlob(blob, `${name}.png`);
    return;
  }
  const images = root.getElementsByTagName("image");
  let img = null;
  for (const el of images) {
    let p = el.parentNode;
    let inDefs = false;
    while (p) {
      if (p.nodeName.toLowerCase() === "defs") inDefs = true;
      p = p.parentNode;
    }
    if (!inDefs) {
      img = el;
      break;
    }
  }
  const iw = img ? parseFloat(img.getAttribute("width")) : 0;
  const ih = img ? parseFloat(img.getAttribute("height")) : 0;
  if (!img || !iw || !ih) {
    saveBlob(blob, `${name}.png`);
    return;
  }
  const badge = await overlay(Math.round(Math.max(iw, ih)));
  const frame = await loadImage(URL.createObjectURL(blob));
  const overlayImg = await loadImage(badge);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.drawImage(frame, 0, 0, w, h);
  ctx.drawImage(overlayImg, parseFloat(img.getAttribute("x")) || 0, parseFloat(img.getAttribute("y")) || 0, iw, ih);
  saveBlob(await canvasToBlob(c, "image/png"), `${name}.png`);
}

export async function getSvgString({ qr }) {
  const blob = await qr.getRawData("svg");
  if (!blob) throw new Error("SVG export failed");
  return blob.text();
}

/**
 * Exports the QR as SVG. When `vectorize(svg)` is provided, the raster logo
 * `<image>` is swapped for a true-vector lockup before saving (or kept as-is
 * if the callback returns false).
 */
export async function exportSVG({ qr, name = "qr-code", vectorize = null } = {}) {
  let svg = await getSvgString({ qr });
  if (vectorize) {
    const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
    if (vectorize(doc.documentElement)) {
      svg = new XMLSerializer().serializeToString(doc);
    }
  }
  saveBlob(new Blob([svg], { type: "image/svg+xml" }), `${name}.svg`);
  return svg;
}

export { QRCodeStyling };