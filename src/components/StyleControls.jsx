import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { CORNER_FILLS, CORNER_STYLES, DOT_STYLES } from "../lib/qr.js";

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

function ImageField({ value, onChange, alt, hint }) {
  const fileRef = useRef(null);

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="logo">
      {value ? (
        <div className="logo__preview">
          <img src={value} alt={alt} />
          <button className="btn btn--ghost btn--sm" type="button" onClick={() => onChange("")}>
            Remove
          </button>
        </div>
      ) : (
        <button className="btn btn--ghost" type="button" onClick={() => fileRef.current?.click()}>
          Choose image (PNG, JPG, SVG)
        </button>
      )}
      <input ref={fileRef} className="visually-hidden" type="file" accept="image/*" onChange={onFile} />
      {hint && <p className="hint">{hint}</p>}
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
  inkImg,
  onInkImg,
  bgType,
  onBgType,
  bgColor,
  onBgColor,
  bgColor2,
  onBgColor2,
  bgImg,
  onBgImg,
  dotStyle,
  onDotStyle,
  cornerStyle,
  onCornerStyle,
  cornerFill,
  onCornerFill,
  cornerColor,
  onCornerColor,
  cornerColor2,
  onCornerColor2,
  cornerImg,
  onCornerImg,
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
          {cornerStyle === "" ? (
            <p className="hint">Corners follow the ink color until you pick a corner style.</p>
          ) : (
            <p className="hint">Apply a solid, gradient or image fill to the finder patterns below.</p>
          )}
        </div>
      </div>

      {cornerStyle !== "" && (
        <div className="sub">
          <div className="sub__row">
            <span className="sub__label">Corner fill</span>
            <Segmented value={cornerFill} onChange={onCornerFill} options={CORNER_FILLS} />
          </div>
          {cornerFill === "image" ? (
            <ImageField
              value={cornerImg}
              onChange={onCornerImg}
              alt="Corner image preview"
              hint="The image fills the finder patterns in the three corners."
            />
          ) : (
            <ColorRow
              label="Corner color"
              value={cornerColor}
              onChange={onCornerColor}
              second={cornerFill === "gradient" ? cornerColor2 : undefined}
              onSecondChange={onCornerColor2}
            />
          )}
        </div>
      )}

      <div className="sub">
        <div className="sub__row">
          <span className="sub__label">Ink</span>
          <Segmented
            value={fgType}
            onChange={onFgType}
            options={[
              { v: "solid", label: "Solid" },
              { v: "gradient", label: "Gradient" },
              { v: "image", label: "Image" },
            ]}
          />
        </div>
        {fgType === "image" ? (
          <ImageField
            value={inkImg}
            onChange={onInkImg}
            alt="Ink image preview"
            hint="The image fills the dark modules. High-contrast images scan best."
          />
        ) : (
          <ColorRow label="Ink color" value={fgColor} onChange={onFgColor} second={fgType === "gradient" ? fgColor2 : undefined} onSecondChange={onFgColor2} />
        )}
      </div>

      <div className="sub">
        <div className="sub__row">
          <span className="sub__label">Paper</span>
          <Segmented
            value={bgType}
            onChange={onBgType}
            options={[
              { v: "solid", label: "Solid" },
              { v: "gradient", label: "Gradient" },
              { v: "image", label: "Image" },
            ]}
          />
        </div>
        {bgType === "image" ? (
          <ImageField
            value={bgImg}
            onChange={onBgImg}
            alt="Paper image preview"
            hint="The image fills the paper around the code."
          />
        ) : (
          <ColorRow label="Paper color" value={bgColor} onChange={onBgColor} second={bgType === "gradient" ? bgColor2 : undefined} onSecondChange={onBgColor2} />
        )}
      </div>
    </div>
  );
}