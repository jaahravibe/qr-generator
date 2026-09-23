export const LOGO_ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export const MAX_LOGO_DIM = 512;

export const LOGO_SHAPES = [
  { v: "none", label: "None" },
  { v: "circle", label: "Circle" },
  { v: "rounded", label: "Rounded" },
  { v: "square", label: "Square" },
];

export const LOGO_FONTS = [
  { v: "sans", label: "Inter", group: "Sans" },
  { v: "poppins", label: "Poppins", group: "Sans" },
  { v: "montserrat", label: "Montserrat", group: "Sans" },
  { v: "roboto", label: "Roboto", group: "Sans" },
  { v: "opensans", label: "Open Sans", group: "Sans" },
  { v: "raleway", label: "Raleway", group: "Sans" },
  { v: "oswald", label: "Oswald", group: "Sans" },
  { v: "quicksand", label: "Quicksand", group: "Sans" },
  { v: "lato", label: "Lato", group: "Sans" },
  { v: "archivo", label: "Archivo", group: "Sans" },
  { v: "serif", label: "Playfair Display", group: "Serif" },
  { v: "merriweather", label: "Merriweather", group: "Serif" },
  { v: "ebgaramond", label: "EB Garamond", group: "Serif" },
  { v: "cormorant", label: "Cormorant", group: "Serif" },
  { v: "librebaskerville", label: "Libre Baskerville", group: "Serif" },
  { v: "lora", label: "Lora", group: "Serif" },
  { v: "crimson", label: "Crimson Text", group: "Serif" },
  { v: "alegreya", label: "Alegreya", group: "Serif" },
  { v: "mono", label: "JetBrains Mono", group: "Monospace" },
  { v: "firacode", label: "Fira Code", group: "Monospace" },
  { v: "ibmplex", label: "IBM Plex Mono", group: "Monospace" },
  { v: "spacemono", label: "Space Mono", group: "Monospace" },
  { v: "sourcecode", label: "Source Code Pro", group: "Monospace" },
  { v: "robotomono", label: "Roboto Mono", group: "Monospace" },
  { v: "courierprime", label: "Courier Prime", group: "Monospace" },
  { v: "script", label: "Pacifico", group: "Script" },
  { v: "caveat", label: "Caveat", group: "Script" },
  { v: "dancing", label: "Dancing Script", group: "Script" },
  { v: "greatvibes", label: "Great Vibes", group: "Script" },
  { v: "kalam", label: "Kalam", group: "Script" },
  { v: "shadows", label: "Shadows Into Light", group: "Script" },
  { v: "comic", label: "Comic Neue", group: "Script" },
  { v: "gochi", label: "Gochi Hand", group: "Script" },
  { v: "display", label: "Space Grotesk", group: "Display" },
  { v: "bebas", label: "Bebas Neue", group: "Display" },
  { v: "lobster", label: "Lobster", group: "Display" },
  { v: "russo", label: "Russo One", group: "Display" },
  { v: "carter", label: "Carter One", group: "Display" },
  { v: "monoton", label: "Monoton", group: "Display" },
  { v: "righteous", label: "Righteous", group: "Display" },
  { v: "berkshire", label: "Berkshire Swash", group: "Display" },
  { v: "unifraktur", label: "Unifraktur", group: "Blackletter" },
  { v: "unifrakturcook", label: "Unifraktur Cook", group: "Blackletter" },
  { v: "pirata", label: "Pirata One", group: "Blackletter" },
  { v: "germania", label: "Germania One", group: "Blackletter" },
  { v: "fondamento", label: "Fondamento", group: "Blackletter" },
];

