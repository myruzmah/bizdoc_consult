import { useState, useEffect } from "react";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import {
  Menu, X, MessageSquare, Code2, Brain, Rocket, Users,
  GraduationCap, Target, Lightbulb, Mail, Linkedin, Github,
  Award, Briefcase, Monitor, Cpu, Zap, Globe,
} from "lucide-react";
import SplashScreen from "@/components/SplashScreen";

const DARK = "#1E3A5F";
const GOLD = "#B48C4C";
const TEXT = "#1A1A1A";
const BG   = "#FFFAF6";
const W    = "#FFFFFF";

const ROLES = [
  { icon: Briefcase, title: "CEO & Academic Director", org: "Hamzury Innovation Hub", description: "Leading Hamzury Innovation Hub with a mission to build practical tech opportunities and empower the next generation." },
  { icon: Code2, title: "Full-Stack Software Developer", org: "", description: "Designing and shipping web platforms, AI-powered tools, dashboards, verification systems, and digital products." },
  { icon: Rocket, title: "Innovation-Driven Builder", org: "", description: "Focused on turning ideas into working products that solve real problems across education, operations, and social impact." },
];

const SKILLS = [
  { icon: Monitor, label: "Full-Stack Development" },
  { icon: Cpu, label: "PHP & MySQL Systems" },
  { icon: Code2, label: "JavaScript & Frontend UI" },
  { icon: Brain, label: "AI Product Prototyping" },
  { icon: Zap, label: "Hackathon MVP Development" },
  { icon: Users, label: "Technical Leadership" },
];

const PROJECTS = [
  { name: "Canvas Coach", tag: "Award-Winning", description: "A creative-tech project recognized for excellence in creativity and innovation." },
  { name: "RealityOS AI", tag: "AI Platform", description: "A future-focused AI platform concept built to demonstrate bold product thinking and technical execution." },
  { name: "JobFit AI", tag: "AI Solution", description: "A practical AI-driven solution designed to improve job matching and career opportunity discovery." },
  { name: "Hamzury Platform", tag: "Live Product", description: "The all-in-one business consultancy platform — registration, compliance, Skills training, and growth systems." },
  { name: "Shifa AI", tag: "Team Project", description: "AI-powered solution built as a Q1 2025 team project. Student-led, mentor-guided, shipped to production." },
];

