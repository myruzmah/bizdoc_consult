import { useState, useEffect } from "react";

const SHARED_QUOTES = [
  "Structure before speed.",
  "Clarity removes chaos.",
  "Position first. Promote second.",
  "Growth follows structure.",
];

// Founder quotes
const FOUNDER_QUOTES = [
  "Build what people need, not what sounds impressive.",
  "Execution beats ideas. Every time.",
  "If it doesn't create value, it doesn't belong.",
  "Simplicity is the ultimate sophistication.",
  "Move with purpose, not just speed.",
  "Teach people to fish. Then help them sell the fish.",
];

// Hadith & Quran-inspired wisdom (relevant to work & education)
const FAITH_QUOTES = [
  "Whoever follows a path seeking knowledge, Allah makes the path to Jannah easy.",
  "The best of people are those most beneficial to others.",
  "Tie your camel, then trust in Allah.",
  "Indeed, with hardship comes ease. — Quran 94:6",
  "And say: My Lord, increase me in knowledge. — Quran 20:114",
  "Do good, for Allah loves those who do good. — Quran 2:195",
  "He who does not thank people does not thank Allah.",
  "The strong believer is better than the weak believer.",
  "Take provision, but the best provision is Taqwa. — Quran 2:197",
];

const DEPT_QUOTES: Record<string, string[]> = {
  bizdoc: [
    "Compliance that protects.",
    "Compliance is freedom.",
    "Your business deserves order.",
    "Registered. Compliant. Protected.",
    ...SHARED_QUOTES,
    ...FOUNDER_QUOTES,
    ...FAITH_QUOTES,
  ],
  systemise: [
    "Systems that scale.",
    "Systems scale. Hustle doesn't.",
    "Build the machine, not the habit.",
    "Your brand is your first impression.",
    ...SHARED_QUOTES,
    ...FOUNDER_QUOTES,
    ...FAITH_QUOTES,
  ],
  skills: [
    "Skills that earn.",
    "Learn what actually works.",
    "Knowledge without action is wasted.",
    "Build income, not just a resume.",
    ...SHARED_QUOTES,
    ...FOUNDER_QUOTES,
    ...FAITH_QUOTES,
  ],
  general: [
    "Compliance that protects.",
    "Systems that scale.",
    "Skills that earn.",
    ...SHARED_QUOTES,
    ...FOUNDER_QUOTES,
    ...FAITH_QUOTES,
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
