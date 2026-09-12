import { useRef } from "react";

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

export default function LogoControls({
  logoType,
  onLogoType,
  logoTxt,
  onLogoTxt,
  logoImg,
  onLogoImg,
  logoSize,
  onLogoSize,
  caption,
  onCaption,
  previewColor,
}) {
  const fileRef = useRef(null);

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onLogoImg(String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <section className="card">
      <div className="card__head">
        <h2 className="card__title">Logo &amp; caption</h2>
        <Segmented
          value={logoType}
          onChange={onLogoType}
          options={[
            { v: "none", label: "None" },
            { v: "image", label: "Image" },
            { v: "text", label: "Text" },
          ]}
        />
      </div>

      {logoType === "image" && (
        <div className="logo">
          {logoImg ? (
            <div className="logo__preview">
              <img src={logoImg} alt="Logo preview" />
              <button className="btn btn--ghost btn--sm" type="button" onClick={() => onLogoImg("")}>
                Remove
              </button>
            </div>
          ) : (
            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => fileRef.current?.click()}
            >
              Choose image (PNG, JPG, SVG)
            </button>
          )}
          <input ref={fileRef} className="visually-hidden" type="file" accept="image/*" onChange={onFile} />
        </div>
      )}

      {logoType === "text" && (
        <div className="field">
          <label htmlFor="logoText">Wordmark</label>
          <input
            id="logoText"
            type="text"
            value={logoTxt}
            maxLength={24}
            placeholder="e.g. YourBrand"
            onChange={(e) => onLogoTxt(e.target.value)}
          />
          {logoTxt.trim() && (
            <span
              className="logo__chip"
              style={{ color: previewColor, borderColor: `color-mix(in srgb, ${previewColor} 35%, transparent)` }}
            >
              {logoTxt.trim()}
            </span>
          )}
          <p className="hint">Rendered as the badge in the centre of the code.</p>
        </div>
      )}

      <div className="field">
        <label htmlFor="caption">Caption below code · optional</label>
        <input
          id="caption"
          type="text"
          value={caption}
          maxLength={120}
          placeholder="e.g. Scan to open our menu"
          onChange={(e) => onCaption(e.target.value)}
        />
        <p className="hint">Included in PNG and SVG exports.</p>
      </div>

      {logoType !== "none" && (
        <div className="field">
          <label htmlFor="logoSize">Badge size · {Math.round(logoSize * 100)}%</label>
          <input
            id="logoSize"
            type="range"
            min={0.18}
            max={0.5}
            step={0.01}
            value={logoSize}
            onChange={(e) => onLogoSize(Number(e.target.value))}
          />
        </div>
      )}
    </section>
  );
}