export const LOGO_FONT_STACKS = {
  sans: 'Inter, "Segoe UI", system-ui, sans-serif',
  poppins: 'Poppins, "Segoe UI", system-ui, sans-serif',
  montserrat: 'Montserrat, "Segoe UI", system-ui, sans-serif',
  roboto: 'Roboto, "Segoe UI", system-ui, sans-serif',
  opensans: '"Open Sans", "Segoe UI", system-ui, sans-serif',
  raleway: 'Raleway, "Segoe UI", system-ui, sans-serif',
  oswald: 'Oswald, "Segoe UI", system-ui, sans-serif',
  quicksand: 'Quicksand, "Segoe UI", system-ui, sans-serif',
  lato: 'Lato, "Segoe UI", system-ui, sans-serif',
  archivo: 'Archivo, "Segoe UI", system-ui, sans-serif',
  serif: '"Playfair Display", Georgia, serif',
  merriweather: 'Merriweather, Georgia, serif',
  ebgaramond: '"EB Garamond", Georgia, serif',
  cormorant: 'Cormorant, Georgia, serif',
  librebaskerville: '"Libre Baskerville", Georgia, serif',
  lora: 'Lora, Georgia, serif',
  crimson: '"Crimson Text", Georgia, serif',
  alegreya: 'Alegreya, Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
  firacode: '"Fira Code", ui-monospace, Menlo, monospace',
  ibmplex: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
  spacemono: '"Space Mono", ui-monospace, Menlo, monospace',
  sourcecode: '"Source Code Pro", ui-monospace, Menlo, monospace',
  robotomono: '"Roboto Mono", ui-monospace, Menlo, monospace',
  courierprime: '"Courier Prime", "Courier New", monospace',
  script: 'Pacifico, "Segoe Script", cursive',
  caveat: 'Caveat, "Segoe Script", cursive',
  dancing: '"Dancing Script", "Segoe Script", cursive',
  greatvibes: '"Great Vibes", "Segoe Script", cursive',
  kalam: 'Kalam, "Segoe Script", cursive',
  shadows: '"Shadows Into Light", "Segoe Script", cursive',
  comic: '"Comic Neue", "Comic Sans MS", "Comic Sans", cursive',
  gochi: '"Gochi Hand", "Comic Sans MS", cursive',
  display: '"Space Grotesk", "Segoe UI", system-ui, sans-serif',
  bebas: '"Bebas Neue", Impact, sans-serif',
  lobster: 'Lobster, "Brush Script MT", cursive',
  russo: '"Russo One", Impact, sans-serif',
  carter: '"Carter One", Georgia, serif',
  monoton: 'Monoton, Georgia, serif',
  righteous: 'Righteous, "Trebuchet MS", sans-serif',
  berkshire: '"Berkshire Swash", Georgia, serif',
  unifraktur: '"UnifrakturMaguntia", "Old English Text MT", "Engravers MT", serif',
  unifrakturcook: '"UnifrakturCook", "UnifrakturMaguntia", "Old English Text MT", serif',
  pirata: '"Pirata One", "Old English Text MT", "Engravers MT", serif',
  germania: '"Germania One", "Old English Text MT", Georgia, serif',
  fondamento: 'Fondamento, "Old English Text MT", Georgia, serif',
};

export const LOGO_WEIGHTS = [
  { v: "400", label: "Regular" },
  { v: "600", label: "Medium" },
  { v: "700", label: "Bold" },
];

export const TEXT_ALIGN = [
  { v: "left", label: "Left" },
  { v: "center", label: "Center" },
  { v: "right", label: "Right" },
];

export const TEXT_CASES = [
  { v: "none", label: "As typed" },
  { v: "upper", label: "UPPERCASE" },
  { v: "title", label: "Title Case" },
];

export const LOCKUP_LINE_DEFAULTS = {
  text: "",
  family: "sans",
  weight: "700",
  italic: false,
  color: "",
  size: "auto",
  tracking: 0,
  case: "none",
};

export const DEFAULT_TEXT_LOCKUP = {
  align: "center",
  leading: 1.2,
  lines: [{ ...LOCKUP_LINE_DEFAULTS }],
};

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

export function applyTextCase(text, c) {
  if (!c || c === "none") return text;
  if (c === "upper") return text.toLocaleUpperCase();
  if (c === "title")
    return text.replace(/\S+/g, (w) => w[0].toLocaleUpperCase() + w.slice(1));
  return text;
}

