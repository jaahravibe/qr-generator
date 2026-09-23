import { describe, it, expect } from "vitest";
import {
  layoutLockup,
  drawLockup,
  applyTextCase,
  trackedWidth,
  logoBoxPx,
  TEXT_ALIGN,
  TEXT_CASES,
  LOCKUP_LINE_DEFAULTS,
  DEFAULT_TEXT_LOCKUP,
} from "../logo.js";

const measure = (text, fs) => text.length * fs * 0.6;
const metrics = (fs) => ({ ascent: fs * 0.75, descent: fs * 0.25 });

function baseLine(over = {}) {
  return { text: "Hello", size: "auto", ...over };
}

describe("applyTextCase", () => {
  it("passes text through unchanged when case is none", () => {
    expect(applyTextCase("Acme Co", "none")).toBe("Acme Co");
    expect(applyTextCase("Acme Co", undefined)).toBe("Acme Co");
  });

  it("uppercases text", () => {
    expect(applyTextCase("acme co", "upper")).toBe("ACME CO");
  });

  it("title-cases words", () => {
    expect(applyTextCase("acme brand co", "title")).toBe("Acme Brand Co");
  });
});

describe("trackedWidth", () => {
  it("adds per-character letter spacing", () => {
    expect(trackedWidth("hi", 100, 0.1, measure)).toBeCloseTo(120 + 10);
    expect(trackedWidth("hi", 100, 0, measure)).toBeCloseTo(120);
  });
});

