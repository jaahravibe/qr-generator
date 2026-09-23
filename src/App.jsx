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
  exportPNG,
  exportSVG,
  getSvgString,
  copyText,
  applyImageFills,
} from "./lib/qr.js";
import {
  composeLogo,
  composeTextBadge,
  logoCoverage,
  readLogoFile,
  vectorizeBadge,
  DEFAULT_LOGO_STYLE,
} from "./lib/logo.js";

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
  const [fgColor, setFgColor] = useState("#000000");
  const [fgColor2, setFgColor2] = useState("#4f46e5");
  const [inkImg, setInkImg] = useState("");
  const [bgType, setBgType] = useState("solid");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgColor2, setBgColor2] = useState("#eef2ff");
  const [bgImg, setBgImg] = useState("");
  const [dotStyle, setDotStyle] = useState("square");
  const [cornerStyle, setCornerStyle] = useState("");
  const [cornerFill, setCornerFill] = useState("solid");
  const [cornerColor, setCornerColor] = useState("#000000");
  const [cornerColor2, setCornerColor2] = useState("#4f46e5");
  const [cornerImg, setCornerImg] = useState("");

  const [logoType, setLogoType] = useState("none");
  const [logoImg, setLogoImg] = useState("");
  const [logoMeta, setLogoMeta] = useState(null);
  const [logoError, setLogoError] = useState(null);
  const [logoSize, setLogoSize] = useState(0.35);
  const [logoStyle, setLogoStyle] = useState(DEFAULT_LOGO_STYLE);
  const [logoUrl, setLogoUrl] = useState(null);

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

  const lockup = logoStyle.lockup || DEFAULT_LOGO_STYLE.lockup;
  const wordmarkText = lockup.lines.map((l) => l.text || "").join(" ").trim();
  const hasLogo = logoType === "image" ? !!logoImg : logoType === "text" ? !!wordmarkText : false;
  const logoInk = fgType === "gradient" ? fgColor2 : fgColor;
  const logoShape = logoStyle.shape[logoType] ?? "rounded";
  const logoPlateColor = logoStyle.plateColor || (bgType === "solid" ? bgColor : "#ffffff");

  useEffect(() => {
    let active = true;
    const id = setTimeout(() => {
      (async () => {
        const src = hasLogo
          ? logoType === "image"
            ? logoImg
            : await composeTextBadge({
                lockup,
                inkColor: logoInk,
                shape: logoShape,
                plateColor: logoPlateColor,
                borderWidth: logoStyle.borderWidth,
                borderColor: logoStyle.borderColor,
                radius: logoStyle.radius,
                padding: logoStyle.padding,
                opacity: logoStyle.opacity,
              })
          : null;
        if (!active) return;
        if (!src) {
          setLogoUrl(null);
          return;
        }
        try {
          const url = await composeLogo({
            src,
            shape: logoShape,
            plateColor: logoPlateColor,
            borderWidth: logoStyle.borderWidth,
            borderColor: logoStyle.borderColor,
            radius: logoStyle.radius,
            padding: logoStyle.padding,
            opacity: logoStyle.opacity,
          });
          if (active) {
            setLogoUrl(url);
            setLogoError(null);
          }
        } catch (e) {
          if (active) {
            setLogoUrl(null);
            setLogoError(String(e?.message || e));
          }
        }
      })();
    }, 120);
    return () => {
      active = false;
      clearTimeout(id);
    };
  }, [
    hasLogo,
    logoType,
    logoImg,
    lockup,
    logoInk,
    logoShape,
    logoPlateColor,
    logoStyle.borderWidth,
    logoStyle.borderColor,
    logoStyle.radius,
    logoStyle.padding,
    logoStyle.opacity,
  ]);

  function handleLogoFile(file) {
    if (!file) {
      setLogoImg("");
      setLogoMeta(null);
      setLogoError(null);
      return;
    }
    readLogoFile(file).then((meta) => {
      if (!meta.ok) {
        setLogoImg("");
        setLogoMeta(null);
        setLogoError(meta.error);
        return;
      }
      setLogoError(null);
      setLogoMeta(meta);
      setLogoImg(meta.dataUrl);
    });
  }

  function handleLogoPreset(preset) {
    setLogoError(null);
    setLogoMeta(null);
    setLogoImg(preset.src);
  }

  const forcedH = hasLogo;
  const effectiveEc = forcedH ? "H" : ecLevel;
  const capacity = EC_CAPACITY[effectiveEc];
  const overflow = bytes > capacity;

  const meta = useMemo(
    () => qrMeta(payload, effectiveEc, version),
    [payload, effectiveEc, version],
  );
  const versionTooSmall = version > 0 && !!meta && !meta.fits;
  const renderVersion = versionTooSmall ? 0 : version;
  const coveragePct = logoCoverage(logoSize, meta?.moduleCount || 25);

  const fgExport = fgType === "solid" || fgType === "image" ? fgColor : fgColor2;
  const fileName = "qr-code";

  const qrRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef({ ink: inkImg, bg: bgImg, corner: cornerImg });
  imageRef.current = { ink: inkImg, bg: bgImg, corner: cornerImg };

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
        cornerFill,
        cornerColor,
        cornerColor2,
        logoUrl,
        logoSize,
        logoMargin: 8,
      }),
    [payload, size, margin, effectiveEc, renderVersion, fgType, fgColor, fgColor2, bgType, bgColor, bgColor2, dotStyle, cornerStyle, cornerFill, cornerColor, cornerColor2, logoUrl, logoSize],
  );

  useEffect(() => {
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling();
      qrRef.current.applyExtension((svg) => applyImageFills(svg, imageRef.current));
    }
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
  }, [options, payload, inkImg, bgImg, cornerImg]);

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

  const badgeForExport = {
    lockup,
    inkColor: logoInk,
    shape: logoShape,
    plateColor: logoPlateColor,
    borderWidth: logoStyle.borderWidth,
    borderColor: logoStyle.borderColor,
    radius: logoStyle.radius,
    padding: logoStyle.padding,
    opacity: logoStyle.opacity,
  };

  const handlePng = () =>
    runExport(() =>
      exportPNG({
        qr: qrRef.current,
        name: fileName,
        overlay: logoType === "text" && hasLogo ? (px) => composeTextBadge({ ...badgeForExport, size: px }) : null,
      }),
    );

  const handleSvg = () =>
    runExport(() =>
      exportSVG({
        qr: qrRef.current,
        name: fileName,
        vectorize: logoType === "text" && hasLogo ? (svg) => vectorizeBadge(svg, badgeForExport) : null,
      }),
    );

  const handleCopySvg = () =>
    runExport(async () => {
      const svg = await getSvgString({ qr: qrRef.current });
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
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path fillRule="evenodd" d="M1 1h22v22H1V1Zm4 4v14h14v-14H5Z" />
              <rect x="8" y="8" width="8" height="8" />
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
        <QRPreview containerRef={containerRef} payload={payload} error={error} />

        <div className="stack">
          <section className="card editor">
            <nav className="tabs" role="tablist" aria-label="Editor sections">
              {TABS.map(({ id, label }, i) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  className={`tabs__btn${tab === id ? " active" : ""}`}
                  onClick={() => setTab(id)}
                >
                  <span className="tabs__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
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
                  inkImg={inkImg}
                  onInkImg={setInkImg}
                  bgType={bgType}
                  onBgType={setBgType}
                  bgColor={bgColor}
                  onBgColor={setBgColor}
                  bgColor2={bgColor2}
                  onBgColor2={setBgColor2}
                  bgImg={bgImg}
                  onBgImg={setBgImg}
                  dotStyle={dotStyle}
                  onDotStyle={setDotStyle}
                  cornerStyle={cornerStyle}
                  onCornerStyle={setCornerStyle}
                  cornerFill={cornerFill}
                  onCornerFill={setCornerFill}
                  cornerColor={cornerColor}
                  onCornerColor={setCornerColor}
                  cornerColor2={cornerColor2}
                  onCornerColor2={setCornerColor2}
                  cornerImg={cornerImg}
                  onCornerImg={setCornerImg}
                />
              )}
              {tab === "logo" && (
                <LogoControls
                  logoType={logoType}
                  onLogoType={setLogoType}
                  lockup={lockup}
                  onLockup={(patch) =>
                    setLogoStyle((s) => ({
                      ...s,
                      lockup: { ...(s.lockup || DEFAULT_LOGO_STYLE.lockup), ...patch },
                    }))
                  }
                  logoImg={logoImg}
                  logoMeta={logoMeta}
                  onLogoFile={handleLogoFile}
                  onLogoPreset={handleLogoPreset}
                  logoError={logoError}
                  hasLogo={hasLogo}
                  logoSize={logoSize}
                  onLogoSize={setLogoSize}
                  logoStyle={logoStyle}
                  onLogoStyle={(patch) => setLogoStyle((s) => ({ ...s, ...patch }))}
                  previewColor={fgExport}
                  coveragePct={coveragePct}
                />
              )}
              {tab === "export" && (
                <>
                  {canExport && (
                    <div className="reminders">
                      <div className="reminder">
                        <p className="reminder__what">Ready to export</p>
                        <p className="reminder__why">Scan the preview with your phone before doing anything. A quick test now beats a failed print run later.</p>
                      </div>
                      {fgType === "image" && (
                        <div className="reminder">
                          <p className="reminder__what">Image used as the QR pattern</p>
                          <p className="reminder__why">Low-contrast or busy images can fail to scan, so test it before exporting.</p>
                        </div>
                      )}
                      {bgType === "image" && (
                        <div className="reminder">
                          <p className="reminder__what">Image used as the background</p>
                          <p className="reminder__why">A busy or low-contrast background can interfere with scanning, so test it before exporting.</p>
                        </div>
                      )}
                      {fgType === "gradient" && (
                        <div className="reminder">
                          <p className="reminder__what">Gradient used for the QR pattern</p>
                          <p className="reminder__why">The lighter end of the gradient may not scan, so test it before exporting.</p>
                        </div>
                      )}
                      {bgType === "gradient" && (
                        <div className="reminder">
                          <p className="reminder__what">Gradient used for the background</p>
                          <p className="reminder__why">The lighter end of the gradient may not scan, so test it before exporting.</p>
                        </div>
                      )}
                      {hasLogo && (
                        <div className="reminder">
                          <p className="reminder__what">Logo overlaid on the code</p>
                          <p className="reminder__why">The logo hides part of the data, so test the scan on a few different devices before exporting.</p>
                        </div>
                      )}
                    </div>
                  )}
                  <ExportControls
                    canExport={canExport}
                    busy={busy}
                    copied={copied}
                    onPng={handlePng}
                    onSvg={handleSvg}
                    onCopySvg={handleCopySvg}
                  />
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;