export function trackedWidth(text, fs, tracking, measure, line) {
  const natural = measure(text, fs, line);
  const spacing = Math.max(0, text.length - 1) * tracking * fs;
  return natural + spacing;
}

/**
 * Pure layout pass for a wordmark lockup. `measure(text, fs, line)` returns
 * the natural advance width in px for a given font size; `metrics(fs, line)`
 * returns `{ ascent, descent }`. Both receive the current line config so
 * per-line fonts are possible. Both are injectable, so the engine is
 * testable in Node without a canvas.
 *
 * Lines are width-fit individually, then all are rescaled together so the
 * *wrapped* visual block (every line's wrapped segments × line height) fits
 * the height budget. The whole block is then optically centered.
 */
export function layoutLockup({
  box,
  lines,
  align = "center",
  leading = 1.2,
  measure,
  metrics,
  budgets = { w: 0.9, h: 0.92 },
  minSize = 12,
  maxSize = 200,
}) {
  const b = { w: Math.max(1, box.w), h: Math.max(1, box.h) };
  const maxW = b.w * budgets.w;
  const maxH = b.h * budgets.h;
  const m = metrics
    ? (fs, line) => metrics(fs, line)
    : (fs) => ({ ascent: fs * 0.75, descent: fs * 0.25 });

  const actives = lines
    .map((l) => ({ ...LOCKUP_LINE_DEFAULTS, ...l, text: applyTextCase(String(l.text ?? "").trim(), l.case) }))
    .filter((l) => l.text.length > 0);

  const widthAt = (line, fs) => (text) => trackedWidth(text, fs, line.tracking, measure, line);
  const wrapsAt = (line, fs) => wrapWords(line.text, widthAt(line, fs), maxW);
  const fitsAt = (line, fs) => wrapsAt(line, fs).every((t) => widthAt(line, fs)(t) <= maxW);

  function bestFs(line) {
    if (typeof line.size === "number" && line.size > 0) {
      let fs = clamp(Math.round(b.w * line.size), minSize, maxSize);
      let guard = 0;
      while (!fitsAt(line, fs) && fs > minSize && guard++ < 60) fs -= 2;
      return fs;
    }
    let lo = minSize;
    let hi = maxSize;
    let best = minSize;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (fitsAt(line, mid)) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return best;
  }

  let sizes = actives.map((l) => Math.max(minSize, bestFs(l)));
  const drawnHAt = (fsList) =>
    fsList.reduce((sum, fs, i) => sum + wrapsAt(actives[i], fs).length * fs * leading, 0);

  let guard = 0;
  while (drawnHAt(sizes) > maxH && sizes.some((fs) => fs > minSize) && guard++ < 24) {
    const ratio = maxH / drawnHAt(sizes);
    const next = sizes.map((fs) => Math.max(minSize, Math.round(fs * ratio)));
    if (next.every((fs, i) => fs === sizes[i])) break;
    sizes = next;
  }
  const blockH = drawnHAt(sizes);
  const blockTop = (b.h - blockH) / 2;

  const visual = [];
  let cursorTop = blockTop;
  const tx = align === "left" ? 0 : align === "right" ? b.w : b.w / 2;
  const textAlign = align === "left" ? "left" : align === "right" ? "right" : "center";

  sizes.forEach((fs, i) => {
    const line = actives[i];
    const lh = fs * leading;
    const segs = wrapsAt(line, fs);
    const met = m(fs, line);
    segs.forEach((text) => {
      visual.push({
        text,
        fs,
        weight: line.weight,
        italic: line.italic,
        tracking: line.tracking,
        color: line.color,
        family: line.family,
        x: tx,
        textAlign,
        ascent: met.ascent,
        descent: met.descent,
        boxTop: cursorTop,
        baseline: cursorTop + (lh - (met.ascent + met.descent)) / 2 + met.ascent,
        lineH: lh,
        width: widthAt(line, fs)(text),
      });
      cursorTop += lh;
    });
  });

  return {
    box: b,
    lines: visual,
    blockH,
    maxWidth: visual.reduce((maxv, l) => Math.max(maxv, l.width), 0),
    sizes,
  };
}

