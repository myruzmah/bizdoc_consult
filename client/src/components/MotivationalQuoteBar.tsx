import { useState, useEffect } from "react";

const QUOTES = [
  "Structure before speed.",
  "Compliance is freedom.",
  "Systems scale. Hustle doesn't.",
  "Position first. Promote second.",
  "Build what lasts.",
  "Clarity removes chaos.",
  "Your business deserves order.",
  "Growth follows structure.",
];

type Props = { color: string };

export default function MotivationalQuoteBar({ color }: Props) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % QUOTES.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
        {QUOTES[idx]}
      </p>
    </div>
  );
}
