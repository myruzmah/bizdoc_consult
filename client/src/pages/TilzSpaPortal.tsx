import { useState, useEffect, useRef, useCallback } from "react";
import PageMeta from "@/components/PageMeta";
import {
  Phone, MapPin, Clock, Menu, X, ChevronRight,
  Droplets, Flame, Scissors, Sparkles, Heart, Shield,
  Star, MessageCircle, ExternalLink, Instagram, Facebook,
} from "lucide-react";

// ── BRAND COLOURS ───────────────────────────────────────────────────────────
const C = {
  chocolate: "#3C2415",
  cappuccino: "#C4A882",
  roseGold: "#B76E79",
  gold: "#D4AF6F",
  cream: "#F5F0E8",
  ivory: "#FAF7F2",
  white: "#FFFFFF",
};

const WA = "https://wa.me/2348172371818";
const waMsg = (service: string) =>
  `${WA}?text=${encodeURIComponent(`Hello Tilz Spa, I'd like to book: ${service}`)}`;

// ── NAV LINKS ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Sauna", href: "#sauna" },
  { label: "Barbing", href: "#barbing" },
  { label: "Founder", href: "#founder" },
  { label: "Contact", href: "#contact" },
];

// ── SERVICE DATA ────────────────────────────────────────────────────────────
type Service = {
  name: string;
  price: string;
  desc: string;
  icon: typeof Droplets;
  coming?: boolean;
};

const SPA_SERVICES: Service[] = [
  { name: "Luxury Bathing Rituals", price: "\u20A615K - 25K", desc: "Premium bath therapy with essential oils, mineral salts and aromatic botanicals for total body renewal.", icon: Droplets },
  { name: "Medical-Grade Pedicures", price: "\u20A620K - 35K", desc: "Clinical-level foot care with sterilised instruments, callus treatment and luxury moisturising finish.", icon: Sparkles },
  { name: "Signature Spa Treatments", price: "\u20A635K - 60K", desc: "Our bespoke full-body treatment combining massage, exfoliation and hydration for the ultimate indulgence.", icon: Heart },
  { name: "Facial Rejuvenation", price: "Coming Soon", desc: "Advanced facial treatments using premium skincare products for a radiant, youthful complexion.", icon: Star, coming: true },
  { name: "Couples Package", price: "Coming Soon", desc: "A shared sanctuary experience designed for two. Perfect for anniversaries and special occasions.", icon: Heart, coming: true },
  { name: "Bridal Package", price: "Coming Soon", desc: "Head-to-toe bridal prep with personalised treatments to ensure you glow on your special day.", icon: Sparkles, coming: true },
];

const SAUNA_SERVICES: Service[] = [
  { name: "Steam Sauna Session", price: "\u20A610K - 15K", desc: "Traditional steam sauna for deep detoxification, stress relief and improved circulation.", icon: Flame },
  { name: "Infrared Sauna", price: "\u20A615K - 20K", desc: "Gentle infrared heat therapy that penetrates deeper for muscle recovery and skin purification.", icon: Flame },
  { name: "Sauna + Spa Combo", price: "\u20A625K - 40K", desc: "The complete wellness circuit: sauna detox followed by a rejuvenating spa treatment.", icon: Droplets },
  { name: "Private Sauna Room", price: "\u20A620K - 30K", desc: "An exclusive private sauna experience with personalised temperature and aromatherapy settings.", icon: Shield },
];

const BARBING_SERVICES: Service[] = [
  { name: "Executive Haircut", price: "\u20A65K - 8K", desc: "Precision cuts tailored to your style with hot towel finish and scalp massage.", icon: Scissors },
  { name: "Beard Grooming & Shaping", price: "\u20A63K - 5K", desc: "Expert beard sculpting, trimming and conditioning for a sharp, refined look.", icon: Scissors },
  { name: "Hot Towel Shave", price: "\u20A65K - 8K", desc: "Classic straight-razor shave with pre-shave oil, hot towel and aftershave balm.", icon: Flame },
  { name: "Hair & Beard Combo", price: "\u20A68K - 12K", desc: "Complete grooming session: precision haircut paired with professional beard styling.", icon: Scissors },
  { name: "Hair Treatment", price: "\u20A610K - 15K", desc: "Deep conditioning, scalp therapy and nourishing treatments for healthier, stronger hair.", icon: Sparkles },
  { name: "VIP Package", price: "\u20A615K - 20K", desc: "The full executive experience: haircut, beard grooming and mini facial in one premium session.", icon: Star },
];

