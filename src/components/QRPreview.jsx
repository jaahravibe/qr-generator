export default function QRPreview({
  containerRef,
  payload,
  error,
  bytes,
  capacity,
  overflow,
  ecLevel,
  forcedH,
  meta,
  versionTooSmall,
  caption,
  captionColor,
}) {
  return (
    <section className="card preview">
      <h2 className="card__title">Preview</h2>

      <div className={`stage${payload ? "" : " stage--empty"}`} ref={containerRef}>
        {!payload && <p className="empty">Your QR code will appear here.</p>}
        {caption && payload && (
          <p className="stage__caption" style={{ color: captionColor }}>
            {caption}
          </p>
        )}
      </div>

      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}

      <div className="chips">
        <span className="chip">EC {ecLevel}</span>
        {meta && (
          <span className={`chip${versionTooSmall ? " chip--danger" : ""}`}>
            v{meta.version} · {meta.moduleCount}²
          </span>
        )}
        <span className="chip">
          {bytes.toLocaleString()}B / ~{capacity.toLocaleString()}B
        </span>
        {forcedH && <span className="chip chip--accent">H forced · logo</span>}
        {overflow && <span className="chip chip--danger">May not fit</span>}
      </div>
    </section>
  );
}