/**
 * Paints a layout produced by `layoutLockup` onto a 2D context at any
 * resolution. `outline` = `{ color, width }` (width is a fraction of the
 * font size); `shadow` = `{ color, blur, offsetY }`.
 */
export function drawLockup(ctx, layout, { opacity = 1, outline = null, shadow = null } = {}) {
  ctx.save();
  ctx.globalAlpha = clamp(opacity, 0, 1);
  if (shadow) {
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur ?? 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = shadow.offsetY ?? 0;
  }
  for (const ln of layout.lines) {
    const stack = LOGO_FONT_STACKS[ln.family] || LOGO_FONT_STACKS.sans;
    const slant = ln.italic ? "italic " : "";
    ctx.font = `${slant}${ln.weight} ${ln.fs}px ${stack}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${ln.tracking * ln.fs}px`;
    ctx.textAlign = ln.textAlign;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = ln.color || "#000000";
    if (outline && outline.width > 0) {
      ctx.lineWidth = Math.max(1, outline.width * ln.fs);
      ctx.strokeStyle = outline.color;
      ctx.lineJoin = "round";
      ctx.strokeText(ln.text, ln.x, ln.baseline);
    }
    ctx.fillText(ln.text, ln.x, ln.baseline);
  }
  ctx.restore();
}

function wrapWords(text, width, maxW) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (!cur || width(test) <= maxW) cur = test;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * Replicates the centered logo box qr-code-styling draws: a square of the
 * QR edge scaled by `imageSize`, plus `qr-code-styling`'s px `margin`
 * on each side (used to fully mask the raster during export).
 */
export function logoBoxPx(edge, imageSize, { margin = 0, scale = 1 } = {}) {
  const s = Math.max(1, edge * scale);
  const e = Math.max(0, imageSize) * s;
  const m = Math.max(0, margin) * scale;
  const w = Math.min(s, e + 2 * m);
  const x = Math.max(0, (s - w) / 2);
  return { x, y: x, w, h: w };
}

export const DEFAULT_LOGO_STYLE = {
  shape: { image: "none", text: "rounded" },
  plateColor: "",
  borderWidth: 0,
  borderColor: "#232019",
  radius: 0.28,
  padding: 0.04,
  opacity: 1,
  lockup: {
    align: "center",
    outline: 0,
    outlineColor: "#ffffff",
    shadow: 0,
    shadowColor: "#000000",
    lines: [{ ...LOCKUP_LINE_DEFAULTS }],
  },
};

function loadLockupFonts(lines) {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  const seen = new Set();
  const jobs = [];
  for (const l of lines) {
    const stack = LOGO_FONT_STACKS[l.family] || LOGO_FONT_STACKS.sans;
    const slant = l.italic ? "italic " : "";
    for (const w of new Set([l.weight, "400", "700"])) {
      const key = `${slant}${w}|${stack}`;
      if (seen.has(key)) continue;
      seen.add(key);
      jobs.push(document.fonts.load(`${slant}${w} 100px ${stack}`));
    }
  }
  return Promise.allSettled(jobs).then(() => document.fonts.ready);
}

/**
 * Builds the browser measure/metrics adapter used by the layout engine.
 * Crucially it does NOT set `ctx.letterSpacing` while measuring (the engine
 * adds tracking arithmetically), while `drawLockup` does set it for painting.
 */
export function makeTextAdapter(ctx, fallback) {
  const fontOf = (line, fs) => {
    const l = line || fallback;
    const stack = LOGO_FONT_STACKS[l.family] || LOGO_FONT_STACKS.sans;
    return `${l.italic ? "italic " : ""}${l.weight} ${fs}px ${stack}`;
  };
  return {
    fontOf,
    measure: (text, fs, line) => {
      ctx.font = fontOf(line, fs);
      return ctx.measureText(text).width;
    },
    metrics: (fs, line) => {
      ctx.font = fontOf(line, fs);
      const m = ctx.measureText("MHhpg");
      return {
        ascent: m.fontBoundingBoxAscent || fs * 0.8,
        descent: m.fontBoundingBoxDescent || fs * 0.2,
      };
    },
  };
}

