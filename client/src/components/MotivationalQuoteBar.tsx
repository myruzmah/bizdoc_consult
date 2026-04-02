import { useState, useEffect } from "react";

const SHARED_QUOTES = [
  "Structure before speed.",
  "Clarity removes chaos.",
  "Position first. Promote second.",
  "Growth follows structure.",
];

const DEPT_QUOTES: Record<string, string[]> = {
  bizdoc: [
    "Compliance that protects.",
    "Compliance is freedom.",
    "Your business deserves order.",
    "Registered. Compliant. Protected.",
    ...SHARED_QUOTES,
  ],
  systemise: [
    "Systems that scale.",
    "Systems scale. Hustle doesn't.",
    "Build the machine, not the habit.",
    "Your brand is your first impression.",
    ...SHARED_QUOTES,
  ],
  skills: [
    "Skills that earn.",
    "Learn what actually works.",
    "Knowledge without action is wasted.",
    "Build income, not just a resume.",
    ...SHARED_QUOTES,
  ],
  general: [
    "Compliance that protects.",
    "Systems that scale.",
    "Skills that earn.",
    ...SHARED_QUOTES,
  ],
};

type Props = { color: string; department?: string };

export default function MotivationalQuoteBar({ color, department = "general" }: Props) {
  const quotes = DEPT_QUOTES[department] || DEPT_QUOTES.general;
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % quotes.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div
      className="fixed bottom-0 inset-x-0 md:hidden z-40 flex items-center justify-center"
      style={{
        backgroundColor: `${color}F2`,
        height: 36,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <p
        className="text-[11px] font-light tracking-widest uppercase text-white/90 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {quotes[idx]}
      </p>
    </div>
  );
}
