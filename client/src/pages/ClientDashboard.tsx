import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  CheckCircle, Circle, ChevronRight, Loader2, AlertCircle, LogOut,
  Clock, Send, MessageSquare, Receipt, Activity, Calendar,
  Building2, Phone, User, FileText, CreditCard, Copy,
  ChevronDown, Upload, PhoneCall,
} from "lucide-react";
import PageMeta from "../components/PageMeta";
import ChatWidget from "../components/ChatWidget";
import { trpc } from "@/lib/trpc";

/* ── Unified brand — all refs are HAM-XXXX-YYYY (general grey) ── */
const THEME = { primary: "#2D2D2D", accent: "#B48C4C", label: "HAMZURY" };
function getDeptTheme(_ref: string) { return THEME; }

const CREAM = "#FFFAF6";   // Milk white
const WHITE = "#FFFFFF";
const DARK = "#1A1A1A";
const GREY = "#2D2D2D";    // Apple grey — general/client

const STATUS_STEPS = ["Not Started", "In Progress", "Waiting on Client", "Submitted", "Completed"];

const STATUS_MESSAGES: Record<string, string> = {
  "Not Started": "Your file has been received and is queued for processing. A compliance officer will begin work shortly.",
  "In Progress": "Your file is actively being worked on. Documents are being prepared and reviewed.",
  "Waiting on Client": "We need additional information or documents from you. Please check your WhatsApp for details.",
  "Submitted": "Your documents have been submitted to the relevant authority. We are awaiting their response.",
  "Completed": "Your file has been completed successfully. Please contact us to arrange document pickup.",
};

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

function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** Context-aware upsell — changes based on client's current service */
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
  // Default
  return [
    { q: "Every serious business needs proper documentation, strong systems, and capable people. Which is your weakest link?", cta: "Find out what I need", chat: true },
    { q: "Is your brand making premium clients trust you? If not, that's fixable.", cta: "Talk to my advisor", chat: true },
    { q: "Want to build real skills that lead to earning? Our programs are built for action, not theory.", cta: "See what fits me", chat: true },
  ];
}

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