function fontStackFor(family) {
  return LOGO_FONT_STACKS[family] || LOGO_FONT_STACKS.sans;
}

/**
 * Shared geometry + layout for a lockup badge at a given pixel `size`.
 * Returns the laid-out lines, the plate/inset geometry, and the fit box so
 * both the canvas rasterizer and the SVG vectorizer paint identically.
 */
export function layoutBadge({
  lockup,
  inkColor = "#000000",
  borderWidth = 0,
  padding = 0.04,
  radius = 0.28,
  size = 512,
  budgets = { w: 0.92, h: 0.94 },
  measure,
  metrics,
}) {
  const lines = (lockup.lines || []).map((l) => ({
    ...LOCKUP_LINE_DEFAULTS,
    ...l,
    color: l.color || inkColor,
  }));
  const bw = Math.max(0, borderWidth);
  const plateInset = bw > 0 ? bw / 2 : 0;
  const plateSize = size - plateInset * 2;
  const padInset = (clamp(padding, 0, 0.5) * size) / 2;
  const imageInset = Math.max(padInset, plateInset);
  const inner = size - imageInset * 2;
  const r = clamp(radius, 0, 0.5) * plateSize;
  const layout = layoutLockup({
    box: { w: inner, h: inner },
    lines,
    align: lockup.align || "center",
    leading: lockup.leading || 1.2,
    measure,
    metrics,
    budgets,
  });
  return { layout, lines, bw, plateInset, plateSize, padInset, imageInset, inner, r };
}

/**
 * Renders a text lockup badge (plate + vector wordmark) to a PNG data URL.
 * Text is drawn once, directly at output resolution, using the metrics-aware
 * engine — no rasterize-then-stamp step.
 */
export async function composeTextBadge({
  lockup,
  inkColor = "#000000",
  shape = "rounded",
  plateColor = "#ffffff",
  borderWidth = 0,
  borderColor = "#232019",
  padding = 0.04,
  radius = 0.28,
  opacity = 1,
  size = 512,
  budgets = { w: 0.92, h: 0.94 },
}) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const adapter = makeTextAdapter(ctx, LOCKUP_LINE_DEFAULTS);
  await loadLockupFonts(lockup?.lines || []);
  const { layout, bw, plateInset, plateSize, imageInset, r } = layoutBadge({
    lockup,
    inkColor,
    borderWidth,
    padding,
    radius,
    size,
    budgets,
    measure: adapter.measure,
    metrics: adapter.metrics,
  });

  if (shape !== "none") {
    platePath(ctx, shape, plateInset, plateInset, plateSize, r);
    ctx.fillStyle = plateColor;
    ctx.fill();
    ctx.clip();
  }

  ctx.globalAlpha = clamp(opacity, 0, 1);
  ctx.save();
  ctx.translate(imageInset, imageInset);
  drawLockup(ctx, layout, {
    opacity: 1,
    outline:
      (lockup.outline || 0) > 0
        ? { color: lockup.outlineColor || "#ffffff", width: lockup.outline }
        : null,
    shadow:
      (lockup.shadow || 0) > 0
        ? { color: lockup.shadowColor || "#000000", blur: lockup.shadow }
        : null,
  });
  ctx.restore();
  ctx.globalAlpha = 1;

  if (shape !== "none" && bw > 0) {
    ctx.lineWidth = bw;
    ctx.strokeStyle = borderColor;
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  return c.toDataURL("image/png");
}

function svgShapeEl(doc, NS, shape, plateInset, plateSize, r) {
  const el = doc.createElementNS(NS, shape === "circle" ? "circle" : "rect");
  if (shape === "circle") {
    const cy = plateInset + plateSize / 2;
    el.setAttribute("cx", cy);
    el.setAttribute("cy", cy);
    el.setAttribute("r", plateSize / 2);
  } else {
    el.setAttribute("x", plateInset);
    el.setAttribute("y", plateInset);
    el.setAttribute("width", plateSize);
    el.setAttribute("height", plateSize);
    el.setAttribute("rx", shape === "rounded" ? r : 0);
  }
  return el;
}

