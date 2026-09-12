export default function QRPreview({
  containerRef,
  payload,
  error,
  busy,
  copied,
  canExport,
  onPng,
  onSvg,
  onCopySvg,
  bytes,
  capacity,
  overflow,
  ecLevel,
  forcedH,
  caption,
  captionColor,
}) {
  return (
    <section className="card preview">
      <h2 className="card__title">Preview</h2>

      <div className="stage">
        {payload ? (
          <>
            <div className="stage__code" ref={containerRef} />
            {caption && (
              <p className="stage__caption" style={{ color: captionColor }}>
                {caption}
              </p>
            )}
          </>
        ) : (
          <p className="empty">Your QR code will appear here.</p>
        )}
      </div>

      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}

      <div className="chips">
        <span className="chip">EC {ecLevel}</span>
        <span className="chip">
          {bytes.toLocaleString()}B / ~{capacity.toLocaleString()}B
        </span>
        {forcedH && <span className="chip chip--accent">H forced · logo</span>}
        {overflow && <span className="chip chip--danger">May not fit</span>}
      </div>

      <div className="actions">
        <button className="btn btn--primary" type="button" onClick={onPng} disabled={!canExport || busy}>
          {busy ? "Working…" : "PNG"}
        </button>
        <button className="btn" type="button" onClick={onSvg} disabled={!canExport || busy}>
          SVG
        </button>
        <button className="btn" type="button" onClick={onCopySvg} disabled={!canExport || busy}>
          {copied ? "Copied" : "Copy SVG"}
        </button>
      </div>
    </section>
  );
}