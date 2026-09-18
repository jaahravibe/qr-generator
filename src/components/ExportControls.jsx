export default function ExportControls({ canExport, busy, copied, onPng, onSvg, onCopySvg }) {
  return (
    <div className="editor__panel">
      <p className="hint">
        Export as a high-res PNG, a crisp vector SVG, or copy the raw SVG markup
        to reuse elsewhere.
      </p>

      <div className="actions">
        <button
          className="btn btn--primary"
          type="button"
          onClick={onPng}
          disabled={!canExport || busy}
        >
          {busy ? "Working…" : "Download PNG"}
        </button>
        <button className="btn" type="button" onClick={onSvg} disabled={!canExport || busy}>
          Download SVG
        </button>
        <button className="btn" type="button" onClick={onCopySvg} disabled={!canExport || busy}>
          {copied ? "SVG copied" : "Copy SVG"}
        </button>
      </div>
    </div>
  );
}