/**
 * Rewrites an exported QR SVG in place: the raster logo `<image>` is replaced
 * by a vector plate + `<text>` lockup, so the wordmark is resolution-independent.
 * Returns false when there is no logo image to replace (caller keeps the svg
 * unchanged). `svg` is an SVG Document element (from DOMParser/XMLSerializer).
 */
export function vectorizeBadge(svg, opts) {
  const doc = svg.ownerDocument;
  if (!doc) return false;
  const NS = svg.namespaceURI || "http://www.w3.org/2000/svg";

  let img = null;
  const images = svg.getElementsByTagName("image");
  for (let i = 0; i < images.length; i++) {
    const el = images[i];
    let p = el.parentNode;
    let inDefs = false;
    while (p) {
      if (p.nodeName.toLowerCase() === "defs") {
        inDefs = true;
        break;
      }
      p = p.parentNode;
    }
    if (!inDefs) {
      img = el;
      break;
    }
  }
  if (!img) return false;

  const x = parseFloat(img.getAttribute("x")) || 0;
  const y = parseFloat(img.getAttribute("y")) || 0;
  const W = parseFloat(img.getAttribute("width"));
  const H = parseFloat(img.getAttribute("height"));
  if (!W || !H) return false;
  const size = Math.round(Math.max(W, H));

  const { lockup = {}, inkColor = "#000000", shape = "rounded", plateColor = "#ffffff", borderWidth = 0, borderColor = "#232019", padding = 0.04, radius = 0.28 } = opts;

  let adapter = null;
  if (typeof document !== "undefined" && document.createElement) {
    try {
      adapter = makeTextAdapter(document.createElement("canvas").getContext("2d"));
    } catch {
      adapter = null;
    }
  }
  if (!adapter) {
    adapter = {
      measure: (t, fs) => fs * 0.55 * t.length,
      metrics: (fs) => ({ ascent: fs * 0.8, descent: fs * 0.2 }),
    };
  }
  const laid = layoutBadge({
    lockup,
    inkColor,
    borderWidth,
    padding,
    radius,
    size,
    measure: adapter.measure,
    metrics: adapter.metrics,
  });
  const { layout, bw, plateInset, plateSize, imageInset, r } = laid;

  const existing = svg.querySelector("defs");
  const defs =
    existing ||
    (() => {
      const d = doc.createElementNS(NS, "defs");
      svg.insertBefore(d, svg.firstChild);
      return d;
    })();

  const suffix = Math.random().toString(36).slice(2, 9);

  const g = doc.createElementNS(NS, "g");
  g.setAttribute("transform", `translate(${x} ${y})`);

  const painter = doc.createElementNS(NS, "g");
  if (shape !== "none") {
    const clipId = `qr-badge-${suffix}`;
    const clip = doc.createElementNS(NS, "clipPath");
    clip.setAttribute("id", clipId);
    clip.appendChild(svgShapeEl(doc, NS, shape, plateInset, plateSize, r));
    defs.appendChild(clip);
    painter.setAttribute("clip-path", `url(#${clipId})`);
    const plateEl = svgShapeEl(doc, NS, shape, plateInset, plateSize, r);
    plateEl.setAttribute("fill", plateColor);
    painter.appendChild(plateEl);
    if (bw > 0) {
      const borderEl = svgShapeEl(doc, NS, shape, plateInset, plateSize, r);
      borderEl.setAttribute("fill", "none");
      borderEl.setAttribute("stroke", borderColor);
      borderEl.setAttribute("stroke-width", bw);
      borderEl.setAttribute("stroke-linejoin", "round");
      painter.appendChild(borderEl);
    }
  }

  let shadowId = null;
  if ((lockup.shadow || 0) > 0) {
    shadowId = `qr-shadow-${suffix}`;
    const filter = doc.createElementNS(NS, "filter");
    filter.setAttribute("id", shadowId);
    filter.setAttribute("x", "-30%");
    filter.setAttribute("y", "-30%");
    filter.setAttribute("width", "160%");
    filter.setAttribute("height", "160%");
    const drop = doc.createElementNS(NS, "feDropShadow");
    drop.setAttribute("dx", "0");
    drop.setAttribute("dy", "0");
    drop.setAttribute("stdDeviation", (lockup.shadow / 2).toFixed(2));
    drop.setAttribute("flood-color", lockup.shadowColor || "#000000");
    drop.setAttribute("flood-opacity", "0.5");
    filter.appendChild(drop);
    defs.appendChild(filter);
  }

  for (const ln of layout.lines) {
    const t = doc.createElementNS(NS, "text");
    t.setAttribute("x", (ln.x + imageInset).toFixed(2));
    t.setAttribute("y", (ln.baseline + imageInset).toFixed(2));
    t.setAttribute(
      "text-anchor",
      ln.textAlign === "left" ? "start" : ln.textAlign === "right" ? "end" : "middle",
    );
    t.setAttribute("font-family", fontStackFor(ln.family));
    t.setAttribute("font-size", ln.fs);
    if (ln.italic) t.setAttribute("font-style", "italic");
    if (ln.weight && ln.weight !== "400") t.setAttribute("font-weight", ln.weight);
    t.setAttribute("letter-spacing", `${(ln.tracking * ln.fs).toFixed(2)}px`);
    t.setAttribute("fill", ln.color);
    if (shadowId) t.setAttribute("filter", `url(#${shadowId})`);
    if ((lockup.outline || 0) > 0) {
      t.setAttribute("stroke", lockup.outlineColor || "#ffffff");
      t.setAttribute("stroke-width", Math.max(1, lockup.outline * ln.fs).toFixed(2));
      t.setAttribute("stroke-linejoin", "round");
      t.setAttribute("paint-order", "stroke");
    }
    t.textContent = ln.text;
    painter.appendChild(t);
  }

  g.appendChild(painter);
  img.parentNode.replaceChild(g, img);
  return true;
}

