import { useState, useEffect } from "react";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import {
  Award, Trophy, Star, Target, Users, GraduationCap,
  Calendar, ChevronRight, Menu, X, MessageSquare,
  Heart, Video, Camera, TrendingUp, Rocket, UserCheck,
} from "lucide-react";
import SplashScreen from "@/components/SplashScreen";

const DARK = "#1E3A5F";
const GOLD = "#B48C4C";
const TEXT = "#1A1A1A";
const BG = "#FFFAF6";
const W = "#FFFFFF";

type Milestone = {
  year: string;
  title: string;
  description: string;
  icon: typeof Award;
  highlight?: boolean;
};

const MILESTONES: Milestone[] = [
  { year: "2026 Q2", title: "Skills Department Launched", description: "First cohort enrolled — Website Development, Data Analysis, Robotics & Creative Tech, Cybersecurity Fundamentals.", icon: Star, highlight: true },
  { year: "2026 Q2", title: "Clarity Sessions Introduced", description: "IT students without a clear direction receive one-on-one guidance to discover their path before training begins.", icon: Target },
  { year: "2026 Q2", title: "Basic Computer Programme", description: "Thursday–Friday–Saturday classes launched for foundational digital literacy.", icon: Users },
  { year: "2026 Q3", title: "First Graduation Ceremony", description: "Celebrating the first cohort of graduates who completed hands-on, market-ready training.", icon: GraduationCap, highlight: true },
  { year: "2026 Q3", title: "Corporate Staff Training", description: "Organisations begin sending staff for tailored upskilling programmes.", icon: Trophy },
  { year: "2026 Q4", title: "Executive Circle Launch", description: "Premium leadership and strategy programme for founders and executives.", icon: Award, highlight: true },
];

type AwardItem = {
  title: string;
  recipient: string;
  cohort: string;
};

const AWARDS: AwardItem[] = [
  { title: "Most Improved Student", recipient: "To be awarded", cohort: "Q2 2026" },
  { title: "Best Final Project", recipient: "To be awarded", cohort: "Q2 2026" },
  { title: "Community Impact Award", recipient: "To be awarded", cohort: "Q2 2026" },
  { title: "Innovation Award", recipient: "To be awarded", cohort: "Q2 2026" },
  { title: "Leadership Excellence", recipient: "To be awarded", cohort: "Q3 2026" },
  { title: "Perfect Attendance", recipient: "To be awarded", cohort: "Q2 2026" },
];