const TABS = [
  { key: "spa", label: "SPA", data: SPA_SERVICES },
  { key: "sauna", label: "SAUNA", data: SAUNA_SERVICES },
  { key: "barbing", label: "BARBING SALON", data: BARBING_SERVICES },
] as const;

const VALUES = [
  { label: "Discretion", icon: Shield },
  { label: "Quality", icon: Star },
  { label: "Serenity", icon: Droplets },
  { label: "Refinement", icon: Sparkles },
];

const STEPS = [
  { num: "01", title: "Welcome", desc: "Step into a world of calm. Our reception team greets you with refreshments and a warm smile." },
  { num: "02", title: "Consultation", desc: "Your therapist listens to your needs and designs a personalised treatment plan just for you." },
  { num: "03", title: "Treatment", desc: "Surrender to expert hands in our serene treatment rooms, crafted for total relaxation." },
  { num: "04", title: "Afterglow", desc: "Leave feeling renewed. We provide aftercare guidance to extend your spa benefits at home." },
];

// ── FADE-IN HOOK ────────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, className: `transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}` };
}

function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const f = useFadeIn();
  return <div ref={f.ref} className={`${f.className} ${className}`}>{children}</div>;
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function TilzSpaPortal() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"spa" | "sauna" | "barbing">("spa");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id.replace("#", ""));
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const activeServices = TABS.find((t) => t.key === activeTab)!.data;

  return (
    <>
      <PageMeta
        title="Tilz Spa | Luxury Spa, Sauna & Barbing Salon — Wuse 2, Abuja"
        description="A sanctuary of calm in the heart of Abuja. Luxury spa treatments, sauna sessions and executive barbing by Tilz Spa. Book your visit today."
      />

      {/* ── FIXED NAV ──────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(60,36,21,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
          {/* Logo */}
          <a href="#hero" onClick={() => scrollTo("#hero")} className="flex items-center gap-2 cursor-pointer">
            <span
              className="text-2xl tracking-wide"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: scrolled ? C.gold : C.chocolate,
                fontWeight: 700,
              }}
            >
              Tilz <span style={{ color: C.roseGold, fontStyle: "italic" }}>Spa</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-sm tracking-wide transition-colors hover:opacity-80"
                style={{
                  fontFamily: "'Lato', system-ui, sans-serif",
                  color: scrolled ? C.cream : C.chocolate,
                  fontWeight: 500,
                }}
              >
                {l.label}
              </button>
            ))}
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105"
              style={{ background: C.roseGold, color: C.white }}
            >
              Book Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <X size={24} style={{ color: scrolled ? C.cream : C.chocolate }} />
              : <Menu size={24} style={{ color: scrolled ? C.cream : C.chocolate }} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 pb-6 pt-2 px-5 flex flex-col gap-4 border-t"
            style={{
              background: "rgba(60,36,21,0.97)",
              borderColor: "rgba(196,168,130,0.2)",
            }}
          >
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-left text-base tracking-wide"
                style={{ color: C.cream, fontFamily: "'Lato', system-ui, sans-serif" }}
              >
                {l.label}
              </button>
            ))}
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-center px-5 py-3 rounded-full font-semibold"
              style={{ background: C.roseGold, color: C.white }}
            >
              Book Now
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center text-center px-5"
        style={{
          background: `linear-gradient(160deg, ${C.ivory} 0%, ${C.cream} 40%, rgba(183,110,121,0.12) 100%)`,
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-[0.07]" style={{ background: C.roseGold }} />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-[0.05]" style={{ background: C.gold }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p
            className="text-xs tracking-[0.35em] uppercase mb-6 opacity-70"
            style={{ color: C.roseGold, fontFamily: "'Lato', system-ui, sans-serif" }}
          >
            Wuse 2, Abuja
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.chocolate, fontWeight: 700 }}
          >
            A Sanctuary{" "}
            <span style={{ color: C.roseGold, fontStyle: "italic" }}>of Calm</span>
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(60,36,21,0.7)", fontFamily: "'Lato', system-ui, sans-serif" }}
          >
            Luxury spa treatments, private sauna sessions and executive grooming
            — all in one serene destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-transform hover:scale-105"
              style={{ background: C.roseGold, color: C.white }}
            >
              Book Your Visit <ChevronRight size={16} />
            </a>
            <button
              onClick={() => scrollTo("#services")}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide border transition-transform hover:scale-105"
              style={{ borderColor: C.cappuccino, color: C.chocolate }}
            >
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* ── HAMZURY VERIFIED BADGE ─────────────────────────────────────── */}
      <div
        className="w-full text-center py-3 px-4"
        style={{ background: C.chocolate }}
      >
        <p className="text-xs sm:text-sm tracking-wide" style={{ color: C.cappuccino }}>
          <span style={{ color: C.gold }}>&#10022;</span>{" "}
          Business setup &amp; digital systems by{" "}
          <a
            href="https://www.hamzury.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 font-semibold transition-colors hover:opacity-80"
            style={{ color: C.gold }}
          >
            HAMZURY
          </a>{" "}
          — Verified Client
        </p>
      </div>

      {/* ── ABOUT ──────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 md:py-28 px-5" style={{ background: C.white }}>
        <FadeIn>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p
                className="text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: C.roseGold, fontFamily: "'Lato', system-ui, sans-serif" }}
              >
                Our Story
              </p>
              <h2
                className="text-3xl sm:text-4xl mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.chocolate, fontWeight: 700 }}
              >
                Where Luxury Meets{" "}
                <span style={{ color: C.roseGold, fontStyle: "italic" }}>Wellness</span>
              </h2>
              <div
                className="space-y-4 text-base leading-relaxed"
                style={{ color: "rgba(60,36,21,0.75)", fontFamily: "'Lato', system-ui, sans-serif" }}
              >
                <p>
                  Tilz Spa was born from a simple belief: everyone deserves a space to pause, breathe
                  and be cared for. Founded by Tilda in the heart of Wuse 2, Abuja, our sanctuary
                  brings together the art of relaxation with the science of modern wellness.
                </p>
                <p>
                  From luxury bathing rituals and medical-grade pedicures to private sauna sessions
                  and executive barbing, every experience is crafted with precision, premium products
                  and genuine care.
                </p>
                <p>
                  We do not rush. We do not cut corners. At Tilz Spa, your comfort is the only priority.
                </p>
              </div>
            </div>

            {/* Image placeholder */}
            <div
              className="relative aspect-[4/5] rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${C.cream}, rgba(183,110,121,0.15))` }}
            >
              <div className="text-center px-8">
                <Droplets size={48} style={{ color: C.roseGold }} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm opacity-50" style={{ color: C.chocolate }}>Spa Interior</p>
              </div>
              {/* Decorative border */}
              <div className="absolute inset-3 rounded-xl border" style={{ borderColor: "rgba(196,168,130,0.3)" }} />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── VALUES STRIP ───────────────────────────────────────────────── */}
      <section className="py-14 px-5" style={{ background: C.chocolate }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {VALUES.map((v) => (
            <FadeIn key={v.label} className="flex flex-col items-center text-center gap-3">
              <v.icon size={28} style={{ color: C.gold }} />
              <span
                className="text-sm tracking-[0.25em] uppercase"
                style={{ color: C.cream, fontFamily: "'Lato', system-ui, sans-serif", fontWeight: 600 }}
              >
                {v.label}
              </span>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────────── */}
      <section id="services" className="py-20 md:py-28 px-5" style={{ background: C.ivory }}>
        <FadeIn>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p
                className="text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: C.roseGold, fontFamily: "'Lato', system-ui, sans-serif" }}
              >
                What We Offer
              </p>
              <h2
                className="text-3xl sm:text-4xl"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.chocolate, fontWeight: 700 }}
              >
                Our <span style={{ color: C.roseGold, fontStyle: "italic" }}>Services</span>
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <div
                className="inline-flex rounded-full p-1 gap-1"
                style={{ background: "rgba(60,36,21,0.06)" }}
              >
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key as typeof activeTab)}
                    className="px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300"
                    style={{
                      background: activeTab === t.key ? C.chocolate : "transparent",
                      color: activeTab === t.key ? C.cream : C.chocolate,
                      fontFamily: "'Lato', system-ui, sans-serif",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Anchor tags for direct links */}
            <div id="sauna" className="absolute" />
            <div id="barbing" className="absolute" />

            {/* Service cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeServices.map((s) => (
                <div
                  key={s.name}
                  className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: C.white,
                    border: `1px solid rgba(196,168,130,0.2)`,
                    boxShadow: "0 2px 20px rgba(60,36,21,0.04)",
                  }}
                >
                  {s.coming && (
                    <span
                      className="absolute top-4 right-4 text-[10px] tracking-wider uppercase px-3 py-1 rounded-full font-semibold"
                      style={{ background: "rgba(183,110,121,0.1)", color: C.roseGold }}
                    >
                      Coming Soon
                    </span>
                  )}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(183,110,121,0.08)" }}
                  >
                    <s.icon size={20} style={{ color: C.roseGold }} />
                  </div>
                  <h3
                    className="text-lg mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.chocolate, fontWeight: 600 }}
                  >
                    {s.name}
                  </h3>
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: C.gold }}
                  >
                    {s.price}
                  </p>
                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{ color: "rgba(60,36,21,0.65)", fontFamily: "'Lato', system-ui, sans-serif" }}
                  >
                    {s.desc}
                  </p>
                  {!s.coming && (
                    <a
                      href={waMsg(s.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                      style={{ color: C.roseGold }}
                    >
                      Book <ChevronRight size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── EXPERIENCE ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-5" style={{ background: C.white }}>
        <FadeIn>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p
                className="text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: C.roseGold, fontFamily: "'Lato', system-ui, sans-serif" }}
              >
                Your Journey
              </p>
              <h2
                className="text-3xl sm:text-4xl"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.chocolate, fontWeight: 700 }}
              >
                The Tilz <span style={{ color: C.roseGold, fontStyle: "italic" }}>Experience</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {STEPS.map((s, i) => (
                <FadeIn key={s.num} className="text-center">
                  <div
                    className="text-4xl font-bold mb-4 opacity-20"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.roseGold }}
                  >
                    {s.num}
                  </div>
                  <h3
                    className="text-xl mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.chocolate, fontWeight: 600 }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(60,36,21,0.65)", fontFamily: "'Lato', system-ui, sans-serif" }}
                  >
                    {s.desc}
                  </p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2">
                      <ChevronRight size={20} style={{ color: C.cappuccino }} className="opacity-30" />
                    </div>
                  )}
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── FOUNDER ────────────────────────────────────────────────────── */}
      <section
        id="founder"
        className="py-20 md:py-28 px-5"
        style={{ background: `linear-gradient(160deg, ${C.cream}, rgba(183,110,121,0.08))` }}
      >
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: C.roseGold, fontFamily: "'Lato', system-ui, sans-serif" }}
            >
              The Visionary
            </p>
            <h2
              className="text-3xl sm:text-4xl mb-8"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.chocolate, fontWeight: 700 }}
            >
              Meet <span style={{ color: C.roseGold, fontStyle: "italic" }}>Tilda</span>
            </h2>

            {/* Avatar placeholder */}
            <div
              className="w-28 h-28 rounded-full mx-auto mb-8 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${C.roseGold}, ${C.gold})` }}
            >
              <span className="text-3xl font-bold" style={{ color: C.white, fontFamily: "'Playfair Display', Georgia, serif" }}>
                T
              </span>
            </div>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8"
              style={{ color: "rgba(60,36,21,0.75)", fontFamily: "'Lato', system-ui, sans-serif" }}
            >
              Tilda built Tilz Spa with one mission: to create a space in Abuja where self-care is not
              a luxury reserved for a few, but a standard everyone deserves. From curating premium
              treatments to training a team that genuinely cares, every detail of Tilz Spa reflects
              her commitment to quality, discretion and warmth.
            </p>

            <a
              href="/clients/tilz-spa/founder"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide transition-colors hover:opacity-80"
              style={{ color: C.roseGold }}
            >
              Read Tilda's Full Story <ChevronRight size={14} />
            </a>
          </div>
        </FadeIn>
      </section>

      {/* ── CONTACT ────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 md:py-28 px-5" style={{ background: C.white }}>
        <FadeIn>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p
                className="text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: C.roseGold, fontFamily: "'Lato', system-ui, sans-serif" }}
              >
                Visit Us
              </p>
              <h2
                className="text-3xl sm:text-4xl"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.chocolate, fontWeight: 700 }}
              >
                Get in <span style={{ color: C.roseGold, fontStyle: "italic" }}>Touch</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Info */}
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(183,110,121,0.08)" }}>
                    <MapPin size={18} style={{ color: C.roseGold }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: C.chocolate }}>Location</h4>
                    <p className="text-sm" style={{ color: "rgba(60,36,21,0.65)" }}>Wuse 2, Abuja, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(183,110,121,0.08)" }}>
                    <Phone size={18} style={{ color: C.roseGold }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: C.chocolate }}>Phone</h4>
                    <a href="tel:+2348172371818" className="text-sm hover:underline" style={{ color: "rgba(60,36,21,0.65)" }}>
                      0817 237 1818
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(183,110,121,0.08)" }}>
                    <Clock size={18} style={{ color: C.roseGold }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1" style={{ color: C.chocolate }}>Opening Hours</h4>
                    <p className="text-sm" style={{ color: "rgba(60,36,21,0.65)" }}>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                    <p className="text-sm" style={{ color: "rgba(60,36,21,0.65)" }}>Sunday: By Appointment Only</p>
                  </div>
                </div>

                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm tracking-wide transition-transform hover:scale-105"
                  style={{ background: "#25D366", color: C.white }}
                >
                  <MessageCircle size={18} />
                  Book via WhatsApp
                </a>
              </div>

              {/* Map placeholder */}
              <div
                className="aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ background: C.cream, border: `1px solid rgba(196,168,130,0.2)` }}
              >
                <div className="text-center px-8">
                  <MapPin size={40} style={{ color: C.cappuccino }} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm opacity-50" style={{ color: C.chocolate }}>Google Maps — Wuse 2, Abuja</p>
                  <p className="text-xs mt-1 opacity-30" style={{ color: C.chocolate }}>Map embed placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="py-14 px-5" style={{ background: C.chocolate }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <p
                className="text-2xl mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.cream, fontWeight: 700 }}
              >
                Tilz <span style={{ color: C.roseGold, fontStyle: "italic" }}>Spa</span>
              </p>
              <p className="text-xs tracking-wider" style={{ color: "rgba(245,240,232,0.5)" }}>
                by Tilda
              </p>
            </div>

            {/* Social */}
            <div className="flex items-center gap-5">
              <a href="#" className="transition-opacity hover:opacity-70" aria-label="Instagram">
                <Instagram size={20} style={{ color: C.cappuccino }} />
              </a>
              <a href="#" className="transition-opacity hover:opacity-70" aria-label="Facebook">
                <Facebook size={20} style={{ color: C.cappuccino }} />
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" aria-label="WhatsApp">
                <MessageCircle size={20} style={{ color: C.cappuccino }} />
              </a>
            </div>

            {/* HAMZURY credit */}
            <div className="text-center md:text-right">
              <p className="text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>
                Designed &amp; Powered by
              </p>
              <a
                href="https://www.hamzury.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold tracking-wide transition-colors hover:opacity-80"
                style={{ color: C.gold }}
              >
                HAMZURY <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div
            className="mt-10 pt-6 text-center text-xs"
            style={{ borderTop: "1px solid rgba(196,168,130,0.15)", color: "rgba(245,240,232,0.3)" }}
          >
            &copy; {new Date().getFullYear()} Tilz Spa. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP BUTTON ───────────────────────────────────── */}
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ background: "#25D366" }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} style={{ color: C.white }} fill={C.white} />
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: "#25D366" }}
        />
      </a>
    </>
  );
}
