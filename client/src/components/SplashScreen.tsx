import { useState, useEffect } from "react";

/**
 * Splash screen — milk background, inline SVG icon with department color.
 * No images — pure SVG + CSS for instant load.
 *
 * Brand colors:
 *  - Home (HAMZURY): charcoal #1A1A1A
 *  - BizDoc (BIZDOC): green #1B4D3E + gold accent bar
 *  - Systemise (HAMZURY): blue #2563EB
 *  - Skills (HAMZURY): navy #1E3A5F
 */

type SplashProps = {
  text: string;
  color: string;
  /** Optional accent color shown as a bar beneath the text (BizDoc gold) */
  accent?: string;
  /** Which icon to show (kept for API compat, all use same logo now) */
  icon?: "bizdoc" | "hamzury";
  /** Department name shown below icon */
  departmentName?: string;
  /** Tagline / slogan shown below department name */
  tagline?: string;
  duration?: number;
};

export default function SplashScreen({ text, color, accent, icon = "hamzury", departmentName, tagline, duration = 1600 }: SplashProps) {
  const [phase, setPhase] = useState<"fill" | "fadeout" | "done">("fill");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fadeout"), duration);
    const t2 = setTimeout(() => setPhase("done"), duration + 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [duration]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: "#FFFAF6",
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.4s ease-out",
        pointerEvents: phase === "fadeout" ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes splash-icon-in {
          0%   { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes accent-grow {
          0%   { width: 0; opacity: 0; }
          40%  { opacity: 1; }
          100% { width: 60px; opacity: 1; }
        }
        @keyframes splash-text-up {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="flex flex-col items-center">
        <div style={{ opacity: 0, animation: `splash-icon-in 0.8s ease-out forwards` }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", backgroundColor: "#FFFAF6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img
              src={icon === "bizdoc" ? "/bizdoc-logo.svg" : "/hamzury%20logo.jpeg"}
              alt={icon === "bizdoc" ? "BizDoc" : "Hamzury"}
              width={80}
              height={80}
              className="object-contain"
              style={{ width: 80, height: 80, mixBlendMode: "multiply", filter: "contrast(1.15)" }}
            />
          </div>
        </div>
        {accent && (
          <div
            className="rounded-full"
            style={{ height: 4, backgroundColor: accent, width: 0, marginTop: 6, animation: `accent-grow ${duration * 0.7}ms ease-out ${duration * 0.2}ms forwards` }}
          />
        )}
        {departmentName && (
          <p
            className="mt-4 text-[11px] md:text-[13px] font-semibold tracking-[0.3em] uppercase"
            style={{ color, opacity: 0, animation: `splash-text-up 0.6s ease-out ${duration * 0.3}ms forwards` }}
          >
            {departmentName}
          </p>
        )}
        {tagline && (
          <p
            className="mt-2 text-[11px] md:text-[12px] font-light tracking-wide max-w-xs text-center"
            style={{ color: `${color}88`, opacity: 0, animation: `splash-text-up 0.6s ease-out ${duration * 0.45}ms forwards` }}
          >
            {tagline}
          </p>
        )}
      </div>
    </div>
  );
}