export default function SkillsMilestones() {
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
      <SplashScreen text="HAMZURY" color={DARK} departmentName="Skills" tagline="Milestones & Achievements" />
      <PageMeta title="Milestones & Achievements — Hamzury Skills" description="Tracking the journey of Hamzury Skills — milestones, achievements, and awards." />

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
                { label: "Startups", href: "/skills/startups" },
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
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>MILESTONES & ACHIEVEMENTS</p>
          <h1 className="text-[clamp(28px,5vw,44px)] font-light leading-[1.1] tracking-tight mb-6" style={{ color: TEXT }}>
            Building something <span style={{ color: DARK }}>worth remembering.</span>
          </h1>
          <p className="text-[14px] leading-relaxed max-w-md mx-auto" style={{ color: TEXT, opacity: 0.5 }}>
            Every cohort writes a new chapter. Here's the journey so far.
          </p>
        </div>
      </section>

      {/* OUR TRACK RECORD */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: W }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4 text-center" style={{ color: GOLD }}>OUR TRACK RECORD</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-4 text-center tracking-tight" style={{ color: TEXT }}>We don't talk — we <span style={{ color: DARK }}>show results.</span></h2>
          <p className="text-[13px] text-center mb-14 max-w-md mx-auto" style={{ color: `${TEXT}55` }}>
            Before we opened enrollment, we were already training. Here's what we've done.
          </p>

          {/* Impact stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
            {[
              { value: "215+", label: "Students Trained", Icon: GraduationCap },
              { value: "90%", label: "Startups Working", Icon: Rocket },
              { value: "87%", label: "Got A Grade (IT)", Icon: Award },
              { value: "11", label: "Students Retained", Icon: UserCheck },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-6 text-center" style={{ backgroundColor: BG, border: `1px solid ${DARK}08` }}>
                <s.Icon size={20} className="mx-auto mb-3" style={{ color: GOLD }} />
                <p className="text-[clamp(24px,4vw,36px)] font-light mb-1" style={{ color: DARK }}>{s.value}</p>
                <p className="text-[12px] font-medium" style={{ color: `${TEXT}55` }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Impact stories */}
          <div className="space-y-5">
            <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6" style={{ backgroundColor: BG, border: `1px solid ${DARK}08` }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${GOLD}15` }}>
                <Heart size={22} style={{ color: GOLD }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-[16px] font-medium" style={{ color: TEXT }}>40 Sponsored Orphans — RIDI Boot Camp</h3>
                  <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#16A34A15", color: "#15803D" }}>Completed</span>
                </div>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: TEXT, opacity: 0.55 }}>
                  Third-term boot camp teaching basic computer skills to 40 children sponsored by RIDI. Every child graduated with practical digital literacy.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href="https://www.youtube.com/@hamzury" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-medium transition-opacity hover:opacity-70" style={{ backgroundColor: `${DARK}08`, color: DARK }}>
                    <Video size={13} /> Graduation Video
                  </a>
                  <a href="https://www.youtube.com/@hamzury" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-medium transition-opacity hover:opacity-70" style={{ backgroundColor: `${DARK}08`, color: DARK }}>
                    <Camera size={13} /> Photos
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6" style={{ backgroundColor: BG, border: `1px solid ${DARK}08` }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#8B5CF615" }}>
                <Users size={22} style={{ color: "#8B5CF6" }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-[16px] font-medium" style={{ color: TEXT }}>75 Young Women — Software Development</h3>
                  <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#16A34A15", color: "#15803D" }}>Completed</span>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: TEXT, opacity: 0.55 }}>
                  Trained 75 young women in software development. Building technical capability and career paths in tech.
                </p>
              </div>
            </div>

            <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6" style={{ backgroundColor: BG, border: `1px solid ${DARK}08` }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#2563EB15" }}>
                <TrendingUp size={22} style={{ color: "#2563EB" }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-[16px] font-medium" style={{ color: TEXT }}>100 Students — Jos Digital Rise</h3>
                  <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "#16A34A15", color: "#15803D" }}>Completed</span>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: TEXT, opacity: 0.55 }}>
                  100 students trained through the Jos Digital Rise initiative. Expanding digital skills access across Plateau State.
                </p>
              </div>
            </div>

            <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6" style={{ backgroundColor: BG, border: `1px solid ${DARK}08` }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#16A34A15" }}>
                <Award size={22} style={{ color: "#16A34A" }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="text-[16px] font-medium" style={{ color: TEXT }}>20 out of 23 IT Students — Grade A</h3>
                  <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${GOLD}15`, color: GOLD }}>87% A Grade</span>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: TEXT, opacity: 0.55 }}>
                  20 out of 23 IT students scored A and went on to start their own businesses. We retained 11 of our total students as staff — and 90% of graduates have working startups. MetFix (our facility management arm) was built by a retained student. Shifa AI was a 2025 Cohort 1, Q1 team project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4 text-center" style={{ color: GOLD }}>TIMELINE</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-16 text-center tracking-tight" style={{ color: TEXT }}>Key milestones.</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px" style={{ backgroundColor: `${DARK}12` }} />

            <div className="space-y-10">
              {MILESTONES.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="flex items-start gap-5 md:gap-8 pl-2">
                    <div
                      className="relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: m.highlight ? GOLD : `${DARK}08`,
                        boxShadow: m.highlight ? `0 4px 16px ${GOLD}30` : "none",
                      }}
                    >
                      <Icon size={18} style={{ color: m.highlight ? W : DARK }} />
                    </div>
                    <div className="pt-1">
                      <p className="text-[11px] font-medium tracking-[0.15em] uppercase mb-1" style={{ color: GOLD }}>{m.year}</p>
                      <h3 className="text-[16px] md:text-[18px] font-medium mb-2" style={{ color: TEXT }}>{m.title}</h3>
                      <p className="text-[13px] leading-relaxed" style={{ color: TEXT, opacity: 0.55 }}>{m.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: W }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4 text-center" style={{ color: GOLD }}>RECOGNITION</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-16 text-center tracking-tight" style={{ color: TEXT }}>Awards & recognition.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AWARDS.map((a, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 transition-all hover:shadow-md"
                style={{ backgroundColor: BG, border: `1px solid ${DARK}08` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${GOLD}15` }}>
                    <Trophy size={14} style={{ color: GOLD }} />
                  </div>
                  <p className="text-[11px] font-medium tracking-[0.15em] uppercase" style={{ color: `${TEXT}44` }}>{a.cohort}</p>
                </div>
                <h3 className="text-[15px] font-medium mb-2" style={{ color: TEXT }}>{a.title}</h3>
                <p className="text-[13px]" style={{ color: TEXT, opacity: 0.45 }}>{a.recipient}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-6 tracking-tight" style={{ color: TEXT }}>
            Be part of the next milestone.
          </h2>
          <button
            onClick={() => openChat("I want to enroll in a Skills program. Please ask me some questions to understand my goals.")}
            className="px-8 py-4 rounded-full text-[14px] font-medium transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: DARK, color: BG, boxShadow: `0 4px 24px ${DARK}20` }}
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6" style={{ backgroundColor: W }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[12px]" style={{ color: TEXT, opacity: 0.4 }}>
          <Link href="/skills"><span className="cursor-pointer">Hamzury Skills</span></Link>
          <p>&copy; {new Date().getFullYear()} HAMZURY</p>
          <div className="flex items-center gap-6">
            <Link href="/skills/startups"><span className="hover:opacity-80 transition-opacity cursor-pointer">Startups</span></Link>
            <Link href="/skills/alumni"><span className="hover:opacity-80 transition-opacity cursor-pointer">Alumni</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