export function validateLogoFile(file) {
  if (!file) return { ok: false, error: "No file selected." };
  if (!LOGO_ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: "Unsupported file type. Use PNG, JPG, WebP or SVG." };
  }
  return { ok: true };
}

function byteLengthOfDataUrl(dataUrl) {
  const comma = dataUrl.indexOf(",");
  if (comma < 0) return Infinity;
  return Math.round(((dataUrl.length - comma - 1) * 3) / 4);
}

function dataUrlKb(dataUrl) {
  return Math.max(1, Math.round(byteLengthOfDataUrl(dataUrl) / 1024));
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

async function loadDrawable(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through to a plain <img> decode */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the image."));
    };
    img.src = url;
  });
}

export async function readLogoFile(file) {
  const v = validateLogoFile(file);
  if (!v.ok) return v;
  const huge = file.size > MAX_LOGO_BYTES;
  const isSvg = file.type === "image/svg+xml";
  if (isSvg && !huge) {
    const dataUrl = await fileToDataUrl(file);
    return { ok: true, dataUrl, width: null, height: null, kb: dataUrlKb(dataUrl), svg: true };
  }
  const src = isSvg ? await loadImage(await fileToDataUrl(file)) : await loadDrawable(file);
  const w = src.width || src.naturalWidth || 0;
  const h = src.height || src.naturalHeight || 0;
  if (!huge && w <= MAX_LOGO_DIM && h <= MAX_LOGO_DIM) {
    const dataUrl = await fileToDataUrl(file);
    return { ok: true, dataUrl, width: w, height: h, kb: dataUrlKb(dataUrl), svg: false };
  }
  const scale = Math.min(1, MAX_LOGO_DIM / Math.max(w, h, 1));
  const outW = Math.max(1, Math.round(w * scale));
  const outH = Math.max(1, Math.round(h * scale));
  const c = document.createElement("canvas");
  c.width = outW;
  c.height = outH;
  c.getContext("2d").drawImage(src, 0, 0, outW, outH);
  return fitToBudget(c);
}

