import { useState } from "react";
import { PRESET_ORDER, PRESETS, CUSTOM_TYPES, blankField } from "../lib/presets.js";
import { EC_LEVELS, MAX_VERSION } from "../lib/qr.js";
import { copyText } from "../lib/qr.js";

function Field({ field, value, onChange }) {
  const common = {
    id: `f-${field.key}`,
    placeholder: field.placeholder || "",
    value,
    onChange: (e) => onChange(field.key, e.target.value),
  };
  switch (field.type) {
    case "textarea":
      return <textarea rows={field.rows || 3} {...common} />;
    case "select":
      return (
        <select {...common}>
          {field.options.map((o) => (
            <option key={o.v} value={o.v}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "number":
      return <input type="number" step={field.step || "any"} {...common} />;
    case "datetime":
      return <input type="datetime-local" {...common} />;
    case "password":
      return <input type="password" autoComplete="off" {...common} />;
    case "url":
      return <input type="url" spellCheck={false} {...common} />;
    case "email":
      return <input type="email" {...common} />;
    case "tel":
      return <input type="tel" {...common} />;
    case "date":
      return <input type="date" {...common} />;
    case "time":
      return <input type="time" {...common} />;
    default:
      return <input type="text" spellCheck={false} {...common} />;
  }
}

function Payload({ payload }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const ok = await copyText(payload);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <details className="raw">
      <summary>
        <span className="raw__chevron" aria-hidden="true" />
        Generated payload
      </summary>
      <div className="raw__body">
        <pre>{payload}</pre>
        <div className="raw__actions">
          <button className="btn btn--sm" type="button" onClick={onCopy}>
            {copied ? "Copied" : "Copy payload"}
          </button>
        </div>
      </div>
    </details>
  );
}

export default function Controls({
  preset,
  presetDef,
  onPreset,
  vals,
  onVal,
  payload,
  bytes,
  capacity,
  overflow,
  ecLevel,
  onEcLevel,
  forcedH,
  version,
  onVersion,
  meta,
  versionTooSmall,
  size,
  onSize,
  margin,
  onMargin,
}) {
  const pct = capacity ? Math.min(100, Math.round((bytes / capacity) * 100)) : 0;

  const customFields = vals.fields || [];

  function updateRow(i, patch) {
    onVal("fields", customFields.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function removeRow(i) {
    onVal("fields", customFields.filter((_, idx) => idx !== i));
  }

  function addRow() {
    onVal("fields", [...customFields, blankField()]);
  }

  return (
    <div className="editor__panel">
      <div className="card__head">
        <label className="panel-label" htmlFor="preset">
          Type
        </label>
        <select
          id="preset"
          className="preset"
          value={preset}
          onChange={(e) => onPreset(e.target.value)}
          aria-label="Type of content"
        >
          {PRESET_ORDER.map((id) => (
            <option key={id} value={id}>
              {PRESETS[id].label}
            </option>
          ))}
        </select>
      </div>

      {presetDef.dynamic ? (
        <div className="custom">
          {customFields.map((row, i) => (
            <div className="custom-row" key={row.id}>
              <input
                className="custom-row__label"
                placeholder="Label"
                aria-label="Field label"
                value={row.label}
                onChange={(e) => updateRow(i, { label: e.target.value })}
              />
              <select
                className="custom-row__type"
                aria-label="Field type"
                value={row.type}
                onChange={(e) => updateRow(i, { type: e.target.value })}
              >
                {CUSTOM_TYPES.map((t) => (
                  <option key={t.v} value={t.v}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                className="custom-row__value"
                type={(CUSTOM_TYPES.find((t) => t.v === row.type) || CUSTOM_TYPES[0]).inputType}
                placeholder="Value"
                aria-label={`Value for ${row.label.trim() || `field ${i + 1}`}`}
                value={row.value}
                onChange={(e) => updateRow(i, { value: e.target.value })}
              />
              <button
                className="btn btn--sm custom-row__remove"
                type="button"
                aria-label="Remove field"
                title="Remove field"
                onClick={() => removeRow(i)}
              >
                ×
              </button>
            </div>
          ))}
          <button className="btn btn--sm add-field" type="button" onClick={addRow}>
            + Add field
          </button>
        </div>
      ) : (
        <div className="fields">
          {presetDef.fields.map((f) => (
            <div className="field" key={f.key}>
              <label htmlFor={`f-${f.key}`}>{f.label}</label>
              <Field field={f} value={vals[f.key] ?? ""} onChange={onVal} />
            </div>
          ))}
        </div>
      )}

      <div className="bytes">
        <div className="bytes__bar" aria-hidden="true">
          <div
            className={`bytes__fill${overflow ? " bytes__fill--danger" : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="bytes__label">
          {bytes.toLocaleString()}B of ~{capacity.toLocaleString()}B
          {overflow ? " — payload may not fit" : ""}
        </div>
      </div>

      {payload ? <Payload payload={payload} /> : <p className="hint">Complete the fields above to generate a code.</p>}

      <div className="grid2">
        <div className="field">
          <label htmlFor="ec">Error correction</label>
          <select id="ec" value={ecLevel} onChange={(e) => onEcLevel(e.target.value)} disabled={forcedH}>
            {EC_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l} — {l === "L" ? "7%" : l === "M" ? "15%" : l === "Q" ? "25%" : "30%"}
              </option>
            ))}
          </select>
          {forcedH && <p className="hint">H is forced while a logo is set.</p>}
        </div>
        <div className="field">
          <label htmlFor="version">Version</label>
          <select id="version" value={version} onChange={(e) => onVersion(Number(e.target.value))}>
            <option value={0}>Auto</option>
            {Array.from({ length: MAX_VERSION }, (_, i) => i + 1).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          {meta && (
            <p className={`hint${versionTooSmall ? " hint--warn" : ""}`}>
              {versionTooSmall
                ? `Needs at least v${meta.required} — using Auto for now`
                : `Grid · v${meta.version} · ${meta.moduleCount}×${meta.moduleCount}`}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="margin">Quiet zone · {margin}px</label>
        <input
          id="margin"
          type="range"
          min={0}
          max={80}
          step={4}
          value={margin}
          onChange={(e) => onMargin(Number(e.target.value))}
        />
      </div>

      <div className="field">
        <label htmlFor="size">Size · {size}px</label>
        <input
          id="size"
          type="range"
          min={384}
          max={1600}
          step={32}
          value={size}
          onChange={(e) => onSize(Number(e.target.value))}
        />
      </div>
    </div>
  );
}