describe("layoutLockup", () => {
  it("returns no lines for an empty lockup", () => {
    const out = layoutLockup({ box: { w: 360, h: 360 }, lines: [], measure, metrics });
    expect(out.lines).toEqual([]);
  });

  it("skips empty config lines", () => {
    const out = layoutLockup({
      box: { w: 360, h: 360 },
      lines: [baseLine(), baseLine({ text: "" })],
      measure,
      metrics,
    });
    expect(out.lines).toHaveLength(1);
    expect(out.lines[0].text).toBe("Hello");
  });

  it("auto-fit clamps to the max size when text is short", () => {
    const out = layoutLockup({
      box: { w: 360, h: 360 },
      lines: [baseLine({ text: "Hi" })],
      measure,
      metrics,
      maxSize: 200,
    });
    expect(out.lines).toHaveLength(1);
    expect(out.lines[0].fs).toBe(200);
  });

  it("wraps a long phrase across multiple visual lines", () => {
    const out = layoutLockup({
      box: { w: 100, h: 200 },
      lines: [baseLine({ text: "aaa bbb ccc" })],
      measure,
      metrics,
    });
    expect(out.lines.map((l) => l.text)).toEqual(["aaa", "bbb", "ccc"]);
  });

  it("keeps an unbreakable word on one line at the smallest size", () => {
    const out = layoutLockup({
      box: { w: 100, h: 200 },
      lines: [baseLine({ text: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" })],
      measure,
      metrics,
    });
    expect(out.lines).toHaveLength(1);
    expect(out.lines[0].fs).toBe(12);
  });

  it("shrinks auto size under tracking", () => {
    const make = (tracking) =>
      layoutLockup({
        box: { w: 100, h: 200 },
        lines: [baseLine({ text: "aaaaaaaa", tracking })],
        measure,
        metrics,
      });
    const loose = make(0);
    const tight = make(0.1);
    expect(loose.lines[0].fs).toBe(18);
    expect(tight.lines[0].fs).toBeLessThan(loose.lines[0].fs);
  });

  it("centers ink optically using font metrics", () => {
    const out = layoutLockup({
      box: { w: 360, h: 360 },
      lines: [baseLine({ text: "Hiiii", size: 0.2 })],
      measure,
      metrics,
    });
    expect(out.lines[0].fs).toBe(72);
    const asc = 54;
    const lh = 72 * 1.2;
    const blockTop = (360 - lh) / 2;
    expect(out.lines[0].baseline).toBeCloseTo(blockTop + (lh - 72) / 2 + asc);
  });

  it("rescales all lines proportionally to fit the height budget", () => {
    const out = layoutLockup({
      box: { w: 360, h: 360 },
      lines: [baseLine({ text: "aa", size: 0.45 }), baseLine({ text: "bb", size: 0.45 })],
      measure,
      metrics,
    });
    expect(out.lines).toHaveLength(2);
    expect(out.lines[0].fs).toBe(138);
    expect(out.blockH / (360 * 0.92)).toBeCloseTo(1);
  });

  it("budgets height by wrapped segments so a second line stays visible", () => {
    const box = { w: 360, h: 360 };
    const out = layoutLockup({
      box,
      lines: [
        { text: "A Very Long Brand Name That Wraps Onto Lines", size: "auto" },
        { text: "with a second line", size: "auto" },
      ],
      measure,
      metrics,
      maxSize: 120,
    });
    expect(out.lines.length).toBeGreaterThanOrEqual(3);
    const drawn = out.lines.reduce((sum, l) => sum + l.lineH, 0);
    expect(drawn).toBeLessThanOrEqual(box.h * 0.92 + 1e-6);
    expect(out.blockH).toBeCloseTo(drawn);
    const bottom = out.lines[out.lines.length - 1].boxTop + out.lines[out.lines.length - 1].lineH;
    expect(bottom).toBeLessThanOrEqual(box.h);
  });

  it("vertically centers the wrapped block inside the box", () => {
    const box = { w: 360, h: 360 };
    const out = layoutLockup({
      box,
      lines: [{ text: "aa", size: "auto" }, { text: "bb cc dd", size: "auto" }],
      measure,
      metrics,
      maxSize: 120,
    });
    const drawn = out.lines.reduce((sum, l) => sum + l.lineH, 0);
    expect(out.lines[0].boxTop).toBeCloseTo((box.h - drawn) / 2);
  });

  it("aligns lines left, center and right", () => {
    const right = layoutLockup({
      box: { w: 360, h: 360 },
      lines: [baseLine()],
      measure,
      metrics,
      align: "right",
    });
    expect(right.lines[0].textAlign).toBe("right");
    expect(right.lines[0].x).toBe(360);

    const left = layoutLockup({
      box: { w: 360, h: 360 },
      lines: [baseLine()],
      measure,
      metrics,
      align: "left",
    });
    expect(left.lines[0].textAlign).toBe("left");
    expect(left.lines[0].x).toBe(0);
  });
});

describe("logoBoxPx", () => {
  it("computes the centered box accounting for scale and margin", () => {
    const box = logoBoxPx(512, 0.25, { margin: 8, scale: 2 });
    expect(box.x).toBe(368);
    expect(box.w).toBe(288);
  });

  it("stays inside the canvas", () => {
    const box = logoBoxPx(512, 0.9, { margin: 0 });
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.w).toBeLessThanOrEqual(512);
  });
});

describe("lockup constants", () => {
  it("exposes align and case options", () => {
    expect(TEXT_ALIGN.map((o) => o.v)).toEqual(["left", "center", "right"]);
    expect(TEXT_CASES.map((o) => o.v)).toEqual(["none", "upper", "title"]);
  });

  it("defaults a line to auto size, sans, bold, no tracking", () => {
    expect(LOCKUP_LINE_DEFAULTS).toMatchObject({
      family: "sans",
      weight: "700",
      italic: false,
      size: "auto",
      tracking: 0,
      case: "none",
    });
    expect(DEFAULT_TEXT_LOCKUP.align).toBe("center");
    expect(DEFAULT_TEXT_LOCKUP.lines).toHaveLength(1);
  });

  it("drawLockup degrades cleanly with an empty layout", () => {
    const ctx = {
      save() {},
      restore() {},
      lines: [],
    };
    expect(() => drawLockup(ctx, { lines: [] })).not.toThrow();
  });
});