export default function SkillsCEOPage() {
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
      <SplashScreen text="HAMZURY" color={DARK} departmentName="Skills" tagline="CEO" />
      <PageMeta title="Idris Ibrahim — CEO, Hamzury Skills" description="Meet Idris Ibrahim — Software Developer, Tech Leader, and CEO of Hamzury Innovation Hub." />

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
      <section className="min-h-[70vh] flex items-center justify-center px-6 pt-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${DARK}08` }}>
            <span className="text-[32px] font-light" style={{ color: DARK }}>II</span>
          </div>
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>CEO & ACADEMIC DIRECTOR</p>
          <h1 className="text-[clamp(28px,5vw,44px)] font-light leading-[1.1] tracking-tight mb-4" style={{ color: TEXT }}>
            Idris <span style={{ color: DARK }}>Ibrahim</span>
          </h1>
          <p className="text-[14px] leading-relaxed max-w-lg mx-auto mb-8" style={{ color: TEXT, opacity: 0.5 }}>
            Software Developer. Tech Leader. Builder of impact-driven solutions. Building digital products, AI-powered systems, and scalable platforms that solve real problems.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => openChat("I'd like to connect with Idris Ibrahim about a collaboration, partnership, or project opportunity.")}
              className="px-7 py-3.5 rounded-full text-[13px] font-medium transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: DARK, color: BG, boxShadow: `0 4px 24px ${DARK}20` }}
            >
              Contact Me
            </button>
            <button
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3.5 rounded-full text-[13px] font-medium transition-all duration-300 hover:opacity-80"
              style={{ color: TEXT, border: `1px solid ${TEXT}20` }}
            >
              View Projects
            </button>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: W }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4 text-center" style={{ color: GOLD }}>PROFESSIONAL SNAPSHOT</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-16 text-center tracking-tight" style={{ color: TEXT }}>
            Driven by innovation, execution, and <span style={{ color: DARK }}>impact.</span>
          </h2>

          <div className="space-y-5">
            {ROLES.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="rounded-2xl p-7 transition-all hover:shadow-md" style={{ backgroundColor: BG, border: `1px solid ${DARK}08` }}>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${DARK}08` }}>
                      <Icon size={20} style={{ color: DARK }} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-medium mb-1" style={{ color: TEXT }}>{r.title}</h3>
                      {r.org && <p className="text-[12px] font-medium mb-2" style={{ color: GOLD }}>{r.org}</p>}
                      <p className="text-[13px] leading-relaxed" style={{ color: TEXT, opacity: 0.55 }}>{r.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4 text-center" style={{ color: GOLD }}>ABOUT ME</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-10 text-center tracking-tight" style={{ color: TEXT }}>
            Building technology with <span style={{ color: DARK }}>purpose.</span>
          </h2>

          <div className="space-y-5 text-[14px] leading-relaxed" style={{ color: TEXT, opacity: 0.6 }}>
            <p>
              I am Idris Ibrahim, a software developer and innovation leader passionate about building practical solutions that create real value. I work across product design, development, AI integration, and systems thinking to turn concepts into usable digital experiences.
            </p>
            <p>
              Beyond writing code, I care deeply about leadership, mentorship, and creating opportunities for others through technology. My long-term vision is to help transform lives at scale by building systems, tools, and communities that unlock growth.
            </p>
          </div>
        </div>
      </section>

      {/* CORE SKILLS */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: W }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4 text-center" style={{ color: GOLD }}>CORE SKILLS</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-14 text-center tracking-tight" style={{ color: TEXT }}>What I work with.</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SKILLS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="rounded-2xl p-5 text-center transition-all hover:shadow-md" style={{ backgroundColor: BG, border: `1px solid ${DARK}08` }}>
                  <Icon size={22} className="mx-auto mb-3" style={{ color: DARK }} />
                  <p className="text-[13px] font-medium" style={{ color: TEXT }}>{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section id="work" className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4 text-center" style={{ color: GOLD }}>SELECTED WORK</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-14 text-center tracking-tight" style={{ color: TEXT }}>
            Projects and innovation <span style={{ color: DARK }}>highlights.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROJECTS.map((p, i) => (
              <div key={i} className="rounded-2xl p-6 transition-all hover:shadow-md" style={{ backgroundColor: W, border: `1px solid ${DARK}08` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${DARK}08` }}>
                    <Lightbulb size={16} style={{ color: DARK }} />
                  </div>
                  <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${GOLD}15`, color: GOLD }}>{p.tag}</span>
                </div>
                <h3 className="text-[16px] font-medium mb-2" style={{ color: TEXT }}>{p.name}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: TEXT, opacity: 0.55 }}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: W }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>VISION</p>
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-6 tracking-tight" style={{ color: TEXT }}>
            Technology, leadership, and <span style={{ color: DARK }}>scale.</span>
          </h2>
          <p className="text-[14px] leading-relaxed max-w-lg mx-auto" style={{ color: TEXT, opacity: 0.55 }}>
            My goal is not just to build products, but to build platforms, systems, and opportunities that help people grow. I believe technology should be useful, accessible, and capable of unlocking transformation at scale.
          </p>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[clamp(22px,3.5vw,32px)] font-light mb-4 tracking-tight" style={{ color: TEXT }}>
            Let's build something <span style={{ color: DARK }}>meaningful.</span>
          </h2>
          <p className="text-[13px] mb-10" style={{ color: TEXT, opacity: 0.5 }}>
            Available for collaborations, speaking, partnerships, innovation projects, and software development opportunities.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => openChat("I'd like to reach out to Idris Ibrahim about a collaboration or opportunity.")}
              className="px-7 py-3.5 rounded-full text-[13px] font-medium transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
              style={{ backgroundColor: DARK, color: BG, boxShadow: `0 4px 24px ${DARK}20` }}
            >
              <Mail size={14} /> Get in Touch
            </button>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-full text-[13px] font-medium transition-all duration-300 hover:opacity-80 flex items-center gap-2"
              style={{ color: TEXT, border: `1px solid ${TEXT}20` }}
            >
              <Linkedin size={14} /> LinkedIn
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-full text-[13px] font-medium transition-all duration-300 hover:opacity-80 flex items-center gap-2"
              style={{ color: TEXT, border: `1px solid ${TEXT}20` }}
            >
              <Github size={14} /> GitHub
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6" style={{ backgroundColor: W }}>
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
