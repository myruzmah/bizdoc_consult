import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  CheckCircle, Circle, ChevronRight, Loader2, AlertCircle, LogOut,
  Send, MessageSquare, Calendar,
  Phone, CreditCard, Copy,
  Unlock, ArrowRight, Quote,
  Shield, FileCheck, Globe, Zap, TrendingUp, Target, Award, BookOpen, Sparkles, Lock,
  BarChart3, Users, Briefcase, GraduationCap, Bot, Palette, Clock, MapPin,
  X,
} from "lucide-react";
import PageMeta from "../components/PageMeta";
import { trpc } from "@/lib/trpc";

/* ── Brand constants ── */
const CREAM = "#FFFAF6";
const WHITE = "#FFFFFF";
const DARK = "#1A1A1A";
const MUTED = "#666666";
const GOLD = "#B48C4C";
const GREEN = "#22C55E";
const BORDER = "#2D2D2D08";
const GREY_LOCKED = "#E5E5E5";
const CHAT_USER_BG = "#2D2D2D";
const CHAT_BOT_BG = "#F5F5F5";

const DEPT_COLORS: Record<string, string> = {
  bizdoc: "#1B4D3E",
  systemise: "#2563EB",
  skills: "#1E3A5F",
  general: "#2D2D2D",
};

/* ── 8 Business Growth Stages ── */
const STAGES = [
  { key: "registration", title: "Registration", icon: Shield, desc: "CAC, Business Name", items: ["CAC Business Registration", "Business Name Reservation", "Annual Returns Filing"] },
  { key: "tax", title: "Tax & Compliance", icon: FileCheck, desc: "TIN, VAT, PAYE, TCC", items: ["TIN Registration", "VAT Setup", "PAYE Registration", "Tax Clearance Certificate"] },
  { key: "licences", title: "Licences & Permits", icon: Award, desc: "NAFDAC, SON, DPR, sector licences", items: ["NAFDAC Registration", "SON Certification", "DPR Licence", "Sector-Specific Permits"] },
  { key: "legal", title: "Legal & Contracts", icon: Briefcase, desc: "Contracts, agreements, templates", items: ["Employment Contracts", "Partnership Agreements", "Client Service Agreements", "NDA Templates"] },
  { key: "brand", title: "Brand & Website", icon: Globe, desc: "Brand identity, website, online presence", items: ["Brand Identity Design", "Website Development", "Social Media Setup", "Google Business Profile"] },
  { key: "systems", title: "Systems & Automation", icon: Zap, desc: "CRM, dashboard, automation, AI agents", items: ["CRM Setup", "Dashboard & Reporting", "Workflow Automation", "AI Agent Integration"] },
  { key: "training", title: "Team & Training", icon: GraduationCap, desc: "Staff training, Skills programs", items: ["Staff Onboarding Program", "Skills Development", "Leadership Training", "Process Documentation"] },
  { key: "growth", title: "Growth & Scale", icon: TrendingUp, desc: "Strategy, expansion, management", items: ["Business Strategy", "Market Expansion Plan", "Management Systems", "Investment Readiness"] },
] as const;

type StageKey = typeof STAGES[number]["key"];
type StageState = "delivered" | "active" | "paid" | "locked";

const STAGE_PITCHES: Record<StageKey, string> = {
  registration: "Is your business legally recognized? Without CAC, you can't open a corporate bank account or sign government contracts.",
  tax: "Can you get a Tax Clearance Certificate right now? Without one, you miss government contracts and face penalties.",
  licences: "Does your sector require a specific licence? Operating without it could mean shutdown or heavy fines.",
  legal: "If a staff member or partner betrays you today, are your contracts protecting you?",
  brand: "If a premium client finds you online right now, will they trust you enough to pay?",
  systems: "Are you still doing things manually that should already be automated?",
  training: "Can your team run the business properly without you being there every day?",
  growth: "Is your business ready to handle 10x more clients without breaking?",
};

/* ── Founder quotes ── */
const FOUNDER_QUOTES = [
  "Businesses deserve more than consultants who disappear after the invoice. We stay until the work is done.",
  "Structure is what separates businesses that last from businesses that don't.",
  "If your business can't run without you, you don't have a business. You have a job.",
  "Compliance is not a cost. It is the price of being taken seriously.",
  "The businesses that win are the ones that got structured early.",
  "Every document, every system, every skill -- it all adds up to a business that lasts.",
  "We don't just register businesses. We prepare them to operate, compete, and scale.",
];

/* ── Utility functions ── */
function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
}

