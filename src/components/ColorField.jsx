import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

export function ColorField({ label, value, onChange }) {
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

export function ColorRow({ label, value, onChange, second, onSecondChange }) {
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