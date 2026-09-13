import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { CORNER_STYLES, DOT_STYLES } from "../lib/qr.js";

function Segmented({ value, onChange, options }) {
  return (
    <div className="seg" role="group">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          className={value === o.v ? "active" : ""}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    let raf = 0;
    const compute = () => {
      const btn = btnRef.current;
      const pop = popRef.current;
      if (!btn || !pop) return;
      const r = btn.getBoundingClientRect();
      const pw = pop.offsetWidth;
      const ph = pop.offsetHeight;
      const gap = 8;
      const below = window.innerHeight - r.bottom;
      const up = below < ph + gap && r.top > below;
      const left = Math.min(Math.max(8, r.left), Math.max(8, window.innerWidth - pw - 8));
      setPos({ up, left, top: r.bottom + gap, bottom: window.innerHeight - r.top + gap });
    };
    compute();
    const onMove = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  return (
    <div className="color" ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        className="color__swatch"
        style={{ background: value }}
        onClick={() => {
          setPos(null);
          setOpen((o) => !o);
        }}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="true"
      />
      {open && (
        <div
          ref={popRef}
          className={`color__popup${pos && pos.up ? " color__popup--up" : ""}`}
          style={
            pos
              ? { left: pos.left, top: pos.up ? undefined : pos.top, bottom: pos.up ? pos.bottom : undefined }
              : undefined
          }
        >
          <HexColorPicker color={value} onChange={onChange} />
        </div>
      )}
      <input
        className="color__hex"
        type="text"
        value={value}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} hex`}
      />
    </div>
  );
}

function ColorRow({ label, value, onChange, second, onSecondChange }) {
  return (
    <div>
      <span className="color-label">{label}</span>
      <div className="grid2">
        <ColorField label={`${label} primary`} value={value} onChange={onChange} />
        {second !== undefined && onSecondChange !== undefined && (
          <ColorField label={`${label} secondary`} value={second} onChange={onSecondChange} />
        )}
      </div>
    </div>
  );
}

export default function StyleControls({
  fgType,
  onFgType,
  fgColor,
  onFgColor,
  fgColor2,
  onFgColor2,
  bgType,
  onBgType,
  bgColor,
  onBgColor,
  bgColor2,
  onBgColor2,
  dotStyle,
  onDotStyle,
  cornerStyle,
  onCornerStyle,
  cornerColor,
  onCornerColor,
}) {
  return (
    <div className="editor__panel">
      <div className="field">
        <label htmlFor="dot">Dot style</label>
        <select id="dot" value={dotStyle} onChange={(e) => onDotStyle(e.target.value)}>
          {DOT_STYLES.map((o) => (
            <option key={o.v} value={o.v}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid2">
        <div className="field">
          <label htmlFor="corner">Corner style</label>
          <select id="corner" value={cornerStyle} onChange={(e) => onCornerStyle(e.target.value)}>
            {CORNER_STYLES.map((o) => (
              <option key={o.v} value={o.v}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cornerColor">Corner color</label>
          <ColorField label="Corner color" value={cornerColor} onChange={onCornerColor} />
        </div>
      </div>

      <div className="sub">
        <div className="sub__row">
          <span className="sub__label">Modules</span>
          <Segmented
            value={fgType}
            onChange={onFgType}
            options={[
              { v: "solid", label: "Solid" },
              { v: "gradient", label: "Gradient" },
            ]}
          />
        </div>
        <ColorRow label="Modules color" value={fgColor} onChange={onFgColor} second={fgType === "gradient" ? fgColor2 : undefined} onSecondChange={onFgColor2} />
      </div>

      <div className="sub">
        <div className="sub__row">
          <span className="sub__label">Background</span>
          <Segmented
            value={bgType}
            onChange={onBgType}
            options={[
              { v: "solid", label: "Solid" },
              { v: "gradient", label: "Gradient" },
            ]}
          />
        </div>
        <ColorRow label="Background color" value={bgColor} onChange={onBgColor} second={bgType === "gradient" ? bgColor2 : undefined} onSecondChange={onBgColor2} />
      </div>
    </div>
  );
}