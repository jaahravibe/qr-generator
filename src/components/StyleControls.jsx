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

function ColorRow({ label, value, onChange, second, onSecondChange }) {
  return (
    <div>
      <span className="color-label">{label}</span>
      <div className="grid2">
        <div className="color">
          <input
            className="color__swatch"
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} primary`}
          />
          <input
            className="color__hex"
            type="text"
            value={value}
            spellCheck={false}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${label} primary hex`}
          />
        </div>
        {second !== undefined && onSecondChange !== undefined && (
          <div className="color">
            <input
              className="color__swatch"
              type="color"
              value={second}
              onChange={(e) => onSecondChange(e.target.value)}
              aria-label={`${label} secondary`}
            />
            <input
              className="color__hex"
              type="text"
              value={second}
              spellCheck={false}
              onChange={(e) => onSecondChange(e.target.value)}
              aria-label={`${label} secondary hex`}
            />
          </div>
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
    <section className="card">
      <h2 className="card__title">Style</h2>

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
          <div className="color">
            <input
              className="color__swatch"
              id="cornerColor"
              type="color"
              value={cornerColor}
              onChange={(e) => onCornerColor(e.target.value)}
            />
            <input
              className="color__hex"
              type="text"
              value={cornerColor}
              spellCheck={false}
              onChange={(e) => onCornerColor(e.target.value)}
            />
          </div>
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
    </section>
  );
}