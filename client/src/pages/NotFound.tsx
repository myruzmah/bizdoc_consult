import { useLocation } from "wouter";
import PageMeta from "@/components/PageMeta";

const CHARCOAL = "#1A1A1A";
const GOLD     = "#B48C4C";
const MILK     = "#FFFAF6";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: MILK }}
    >
      <PageMeta
        title="Page Not Found — HAMZURY"
        description="The page you're looking for doesn't exist. Return to HAMZURY."
        canonical="https://hamzury.com/404"
      />

      <h1
        className="text-[clamp(28px,4vw,40px)] font-light tracking-tight mb-4"
        style={{ color: CHARCOAL, letterSpacing: "-0.025em" }}
      >
        Page not found
      </h1>

      <p
        className="text-[15px] font-light leading-relaxed mb-10 max-w-sm"
        style={{ color: `${CHARCOAL}60` }}
      >
        The page you are looking for does not exist.
      </p>

      <button
        onClick={() => setLocation("/")}
        className="px-8 py-3.5 rounded-full text-[14px] font-medium tracking-tight transition-opacity duration-200 hover:opacity-85"
        style={{ backgroundColor: GOLD, color: "#FFFFFF" }}
      >
        Go to HAMZURY
      </button>
    </div>
  );
}
