export default function QRPreview({ containerRef, payload, error }) {
  return (
    <section className="preview">
      <div className={`stage${payload ? "" : " stage--empty"}`}>
        {!payload && (
          <div className="empty">
            <span className="empty__qr" aria-hidden="true" />
            <p className="empty__msg">No signal — complete the form</p>
          </div>
        )}
        <div className="stage__qr" ref={containerRef} />
      </div>

      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}
    </section>
  );
}
