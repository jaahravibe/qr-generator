import { useRef } from "react";
import { ColorField } from "./ColorField.jsx";
import {
  LOGO_FONTS,
  LOGO_PRESETS,
  LOGO_SHAPES,
  LOGO_WEIGHTS,
  LOCKUP_LINE_DEFAULTS,
  TEXT_ALIGN,
  TEXT_CASES,
} from "../lib/logo.js";

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

const pct = (v) => `${Math.round(v * 100)}%`;

function Slider({ id, label, min, max, step, value, onValue, format = String, extra = "" }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} · {format(value)}
        {extra}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValue(Number(e.target.value))}
      />
    </div>
  );
}

function FontGroups({ value, onValue, id }) {
  const groups = LOGO_FONTS.reduce((acc, o) => {
    const last = acc[acc.length - 1];
    if (!last || last.group !== o.group) acc.push({ group: o.group, opts: [o] });
    else last.opts.push(o);
    return acc;
  }, []);
  return (
    <select id={id} value={value} onChange={(e) => onValue(e.target.value)}>
      {groups.map((g) => (
        <optgroup key={g.group} label={g.group}>
          {g.opts.map((o) => (
            <option key={o.v} value={o.v}>
              {o.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

export default function LogoControls({
  logoType,
  onLogoType,
  lockup,
  onLockup,
  logoImg,
  logoMeta,
  onLogoFile,
  onLogoPreset,
  logoError,
  hasLogo,
  logoSize,
  onLogoSize,
  logoStyle,
  onLogoStyle,
  previewColor,
  coveragePct,
}) {
  const fileRef = useRef(null);
  const shape = logoStyle.shape[logoType];

  const line = lockup.lines[0] || {};
  const lineColor = line.color || previewColor;

  function editLine(patch) {
    onLockup({ lines: [{ ...LOCKUP_LINE_DEFAULTS, ...lockup.lines[0], ...patch }] });
  }

  function onFile(e) {
    const file = e.target.files?.[0];
    if (file) onLogoFile(file);
    e.target.value = "";
  }

  return (
    <div className="editor__panel">
      <div className="card__head">
        <span className="panel-label">Badge</span>
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

      {logoError && (
        <div className="alert" role="alert">
          {logoError}
        </div>
      )}

      {logoType === "image" && (
        <div className="logo">
          <div className="logo__presets" role="group" aria-label="Logo presets">
            {LOGO_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="logo__preset"
                title={p.label}
                aria-label={`Use ${p.label} preset`}
                onClick={() => onLogoPreset(p)}
              >
                <img src={p.src} alt={p.label} />
              </button>
            ))}
          </div>
          {logoImg ? (
            <div className="logo__preview">
              <img src={logoImg} alt="Logo preview" />
              <div className="logo__info">
                {logoMeta && (
                  <span className="logo__meta">
                    {logoMeta.width
                      ? `${logoMeta.width}${logoMeta.height ? `×${logoMeta.height}` : ""} · `
                      : ""}
                    {logoMeta.kb} KB
                  </span>
                )}
                <button className="btn btn--ghost btn--sm" type="button" onClick={() => onLogoFile(null)}>
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => fileRef.current?.click()}
            >
              Choose image (PNG, JPG, WebP, SVG)
            </button>
          )}
          <input ref={fileRef} className="visually-hidden" type="file" accept="image/*" onChange={onFile} />
          <p className="hint">Images over 2 MB are downscaled automatically to fit.</p>
        </div>
      )}

      {logoType === "text" && (
        <div className="text-logo">
          <p className="hint">Rendered as the badge in the centre of the code.</p>

          <div className="lockup">
            <div className="field">
              <label htmlFor="logoText0">Wordmark</label>
              <input
                id="logoText0"
                type="text"
                value={line.text}
                maxLength={40}
                placeholder="e.g. YourBrand"
                onChange={(e) => editLine({ text: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="lineFont0">Font</label>
              <FontGroups value={line.family} onValue={(v) => editLine({ family: v })} id="lineFont0" />
            </div>
            <div className="grid2">
              <div>
                <span className="color-label">Weight</span>
                <Segmented
                  value={line.weight}
                  onChange={(v) => editLine({ weight: v })}
                  options={LOGO_WEIGHTS}
                />
              </div>
              <div>
                <span className="color-label">Style</span>
                <Segmented
                  value={line.italic ? "italic" : "normal"}
                  onChange={(v) => editLine({ italic: v === "italic" })}
                  options={[
                    { v: "normal", label: "Normal" },
                    { v: "italic", label: "Italic" },
                  ]}
                />
              </div>
            </div>
            <div className="sub__row">
              <span className="sub__label">Text size</span>
              <Segmented
                value={line.size === "auto" ? "auto" : "custom"}
                onChange={(v) => editLine({ size: v === "auto" ? "auto" : 0.3 })}
                options={[
                  { v: "auto", label: "Auto" },
                  { v: "custom", label: "Custom" },
                ]}
              />
            </div>
            {line.size !== "auto" && (
              <Slider
                id="lineSize0"
                label="Size"
                min={0.18}
                max={0.5}
                step={0.01}
                value={line.size}
                onValue={(v) => editLine({ size: v })}
                format={pct}
              />
            )}
            <div className="grid2">
              <div className="field">
                <label htmlFor="lineCase0">Capitalization</label>
                <select
                  id="lineCase0"
                  value={line.case}
                  onChange={(e) => editLine({ case: e.target.value })}
                >
                  {TEXT_CASES.map((o) => (
                    <option key={o.v} value={o.v}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <Slider
                id="lineTrack0"
                label="Tracking"
                min={0}
                max={0.2}
                step={0.01}
                value={line.tracking}
                onValue={(v) => editLine({ tracking: v })}
                format={(v) => `+${v.toFixed(2)}`}
              />
            </div>
            <div className="sub__row">
              <span className="sub__label">Text color</span>
              <ColorField
                label="Text color"
                value={lineColor}
                onChange={(v) => editLine({ color: v })}
              />
            </div>
          </div>

          <div className="sub">
            <div className="sub__row">
              <span className="sub__label">Align</span>
              <Segmented
                value={lockup.align || "center"}
                onChange={(v) => onLockup({ align: v })}
                options={TEXT_ALIGN}
              />
            </div>
          </div>

          <div className="sub">
            <div className="sub__row">
              <span className="sub__label">Outline</span>
              <Segmented
                value={(lockup.outline || 0) > 0 ? "on" : "off"}
                onChange={(v) => onLockup({ outline: v === "on" ? 0.06 : 0 })}
                options={[
                  { v: "off", label: "Off" },
                  { v: "on", label: "On" },
                ]}
              />
            </div>
            {(lockup.outline || 0) > 0 && (
              <>
                <Slider
                  id="lockupOutline"
                  label="Outline width"
                  min={0.02}
                  max={0.16}
                  step={0.01}
                  value={lockup.outline}
                  onValue={(v) => onLockup({ outline: v })}
                  format={(v) => `${Math.round(v * 100)}%`}
                />
                <div className="sub__row">
                  <span className="sub__label">Outline color</span>
                  <ColorField
                    label="Outline color"
                    value={lockup.outlineColor || "#ffffff"}
                    onChange={(v) => onLockup({ outlineColor: v })}
                  />
                </div>
              </>
            )}
            <div className="sub__row">
              <span className="sub__label">Shadow</span>
              <Segmented
                value={(lockup.shadow || 0) > 0 ? "on" : "off"}
                onChange={(v) => onLockup({ shadow: v === "on" ? 4 : 0 })}
                options={[
                  { v: "off", label: "Off" },
                  { v: "on", label: "On" },
                ]}
              />
            </div>
            {(lockup.shadow || 0) > 0 && (
              <>
                <Slider
                  id="lockupShadow"
                  label="Shadow blur"
                  min={1}
                  max={14}
                  step={1}
                  value={lockup.shadow}
                  onValue={(v) => onLockup({ shadow: v })}
                  extra=" px"
                />
                <div className="sub__row">
                  <span className="sub__label">Shadow color</span>
                  <ColorField
                    label="Shadow color"
                    value={lockup.shadowColor || "#000000"}
                    onChange={(v) => onLockup({ shadowColor: v })}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {hasLogo && (
        <>
          <div className="sub">
            <div className="sub__row">
              <span className="sub__label">Plate</span>
              <Segmented
                value={shape}
                onChange={(v) => onLogoStyle({ shape: { ...logoStyle.shape, [logoType]: v } })}
                options={LOGO_SHAPES}
              />
            </div>
            {shape !== "none" && (
              <>
                <div className="sub__row">
                  <span className="sub__label">Plate color</span>
                  <ColorField label="Plate color" value={logoStyle.plateColor} onChange={(v) => onLogoStyle({ plateColor: v })} />
                </div>
                {shape === "rounded" && (
                  <Slider
                    id="logoRadius"
                    label="Corner radius"
                    min={0.08}
                    max={0.5}
                    step={0.01}
                    value={logoStyle.radius}
                    onValue={(v) => onLogoStyle({ radius: v })}
                    format={pct}
                  />
                )}
                <div className="sub__row">
                  <span className="sub__label">Border</span>
                  <ColorField label="Border color" value={logoStyle.borderColor} onChange={(v) => onLogoStyle({ borderColor: v })} />
                </div>
                <Slider
                  id="logoBorder"
                  label="Border width"
                  min={0}
                  max={16}
                  step={1}
                  value={logoStyle.borderWidth}
                  onValue={(v) => onLogoStyle({ borderWidth: v })}
                  extra=" px"
                />
              </>
            )}
          </div>

          <div className="sub">
            <Slider
              id="logoPad"
              label="Padding"
              min={0}
              max={0.25}
              step={0.01}
              value={logoStyle.padding}
              onValue={(v) => onLogoStyle({ padding: v })}
              format={pct}
            />
            <Slider
              id="logoOpacity"
              label="Opacity"
              min={0.2}
              max={1}
              step={0.05}
              value={logoStyle.opacity}
              onValue={(v) => onLogoStyle({ opacity: v })}
              format={pct}
            />
          </div>
        </>
      )}

      {hasLogo && (
        <div className="sub">
          <Slider
            id="logoSize"
            label="Badge size"
            min={0.18}
            max={0.5}
            step={0.01}
            value={logoSize}
            onValue={onLogoSize}
            format={pct}
            extra={` · covers ~${Math.max(1, Math.round(coveragePct * 100))}% of width`}
          />
          {coveragePct >= 0.35 && (
            <p className="hint hint--warn">Large badges hide more data — test the scan before exporting.</p>
          )}
        </div>
      )}
    </div>
  );
}