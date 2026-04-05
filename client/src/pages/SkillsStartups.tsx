import { useState, useEffect } from "react";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import {
  Rocket, Lightbulb, Users, TrendingUp, Shield,
  Menu, X, MessageSquare, ArrowRight, ExternalLink, Globe,
} from "lucide-react";
import SplashScreen from "@/components/SplashScreen";

const DARK = "#1E3A5F";
const GOLD = "#B48C4C";
const TEXT = "#1A1A1A";
const BG = "#FFFAF6";
const W = "#FFFFFF";

type Startup = {
  name: string;
  founder: string;
  founderInitials: string;
  cohort: string;
  sector: string;
  description: string;
  pitch: string;
  website?: string;
  status: "building" | "launched" | "scaling";
  type: "student" | "company";
};

// Hamzury company startups
const COMPANY_STARTUPS: Startup[] = [
  { name: "Hamzury", founder: "Hamzat", founderInitials: "H", cohort: "2025", sector: "Business Services", description: "All-in-one business consultancy — registration, compliance, and growth systems for Nigerian businesses.", pitch: "Making business registration and compliance simple for every Nigerian entrepreneur.", website: "https://www.hamzury.com", status: "launched", type: "company" },
  { name: "BizDoc Consult", founder: "Hamzury", founderInitials: "H", cohort: "2025", sector: "Business Registration", description: "CAC registration, tax compliance, and business documentation handled end-to-end.", pitch: "End-to-end business documentation so founders focus on building, not paperwork.", website: "https://www.hamzury.com/bizdoc", status: "launched", type: "company" },
  { name: "Systemise", founder: "Hamzury", founderInitials: "H", cohort: "2026", sector: "Tech & Automation", description: "Business automation, website development, and tech solutions for growing companies.", pitch: "Helping businesses automate what slows them down.", website: "https://www.hamzury.com/systemise", status: "launched", type: "company" },
  { name: "MetFix", founder: "Retained Student", founderInitials: "R", cohort: "2026", sector: "Facility Management", description: "On-demand maintenance, repairs, and facility management for homes and businesses. Built by a retained student from our training programme.", pitch: "On-demand maintenance and repairs without the hassle of finding reliable technicians.", website: "https://www.hamzury.com/metfix", status: "building", type: "company" },
];

