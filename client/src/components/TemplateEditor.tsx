import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TEMPLATE EDITOR — Letterhead, Carousel, Flier
   Editable in-browser, export as PNG via html2canvas
   ═══════════════════════════════════════════════════════════════════════════ */

const GOLD = "#B48C4C";
const MILK = "#FFFAF6";

const DEPT_COLORS: Record<string, { primary: string; label: string }> = {
  general:   { primary: "#1A1A1A", label: "HAMZURY" },
  bizdoc:    { primary: "#1B4D3E", label: "BIZDOC" },
  systemise: { primary: "#2563EB", label: "SYSTEMISE" },
  skills:    { primary: "#1E3A5F", label: "HAMZURY SKILLS" },
  ridi:      { primary: "#C9A97E", label: "RIDI" },
  media:     { primary: "#1A1A1A", label: "MEDIA" },
};

type TemplateType = "letterhead" | "carousel" | "flier";

// ── EXPORT HELPER ─────────────────────────────────────────────────────────────
async function exportPNG(el: HTMLElement, filename: string) {
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#FFFFFF" });
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ── EDITABLE TEXT ─────────────────────────────────────────────────────────────
function E({ value, onChange, style, className }: {
  value: string; onChange: (v: string) => void; style?: React.CSSProperties; className?: string;
}) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onBlur={e => onChange(e.currentTarget.textContent || "")}
      className={`outline-none focus:ring-1 focus:ring-[#B48C4C40] rounded px-1 ${className || ""}`}
      style={{ minHeight: "1em", ...style }}
    >
      {value}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LETTERHEAD (A4 ratio)
// ══════════════════════════════════════════════════════════════════════════════
function Letterhead({ dept }: { dept: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const c = DEPT_COLORS[dept] || DEPT_COLORS.general;
  const [exporting, setExporting] = useState(false);

  const [date, setDate] = useState(new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }));
  const [recipient, setRecipient] = useState("Dear [Recipient Name],");
  const [subject, setSubject] = useState("RE: [Subject Line]");
  const [body, setBody] = useState("We are writing to inform you about [topic]. As part of our continued commitment to [purpose], we would like to [action].\n\nPlease do not hesitate to reach out should you have any questions.\n\nWarm regards,");
  const [signer, setSigner] = useState("[Your Name]\n[Title]");

  const doExport = useCallback(async () => {
    if (!ref.current) return;
    setExporting(true);
    await exportPNG(ref.current, `${c.label.toLowerCase()}-letterhead-${Date.now()}.png`);
    setExporting(false);
  }, [c.label]);

  return (
    <div>
      <div ref={ref} style={{ width: 794, minHeight: 1123, backgroundColor: "#FFFFFF", padding: 60, fontFamily: "'Inter', sans-serif", position: "relative" }}>
        {/* Accent line */}
        <div style={{ height: 4, backgroundColor: c.primary, marginBottom: 32 }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.15em", color: c.primary }}>{c.label}</div>
            <div style={{ fontSize: 10, color: "#999", marginTop: 2, letterSpacing: "0.1em" }}>HAMZURY INNOVATION HUB</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#999", lineHeight: 1.8 }}>
            3rd Floor, Plan Aid Academy<br />
            Kado, Abuja, Nigeria<br />
            +234 803 462 0520<br />
            info@hamzury.com
          </div>
        </div>

        {/* Date */}
        <div style={{ marginBottom: 24 }}>
          <E value={date} onChange={setDate} style={{ fontSize: 12, color: "#666" }} />
        </div>

        {/* Recipient */}
        <div style={{ marginBottom: 8 }}>
          <E value={recipient} onChange={setRecipient} style={{ fontSize: 14, color: "#333", fontWeight: 500 }} />
        </div>

        {/* Subject */}
        <div style={{ marginBottom: 24 }}>
          <E value={subject} onChange={setSubject} style={{ fontSize: 13, color: c.primary, fontWeight: 600 }} />
        </div>

        {/* Body */}
        <div style={{ marginBottom: 40 }}>
          <E value={body} onChange={setBody} style={{ fontSize: 13, color: "#333", lineHeight: 1.8, whiteSpace: "pre-wrap" }} />
        </div>

        {/* Signer */}
        <div style={{ marginBottom: 60 }}>
          <E value={signer} onChange={setSigner} style={{ fontSize: 13, color: "#333", fontWeight: 500, whiteSpace: "pre-wrap" }} />
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: 40, left: 60, right: 60 }}>
          <div style={{ height: 1, backgroundColor: `${c.primary}15`, marginBottom: 12 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#AAA", letterSpacing: "0.05em" }}>
            <span>www.hamzury.com</span>
            <span>+234 803 462 0520</span>
            <span>info@hamzury.com</span>
          </div>
        </div>
      </div>

      <button onClick={doExport} disabled={exporting} className="mt-4 px-6 py-3 rounded-full text-[13px] font-medium flex items-center gap-2 transition-opacity disabled:opacity-40" style={{ backgroundColor: c.primary, color: "#fff" }}>
        {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        {exporting ? "Exporting..." : "Download Letterhead"}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CAROUSEL (1080x1080, 5 slides)
// ══════════════════════════════════════════════════════════════════════════════
function Carousel({ dept }: { dept: string }) {
  const c = DEPT_COLORS[dept] || DEPT_COLORS.general;
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [slide, setSlide] = useState(0);
  const [exporting, setExporting] = useState(false);

  const [titles] = useState([
    { head: "Your Headline Here", sub: "Supporting text goes here. Keep it short." },
    { head: "Point One", sub: "Explain the first key takeaway in 1-2 sentences." },
    { head: "Point Two", sub: "What's the second thing your audience should know?" },
    { head: "Point Three", sub: "Drive it home with the final insight." },
    { head: "Get Started Today", sub: "hamzury.com · +234 803 462 0520" },
  ]);
  const [slides, setSlides] = useState(titles);

  const updateSlide = (i: number, key: "head" | "sub", val: string) => {
    setSlides(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  };

  const SIZE = 540; // display size (half of 1080 for screen)

  const exportSlide = useCallback(async (i: number) => {
    const el = refs.current[i];
    if (!el) return;
    setExporting(true);
    await exportPNG(el, `${c.label.toLowerCase()}-slide-${i + 1}-${Date.now()}.png`);
    setExporting(false);
  }, [c.label]);

  const exportAll = useCallback(async () => {
    setExporting(true);
    for (let i = 0; i < 5; i++) {
      const el = refs.current[i];
      if (el) await exportPNG(el, `${c.label.toLowerCase()}-slide-${i + 1}-${Date.now()}.png`);
    }
    setExporting(false);
  }, [c.label]);

  const isEdge = (i: number) => i === 0 || i === 4;

  return (
    <div>
      {/* All slides (hidden off-screen for export, visible one shown) */}
      <div style={{ position: "relative" }}>
        {slides.map((s, i) => (
          <div
            key={i}
            ref={el => { refs.current[i] = el; }}
            style={{
              width: SIZE, height: SIZE,
              backgroundColor: isEdge(i) ? c.primary : "#FFFFFF",
              display: i === slide ? "flex" : "none",
              flexDirection: "column", justifyContent: "center", alignItems: "center",
              padding: 60, textAlign: "center", fontFamily: "'Inter', sans-serif",
              border: isEdge(i) ? "none" : `1px solid ${c.primary}10`,
            }}
          >
            {/* Slide number */}
            <div style={{ position: "absolute", top: 20, right: 24, fontSize: 10, color: isEdge(i) ? "#ffffff40" : `${c.primary}30`, letterSpacing: "0.1em" }}>
              {i + 1}/5
            </div>

            {/* Logo */}
            <div style={{ position: "absolute", top: 20, left: 24, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: isEdge(i) ? "#ffffff50" : `${c.primary}40` }}>
              {c.label}
            </div>

            {/* Content */}
            <E
              value={s.head}
              onChange={v => updateSlide(i, "head", v)}
              style={{ fontSize: 28, fontWeight: 600, color: isEdge(i) ? "#FFFFFF" : c.primary, marginBottom: 16, lineHeight: 1.2 }}
            />
            <E
              value={s.sub}
              onChange={v => updateSlide(i, "sub", v)}
              style={{ fontSize: 14, color: isEdge(i) ? "#ffffff90" : "#666", lineHeight: 1.6, maxWidth: 400 }}
            />

            {/* Gold accent dot */}
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: GOLD, marginTop: 24 }} />
          </div>
        ))}

        {/* Hidden slides for export */}
        <div style={{ position: "absolute", left: -9999, top: 0 }}>
          {slides.map((s, i) => (
            i !== slide ? (
              <div
                key={`hidden-${i}`}
                ref={el => { refs.current[i] = el; }}
                style={{
                  width: SIZE, height: SIZE,
                  backgroundColor: isEdge(i) ? c.primary : "#FFFFFF",
                  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                  padding: 60, textAlign: "center", fontFamily: "'Inter', sans-serif",
                  border: isEdge(i) ? "none" : `1px solid ${c.primary}10`,
                }}
              >
                <div style={{ position: "absolute", top: 20, right: 24, fontSize: 10, color: isEdge(i) ? "#ffffff40" : `${c.primary}30`, letterSpacing: "0.1em" }}>{i + 1}/5</div>
                <div style={{ position: "absolute", top: 20, left: 24, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: isEdge(i) ? "#ffffff50" : `${c.primary}40` }}>{c.label}</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: isEdge(i) ? "#FFFFFF" : c.primary, marginBottom: 16, lineHeight: 1.2 }}>{s.head}</div>
                <div style={{ fontSize: 14, color: isEdge(i) ? "#ffffff90" : "#666", lineHeight: 1.6, maxWidth: 400 }}>{s.sub}</div>
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: GOLD, marginTop: 24 }} />
              </div>
            ) : null
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-4">
        <button onClick={() => setSlide(p => Math.max(0, p - 1))} disabled={slide === 0} className="p-2 rounded-full hover:bg-black/5 disabled:opacity-20"><ChevronLeft size={18} /></button>
        <span className="text-[13px] font-medium" style={{ color: c.primary }}>Slide {slide + 1} / 5</span>
        <button onClick={() => setSlide(p => Math.min(4, p + 1))} disabled={slide === 4} className="p-2 rounded-full hover:bg-black/5 disabled:opacity-20"><ChevronRight size={18} /></button>
        <div className="flex-1" />
        <button onClick={() => exportSlide(slide)} disabled={exporting} className="px-4 py-2 rounded-full text-[12px] font-medium flex items-center gap-1.5 transition-opacity disabled:opacity-40" style={{ backgroundColor: c.primary, color: "#fff" }}>
          {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} This Slide
        </button>
        <button onClick={exportAll} disabled={exporting} className="px-4 py-2 rounded-full text-[12px] font-medium flex items-center gap-1.5 transition-opacity disabled:opacity-40" style={{ backgroundColor: GOLD, color: "#fff" }}>
          {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} All 5
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FLIER (1080x1350 portrait)
// ══════════════════════════════════════════════════════════════════════════════
function Flier({ dept }: { dept: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const c = DEPT_COLORS[dept] || DEPT_COLORS.general;
  const [exporting, setExporting] = useState(false);

  const [headline, setHeadline] = useState("Your Event or Offer Title");
  const [subheadline, setSubheadline] = useState("A short supporting line that gives context.");
  const [bullets, setBullets] = useState([
    "First benefit or feature",
    "Second benefit or feature",
    "Third benefit or feature",
    "Fourth benefit or feature",
  ]);
  const [cta, setCta] = useState("Register Now");
  const [contact, setContact] = useState("hamzury.com · +234 803 462 0520 · info@hamzury.com");

  const updateBullet = (i: number, val: string) => setBullets(prev => prev.map((b, idx) => idx === i ? val : b));

  const W = 432; // display (1080 * 0.4)
  const H = 540; // display (1350 * 0.4)

  const doExport = useCallback(async () => {
    if (!ref.current) return;
    setExporting(true);
    await exportPNG(ref.current, `${c.label.toLowerCase()}-flier-${Date.now()}.png`);
    setExporting(false);
  }, [c.label]);

  return (
    <div>
      <div ref={ref} style={{ width: W, height: H, backgroundColor: "#FFFFFF", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
        {/* Header band */}
        <div style={{ backgroundColor: c.primary, padding: "32px 28px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.25em", color: "#ffffff50", marginBottom: 8 }}>{c.label}</div>
          <E value={headline} onChange={setHeadline} style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2, marginBottom: 8 }} />
          <E value={subheadline} onChange={setSubheadline} style={{ fontSize: 10, color: "#ffffff80", lineHeight: 1.5 }} />
        </div>

        {/* Bullets */}
        <div style={{ padding: "20px 28px" }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: GOLD, marginTop: 5, flexShrink: 0 }} />
              <E value={b} onChange={v => updateBullet(i, v)} style={{ fontSize: 11, color: "#444", lineHeight: 1.5 }} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ position: "absolute", bottom: 50, left: 28, right: 28, textAlign: "center" }}>
          <div style={{ display: "inline-block", backgroundColor: c.primary, borderRadius: 20, padding: "8px 24px" }}>
            <E value={cta} onChange={setCta} style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF" }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: 16, left: 28, right: 28, textAlign: "center" }}>
          <E value={contact} onChange={setContact} style={{ fontSize: 8, color: "#AAA", letterSpacing: "0.03em" }} />
        </div>
      </div>

      <button onClick={doExport} disabled={exporting} className="mt-4 px-6 py-3 rounded-full text-[13px] font-medium flex items-center gap-2 transition-opacity disabled:opacity-40" style={{ backgroundColor: c.primary, color: "#fff" }}>
        {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        {exporting ? "Exporting..." : "Download Flier"}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN EDITOR
// ══════════════════════════════════════════════════════════════════════════════
export default function TemplateEditor() {
  const [dept, setDept] = useState("general");
  const [tab, setTab] = useState<TemplateType>("letterhead");
  const c = DEPT_COLORS[dept] || DEPT_COLORS.general;

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={dept}
          onChange={e => setDept(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-[13px] font-medium outline-none appearance-none"
          style={{ backgroundColor: `${c.primary}08`, color: c.primary }}
        >
          {Object.entries(DEPT_COLORS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>

        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: `${c.primary}06` }}>
          {(["letterhead", "carousel", "flier"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-[12px] font-medium capitalize transition-all"
              style={{
                backgroundColor: tab === t ? c.primary : "transparent",
                color: tab === t ? "#fff" : `${c.primary}80`,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Hint */}
      <p className="text-[11px] mb-4" style={{ color: "#999" }}>
        Click any text to edit. Then download as PNG.
      </p>

      {/* Template */}
      <div className="overflow-auto rounded-2xl p-4" style={{ backgroundColor: MILK, maxHeight: "70vh" }}>
        {tab === "letterhead" && <Letterhead key={dept} dept={dept} />}
        {tab === "carousel" && <Carousel key={dept} dept={dept} />}
        {tab === "flier" && <Flier key={dept} dept={dept} />}
      </div>
    </div>
  );
}
