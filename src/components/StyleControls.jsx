import { useRef } from "react";
import { ColorRow } from "./ColorField.jsx";
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