/* ── Collapsible Section Component ── */
function Section({
  title,
  count,
  defaultOpen = false,
  children,
  accentColor,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{ backgroundColor: WHITE, border: `1px solid ${GREY}08` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
        style={{ backgroundColor: open ? WHITE : WHITE }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium" style={{ color: GREY }}>
            {title}
          </span>
          {count !== undefined && count > 0 && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: accentColor ? `${accentColor}15` : `${GREY}08`,
                color: accentColor || GREY,
              }}
            >
              {count}
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className="transition-transform duration-200"
          style={{
            color: `${GREY}40`,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {open && (
        <div className="px-6 pb-5" style={{ borderTop: `1px solid ${GREY}06` }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function ClientDashboard() {
  const [session, setSession] = useState<ClientSession | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [claimedInvoices, setClaimedInvoices] = useState<Set<string>>(new Set());
  const [copiedAcct, setCopiedAcct] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const s = loadClientSession();
    setSession(s);
    setSessionLoaded(true);
    if (!s) {
      window.location.href = "/client";
    }
  }, []);

  const theme = getDeptTheme(session?.ref ?? "");
  const PRIMARY = theme.primary;
  const ACCENT = theme.accent;

  // Full lookup query
  const { data, isLoading, isError } = trpc.tracking.fullLookup.useQuery(
    { ref: session?.ref ?? "", phone: session?.phone },
    {
      enabled: !!session?.ref,
      retry: false,
      refetchInterval: 30000,
    }
  );

  // Subscription history (for monthly service clients)
  const { data: subHistory } = trpc.subscriptions.clientHistory.useQuery(
    { ref: session?.ref ?? "" },
    { enabled: !!session?.ref, retry: false }
  );

  // Bank details (public)
  const { data: bankDetails } = trpc.invoices.bankDetails.useQuery(undefined, { staleTime: Infinity });

  // Claim payment mutation
  const claimMutation = trpc.invoices.claimPayment.useMutation({
    onSuccess: (_, vars) => {
      setClaimedInvoices(prev => new Set(prev).add(vars.invoiceNumber));
    },
  });

  // Client note mutation
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

  // Loading states
  if (!sessionLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: CREAM }}>
        <Loader2 className="animate-spin" size={24} style={{ color: PRIMARY }} />
      </div>
    );
  }
  if (!session) return null;
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ backgroundColor: CREAM }}>
        <Loader2 className="animate-spin" size={24} style={{ color: PRIMARY }} />
        <p className="text-[13px] font-light" style={{ color: PRIMARY, opacity: 0.5 }}>Loading your file...</p>
      </div>
    );
  }
  if (isError || !data || !data.found) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ backgroundColor: CREAM }}>
        <AlertCircle size={32} style={{ color: "#DC2626" }} />
        <div className="text-center">
          <p className="text-[15px] font-light mb-1" style={{ color: PRIMARY }}>File not found</p>
          <p className="text-[12px] opacity-40" style={{ color: DARK }}>Reference: {session.ref}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-[12px] font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-70"
          style={{ backgroundColor: PRIMARY, color: ACCENT }}
        >
          Try a different reference
        </button>
      </div>
    );
  }

  const task = data.task;
  const checklist = data.checklist || [];
  const activity = data.activity || [];
  const invoiceSummary = data.invoiceSummary;
  const completedChecklist = checklist.filter(c => c.checked);
  const statusIndex = task.statusIndex;
  const progress = task.progress;
  const clientMessages = activity.filter(a => a.action === "client_note");

  // Pick correct bank account: BizDoc clients use BIZDOC LTD account
  const isBizdoc = (task.department || "").toLowerCase() === "bizdoc";
  const activeBankDetails = bankDetails
    ? (isBizdoc && bankDetails.bizdoc.configured ? bankDetails.bizdoc : bankDetails.general)
    : null;

  // Smart prompt for the "Next Move" card
  const smartPrompts = getSmartPrompts(task.service, task.status, task.department);
  const nextMovePrompt = smartPrompts[0];

  // Determine section default open states
  const hasChecklistPending = checklist.length > 0 && completedChecklist.length < checklist.length;
  const hasInvoices = invoiceSummary && invoiceSummary.invoices.length > 0;
  const hasMessages = clientMessages.length > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      <PageMeta
        title={`${task.businessName || task.clientName} - HAMZURY`}
        description="Track your business compliance file, invoices, and activity."
      />

      {/* ────────────────────────────────────────────────────────────── */}
      {/* 1. HERO HEADER                                                */}
      {/* ────────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-30 px-5 md:px-8 h-14 flex items-center justify-between"
        style={{
          backgroundColor: `${CREAM}f0`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${PRIMARY}08`,
        }}
      >
        <a
          href="/"
          className="text-[15px] font-light tracking-tight"
          style={{ color: PRIMARY, letterSpacing: "-0.03em" }}
        >
          HAMZURY
        </a>
        <div className="flex items-center gap-4">
          <span
            className="text-[11px] font-mono opacity-35 hidden sm:inline"
            style={{ color: PRIMARY }}
          >
            Ref: {task.ref}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[11px] font-medium opacity-40 hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg"
            style={{ color: PRIMARY, backgroundColor: `${PRIMARY}06` }}
          >
            <LogOut size={12} />
            Exit
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-5 md:px-8">

        {/* Welcome header */}
        <div className="pt-10 pb-8">
          <p className="text-[14px] font-light mb-1" style={{ color: `${DARK}70` }}>
            Welcome back, {task.clientName}
          </p>
          <h1
            className="text-[28px] md:text-[32px] font-light tracking-tight leading-tight"
            style={{ color: PRIMARY, letterSpacing: "-0.025em" }}
          >
            {task.businessName || task.clientName}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-[11px] font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: `${ACCENT}12`, color: ACCENT }}
            >
              {task.department || "HAMZURY"}
            </span>
            <span className="text-[11px] font-light" style={{ color: `${DARK}45` }}>
              {task.service}
            </span>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────── */}
        {/* 2. STATUS CARD                                                */}
        {/* ────────────────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-6"
          style={{ backgroundColor: WHITE, border: `1px solid ${PRIMARY}08` }}
        >
          {/* Service name + percentage */}
          <div className="flex items-start justify-between mb-5">
            <h2 className="text-[18px] font-medium leading-snug" style={{ color: PRIMARY }}>
              {task.service}
            </h2>
            <span
              className="text-[22px] font-light tabular-nums"
              style={{ color: ACCENT }}
            >
              {progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-2 rounded-full mb-6"
            style={{ backgroundColor: `${PRIMARY}08` }}
          >
            <div
              className="h-2 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: progress === 100 ? "#16A34A" : ACCENT,
              }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mb-6">
            {STATUS_STEPS.map((step, i) => {
              const isComplete = i < statusIndex;
              const isCurrent = i === statusIndex;
              const shortLabel = step.replace("Waiting on Client", "Awaiting Info");
              return (
                <div key={step} className="flex flex-col items-center flex-1 relative">
                  {/* Connector line */}
                  {i > 0 && (
                    <div
                      className="absolute top-[9px] right-1/2 w-full h-px -z-0"
                      style={{
                        backgroundColor: isComplete || isCurrent ? `${ACCENT}40` : `${PRIMARY}10`,
                      }}
                    />
                  )}
                  {/* Dot */}
                  <div
                    className="relative z-10 w-[18px] h-[18px] rounded-full flex items-center justify-center mb-2"
                    style={{
                      backgroundColor: isComplete
                        ? "#16A34A"
                        : isCurrent
                        ? ACCENT
                        : `${PRIMARY}12`,
                    }}
                  >
                    {isComplete && <CheckCircle size={10} color={WHITE} />}
                    {isCurrent && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: WHITE }}
                      />
                    )}
                  </div>
                  <span
                    className="text-[9px] md:text-[10px] text-center leading-tight font-medium"
                    style={{
                      color: isComplete || isCurrent ? PRIMARY : `${DARK}35`,
                    }}
                  >
                    {shortLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Status message */}
          <p
            className="text-[14px] font-light leading-relaxed"
            style={{ color: `${DARK}90` }}
          >
            {STATUS_MESSAGES[task.status] || "Status update pending."}
          </p>

          {/* Dates row */}
          <div
            className="flex items-center gap-4 mt-5 pt-4"
            style={{ borderTop: `1px solid ${PRIMARY}06` }}
          >
            {task.deadline && (
              <div className="flex items-center gap-1.5">
                <Calendar size={12} style={{ color: `${DARK}40` }} />
                <span className="text-[12px] font-light" style={{ color: `${DARK}50` }}>
                  Deadline: {formatDate(task.deadline)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock size={12} style={{ color: `${DARK}40` }} />
              <span className="text-[12px] font-light" style={{ color: `${DARK}50` }}>
                Last update: {formatDate(task.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────── */}
        {/* 3. YOUR NEXT MOVE                                             */}
        {/* ────────────────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-6"
          style={{
            backgroundColor: WHITE,
            borderLeft: `3px solid ${ACCENT}`,
            border: `1px solid ${ACCENT}20`,
            borderLeftWidth: 3,
            borderLeftColor: ACCENT,
          }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-3"
            style={{ color: ACCENT }}
          >
            Your Next Move
          </p>
          <p
            className="text-[14px] font-light leading-relaxed mb-5"
            style={{ color: DARK }}
          >
            {nextMovePrompt.q}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setChatOpen(true)}
              className="px-5 py-2.5 rounded-lg text-[12px] font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: PRIMARY, color: WHITE }}
            >
              Talk to my advisor
            </button>
            <button
              onClick={() => {
                const dept = (task.department || "").toLowerCase();
                const url = dept === "bizdoc" ? "/bizdoc" : dept === "systemise" ? "/systemise" : dept === "skills" ? "/skills" : "/bizdoc";
                window.location.href = url;
              }}
              className="px-5 py-2.5 rounded-lg text-[12px] font-medium transition-all hover:opacity-70"
              style={{ backgroundColor: `${PRIMARY}08`, color: PRIMARY }}
            >
              See what I need
            </button>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────── */}
        {/* 4. QUICK ACTIONS                                              */}
        {/* ────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => {
              const el = document.getElementById("message-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all hover:shadow-sm"
            style={{ backgroundColor: WHITE, border: `1px solid ${PRIMARY}08` }}
          >
            <MessageSquare size={18} style={{ color: PRIMARY }} />
            <span className="text-[11px] font-medium" style={{ color: PRIMARY }}>
              Message team
            </span>
          </button>
          <button
            onClick={() =>
              toast("Document upload coming soon. For now, send via WhatsApp: +234 806 714 9356")
            }
            className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all hover:shadow-sm"
            style={{ backgroundColor: WHITE, border: `1px solid ${PRIMARY}08` }}
          >
            <Upload size={18} style={{ color: PRIMARY }} />
            <span className="text-[11px] font-medium" style={{ color: PRIMARY }}>
              Upload document
            </span>
          </button>
          <button
            onClick={() =>
              window.open(
                "https://wa.me/2348067149356?text=I'd like to book a call. My ref: " + task.ref,
                "_blank"
              )
            }
            className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all hover:shadow-sm"
            style={{ backgroundColor: WHITE, border: `1px solid ${PRIMARY}08` }}
          >
            <PhoneCall size={18} style={{ color: PRIMARY }} />
            <span className="text-[11px] font-medium" style={{ color: PRIMARY }}>
              Book a call
            </span>
          </button>
        </div>

        {/* ────────────────────────────────────────────────────────────── */}
        {/* 5. FILE DETAILS — Collapsible Sections                        */}
        {/* ────────────────────────────────────────────────────────────── */}
        <div className="space-y-3 mb-8">

          {/* Section A: Checklist */}
          {checklist.length > 0 && (
            <Section
              title="Checklist"
              count={checklist.length}
              defaultOpen={hasChecklistPending}
              accentColor={completedChecklist.length === checklist.length ? "#16A34A" : ACCENT}
            >
              {/* Mini progress */}
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: `${PRIMARY}08` }}>
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((completedChecklist.length / checklist.length) * 100)}%`,
                      backgroundColor: completedChecklist.length === checklist.length ? "#16A34A" : ACCENT,
                    }}
                  />
                </div>
                <span className="text-[11px] font-light" style={{ color: `${DARK}50` }}>
                  {completedChecklist.length}/{checklist.length}
                </span>
              </div>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 py-2.5 px-3 rounded-xl"
                    style={{
                      backgroundColor: item.checked ? `#16A34A06` : `${CREAM}`,
                      border: `1px solid ${item.checked ? "#16A34A10" : `${PRIMARY}05`}`,
                    }}
                  >
                    {item.checked ? (
                      <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: "#16A34A" }} />
                    ) : (
                      <Circle size={16} className="mt-0.5 shrink-0" style={{ color: `${PRIMARY}25` }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[13px] font-light leading-snug"
                        style={{
                          color: item.checked ? "#16A34A" : DARK,
                          opacity: item.checked ? 0.7 : 1,
                        }}
                      >
                        {item.label}
                      </span>
                      {item.phase && (
                        <span
                          className="ml-2 text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: `${DARK}30` }}
                        >
                          {item.phase}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Subscription History (if exists) */}
          {subHistory && (
            <Section title="Monthly Service" count={subHistory.monthlyTasks.length} defaultOpen={false}>
              <div className="mt-2">
                <p className="text-[12px] font-light mb-3" style={{ color: `${DARK}60` }}>
                  {subHistory.service}
                </p>
                {subHistory.monthlyTasks.length === 0 ? (
                  <p className="text-[13px] font-light opacity-40" style={{ color: PRIMARY }}>
                    No monthly tasks yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {subHistory.monthlyTasks.map((t: { month: string | null; status: string; kpiApproved: boolean }) => (
                      <div
                        key={t.month}
                        className="flex items-center justify-between rounded-xl px-4 py-3"
                        style={{ backgroundColor: CREAM, border: `1px solid ${PRIMARY}06` }}
                      >
                        <div className="flex items-center gap-3">
                          {t.kpiApproved ? (
                            <CheckCircle size={16} style={{ color: "#16A34A" }} />
                          ) : t.status === "Completed" ? (
                            <CheckCircle size={16} style={{ color: "#16A34A", opacity: 0.5 }} />
                          ) : (
                            <Circle size={16} style={{ color: `${PRIMARY}30` }} />
                          )}
                          <span className="text-[13px] font-light" style={{ color: PRIMARY }}>
                            {t.month}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                            t.kpiApproved
                              ? "bg-green-100 text-green-700"
                              : t.status === "Submitted"
                              ? "bg-blue-100 text-blue-700"
                              : t.status === "In Progress"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {t.kpiApproved ? "Filed" : t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Section B: Activity */}
          <Section title="Activity" count={activity.length} defaultOpen={false}>
            <div className="mt-2">
              {activity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity size={24} className="mx-auto mb-2" style={{ color: `${DARK}15` }} />
                  <p className="text-[13px] font-light" style={{ color: `${DARK}40` }}>
                    No activity recorded yet.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div
                    className="absolute left-[11px] top-3 bottom-3 w-px"
                    style={{ backgroundColor: `${PRIMARY}08` }}
                  />
                  <div className="space-y-1">
                    {activity.slice(0, 10).map((a) => (
                      <div key={a.id} className="flex items-start gap-4 py-3 pl-0 relative">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10"
                          style={{
                            backgroundColor:
                              a.action === "client_note"
                                ? `${ACCENT}15`
                                : a.action === "status_change"
                                ? `${PRIMARY}10`
                                : a.action === "payment_confirmed"
                                ? "#16A34A12"
                                : `${DARK}06`,
                          }}
                        >
                          {a.action === "client_note" ? (
                            <MessageSquare size={10} style={{ color: ACCENT }} />
                          ) : a.action === "status_change" ? (
                            <Activity size={10} style={{ color: PRIMARY }} />
                          ) : a.action === "payment_confirmed" ? (
                            <Receipt size={10} style={{ color: "#16A34A" }} />
                          ) : (
                            <Clock size={10} style={{ color: `${DARK}40` }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium" style={{ color: PRIMARY }}>
                            {ACTIVITY_LABELS[a.action] || a.action.replace(/_/g, " ")}
                          </p>
                          {a.details && (
                            <p
                              className="text-[11px] font-light mt-0.5 leading-relaxed"
                              style={{ color: `${DARK}55` }}
                            >
                              {a.details.replace("Client message: ", "")}
                            </p>
                          )}
                          <p className="text-[10px] mt-1" style={{ color: `${DARK}30` }}>
                            {timeAgo(a.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Section C: Invoices */}
          {hasInvoices && (
            <Section
              title="Invoices"
              count={invoiceSummary!.invoices.length}
              defaultOpen={false}
              accentColor={
                invoiceSummary!.total - invoiceSummary!.paid > 0 ? "#DC2626" : "#16A34A"
              }
            >
              <div className="mt-2">
                {/* Summary strip */}
                <div
                  className="grid grid-cols-3 gap-4 rounded-xl p-4 mb-4"
                  style={{ backgroundColor: CREAM, border: `1px solid ${PRIMARY}06` }}
                >
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: `${DARK}40` }}>
                      Total
                    </p>
                    <p className="text-[16px] font-semibold" style={{ color: PRIMARY }}>
                      {formatNaira(invoiceSummary!.total)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: `${DARK}40` }}>
                      Paid
                    </p>
                    <p className="text-[16px] font-semibold" style={{ color: "#16A34A" }}>
                      {formatNaira(invoiceSummary!.paid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: `${DARK}40` }}>
                      Balance
                    </p>
                    <p
                      className="text-[16px] font-semibold"
                      style={{
                        color:
                          invoiceSummary!.total - invoiceSummary!.paid > 0 ? "#DC2626" : "#16A34A",
                      }}
                    >
                      {formatNaira(invoiceSummary!.total - invoiceSummary!.paid)}
                    </p>
                  </div>
                </div>

                {/* Individual invoices */}
                <div className="space-y-3">
                  {invoiceSummary!.invoices.map((inv) => {
                    const balance = inv.total - inv.paid;
                    const isPaid = inv.status === "paid";
                    const hasClaimed = claimedInvoices.has(inv.number);
                    const statusBg =
                      isPaid
                        ? "bg-green-100 text-green-700"
                        : inv.status === "partial"
                        ? "bg-amber-100 text-amber-700"
                        : inv.status === "overdue"
                        ? "bg-red-100 text-red-700"
                        : inv.status === "sent"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500";
                    return (
                      <div
                        key={inv.number}
                        className="rounded-xl overflow-hidden"
                        style={{ backgroundColor: CREAM, border: `1px solid ${PRIMARY}06` }}
                      >
                        <div className="px-4 py-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-mono font-medium" style={{ color: PRIMARY }}>
                              {inv.number}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusBg}`}
                            >
                              {inv.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] font-semibold" style={{ color: PRIMARY }}>
                              {formatNaira(inv.total)}
                            </span>
                            {balance > 0 && (
                              <span className="text-[11px] font-light" style={{ color: "#DC2626" }}>
                                Balance: {formatNaira(balance)}
                              </span>
                            )}
                          </div>
                          {inv.dueDate && (
                            <p className="text-[10px] mt-1" style={{ color: `${DARK}30` }}>
                              Due: {formatDate(inv.dueDate)}
                            </p>
                          )}
                        </div>

                        {/* Bank transfer section */}
                        {!isPaid && balance > 0 && activeBankDetails?.configured && (
                          <div className="px-4 pb-4">
                            <div
                              className="rounded-xl p-3 mb-3"
                              style={{ backgroundColor: WHITE, border: `1px solid ${PRIMARY}08` }}
                            >
                              <p
                                className="text-[9px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                                style={{ color: PRIMARY }}
                              >
                                <CreditCard size={10} /> Bank Transfer Details
                              </p>
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px]" style={{ color: `${DARK}50` }}>Bank</span>
                                  <span className="text-[11px] font-medium" style={{ color: DARK }}>
                                    {activeBankDetails!.bankName}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px]" style={{ color: `${DARK}50` }}>
                                    Account Name
                                  </span>
                                  <span className="text-[11px] font-medium" style={{ color: DARK }}>
                                    {activeBankDetails!.accountName}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px]" style={{ color: `${DARK}50` }}>
                                    Account No.
                                  </span>
                                  <button
                                    className="flex items-center gap-1 text-[11px] font-mono font-bold transition-opacity hover:opacity-70"
                                    style={{ color: PRIMARY }}
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
                                  <p className="text-[10px] text-center" style={{ color: "#16A34A" }}>
                                    Copied!
                                  </p>
                                )}
                              </div>
                              <p
                                className="text-[10px] mt-2 text-center"
                                style={{ color: `${DARK}40` }}
                              >
                                Transfer {formatNaira(balance)} then click below
                              </p>
                            </div>

                            {hasClaimed ? (
                              <div
                                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl"
                                style={{ backgroundColor: "#DCFCE7" }}
                              >
                                <CheckCircle size={12} style={{ color: "#16A34A" }} />
                                <span className="text-[11px] font-medium" style={{ color: "#166534" }}>
                                  Payment claim received -- we'll confirm shortly
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  claimMutation.mutate({
                                    invoiceNumber: inv.number,
                                    clientName: inv.clientName,
                                  })
                                }
                                disabled={claimMutation.isPending}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-40"
                                style={{ backgroundColor: PRIMARY, color: ACCENT }}
                              >
                                {claimMutation.isPending ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <CheckCircle size={12} />
                                )}
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
            </Section>
          )}

          {/* Section D: Message */}
          <div id="message-section">
            <Section
              title="Message"
              count={clientMessages.length > 0 ? clientMessages.length : undefined}
              defaultOpen={hasMessages}
              accentColor={ACCENT}
            >
              <div className="mt-2">
                <p className="text-[12px] font-light mb-4" style={{ color: `${DARK}50` }}>
                  Leave a note for your assigned team. They will respond via WhatsApp.
                </p>

                {messageSent && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-xl mb-4"
                    style={{ backgroundColor: "#DCFCE7" }}
                  >
                    <CheckCircle size={14} style={{ color: "#16A34A" }} />
                    <p className="text-[12px] font-medium" style={{ color: "#166534" }}>
                      Message sent. Your team has been notified.
                    </p>
                  </div>
                )}

                <div
                  className="rounded-xl overflow-hidden mb-4"
                  style={{ backgroundColor: CREAM, border: `1px solid ${PRIMARY}06` }}
                >
                  <textarea
                    ref={msgRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-4 text-[14px] font-light bg-transparent resize-none focus:outline-none"
                    style={{ color: DARK, minHeight: 100 }}
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between px-4 pb-3">
                    <span className="text-[10px]" style={{ color: `${DARK}25` }}>
                      {message.length}/1000
                    </span>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || noteMutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-30"
                      style={{ backgroundColor: PRIMARY, color: ACCENT }}
                    >
                      {noteMutation.isPending ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Send size={12} />
                      )}
                      Send
                    </button>
                  </div>
                </div>

                {noteMutation.isError && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-xl mb-4"
                    style={{ backgroundColor: "#FEE2E2" }}
                  >
                    <AlertCircle size={14} style={{ color: "#DC2626" }} />
                    <p className="text-[12px]" style={{ color: "#991B1B" }}>
                      Failed to send message. Please try again.
                    </p>
                  </div>
                )}

                {/* Previous messages */}
                {clientMessages.length > 0 && (
                  <div>
                    <p
                      className="text-[11px] font-medium uppercase tracking-wider mb-3"
                      style={{ color: `${DARK}35` }}
                    >
                      Previous Messages
                    </p>
                    <div className="space-y-2">
                      {clientMessages.map((a) => (
                        <div
                          key={a.id}
                          className="rounded-xl px-4 py-3"
                          style={{ backgroundColor: `${ACCENT}06`, border: `1px solid ${ACCENT}10` }}
                        >
                          <p className="text-[13px] font-light" style={{ color: DARK }}>
                            {a.details?.replace("Client message: ", "")}
                          </p>
                          <p className="text-[10px] mt-1" style={{ color: `${DARK}30` }}>
                            {timeAgo(a.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────── */}
        {/* 6. MORE FROM HAMZURY                                          */}
        {/* ────────────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4"
            style={{ color: ACCENT }}
          >
            More from HAMZURY
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                name: "BizDoc Consult",
                color: "#1B4D3E",
                desc: "Registration, compliance, licences, and ongoing management.",
                url: "/bizdoc",
              },
              {
                name: "Systemise",
                color: "#2563EB",
                desc: "Website, branding, social media, AI agents, and dashboards.",
                url: "/systemise",
              },
              {
                name: "HAMZURY Skills",
                color: "#1E3A5F",
                desc: "AI training, founder programs, and practical cohorts.",
                url: "/skills",
              },
            ].map((dept) => (
              <button
                key={dept.name}
                onClick={() => setChatOpen(true)}
                className="text-left rounded-2xl p-5 transition-all hover:shadow-sm group"
                style={{ backgroundColor: WHITE, border: `1px solid ${dept.color}15` }}
              >
                <div
                  className="w-8 h-1 rounded-full mb-3"
                  style={{ backgroundColor: dept.color }}
                />
                <p className="text-[14px] font-medium mb-1" style={{ color: dept.color }}>
                  {dept.name}
                </p>
                <p className="text-[12px] font-light leading-relaxed" style={{ color: `${DARK}60` }}>
                  {dept.desc}
                </p>
                <span
                  className="inline-flex items-center gap-1 mt-3 text-[11px] font-medium transition-all group-hover:gap-2"
                  style={{ color: dept.color }}
                >
                  Explore
                  <ChevronRight size={12} />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────── */}
        {/* 7. FOOTER                                                     */}
        {/* ────────────────────────────────────────────────────────────── */}
        <div
          className="text-center pt-6 pb-8 space-y-2"
          style={{ borderTop: `1px solid ${PRIMARY}06` }}
        >
          <p className="text-[12px] font-light" style={{ color: `${DARK}40` }}>
            Questions? WhatsApp your CSO on{" "}
            <a
              href="https://wa.me/2348067149356"
              className="underline"
              style={{ color: `${DARK}55` }}
            >
              08067149356
            </a>
          </p>
          <p className="text-[10px]" style={{ color: `${DARK}20` }}>
            Ref: {task.ref} | Last updated: {formatDateTime(task.updatedAt)}
          </p>
        </div>
      </main>

      {/* AI Advisor Chat -- controlled, opens when client clicks upsell */}
      <ChatWidget department="general" open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