function timeAgo(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

/* ── Service importance descriptions ── */
function getServiceImportance(service: string): string {
  const s = (service || "").toLowerCase();
  if (s.includes("cac")) return "Legally recognized. Unlocks banking, contracts, tax filing.";
  if (s.includes("tin") || s.includes("tax")) return "Protects from penalties. Enables Tax Clearance Certificate.";
  if (s.includes("licence") || s.includes("nafdac")) return "Legally operate and avoid regulatory shutdown.";
  if (s.includes("website")) return "Clients trust you before they even call.";
  if (s.includes("brand")) return "Premium clients choose you over competitors.";
  if (s.includes("automation")) return "Save hours every week on repetitive tasks.";
  if (s.includes("training") || s.includes("skill")) return "Team delivers better, faster, less supervision.";
  if (s.includes("social") || s.includes("media")) return "Build authority and attract clients who already trust you.";
  if (s.includes("foreign") || s.includes("cerpac")) return "Operate legally in Nigeria with full compliance.";
  if (s.includes("scuml")) return "Mandatory anti-money laundering compliance.";
  return "Strengthens your business structure and reduces risk.";
}

/** Context-aware upsell -- changes based on client's current service */
function getSmartPrompts(service: string, status: string, dept: string) {
  const s = (service || "").toLowerCase();
  const done = status === "Completed";
  if (s.includes("cac") || s.includes("registration") || dept === "bizdoc") {
    return [
      { q: done ? "Registration done. But does your business have TIN, tax compliance, and proper contracts? Most don't." : "While we handle your registration, consider this: are your tax filings and contracts also sorted?", cta: "Check what I'm missing", chat: true },
      { q: "73% of registered businesses also need a proper website and brand identity to win premium clients.", cta: "Talk to my advisor about this", chat: true },
      { q: done ? "Your team will need to use these new documents properly. Want us to train them?" : "Want your staff trained on compliance processes while we handle the paperwork?", cta: "Ask about training", chat: true },
    ];
  }
  if (s.includes("website") || s.includes("brand") || s.includes("system") || dept === "systemise") {
    return [
      { q: "A great system is useless if your business documents are not in order. Is your compliance fully sorted?", cta: "Check my compliance", chat: true },
      { q: done ? "Your system is ready. Now your team needs to know how to use it properly." : "Once your system is live, will your team actually use it without training?", cta: "Ask about team training", chat: true },
      { q: "Are you also managing your social media? We can handle that while you focus on your business.", cta: "Talk about social media", chat: true },
    ];
  }
  if (s.includes("training") || s.includes("skill") || dept === "skills") {
    return [
      { q: "Skills are powerful when your business structure supports them. Is your compliance and documentation solid?", cta: "Check my business structure", chat: true },
      { q: "Ready to apply what you learned? We can build the systems and dashboards your business needs.", cta: "Talk about systems", chat: true },
      { q: "Want your whole team trained, not just you? Corporate training packages start from custom pricing.", cta: "Ask about team training", chat: true },
    ];
  }
  return [
    { q: "Every serious business needs proper documentation, strong systems, and capable people. Which is your weakest link?", cta: "Find out what I need", chat: true },
    { q: "Is your brand making premium clients trust you? If not, that's fixable.", cta: "Talk to my advisor", chat: true },
    { q: "Want to build real skills that lead to earning? Our programs are built for action, not theory.", cta: "See what fits me", chat: true },
  ];
}

/* ── Next Unlock logic ── */
function getNextUnlock(service: string, department: string, _status: string) {
  const s = (service || "").toLowerCase();
  if (s.includes("cac") || s.includes("registration")) return { title: "Tax Compliance (TIN + VAT)", why: "Without tax compliance, you cannot bid for government contracts or get a Tax Clearance Certificate.", dept: "bizdoc", icon: FileCheck };
  if (s.includes("tax") || s.includes("tin") || s.includes("tcc")) return { title: "Industry Licence for Your Sector", why: "Every sector has specific regulatory requirements. Operating without the right licence puts your business at risk.", dept: "bizdoc", icon: Award };
  if (s.includes("licence") || s.includes("permit") || s.includes("nafdac")) return { title: "Brand Identity & Website", why: "Your compliance is sorted. Now premium clients need to trust you instantly online.", dept: "systemise", icon: Globe };
  if (s.includes("website") || s.includes("brand")) return { title: "Business Automation & CRM", why: "Your brand is live. Now automate the parts of your business that repeat every week.", dept: "systemise", icon: Bot };
  if (s.includes("automation") || s.includes("crm") || s.includes("dashboard")) return { title: "Team Training & Enablement", why: "Systems are only as good as the people using them. Train your team.", dept: "skills", icon: GraduationCap };
  if (s.includes("training") || s.includes("skill") || s.includes("cohort")) return { title: "Full Business Documentation", why: "Make sure your business structure, contracts, and compliance are fully documented.", dept: "bizdoc", icon: FileCheck };
  return { title: "Business Positioning Guide", why: "Not sure what your business needs next? Our advisor can map your full requirements.", dept: "general", icon: Target };
}

/* ── Map service string to a stage index ── */
function mapServiceToStageIndex(service: string): number {
  const s = (service || "").toLowerCase();
  if (s.includes("cac") || s.includes("registration") || s.includes("foreign") || s.includes("cerpac") || s.includes("scuml")) return 0;
  if (s.includes("tax") || s.includes("tin") || s.includes("tcc") || s.includes("vat") || s.includes("paye")) return 1;
  if (s.includes("licence") || s.includes("permit") || s.includes("nafdac") || s.includes("son") || s.includes("dpr")) return 2;
  if (s.includes("contract") || s.includes("legal") || s.includes("agreement")) return 3;
  if (s.includes("website") || s.includes("brand") || s.includes("social") || s.includes("media")) return 4;
  if (s.includes("automation") || s.includes("crm") || s.includes("dashboard") || s.includes("system")) return 5;
  if (s.includes("training") || s.includes("skill") || s.includes("cohort")) return 6;
  if (s.includes("strategy") || s.includes("growth") || s.includes("expansion")) return 7;
  return 0;
}

/* ── Session ── */
interface ClientSession {
  ref: string;
  phone?: string;
  expiresAt: number;
}

function loadClientSession(): ClientSession | null {
  try {
    const raw = localStorage.getItem("hamzury-client-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ClientSession;
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem("hamzury-client-session");
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

const ACTIVITY_LABELS: Record<string, string> = {
  task_created: "File created",
  status_change: "Status updated",
  checklist_toggled: "Checklist updated",
  note_added: "Internal note added",
  document_uploaded: "Document uploaded",
  client_note: "Your message received",
  payment_confirmed: "Payment confirmed",
  invoice_created: "Invoice generated",
  commission_created: "Commission recorded",
  kpi_approved: "Quality approved",
};

/* ── Pulse animation ── */
const pulseKeyframes = `
@keyframes subtlePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(180, 140, 76, 0.3); }
  50% { box-shadow: 0 0 0 6px rgba(180, 140, 76, 0); }
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
`;

/* ── Chat message type ── */
type ChatMsg = { role: "user" | "assistant"; content: string };

/* ────────────────────────────────────────────────────────────────────────── */
/*  BUSINESS GROWTH GUIDE — Two-column layout                               */
/* ────────────────────────────────────────────────────────────────────────── */

export default function ClientDashboard() {
  const [session, setSession] = useState<ClientSession | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [claimedInvoices, setClaimedInvoices] = useState<Set<string>>(new Set());
  const [copiedAcct, setCopiedAcct] = useState(false);

  /* Chat state */
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  /* Message to staff (existing note system) */
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const s = loadClientSession();
    setSession(s);
    setSessionLoaded(true);
    if (!s) {
      window.location.href = "/client";
    }
  }, []);

  /* ── Random founder quote (stable per session) ── */
  const founderQuote = useMemo(
    () => FOUNDER_QUOTES[Math.floor(Math.random() * FOUNDER_QUOTES.length)],
    []
  );

  /* ── tRPC queries ── */
  const { data, isLoading, isError } = trpc.tracking.fullLookup.useQuery(
    { ref: session?.ref ?? "", phone: session?.phone },
    { enabled: !!session?.ref, retry: false, refetchInterval: 30000 }
  );

  const { data: subHistory } = trpc.subscriptions.clientHistory.useQuery(
    { ref: session?.ref ?? "" },
    { enabled: !!session?.ref, retry: false }
  );

  const { data: bankDetails } = trpc.invoices.bankDetails.useQuery(undefined, { staleTime: Infinity });

  const claimMutation = trpc.invoices.claimPayment.useMutation({
    onSuccess: (_, vars) => {
      setClaimedInvoices((prev) => new Set(prev).add(vars.invoiceNumber));
    },
  });

  const noteMutation = trpc.tracking.submitClientNote.useMutation({
    onSuccess: () => {
      setMessage("");
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 4000);
    },
  });

  function handleLogout() {
    localStorage.removeItem("hamzury-client-session");
    window.location.href = "/client";
  }

  function handleSendMessage() {
    if (!message.trim() || !session?.ref) return;
    noteMutation.mutate({ ref: session.ref, message: message.trim() });
  }

  /* ── Auto-scroll chat ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  /* ── Streaming AI Chat ── */
  const handleChatSend = useCallback(async (text?: string) => {
    const msg = (text || chatInput).trim();
    if (!msg || chatLoading) return;
    setChatInput("");

    const userMsg: ChatMsg = { role: "user", content: msg };
    setChatMessages(prev => [...prev, userMsg]);
    setChatLoading(true);

    // Add placeholder
    setChatMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const history = [...chatMessages, userMsg].slice(-10).map(h => ({ role: h.role, content: h.content }));
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: msg,
          history,
          department: "general",
        }),
      });

      if (!response.ok || !response.body) throw new Error("Stream failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const d = line.slice(6).trim();
          if (d === "[DONE]") continue;
          try {
            const parsed = JSON.parse(d);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              setChatMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: fullText };
                return updated;
              });
            }
          } catch { /* skip */ }
        }
      }

      const answer = fullText || "Our team will answer that directly. Start a chat or reach out via the contact options.";
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: answer };
        return updated;
      });
    } catch {
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Connection issue. Please try again or call us at 08067149356." };
        return updated;
      });
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, chatMessages]);

  /* ── Send chat message to side panel from stage activation ── */
  const sendActivateMessage = useCallback((stageName: string) => {
    const msg = `I want to activate ${stageName}`;
    setMobileChatOpen(true);
    // Small delay so mobile sheet opens first
    setTimeout(() => handleChatSend(msg), 100);
  }, [handleChatSend]);

  /* ── Loading / error states ── */
  if (!sessionLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: CREAM }}>
        <Loader2 className="animate-spin" size={24} style={{ color: DARK }} />
      </div>
    );
  }
  if (!session) return null;
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: CREAM }}>
        <Loader2 className="animate-spin" size={24} style={{ color: DARK }} />
        <p className="text-[13px] font-light" style={{ color: DARK, opacity: 0.5 }}>Loading your growth guide...</p>
      </div>
    );
  }
  if (isError || !data || !data.found) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ backgroundColor: CREAM }}>
        <AlertCircle size={32} style={{ color: "#DC2626" }} />
        <div className="text-center">
          <p className="text-[15px] font-light mb-1" style={{ color: DARK }}>File not found</p>
          <p className="text-[12px] opacity-40" style={{ color: DARK }}>Reference: {session.ref}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-[12px] font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-70"
          style={{ backgroundColor: DARK, color: GOLD }}
        >
          Try a different reference
        </button>
      </div>
    );
  }

  /* ── Destructure data ── */
  const task = data.task;
  const checklist = data.checklist || [];
  const activity = data.activity || [];
  const invoiceSummary = data.invoiceSummary;
  const completedChecklist = checklist.filter((c) => c.checked);

  const isBizdoc = (task.department || "").toLowerCase() === "bizdoc";
  const activeBankDetails = bankDetails
    ? isBizdoc && bankDetails.bizdoc.configured
      ? bankDetails.bizdoc
      : bankDetails.general
    : null;

  /* ── Compute stage states ── */
  const currentStageIdx = mapServiceToStageIndex(task.service);
  const isCompleted = task.status === "Completed";

  const stageStates: StageState[] = STAGES.map((_, i) => {
    if (i < currentStageIdx) return "delivered";
    if (i === currentStageIdx) return isCompleted ? "delivered" : "active";
    return "locked";
  });

  const deliveredCount = stageStates.filter(s => s === "delivered").length;
  const activeCount = stageStates.filter(s => s === "active").length;
  const lockedCount = stageStates.filter(s => s === "locked").length;
  const totalPaid = invoiceSummary ? invoiceSummary.paid : 0;

  /* ── Invoices ── */
  const hasInvoices = invoiceSummary && invoiceSummary.invoices.length > 0;

  /* ── Chat panel component ── */
  const ChatPanel = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`flex flex-col ${isMobile ? "h-[70vh]" : "h-full"}`}
      style={{ backgroundColor: WHITE }}
    >
      {/* Chat header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${GOLD}15` }}
          >
            <MessageSquare size={16} style={{ color: GOLD }} />
          </div>
          <div>
            <p className="text-[14px] font-medium" style={{ color: DARK }}>Your Advisor</p>
            <p className="text-[10px]" style={{ color: MUTED }}>Ask anything about your business</p>
          </div>
        </div>
        {isMobile && (
          <button onClick={() => setMobileChatOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X size={18} style={{ color: MUTED }} />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 0 }}>
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 opacity-60">
            <MessageSquare size={32} style={{ color: `${DARK}20` }} className="mb-3" />
            <p className="text-[13px] font-light" style={{ color: MUTED }}>
              Ask about compliance, tax, licences, branding, or any business question.
            </p>
            <p className="text-[11px] mt-2" style={{ color: `${DARK}30` }}>
              Or click a locked stage to activate it.
            </p>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] rounded-2xl px-4 py-2.5"
              style={{
                backgroundColor: msg.role === "user" ? CHAT_USER_BG : CHAT_BOT_BG,
                color: msg.role === "user" ? WHITE : DARK,
                borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                borderBottomLeftRadius: msg.role === "user" ? 16 : 4,
              }}
            >
              {msg.content ? (
                <p className="text-[13px] font-light leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="flex items-center gap-1.5 py-1">
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: `${DARK}40`, animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: `${DARK}40`, animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: `${DARK}40`, animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div
        className="shrink-0 px-4 py-3 flex items-center gap-2"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <input
          ref={chatInputRef}
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChatSend(); } }}
          placeholder="Type a message..."
          className="flex-1 text-[13px] font-light bg-transparent focus:outline-none py-2 px-3 rounded-xl"
          style={{ color: DARK, backgroundColor: CREAM, border: `1px solid ${BORDER}` }}
          disabled={chatLoading}
        />
        <button
          onClick={() => handleChatSend()}
          disabled={!chatInput.trim() || chatLoading}
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all hover:opacity-80 disabled:opacity-30"
          style={{ backgroundColor: GOLD, color: WHITE }}
        >
          {chatLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      <style>{pulseKeyframes}</style>
      <PageMeta
        title={`${task.businessName || task.clientName} - Business Growth Guide | HAMZURY`}
        description="Your personal business growth guide. Track services, unlock next steps, and talk to your advisor."
      />

      {/* ═══ HEADER NAV ═══ */}
      <nav
        className="sticky top-0 z-30 px-5 md:px-8 h-14 flex items-center justify-between"
        style={{
          backgroundColor: `${CREAM}f0`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <a
          href="/"
          className="text-[15px] font-light tracking-tight"
          style={{ color: DARK, letterSpacing: "-0.03em" }}
        >
          HAMZURY
        </a>
        <div className="flex items-center gap-4">
          <a
            href="tel:08067149356"
            className="flex items-center gap-1.5 text-[12px] font-light"
            style={{ color: MUTED }}
          >
            <Phone size={12} />
            08067149356
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[11px] font-medium opacity-40 hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg"
            style={{ color: DARK, backgroundColor: `${DARK}06` }}
          >
            <LogOut size={12} />
            Exit
          </button>
        </div>
      </nav>

      {/* ═══ TWO-COLUMN LAYOUT ═══ */}
      <div className="flex h-[calc(100vh-56px)]">

        {/* ─── LEFT SIDE: Business Growth Stages (scrollable) ─── */}
        <div className="flex-1 md:w-[60%] overflow-y-auto px-5 md:px-8 pb-12">

          {/* Welcome header */}
          <div className="pt-8 pb-6">
            <p className="text-[14px] font-light mb-1" style={{ color: MUTED }}>
              Welcome back, {task.clientName}
            </p>
            <h1
              className="text-[22px] md:text-[26px] font-light tracking-tight leading-tight"
              style={{ color: DARK, letterSpacing: "-0.025em" }}
            >
              {task.businessName || task.clientName}
            </h1>
            <p className="text-[12px] font-light mt-1" style={{ color: MUTED }}>
              {task.department || "HAMZURY"} &middot; Ref: {task.ref}
            </p>
          </div>


          {/* ═══ BUSINESS CIRCLE — Horizontal scrollable stages ═══ */}
          <div className="mb-6">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4"
              style={{ color: MUTED }}
            >
              Business Growth Stages
            </p>

            <div className="overflow-x-auto pb-4 -mx-2">
              <div className="flex items-start gap-0 min-w-max px-2">
                {STAGES.map((stage, i) => {
                  const state = stageStates[i];
                  const StageIcon = stage.icon;
                  const isSelected = selectedStage === i;

                  return (
                    <div key={stage.key} className="flex items-start">
                      {/* Stage circle + label */}
                      <button
                        onClick={() => setSelectedStage(isSelected ? null : i)}
                        className="flex flex-col items-center gap-2 w-[72px] group"
                      >
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center transition-all relative"
                          style={{
                            backgroundColor:
                              state === "delivered" ? GREEN
                              : state === "active" ? `${GOLD}15`
                              : state === "paid" ? `${GOLD}20`
                              : GREY_LOCKED,
                            border: state === "active" ? `2px solid ${GOLD}` : "2px solid transparent",
                            animation: state === "active" ? "subtlePulse 2s ease-in-out infinite" : undefined,
                            boxShadow: isSelected ? `0 0 0 3px ${GOLD}30` : undefined,
                          }}
                        >
                          {state === "delivered" ? (
                            <CheckCircle size={20} style={{ color: WHITE }} />
                          ) : state === "active" ? (
                            <StageIcon size={20} style={{ color: GOLD }} />
                          ) : state === "paid" ? (
                            <StageIcon size={18} style={{ color: GOLD }} />
                          ) : (
                            <Lock size={16} style={{ color: "#999" }} />
                          )}
                        </div>
                        <span
                          className="text-[11px] leading-tight text-center font-medium"
                          style={{
                            color: state === "delivered" ? GREEN
                              : state === "active" ? GOLD
                              : state === "locked" ? "#999"
                              : DARK,
                          }}
                        >
                          {stage.title}
                        </span>
                      </button>

                      {/* Connector line */}
                      {i < STAGES.length - 1 && (
                        <div className="flex items-center h-11 mx-[-4px]">
                          <div
                            className="w-4 h-0.5 rounded-full"
                            style={{
                              backgroundColor:
                                stageStates[i] === "delivered" && stageStates[i + 1] === "delivered"
                                  ? `${GREEN}60`
                                  : stageStates[i] === "delivered" && stageStates[i + 1] === "active"
                                  ? `${GOLD}40`
                                  : `${DARK}10`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>


          {/* ═══ STAGE DETAIL (expanded below circles) ═══ */}
          {selectedStage !== null && (() => {
            const stage = STAGES[selectedStage];
            const state = stageStates[selectedStage];
            const StageIcon = stage.icon;

            if (state === "delivered" || state === "active") {
              return (
                <div
                  className="rounded-2xl p-5 mb-6 transition-all"
                  style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      {state === "delivered" ? (
                        <CheckCircle size={18} style={{ color: GREEN }} />
                      ) : (
                        <StageIcon size={18} style={{ color: GOLD }} />
                      )}
                      <h3 className="text-[16px] font-medium" style={{ color: DARK }}>
                        {stage.title}
                      </h3>
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: state === "delivered" ? `${GREEN}12` : `${GOLD}12`,
                        color: state === "delivered" ? GREEN : GOLD,
                      }}
                    >
                      {state === "delivered" ? "Delivered" : "In Progress"}
                    </span>
                  </div>

                  {/* Current service info */}
                  <div className="space-y-3">
                    <div
                      className="flex items-start gap-3 rounded-xl px-4 py-3"
                      style={{ backgroundColor: CREAM }}
                    >
                      <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: state === "delivered" ? GREEN : GOLD }} />
                      <div className="flex-1">
                        <p className="text-[13px] font-medium" style={{ color: DARK }}>{task.service}</p>
                        {isCompleted && task.updatedAt && (
                          <p className="text-[11px] font-light mt-0.5" style={{ color: MUTED }}>
                            Delivered: {formatDate(task.updatedAt)}
                          </p>
                        )}
                        {!isCompleted && task.deadline && (
                          <p className="text-[11px] font-light mt-0.5" style={{ color: MUTED }}>
                            Expected: {formatDate(task.deadline)}
                          </p>
                        )}
                        <p className="text-[11px] font-light mt-1" style={{ color: `${DARK}60` }}>
                          {getServiceImportance(task.service)}
                        </p>
                      </div>
                    </div>

                    {/* Checklist progress */}
                    {checklist.length > 0 && (
                      <div className="space-y-2">
                        {checklist.map((c, ci) => (
                          <div key={ci} className="flex items-center gap-2.5 px-2">
                            {c.checked ? (
                              <CheckCircle size={14} style={{ color: GREEN }} />
                            ) : (
                              <Circle size={14} style={{ color: `${DARK}20` }} />
                            )}
                            <span
                              className="text-[12px] font-light"
                              style={{ color: c.checked ? DARK : MUTED }}
                            >
                              {c.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Progress bar */}
                    {!isCompleted && (
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: `${DARK}08` }}>
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${task.progress || 0}%`,
                              backgroundColor: GOLD,
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-medium tabular-nums" style={{ color: GOLD }}>
                          {task.progress}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            /* ── Locked stage — the pitch ── */
            return (
              <div
                className="rounded-2xl p-5 mb-6"
                style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <Lock size={18} style={{ color: "#999" }} />
                  <h3 className="text-[16px] font-medium" style={{ color: `${DARK}60` }}>
                    {stage.title}
                  </h3>
                </div>

                <p
                  className="text-[14px] font-light leading-relaxed italic mb-5 px-1"
                  style={{ color: DARK }}
                >
                  "{STAGE_PITCHES[stage.key]}"
                </p>

                <div className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: MUTED }}>
                    This stage includes:
                  </p>
                  <div className="space-y-1.5">
                    {stage.items.map((item, ii) => (
                      <div key={ii} className="flex items-center gap-2 px-1">
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: GOLD }} />
                        <span className="text-[12px] font-light" style={{ color: DARK }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => sendActivateMessage(stage.title)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-semibold uppercase tracking-wider transition-all hover:opacity-90"
                  style={{ backgroundColor: GOLD, color: WHITE }}
                >
                  <Sparkles size={14} />
                  Activate this stage
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })()}


          {/* ═══ SUBSCRIPTION MONTHLY TASKS ═══ */}
          {subHistory && subHistory.monthlyTasks.length > 0 && (
            <div
              className="rounded-2xl p-5 mb-6"
              style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={14} style={{ color: GOLD }} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                  Monthly: {subHistory.service}
                </p>
              </div>
              <div className="space-y-2">
                {subHistory.monthlyTasks.map((t: { month: string | null; status: string; kpiApproved: boolean }) => (
                  <div
                    key={t.month}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5"
                    style={{ backgroundColor: CREAM, border: `1px solid ${DARK}06` }}
                  >
                    <div className="flex items-center gap-2.5">
                      {t.kpiApproved || t.status === "Completed" ? (
                        <CheckCircle size={14} style={{ color: GREEN }} />
                      ) : (
                        <Circle size={14} style={{ color: `${DARK}25` }} />
                      )}
                      <span className="text-[13px] font-light" style={{ color: DARK }}>
                        {t.month}
                      </span>
                    </div>
                    <span
                      className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: t.kpiApproved ? `${GREEN}12` : t.status === "In Progress" ? `${GOLD}12` : `${DARK}08`,
                        color: t.kpiApproved ? GREEN : t.status === "In Progress" ? GOLD : MUTED,
                      }}
                    >
                      {t.kpiApproved ? "Filed" : t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ═══ STATS ROW ═══ */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Active", value: activeCount, icon: Zap, color: activeCount > 0 ? GOLD : MUTED },
              { label: "Done", value: deliveredCount, icon: CheckCircle, color: deliveredCount > 0 ? GREEN : MUTED },
              { label: "Locked", value: lockedCount, icon: Lock, color: MUTED },
              { label: "Paid", value: totalPaid > 0 ? formatNaira(totalPaid) : "--", icon: CreditCard, color: totalPaid > 0 ? DARK : MUTED },
            ].map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl p-4 flex flex-col items-center gap-1.5"
                  style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
                >
                  <StatIcon size={16} style={{ color: stat.color }} />
                  <p className="text-[18px] font-light tabular-nums" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>


          {/* ═══ INVOICES ═══ */}
          {hasInvoices && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={14} style={{ color: MUTED }} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: MUTED }}>
                  Invoices
                </p>
              </div>

              <div
                className="grid grid-cols-3 gap-4 rounded-2xl p-5 mb-4"
                style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
              >
                <div className="text-center">
                  <BarChart3 size={16} className="mx-auto mb-1.5" style={{ color: DARK }} />
                  <p className="text-[16px] font-semibold" style={{ color: DARK }}>{formatNaira(invoiceSummary!.total)}</p>
                  <p className="text-[9px] font-medium uppercase tracking-wider mt-0.5" style={{ color: MUTED }}>Total</p>
                </div>
                <div className="text-center">
                  <CheckCircle size={16} className="mx-auto mb-1.5" style={{ color: GREEN }} />
                  <p className="text-[16px] font-semibold" style={{ color: GREEN }}>{formatNaira(invoiceSummary!.paid)}</p>
                  <p className="text-[9px] font-medium uppercase tracking-wider mt-0.5" style={{ color: MUTED }}>Paid</p>
                </div>
                <div className="text-center">
                  <AlertCircle size={16} className="mx-auto mb-1.5" style={{ color: invoiceSummary!.total - invoiceSummary!.paid > 0 ? "#DC2626" : GREEN }} />
                  <p className="text-[16px] font-semibold" style={{ color: invoiceSummary!.total - invoiceSummary!.paid > 0 ? "#DC2626" : GREEN }}>
                    {formatNaira(invoiceSummary!.total - invoiceSummary!.paid)}
                  </p>
                  <p className="text-[9px] font-medium uppercase tracking-wider mt-0.5" style={{ color: MUTED }}>Balance</p>
                </div>
              </div>

              <div className="space-y-3">
                {invoiceSummary!.invoices.map((inv) => {
                  const balance = inv.total - inv.paid;
                  const isPaid = inv.status === "paid";
                  const hasClaimed = claimedInvoices.has(inv.number);
                  const statusColor =
                    isPaid ? GREEN
                    : inv.status === "partial" ? GOLD
                    : inv.status === "overdue" ? "#DC2626"
                    : inv.status === "sent" ? "#2563EB"
                    : MUTED;
                  return (
                    <div
                      key={inv.number}
                      className="rounded-2xl overflow-hidden"
                      style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
                    >
                      <div className="px-5 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono font-medium" style={{ color: DARK }}>{inv.number}</span>
                          <span
                            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${statusColor}12`, color: statusColor }}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-semibold" style={{ color: DARK }}>{formatNaira(inv.total)}</span>
                          {balance > 0 && (
                            <span className="text-[11px] font-light" style={{ color: "#DC2626" }}>Balance: {formatNaira(balance)}</span>
                          )}
                        </div>
                        {inv.dueDate && (
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={9} style={{ color: `${DARK}30` }} />
                            <p className="text-[10px]" style={{ color: `${DARK}30` }}>Due: {formatDate(inv.dueDate)}</p>
                          </div>
                        )}
                      </div>

                      {!isPaid && balance > 0 && activeBankDetails?.configured && (
                        <div className="px-5 pb-4">
                          <div
                            className="rounded-xl p-3 mb-3"
                            style={{ backgroundColor: CREAM, border: `1px solid ${DARK}06` }}
                          >
                            <p className="text-[9px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: DARK }}>
                              <CreditCard size={10} /> Bank Transfer Details
                            </p>
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[11px]" style={{ color: MUTED }}>Bank</span>
                                <span className="text-[11px] font-medium" style={{ color: DARK }}>{activeBankDetails!.bankName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[11px]" style={{ color: MUTED }}>Account Name</span>
                                <span className="text-[11px] font-medium" style={{ color: DARK }}>{activeBankDetails!.accountName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[11px]" style={{ color: MUTED }}>Account No.</span>
                                <button
                                  className="flex items-center gap-1 text-[11px] font-mono font-bold transition-opacity hover:opacity-70"
                                  style={{ color: DARK }}
                                  onClick={() => {
                                    navigator.clipboard.writeText(activeBankDetails!.accountNumber);
                                    setCopiedAcct(true);
                                    setTimeout(() => setCopiedAcct(false), 2000);
                                  }}
                                >
                                  {activeBankDetails!.accountNumber}
                                  <Copy size={10} />
                                </button>
                              </div>
                              {copiedAcct && (
                                <p className="text-[10px] text-center" style={{ color: GREEN }}>Copied!</p>
                              )}
                            </div>
                            <p className="text-[10px] mt-2 text-center" style={{ color: MUTED }}>
                              Transfer {formatNaira(balance)} then click below
                            </p>
                          </div>

                          {hasClaimed ? (
                            <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl" style={{ backgroundColor: "#DCFCE7" }}>
                              <CheckCircle size={12} style={{ color: GREEN }} />
                              <span className="text-[11px] font-medium" style={{ color: "#166534" }}>
                                Payment claim received -- we'll confirm shortly
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => claimMutation.mutate({ invoiceNumber: inv.number, clientName: inv.clientName })}
                              disabled={claimMutation.isPending}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-40"
                              style={{ backgroundColor: DARK, color: GOLD }}
                            >
                              {claimMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                              I've Paid
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* ═══ SEND MESSAGE TO STAFF ═══ */}
          <div id="message-section" className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Send size={14} style={{ color: MUTED }} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: MUTED }}>
                Send a message
              </p>
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
            >
              {messageSent && (
                <div className="flex items-center gap-2 p-3 mx-5 mt-4 rounded-xl" style={{ backgroundColor: "#DCFCE7" }}>
                  <CheckCircle size={14} style={{ color: GREEN }} />
                  <p className="text-[12px] font-medium" style={{ color: "#166534" }}>
                    Message sent. Your team has been notified.
                  </p>
                </div>
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-5 text-[14px] font-light bg-transparent resize-none focus:outline-none"
                style={{ color: DARK, minHeight: 80 }}
                maxLength={1000}
              />
              <div className="flex items-center justify-between px-5 pb-4">
                <span className="text-[10px]" style={{ color: `${DARK}25` }}>{message.length}/1000</span>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || noteMutation.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-30"
                  style={{ backgroundColor: DARK, color: GOLD }}
                >
                  {noteMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  Send
                </button>
              </div>
            </div>

            {noteMutation.isError && (
              <div className="flex items-center gap-2 p-3 rounded-xl mt-3" style={{ backgroundColor: "#FEE2E2" }}>
                <AlertCircle size={14} style={{ color: "#DC2626" }} />
                <p className="text-[12px]" style={{ color: "#991B1B" }}>Failed to send message. Please try again.</p>
              </div>
            )}

            {/* Recent activity log */}
            {activity.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock size={11} style={{ color: `${DARK}35` }} />
                  <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: `${DARK}35` }}>
                    Recent Activity
                  </p>
                </div>
                <div className="space-y-1">
                  {activity.filter(a => a.action !== "client_note").slice(0, 5).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg"
                      style={{ backgroundColor: CREAM }}
                    >
                      <span className="text-[12px] font-light" style={{ color: DARK }}>
                        {ACTIVITY_LABELS[a.action] || a.action.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px]" style={{ color: `${DARK}30` }}>{timeAgo(a.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>


          {/* ═══ FOUNDER QUOTE ═══ */}
          <div
            className="rounded-2xl p-6 mb-6 relative overflow-hidden"
            style={{ backgroundColor: WHITE, border: `1px solid ${GOLD}15` }}
          >
            <Quote size={60} className="absolute top-3 right-4" style={{ color: GOLD, opacity: 0.06 }} />
            <div className="relative flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${GOLD}10` }}
              >
                <Quote size={16} style={{ color: GOLD }} />
              </div>
              <div>
                <p className="text-[13px] font-light leading-relaxed italic mb-2" style={{ color: DARK }}>
                  "{founderQuote}"
                </p>
                <p className="text-[11px] font-medium" style={{ color: GOLD }}>-- Muhammad Hamzury</p>
              </div>
            </div>
          </div>


          {/* ═══ FOOTER ═══ */}
          <div className="text-center pt-4 pb-6" style={{ borderTop: `1px solid ${DARK}06` }}>
            <p className="text-[10px]" style={{ color: `${DARK}30` }}>
              Ref: {task.ref} &middot; Last updated: {formatDate(task.updatedAt)}
            </p>
          </div>
        </div>


        {/* ─── RIGHT SIDE: Persistent AI Chat (desktop only) ─── */}
        <div
          className="hidden md:flex w-[40%] flex-col border-l"
          style={{ borderColor: BORDER, backgroundColor: WHITE }}
        >
          <ChatPanel />
        </div>
      </div>


      {/* ═══ MOBILE: Chat button + bottom sheet ═══ */}
      <div className="md:hidden">
        {/* Floating chat button */}
        {!mobileChatOpen && (
          <button
            onClick={() => setMobileChatOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
            style={{ backgroundColor: GOLD, color: WHITE }}
          >
            <MessageSquare size={24} />
          </button>
        )}

        {/* Bottom sheet overlay */}
        {mobileChatOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              onClick={() => setMobileChatOpen(false)}
            />
            <div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl overflow-hidden"
              style={{
                backgroundColor: WHITE,
                animation: "slideUp 0.3s ease-out",
                boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <ChatPanel isMobile />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
