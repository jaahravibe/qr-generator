import { describe, it, expect } from "vitest";
import {
  buildQROptions,
  qrGrid,
  qrMeta,
  EC_CAPACITY,
  EC_LEVELS,
  MAX_VERSION,
} from "../qr.js";

describe("qrGrid", () => {
  it("computes module counts from versions", () => {
    expect(qrGrid(1)).toBe(21);
    expect(qrGrid(40)).toBe(17 + 4 * 40);
  });
});

describe("qrMeta", () => {
  it("returns null for an empty payload", () => {
    expect(qrMeta("", "H", 0)).toBeNull();
  });

  it("reports the required version by default", () => {
    const m = qrMeta("https://example.com", "H", 0);
    expect(m).not.toBeNull();
    expect(m.moduleCount).toBe(qrGrid(m.version));
    expect(m.fits).toBe(true);
  });

  it("flags a forced version too small for the payload", () => {
    const m = qrMeta(Array.from({ length: 600 }, () => "x").join(""), "H", 1);
    expect(m.fits).toBe(false);
  });
});

describe("buildQROptions", () => {
  const base = { payload: "hi", ecLevel: "Q", size: 512, margin: 8, logoSize: 0.35 };

  it("passes the logo and image options when a logo url exists", () => {
    const o = buildQROptions({ ...base, logoUrl: "data:image/png;base64,AA==", logoMargin: 8 });
    expect(o.image).toBe("data:image/png;base64,AA==");
    expect(o.imageOptions).toMatchObject({
      imageSize: 0.35,
      margin: 8,
      hideBackgroundDots: true,
      saveAsBlob: true,
    });
  });

  it("omits the image when there is no logo", () => {
    const o = buildQROptions({ ...base });
    expect(o.image).toBeUndefined();
  });

  it("lays the logo margin default back to 8px when absent", () => {
    const o = buildQROptions({ ...base, logoUrl: "data:image/png;base64,AA==" });
    expect(o.imageOptions.margin).toBe(8);
  });

  it("wires QR-level options through", () => {
    const o = buildQROptions({ ...base, version: 5, margin: 12 });
    expect(o.qrOptions).toMatchObject({ errorCorrectionLevel: "Q", typeNumber: 5 });
    expect(o.margin).toBe(12);
  });

  it("builds dot gradients when configured", () => {
    const o = buildQROptions({ ...base, fgType: "gradient", fgColor: "#000000", fgColor2: "#4f46e5" });
    expect(o.dotsOptions.gradient.colorStops).toEqual([
      { offset: 0, color: "#000000" },
      { offset: 1, color: "#4f46e5" },
    ]);
  });
});

describe("ec capacity reference", () => {
  it("lists all four levels with the expected byte budgets", () => {
    expect(EC_LEVELS).toEqual(["L", "M", "Q", "H"]);
    expect(EC_CAPACITY).toEqual({ L: 2953, M: 2331, Q: 1663, H: 1273 });
    expect(MAX_VERSION).toBe(40);
  });
});