function fitToBudget(c) {
  let dataUrl = c.toDataURL("image/png");
  let canvas = c;
  let maxSide = Math.max(c.width, c.height);
  while (byteLengthOfDataUrl(dataUrl) > MAX_LOGO_BYTES && maxSide >= 128) {
    const w2 = Math.max(1, Math.round(canvas.width * 0.75));
    const h2 = Math.max(1, Math.round(canvas.height * 0.75));
    const next = document.createElement("canvas");
    next.width = w2;
    next.height = h2;
    next.getContext("2d").drawImage(canvas, 0, 0, w2, h2);
    dataUrl = next.toDataURL("image/png");
    canvas = next;
    maxSide = Math.max(w2, h2);
  }
  if (byteLengthOfDataUrl(dataUrl) > MAX_LOGO_BYTES) {
    dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  }
  return {
    ok: true,
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    kb: dataUrlKb(dataUrl),
    svg: false,
  };
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("The logo image could not be rendered."));
    img.src = src;
  });
}

function scaleContain(w, h, box) {
  if (!w || !h) return { w: box, h: box };
  const s = Math.min(box / w, box / h);
  return { w: w * s, h: h * s };
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

function platePath(ctx, shape, x, y, size, r) {
  ctx.beginPath();
  if (shape === "circle") ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  else if (shape === "rounded") roundRect(ctx, x, y, size, size, r);
  else ctx.rect(x, y, size, size);
}

export async function composeLogo({
  src,
  shape = "none",
  plateColor = "#ffffff",
  borderWidth = 0,
  borderColor = "#232019",
  padding = 0.04,
  radius = 0.28,
  opacity = 1,
  size = 512,
}) {
  const img = await loadImage(src);
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const bw = Math.max(0, borderWidth);
  // Inset the plate by half the border width so the stroke (centered on the
  // path) lands flush with the canvas edge instead of being cut in two.
  const plateInset = bw > 0 ? bw / 2 : 0;
  const plateSize = size - plateInset * 2;
  const padInset = (Math.min(Math.max(padding, 0), 0.5) * size) / 2;
  const imageInset = Math.max(padInset, plateInset);
  const inner = size - imageInset * 2;
  const r = Math.min(Math.max(radius, 0), 0.5) * plateSize;

  if (shape !== "none") {
    platePath(ctx, shape, plateInset, plateInset, plateSize, r);
    ctx.fillStyle = plateColor;
    ctx.fill();
    ctx.clip();
  }

  const dw = scaleContain(img.width || img.naturalWidth, img.height || img.naturalHeight, inner);
  ctx.globalAlpha = Math.min(1, Math.max(0, opacity));
  ctx.drawImage(img, size / 2 - dw.w / 2, size / 2 - dw.h / 2, dw.w, dw.h);
  ctx.globalAlpha = 1;

  if (shape !== "none" && bw > 0) {
    ctx.lineWidth = bw;
    ctx.strokeStyle = borderColor;
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  return c.toDataURL("image/png");
}

export function logoCoverage(logoSize, moduleCount = 25, ecPct = 0.3) {
  if (!moduleCount || moduleCount <= 0) moduleCount = 25;
  const side = Math.min(
    Math.sqrt(Math.max(logoSize, 0) * ecPct) * moduleCount,
    Math.max(moduleCount - 14, 1),
  );
  return Math.min(1, Math.max(0, side / moduleCount));
}

function svgDataUrl(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const PRESET_SVGS = [
  {
    id: "diamond",
    label: "Diamond",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#232019" d="M24 4 44 24 24 44 4 24 24 4Z"/></svg>`,
  },
  {
    id: "circle",
    label: "Circle",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#232019"/></svg>`,
  },
  {
    id: "square",
    label: "Square",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="36" rx="8" fill="#232019"/></svg>`,
  },
  {
    id: "spark",
    label: "Spark",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#232019" d="M24 4 29 19 44 24 29 29 24 44 19 29 4 24 19 19Z"/></svg>`,
  },
];

export const LOGO_PRESETS = PRESET_SVGS.map((p) => ({ id: p.id, label: p.label, src: svgDataUrl(p.svg) }));