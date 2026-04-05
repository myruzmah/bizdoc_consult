import { useState } from "react";
import { Bot, Check, X, ChevronDown, ChevronUp } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   HAMZURY — Agent Suggestion Card
   Reusable component for displaying AI agent suggestions in dashboards.
   Staff can expand, accept, or dismiss each suggestion.
   ═══════════════════════════════════════════════════════════════════════ */

const WHITE = "#FFFFFF";

// Map agent IDs to their display names and colors
const AGENT_INFO: Record<string, { name: string; emoji: string; color: string }> = {
  evelyn: { name: "Evelyn", emoji: "🎯", color: "#8B5CF6" },
  amara: { name: "Amara", emoji: "📋", color: "#2563EB" },
  nova: { name: "Nova", emoji: "⚡", color: "#059669" },
  zara: { name: "Zara", emoji: "🎓", color: "#D97706" },
  kash: { name: "Kash", emoji: "💰", color: "#DC2626" },
  muse: { name: "Muse", emoji: "🎨", color: "#7C3AED" },
  idris: { name: "Idris", emoji: "📊", color: "#0891B2" },
  ibrahim: { name: "Ibrahim", emoji: "✅", color: "#166534" },
};

interface Suggestion {
  id: number;
  agentId: string;
  suggestionType: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Props {
  suggestions: Suggestion[];
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  isLoading?: boolean;
  maxVisible?: number;
}

export default function AgentSuggestionCard({ suggestions, onAccept, onReject, isLoading, maxVisible = 5 }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div style={{ padding: 16, textAlign: "center", opacity: 0.5, fontSize: 13 }}>
        <Bot size={16} style={{ display: "inline", marginRight: 6 }} />
        Loading AI suggestions...
      </div>
    );
  }

  if (!suggestions?.length) return null; // Don't show anything if no suggestions

  const visible = suggestions.slice(0, maxVisible);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
        padding: "8px 12px", borderRadius: 10,
        background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(59,130,246,0.06))",
        border: "1px solid rgba(139,92,246,0.12)",
      }}>
        <Bot size={15} style={{ color: "#7C3AED" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
          AI Suggestions ({suggestions.length})
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visible.map((s) => {
          const info = AGENT_INFO[s.agentId] || { name: s.agentId, emoji: "🤖", color: "#6B7280" };
          const isExpanded = expandedId === s.id;

          return (
            <div
              key={s.id}
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: "12px 14px",
                backgroundColor: WHITE,
                transition: "border-color 0.15s",
              }}
            >
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 14 }}>{info.emoji}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                      {info.name} · {s.suggestionType.replace(/_/g, " ")} · {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => onAccept(s.id)}
                    title="Accept"
                    style={{
                      width: 28, height: 28, borderRadius: 8, border: "1px solid #D1FAE5",
                      backgroundColor: "#ECFDF5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Check size={14} style={{ color: "#059669" }} />
                  </button>
                  <button
                    onClick={() => onReject(s.id)}
                    title="Dismiss"
                    style={{
                      width: 28, height: 28, borderRadius: 8, border: "1px solid #FEE2E2",
                      backgroundColor: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <X size={14} style={{ color: "#DC2626" }} />
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    title={isExpanded ? "Collapse" : "Expand"}
                    style={{
                      width: 28, height: 28, borderRadius: 8, border: "1px solid #E5E7EB",
                      backgroundColor: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {isExpanded ? <ChevronUp size={14} style={{ color: "#6B7280" }} /> : <ChevronDown size={14} style={{ color: "#6B7280" }} />}
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{
                  marginTop: 10, padding: "10px 12px", borderRadius: 8,
                  backgroundColor: "#F9FAFB", fontSize: 12, lineHeight: 1.6,
                  color: "#374151", whiteSpace: "pre-wrap", maxHeight: 300, overflowY: "auto",
                }}>
                  {s.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {suggestions.length > maxVisible && (
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "#9CA3AF" }}>
          +{suggestions.length - maxVisible} more suggestions
        </div>
      )}
    </div>
  );
}