// Student startups — will grow as cohorts graduate
const STUDENT_STARTUPS: Startup[] = [
  { name: "Shifa AI", founder: "Team AI — 2025 Cohort 1", founderInitials: "SA", cohort: "Q1 2025", sector: "Artificial Intelligence", description: "AI-powered solution built as a Q1 team project by our 2025 Cohort 1 students. Proof that students ship real products.", pitch: "AI-powered health guidance for communities with limited access to healthcare.", status: "launched", type: "student" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  building: { bg: `${GOLD}15`, text: GOLD, label: "Building" },
  launched: { bg: "#16A34A15", text: "#16A34A", label: "Launched" },
  scaling: { bg: `${DARK}10`, text: DARK, label: "Scaling" },
};

const SUPPORT_PILLARS = [
  { icon: Lightbulb, title: "Clarity Sessions", description: "Before building, students undergo guided sessions to refine their vision and validate their ideas." },
  { icon: Shield, title: "Real Skills Training", description: "Web development, data analysis, cybersecurity — students learn the actual tools they need to build." },
  { icon: Users, title: "Department Placement", description: "IT students work in real departments, building real products — not simulations." },
  { icon: TrendingUp, title: "Launch Support", description: "From prototype to market. We guide graduates through their first customers and first revenue." },
];

function StartupCard({ s }: { s: Startup }) {
  const status = STATUS_COLORS[s.status];
  const isClickable = !!s.website;

  const handleClick = () => {
    if (s.website) window.open(s.website, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-2xl p-6 transition-all duration-300 hover:shadow-lg group"
      style={{
        backgroundColor: W,
        border: `1px solid ${DARK}08`,
        cursor: isClickable ? "pointer" : "default",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: s.type === "company" ? DARK : `${DARK}12`,
              color: s.type === "company" ? W : DARK,
            }}
          >
            <span className="text-[13px] font-semibold tracking-wide">{s.founderInitials}</span>
          </div>
          <div>
            <h3 className="text-[15px] font-medium" style={{ color: TEXT }}>{s.name}</h3>
            <p className="text-[11px]" style={{ color: `${TEXT}55` }}>{s.founder}</p>
          </div>
        </div>
        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0" style={{ backgroundColor: status.bg, color: status.text }}>
          {status.label}
        </span>
      </div>

      {/* Pitch callout */}
      <div className="rounded-xl px-4 py-3 mb-4" style={{ backgroundColor: `${GOLD}08`, borderLeft: `3px solid ${GOLD}` }}>
        <p className="text-[13px] leading-relaxed italic" style={{ color: TEXT, opacity: 0.75 }}>"{s.pitch}"</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${DARK}06`, color: `${TEXT}66` }}>{s.sector}</span>
          <span className="text-[10px]" style={{ color: `${TEXT}44` }}>{s.cohort}</span>
        </div>
        {s.website && (
          <span
            className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all group-hover:scale-[1.03]"
            style={{ backgroundColor: `${GOLD}12`, color: GOLD }}
          >
            Visit <ExternalLink size={12} />
          </span>
        )}
      </div>
    </div>
  );
}

export default function SkillsStartups() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"company" | "student">("company");

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
      <SplashScreen text="HAMZURY" color={DARK} departmentName="Skills" tagline="Startups" />
      <PageMeta title="Startups — Hamzury Skills" description="Startups born from Hamzury Skills training programmes and Hamzury company ventures." />

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
                { label: "Alumni", href: "/skills/alumni" },
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
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>STARTUPS</p>
          <h1 className="text-[clamp(28px,5vw,44px)] font-light leading-[1.1] tracking-tight mb-6" style={{ color: TEXT }}>
            From student to <span style={{ color: DARK }}>founder.</span>
          </h1>
          <p className="text-[14px] leading-relaxed max-w-md mx-auto" style={{ color: TEXT, opacity: 0.5 }}>
            Skills doesn't just teach — it builds. Students with vision get trained on exactly what they need to launch.
          </p>
        </div>
      </section>

      {/* HOW WE SUPPORT */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: W }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4 text-center" style={{ color: GOLD }}>THE PROCESS</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-16 text-center tracking-tight" style={{ color: TEXT }}>How we support founders.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUPPORT_PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="rounded-2xl p-7 transition-all hover:shadow-md" style={{ backgroundColor: BG, border: `1px solid ${DARK}08` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: `${DARK}08` }}>
                    <Icon size={18} style={{ color: DARK }} />
                  </div>
                  <h3 className="text-[16px] font-medium mb-2" style={{ color: TEXT }}>{p.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: TEXT, opacity: 0.55 }}>{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STARTUPS GRID — tabbed */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4 text-center" style={{ color: GOLD }}>SHOWCASE</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-10 text-center tracking-tight" style={{ color: TEXT }}>Our ventures.</h2>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveTab("company")}
              className="px-5 py-2.5 rounded-full text-[13px] font-medium transition-all"
              style={{
                backgroundColor: activeTab === "company" ? DARK : `${DARK}06`,
                color: activeTab === "company" ? W : TEXT,
              }}
            >
              <Globe size={14} className="inline mr-2" />
              Hamzury Ventures
            </button>
            <button
              onClick={() => setActiveTab("student")}
              className="px-5 py-2.5 rounded-full text-[13px] font-medium transition-all"
              style={{
                backgroundColor: activeTab === "student" ? DARK : `${DARK}06`,
                color: activeTab === "student" ? W : TEXT,
              }}
            >
              <Rocket size={14} className="inline mr-2" />
              Student Startups
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(activeTab === "company" ? COMPANY_STARTUPS : STUDENT_STARTUPS).map((s, i) => (
              <StartupCard key={i} s={s} />
            ))}
          </div>

          {activeTab === "student" && (
            <div className="mt-10 rounded-2xl p-8 text-center" style={{ backgroundColor: `${DARK}04` }}>
              <Rocket size={24} className="mx-auto mb-4" style={{ color: `${TEXT}22` }} />
              <p className="text-[14px] font-light mb-2" style={{ color: TEXT }}>More student startups launching soon.</p>
              <p className="text-[12px]" style={{ color: `${TEXT}44` }}>Every cohort produces builders. Watch this space as more graduates ship products.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ backgroundColor: W }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-4 tracking-tight" style={{ color: TEXT }}>
            Have a vision? We'll help you build it.
          </h2>
          <p className="text-[13px] mb-8" style={{ color: TEXT, opacity: 0.5 }}>
            If you're building something or want to — tell us about it. We train you on exactly what you need.
          </p>
          <button
            onClick={() => openChat("I have a startup idea or I'm building something. I'd like to learn more about how Skills can help me develop the skills I need to launch.")}
            className="px-8 py-4 rounded-full text-[14px] font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: DARK, color: BG, boxShadow: `0 4px 24px ${DARK}20` }}
          >
            Tell Us Your Vision
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[12px]" style={{ color: TEXT, opacity: 0.4 }}>
          <Link href="/skills"><span className="cursor-pointer">Hamzury Skills</span></Link>
          <p>&copy; {new Date().getFullYear()} HAMZURY</p>
          <div className="flex items-center gap-6">
            <Link href="/skills/milestones"><span className="hover:opacity-80 transition-opacity cursor-pointer">Milestones</span></Link>
            <Link href="/skills/alumni"><span className="hover:opacity-80 transition-opacity cursor-pointer">Alumni</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
