import { describe, it, expect } from "vitest";
import {
  validateLogoFile,
  logoCoverage,
  readLogoFile,
  LOGO_PRESETS,
  LOGO_SHAPES,
  LOGO_FONTS,
  LOGO_FONT_STACKS,
  LOGO_WEIGHTS,
  LOGO_ALLOWED_TYPES,
  MAX_LOGO_BYTES,
  MAX_LOGO_DIM,
} from "../logo.js";

function makeFile({ type = "image/png", size = 1024 } = {}) {
  return { type, size };
}

describe("validateLogoFile", () => {
  it("accepts an allowed type within the size limit", () => {
    expect(validateLogoFile(makeFile())).toEqual({ ok: true });
  });

  it("rejects a missing file", () => {
    expect(validateLogoFile(null).ok).toBe(false);
    expect(validateLogoFile(undefined).ok).toBe(false);
  });

  it("rejects unsupported types", () => {
    for (const type of ["text/plain", "application/pdf", "image/gif"]) {
      expect(validateLogoFile(makeFile({ type })).ok).toBe(false);
    }
  });

  it("accepts allowed types regardless of file size (downscaling handles it)", () => {
    expect(validateLogoFile(makeFile({ size: MAX_LOGO_BYTES + 1 })).ok).toBe(true);
    expect(validateLogoFile(makeFile({ size: MAX_LOGO_BYTES * 8 })).ok).toBe(true);
  });

  it("covers the documented allowlist", () => {
    expect(LOGO_ALLOWED_TYPES).toEqual(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);
  });
});

describe("logoCoverage", () => {
  it("returns the side-fraction implied by area vs EC budget", () => {
    // side ≈ sqrt(logoSize * ecPct), at H (0.30)
    const got = logoCoverage(0.35, 25);
    expect(got).toBeCloseTo(Math.sqrt(0.35 * 0.3));
  });

  it("respects the finder-pattern cap", () => {
    const capped = logoCoverage(1, 25);
    expect(capped).toBeLessThanOrEqual(1);
    // cap = (N - 14) / N
    expect(capped).toBeCloseTo(11 / 25);
  });

  it("is module-count independent below the finder cap", () => {
    const small = logoCoverage(0.35, 21);
    const big = logoCoverage(0.35, 33);
    expect(big).toBeCloseTo(small);
  });

  it("grows with moduleCount once the finder cap binds", () => {
    // cap = (N - 14) / N: 7/21 for N=21 vs 19/33 for N=33
    expect(logoCoverage(1, 33)).toBeGreaterThan(logoCoverage(1, 21));
  });

  it("honours a custom EC percentage", () => {
    expect(logoCoverage(0.35, 25, 0.15)).toBeCloseTo(Math.sqrt(0.35 * 0.15));
  });

  it("clamps invalid sizes to 0..1", () => {
    expect(logoCoverage(-1, 25)).toBe(0);
    expect(logoCoverage(2, 25)).toBeLessThanOrEqual(1);
    expect(logoCoverage(0.35, 0)).toBeGreaterThan(0);
  });
});

describe("readLogoFile", () => {
  it("rejects an unsupported type early", async () => {
    const res = await readLogoFile(makeFile({ type: "text/html" }));
    expect(res.ok).toBe(false);
  });
});

describe("logo catalog", () => {
  it("exposes plate shape options", () => {
    expect(LOGO_SHAPES.map((s) => s.v)).toEqual(["none", "circle", "rounded", "square"]);
  });

  it("exposes data-URL logo presets", () => {
    expect(LOGO_PRESETS.length).toBeGreaterThanOrEqual(3);
    for (const p of LOGO_PRESETS) {
      expect(p.id).toBeTruthy();
      expect(p.label).toBeTruthy();
      expect(p.src.startsWith("data:image/svg+xml,")).toBe(true);
    }
  });

  it("keeps the max downloaded dimension sane", () => {
    expect(MAX_LOGO_DIM).toBe(512);
  });
});

describe("logo fonts", () => {
  it("exposes font family options with matching stacks", () => {
    expect(LOGO_FONTS.length).toBeGreaterThan(20);
    const groups = [...new Set(LOGO_FONTS.map((f) => f.group))];
    expect(groups).toEqual(expect.arrayContaining(["Sans", "Serif", "Monospace", "Script", "Display"]));
    for (const f of LOGO_FONTS) {
      expect(LOGO_FONT_STACKS[f.v]).toBeTruthy();
      expect(LOGO_FONT_STACKS[f.v]).toContain(",");
    }
    expect(LOGO_FONT_STACKS.sans).toContain("Inter");
    expect(LOGO_FONT_STACKS.comic).toContain("Comic Neue");
    expect(LOGO_FONT_STACKS.mono).toContain("JetBrains Mono");
    expect(LOGO_FONT_STACKS.display).toContain("Space Grotesk");
  });

  it("exposes weight tiers", () => {
    expect(LOGO_WEIGHTS.map((w) => w.v)).toEqual(["400", "600", "700"]);
  });
});