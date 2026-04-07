import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Menu, X, Sparkles, Phone, Instagram, MapPin, ChevronRight } from "lucide-react";

const CHOCOLATE   = "#3C2415";
const CAPPUCCINO  = "#C4A882";
const ROSE_GOLD   = "#B76E79";
const GOLD        = "#D4AF6F";
const CREAM       = "#F5F0E8";
const IVORY       = "#FAF7F2";

export default function TilzSpaFounder() {
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: IVORY }}>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14"
        style={{ backgroundColor: `${IVORY}F0`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        <Link
          href="/clients/tilz-spa"
          className="flex items-center gap-2 text-[13px] font-medium transition-opacity hover:opacity-50"
          style={{ color: CHOCOLATE }}
        >
          <ArrowLeft size={14} /> Tilz Spa
        </Link>

        <span className="hidden md:block text-[13px] font-semibold tracking-wide" style={{ color: CHOCOLATE }}>
          Tilda
        </span>

        <div className="relative">
          <button
            onClick={() => setNavMenuOpen(p => !p)}
            className="flex items-center justify-center w-9 h-9 transition-opacity hover:opacity-70"
            style={{ color: CHOCOLATE }}
            aria-label="Menu"
          >
            {navMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {navMenuOpen && (
            <div
              className="absolute top-10 right-0 rounded-2xl py-2 min-w-[220px] shadow-xl"
              style={{ backgroundColor: "#FFFFFF" }}
              onClick={() => setNavMenuOpen(false)}
            >
              {[
                { label: "Tilz Spa", href: "/clients/tilz-spa" },
                { label: "Book a Visit", href: "/clients/tilz-spa#booking" },
                { label: "HAMZURY Home", href: "/" },
              ].map(item => (
                <Link key={item.href} href={item.href}>
                  <span
                    className="block px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-gray-50 cursor-pointer"
                    style={{ color: CHOCOLATE }}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section
        className="pt-36 pb-16 md:pt-48 md:pb-24 px-6"
        style={{ background: `linear-gradient(175deg, ${CREAM} 0%, ${IVORY} 40%, #F8EDE4 100%)` }}
      >
        <div className="max-w-2xl mx-auto text-center">
          {/* Photo placeholder */}
          <div
            className="w-36 h-36 md:w-44 md:h-44 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${ROSE_GOLD}, ${CAPPUCCINO})`,
              border: `3px solid ${GOLD}`,
            }}
          >
            <span className="text-white text-5xl md:text-6xl font-light" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              T
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ color: CHOCOLATE, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Meet Tilda
          </h1>
          <p className="text-lg md:text-xl font-medium" style={{ color: ROSE_GOLD }}>
            Founder, Tilz Spa by Tilda
          </p>
          <div className="w-16 h-[2px] mx-auto mt-6" style={{ backgroundColor: GOLD }} />
        </div>
      </section>

      {/* ───── Story ───── */}
      <section className="py-16 md:py-24 px-6" style={{ backgroundColor: IVORY }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-8"
            style={{ color: CHOCOLATE, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Story
          </h2>
          <p className="text-[15px] md:text-[16px] leading-relaxed mb-6" style={{ color: "#5A3E2B" }}>
            My journey started with a simple belief: that every woman deserves a space where she can be still,
            be beautiful, and be herself. Tilz Spa is that space. What began as a dream grew from watching
            the women around me — professionals, mothers, entrepreneurs — pour into everyone else and leave
            nothing for themselves. I wanted to create a haven in the heart of Abuja where restoration is
            not a luxury, but a necessity.
          </p>
          <p className="text-[15px] md:text-[16px] leading-relaxed" style={{ color: "#5A3E2B" }}>
            When I looked around Abuja, I saw the gap clearly: there was no truly premium, private spa
            experience that combined world-class treatments with the warmth and intimacy of home. That gap
            became my calling. Today, Tilz Spa is expanding beyond beauty treatments into sauna therapy
            and executive barbing — because wellness is not one-size-fits-all. My mission is to create a
            complete wellness destination where every guest, regardless of gender, leaves feeling like the
            best version of themselves.
          </p>
        </div>
      </section>

      {/* ───── Vision ───── */}
      <section className="py-16 md:py-24 px-6" style={{ backgroundColor: CREAM }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-8"
            style={{ color: CHOCOLATE, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The Vision
          </h2>
          <p className="text-[15px] md:text-[16px] leading-relaxed" style={{ color: "#5A3E2B" }}>
            The Tilz Spa vision is to become Abuja's most trusted name in personal wellness — a sanctuary
            that serves everyone from busy professionals to brides, from corporate executives to young women
            discovering self-care for the first time. We are building more than a spa; we are building a
            brand that people return to, recommend to their friends, and associate with the feeling of being
            truly restored. Every decision we make — from the products we choose to the music that plays —
            is guided by a single question: does this make our guest feel cared for?
          </p>
        </div>
      </section>

      {/* ───── Services Under Tilda's Direction ───── */}
      <section className="py-16 md:py-24 px-6" style={{ backgroundColor: IVORY }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-12 text-center"
            style={{ color: CHOCOLATE, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Services Under Tilda's Direction
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Tilz Spa",
                tagline: "Luxury Treatments",
                desc: "Facials, massages, manicures, body treatments and bridal packages — all delivered with premium products in a serene, private setting.",
                icon: "🧖‍♀️",
              },
              {
                name: "Tilz Sauna",
                tagline: "Heat Therapy",
                desc: "Infrared and steam sauna sessions designed to detoxify, relieve stress, and complement your spa experience with deep therapeutic warmth.",
                icon: "🔥",
              },
              {
                name: "Tilz Barbing",
                tagline: "Executive Grooming",
                desc: "Premium grooming for men — precision cuts, beard sculpting, and hot-towel treatments in a refined, comfortable environment.",
                icon: "✂️",
              },
            ].map(svc => (
              <div
                key={svc.name}
                className="rounded-2xl p-8 transition-shadow hover:shadow-lg"
                style={{ backgroundColor: "#FFFFFF", border: `1px solid ${CAPPUCCINO}30` }}
              >
                <div className="text-3xl mb-4">{svc.icon}</div>
                <h3 className="text-lg font-bold mb-1" style={{ color: CHOCOLATE }}>
                  {svc.name}
                </h3>
                <p className="text-[13px] font-semibold mb-3" style={{ color: ROSE_GOLD }}>
                  {svc.tagline}
                </p>
                <p className="text-[14px] leading-relaxed" style={{ color: "#5A3E2B" }}>
                  {svc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Quote Block ───── */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: CHOCOLATE }}>
        <div className="max-w-2xl mx-auto text-center">
          <Sparkles size={28} className="mx-auto mb-6" style={{ color: GOLD }} />
          <blockquote
            className="text-xl md:text-2xl lg:text-[28px] font-light leading-snug mb-6"
            style={{ color: CREAM, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            "I don't just want to build a spa. I want to build the place people think of when they need to feel restored."
          </blockquote>
          <span className="text-[14px] font-semibold tracking-wider uppercase" style={{ color: GOLD }}>
            — Tilda
          </span>
        </div>
      </section>

      {/* ───── Contact ───── */}
      <section className="py-16 md:py-24 px-6" style={{ backgroundColor: CREAM }}>
        <div className="max-w-lg mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl font-bold mb-8"
            style={{ color: CHOCOLATE, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Connect with Tilda
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/2348172371818"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366", color: "#fff" }}
            >
              <Phone size={16} /> WhatsApp
            </a>
            <a
              href="https://instagram.com/tilzspa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: ROSE_GOLD, color: "#fff" }}
            >
              <Instagram size={16} /> Instagram
            </a>
            <Link href="/clients/tilz-spa">
              <span
                className="flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: CHOCOLATE, color: CREAM }}
              >
                <MapPin size={16} /> Visit the Spa <ChevronRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="py-8 px-6 text-center" style={{ backgroundColor: CHOCOLATE }}>
        <p className="text-[13px]" style={{ color: CAPPUCCINO }}>
          Tilz Spa by Tilda &middot; Wuse 2, Abuja &middot; Powered by{" "}
          <Link href="/">
            <span className="underline cursor-pointer" style={{ color: GOLD }}>HAMZURY</span>
          </Link>
        </p>
      </footer>
    </div>
  );
}
