import { useState, useEffect } from "react";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import {
  GraduationCap, Users, Briefcase, MapPin,
  Menu, X, MessageSquare, Quote,
} from "lucide-react";
import SplashScreen from "@/components/SplashScreen";

const DARK = "#1E3A5F";
const GOLD = "#B48C4C";
const TEXT = "#1A1A1A";
const BG = "#FFFAF6";
const W = "#FFFFFF";

type AlumniMember = {
  name: string;
  cohort: string;
  programme: string;
  currentRole: string;
  location: string;
  quote?: string;
};

// Placeholder — will be populated as graduates emerge
const ALUMNI: AlumniMember[] = [];

const STATS = [
  { label: "Graduates", value: "—", note: "First cohort in training" },
  { label: "Programmes", value: "6", note: "Active tracks" },
  { label: "Cohorts", value: "Q2–Q4", note: "2026 calendar" },
  { label: "Placement Rate", value: "—", note: "Tracking begins Q3" },
];

export default function SkillsAlumni() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openChat = (context: string) => {
    localStorage.setItem("hamzury-chat-context", context);
    const btn = document.querySelector("[data-chat-trigger]") as HTMLElement;
    if (btn) btn.click();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
      <SplashScreen text="HAMZURY" color={DARK} departmentName="Skills" tagline="Alumni Network" />
      <PageMeta title="Alumni — Hamzury Skills" description="Hamzury Skills alumni network. Where our graduates go and what they build." />

      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
        style={{
          backgroundColor: scrolled ? `${W}F5` : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.04)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between relative">
          <Link href="/skills"><span className="text-[13px] tracking-[4px] font-light uppercase cursor-pointer" style={{ color: TEXT }}>HAMZURY SKILLS</span></Link>
          <button onClick={() => setMobileMenuOpen(p => !p)} className="flex items-center justify-center w-9 h-9 transition-opacity hover:opacity-70" style={{ color: TEXT }} aria-label="Menu">
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {mobileMenuOpen && (
            <div className="absolute top-12 right-0 rounded-2xl py-2 min-w-[220px] shadow-xl" style={{ backgroundColor: W }} onClick={() => setMobileMenuOpen(false)}>
              {[
                { label: "Milestones", href: "/skills/milestones" },
                { label: "Startups", href: "/skills/startups" },
                { label: "HALS", href: "/skills/hals" },
                { label: "Exit", href: "/skills" },
              ].map(item => (
                <Link key={item.href} href={item.href}>
                  <span className="block px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-50 cursor-pointer" style={{ color: TEXT }}>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-[60vh] flex items-center justify-center px-6 pt-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>ALUMNI</p>
          <h1 className="text-[clamp(28px,5vw,44px)] font-light leading-[1.1] tracking-tight mb-6" style={{ color: TEXT }}>
            Where our graduates <span style={{ color: DARK }}>go next.</span>
          </h1>
          <p className="text-[14px] leading-relaxed max-w-md mx-auto" style={{ color: TEXT, opacity: 0.5 }}>
            The Skills network grows with every cohort. Our alumni build, lead, and create across industries.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6" style={{ backgroundColor: W }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-[clamp(28px,4vw,40px)] font-light mb-1" style={{ color: DARK }}>{s.value}</p>
              <p className="text-[13px] font-medium mb-1" style={{ color: TEXT }}>{s.label}</p>
              <p className="text-[11px]" style={{ color: `${TEXT}44` }}>{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ALUMNI GRID / EMPTY STATE */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4 text-center" style={{ color: GOLD }}>NETWORK</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-16 text-center tracking-tight" style={{ color: TEXT }}>Alumni directory.</h2>

          {ALUMNI.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: W, border: `1px solid ${DARK}08` }}>
              <GraduationCap size={32} className="mx-auto mb-5" style={{ color: `${TEXT}18` }} />
              <h3 className="text-[18px] font-light mb-3" style={{ color: TEXT }}>First cohort in progress.</h3>
              <p className="text-[13px] max-w-sm mx-auto mb-8" style={{ color: TEXT, opacity: 0.45 }}>
                Our Q2 2026 cohort is currently in training. Graduates will appear here after their graduation ceremony.
              </p>
              <button
                onClick={() => openChat("I want to enroll in a Skills program so I can be part of the alumni network.")}
                className="px-6 py-3 rounded-full text-[13px] font-medium transition-all hover:scale-[1.02]"
                style={{ backgroundColor: DARK, color: BG }}
              >
                Join the Next Cohort
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ALUMNI.map((a, i) => (
                <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: W, border: `1px solid ${DARK}08` }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${DARK}08` }}>
                      <span className="text-[16px] font-medium" style={{ color: DARK }}>{a.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium" style={{ color: TEXT }}>{a.name}</h3>
                      <p className="text-[12px]" style={{ color: `${TEXT}55` }}>{a.programme} — {a.cohort}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={12} style={{ color: `${TEXT}44` }} />
                      <span className="text-[12px]" style={{ color: `${TEXT}66` }}>{a.currentRole}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} style={{ color: `${TEXT}44` }} />
                      <span className="text-[12px]" style={{ color: `${TEXT}66` }}>{a.location}</span>
                    </div>
                  </div>
                  {a.quote && (
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${DARK}08` }}>
                      <div className="flex items-start gap-2">
                        <Quote size={12} className="shrink-0 mt-0.5" style={{ color: GOLD }} />
                        <p className="text-[12px] italic leading-relaxed" style={{ color: TEXT, opacity: 0.55 }}>{a.quote}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STAY CONNECTED */}
      <section className="py-20 px-6" style={{ backgroundColor: W }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-4 tracking-tight" style={{ color: TEXT }}>
            Stay connected.
          </h2>
          <p className="text-[13px] mb-8" style={{ color: TEXT, opacity: 0.5 }}>
            Alumni get priority access to advanced programmes, mentorship opportunities, and the Hamzury network.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => openChat("I'm a Skills alumnus and I'd like to stay connected with the network.")}
              className="px-6 py-3 rounded-full text-[13px] font-medium transition-all hover:scale-[1.02]"
              style={{ backgroundColor: DARK, color: BG }}
            >
              Connect as Alumni
            </button>
            <button
              onClick={() => openChat("I'm interested in partnering with Hamzury Skills as an employer or mentor.")}
              className="px-6 py-3 rounded-full text-[13px] font-medium transition-all hover:scale-[1.02]"
              style={{ backgroundColor: `${DARK}08`, color: DARK }}
            >
              Partner with Us
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[12px]" style={{ color: TEXT, opacity: 0.4 }}>
          <Link href="/skills"><span className="cursor-pointer">Hamzury Skills</span></Link>
          <p>&copy; {new Date().getFullYear()} HAMZURY</p>
          <div className="flex items-center gap-6">
            <Link href="/skills/milestones"><span className="hover:opacity-80 transition-opacity cursor-pointer">Milestones</span></Link>
            <Link href="/skills/startups"><span className="hover:opacity-80 transition-opacity cursor-pointer">Startups</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
