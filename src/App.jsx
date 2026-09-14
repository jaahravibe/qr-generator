import { useEffect, useMemo, useRef, useState } from "react";
import Controls from "./components/Controls.jsx";
import StyleControls from "./components/StyleControls.jsx";
import LogoControls from "./components/LogoControls.jsx";
import QRPreview from "./components/QRPreview.jsx";
import ExportControls from "./components/ExportControls.jsx";
import { PRESETS } from "./lib/presets.js";
import {
  QRCodeStyling,
  buildQROptions,
  EC_CAPACITY,
  qrMeta,
  textLogoDataUrl,
  exportPNG,
  exportSVG,
  getSvgString,
  copyText,
} from "./lib/qr.js";

const THEME_CYCLE = { light: "dark", dark: "system", system: "light" };

const TABS = [
  { id: "content", label: "Content" },
  { id: "style", label: "Style" },
  { id: "logo", label: "Logo" },
  { id: "export", label: "Export" },
];

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function IconMonitor() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

const THEME_ICONS = { light: <IconSun />, dark: <IconMoon />, system: <IconMonitor /> };

function slug(v) {
  return v
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("qr-theme") || "system");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") delete root.dataset.theme;
    else root.dataset.theme = theme;
    localStorage.setItem("qr-theme", theme);
  }, [theme]);

  const [preset, setPreset] = useState("url");
  const [vals, setVals] = useState({ ...PRESETS.url.defaults });
  const [tab, setTab] = useState("content");

  const [ecLevel, setEcLevel] = useState("H");
  const [version, setVersion] = useState(0);
  const [size, setSize] = useState(768);
  const [margin, setMargin] = useState(24);

  const [fgType, setFgType] = useState("solid");
  const [fgColor, setFgColor] = useState("#0f172a");
  const [fgColor2, setFgColor2] = useState("#4f46e5");
  const [bgType, setBgType] = useState("solid");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgColor2, setBgColor2] = useState("#eef2ff");
  const [dotStyle, setDotStyle] = useState("rounded");
  const [cornerStyle, setCornerStyle] = useState("");
  const [cornerColor, setCornerColor] = useState("#0f172a");

  const [logoType, setLogoType] = useState("none");
  const [logoTxt, setLogoTxt] = useState("");
  const [logoImg, setLogoImg] = useState("");
  const [logoSize, setLogoSize] = useState(0.35);
  const [caption, setCaption] = useState("");

  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef(null);

  const presetDef = PRESETS[preset];

  const payload = useMemo(() => presetDef.build(vals) || "", [presetDef, vals]);

  const bytes = useMemo(
    () => (payload ? new TextEncoder().encode(payload).length : 0),
    [payload],
  );

  const logoUrl = useMemo(() => {
    if (logoType === "image") return logoImg || null;
    if (logoType === "text") {
      const t = logoTxt.trim();
      if (!t) return null;
      return textLogoDataUrl(t, fgType === "gradient" ? fgColor2 : fgColor, bgColor);
    }
    return null;
  }, [logoType, logoImg, logoTxt, fgColor, fgColor2, fgType, bgColor]);

  const forcedH = logoType !== "none";
  const effectiveEc = forcedH ? "H" : ecLevel;
  const capacity = EC_CAPACITY[effectiveEc];
  const overflow = bytes > capacity;

  const meta = useMemo(
    () => qrMeta(payload, effectiveEc, version),
    [payload, effectiveEc, version],
  );
  const versionTooSmall = version > 0 && !!meta && !meta.fits;
  const renderVersion = versionTooSmall ? 0 : version;

  const fgExport = fgType === "solid" ? fgColor : fgColor2;
  const fileName = useMemo(() => slug(caption) || "qr-code", [caption]);

  const qrRef = useRef(null);
  const containerRef = useRef(null);

  const options = useMemo(
    () =>
      buildQROptions({
        payload,
        size,
        margin,
        ecLevel: effectiveEc,
        version: renderVersion,
        fgType,
        fgColor,
        fgColor2,
        bgType,
        bgColor,
        bgColor2,
        dotStyle,
        cornerStyle,
        cornerColor,
        logoUrl,
        logoSize,
      }),
    [payload, size, margin, effectiveEc, renderVersion, fgType, fgColor, fgColor2, bgType, bgColor, bgColor2, dotStyle, cornerStyle, cornerColor, logoUrl, logoSize],
  );

  useEffect(() => {
    if (!qrRef.current) qrRef.current = new QRCodeStyling();
    const el = containerRef.current;
    if (el && !qrRef.current._container) qrRef.current.append(el);
    if (payload) {
      try {
        qrRef.current.update(options);
        setError(null);
      } catch (e) {
        setError(String(e?.message || e));
        return;
      }
    } else {
      setError(null);
      if (qrRef.current?._container) qrRef.current._container.innerHTML = "";
    }
  }, [options, payload]);

  function changePreset(id) {
    const defaults = PRESETS[id].defaults;
    const next = { ...defaults };
    if (defaults.fields) next.fields = defaults.fields.map((f) => ({ ...f }));
    setPreset(id);
    setVals(next);
    setError(null);
  }

  function setVal(key, value) {
    setVals((p) => ({ ...p, [key]: value }));
  }

  async function runExport(fn) {
    if (busy || !payload || error) return;
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  const handlePng = () =>
    runExport(() => exportPNG({ qr: qrRef.current, caption, fgColor: fgExport, bgColor, name: fileName }));

  const handleSvg = () =>
    runExport(() => exportSVG({ qr: qrRef.current, caption, fgColor: fgExport, name: fileName }));

  const handleCopySvg = () =>
    runExport(async () => {
      const svg = await getSvgString({ qr: qrRef.current, caption, fgColor: fgExport });
      const ok = await copyText(svg);
      clearTimeout(copiedTimer.current);
      setCopied(ok);
      if (ok) copiedTimer.current = setTimeout(() => setCopied(false), 1800);
    });

  const canExport = !!payload && !error;

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <rect x="3" y="3" width="8" height="8" rx="1.5" />
              <rect x="6" y="6" width="2" height="2" />
              <rect x="13" y="3" width="8" height="8" rx="1.5" />
              <rect x="16" y="6" width="2" height="2" />
              <rect x="3" y="13" width="8" height="8" rx="1.5" />
              <rect x="6" y="16" width="2" height="2" />
              <rect x="13" y="13" width="2.5" height="2.5" rx="0.5" />
              <rect x="18.5" y="13" width="2.5" height="2.5" rx="0.5" />
              <rect x="18.5" y="18.5" width="2.5" height="2.5" rx="0.5" />
              <rect x="13" y="18.5" width="2.5" height="2.5" rx="0.5" />
            </svg>
          </span>
          <div className="brand__text">
            <h1>QR Generator</h1>
            <p>Create, customize and export QR codes</p>
          </div>
        </div>
        <button
          className="icon-btn"
          type="button"
          onClick={() => setTheme((t) => THEME_CYCLE[t])}
          title={`Theme: ${theme} (click to change)`}
          aria-label={`Theme: ${theme}`}
        >
          {THEME_ICONS[theme]}
        </button>
      </header>

      <main className="layout">
        <QRPreview
          containerRef={containerRef}
          payload={payload}
          error={error}
          bytes={bytes}
          capacity={capacity}
          overflow={overflow}
          ecLevel={effectiveEc}
          forcedH={forcedH}
          meta={meta}
          versionTooSmall={versionTooSmall}
          caption={caption}
          captionColor={fgExport}
        />

        <div className="stack">
          <section className="card editor">
            <nav className="tabs" role="tablist" aria-label="Editor sections">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  className={`tabs__btn${tab === id ? " active" : ""}`}
                  onClick={() => setTab(id)}
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="editor__body">
              {tab === "content" && (
                <Controls
                  preset={preset}
                  presetDef={presetDef}
                  onPreset={changePreset}
                  vals={vals}
                  onVal={setVal}
                  payload={payload}
                  bytes={bytes}
                  capacity={capacity}
                  overflow={overflow}
                  ecLevel={effectiveEc}
                  onEcLevel={setEcLevel}
                  forcedH={forcedH}
                  version={version}
                  onVersion={setVersion}
                  meta={meta}
                  versionTooSmall={versionTooSmall}
                  size={size}
                  onSize={setSize}
                  margin={margin}
                  onMargin={setMargin}
                />
              )}
              {tab === "style" && (
                <StyleControls
                  fgType={fgType}
                  onFgType={setFgType}
                  fgColor={fgColor}
                  onFgColor={setFgColor}
                  fgColor2={fgColor2}
                  onFgColor2={setFgColor2}
                  bgType={bgType}
                  onBgType={setBgType}
                  bgColor={bgColor}
                  onBgColor={setBgColor}
                  bgColor2={bgColor2}
                  onBgColor2={setBgColor2}
                  dotStyle={dotStyle}
                  onDotStyle={setDotStyle}
                  cornerStyle={cornerStyle}
                  onCornerStyle={setCornerStyle}
                  cornerColor={cornerColor}
                  onCornerColor={setCornerColor}
                />
              )}
              {tab === "logo" && (
                <LogoControls
                  logoType={logoType}
                  onLogoType={setLogoType}
                  logoTxt={logoTxt}
                  onLogoTxt={setLogoTxt}
                  logoImg={logoImg}
                  onLogoImg={setLogoImg}
                  logoSize={logoSize}
                  onLogoSize={setLogoSize}
                  caption={caption}
                  onCaption={setCaption}
                  previewColor={fgExport}
                />
              )}
              {tab === "export" && (
                <ExportControls
                  canExport={canExport}
                  busy={busy}
                  copied={copied}
                  onPng={handlePng}
                  onSvg={handleSvg}
                  onCopySvg={handleCopySvg}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;