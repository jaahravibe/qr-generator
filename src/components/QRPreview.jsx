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
  scan,
  caption,
  captionColor,
}) {
  return (
    <section className="card preview">
      <h2 className="card__title">Preview</h2>

      <div className={`stage${payload ? "" : " stage--empty"}`}>
        {!payload && <p className="empty">Your QR code will appear here.</p>}
        <div className="stage__qr" ref={containerRef} />
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
        {scan === "pending" && <span className="chip">Checking scan…</span>}
        {scan === "ok" && <span className="chip chip--accent">Scans OK</span>}
        {scan === "fail" && <span className="chip chip--danger">Not scannable</span>}
        {scan === "mismatch" && <span className="chip chip--danger">Decodes differently</span>}
        {overflow && <span className="chip chip--danger">May not fit</span>}
      </div>
    </section>
  );
}