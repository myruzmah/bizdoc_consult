import { useState, useEffect, useRef, useMemo } from "react";
import {
  CheckCircle, Circle, ChevronRight, Loader2, AlertCircle, LogOut,
  Send, MessageSquare, Calendar,
  Phone, CreditCard, Copy,
  Unlock, ArrowRight, Quote,
  Shield, FileCheck, Globe, Zap, TrendingUp, Target, Award, BookOpen, Sparkles, Lock,
  BarChart3, Users, Briefcase, GraduationCap, Bot, Palette, Clock, MapPin,
} from "lucide-react";
import PageMeta from "../components/PageMeta";
import ChatWidget from "../components/ChatWidget";
import { trpc } from "@/lib/trpc";

/* ── Brand constants ── */
const CREAM = "#FFFAF6";
const WHITE = "#FFFFFF";
const DARK = "#1A1A1A";
const MUTED = "#666666";
const GOLD = "#B48C4C";
const GREEN = "#22C55E";
const BORDER = "#2D2D2D08";

const DEPT_COLORS: Record<string, string> = {
  bizdoc: "#1B4D3E",
  systemise: "#2563EB",
  skills: "#1E3A5F",
  general: "#2D2D2D",
};

/* ── Department icons mapping ── */
const DEPT_ICONS: Record<string, typeof Shield> = {
  bizdoc: Shield,
  systemise: Globe,
  skills: GraduationCap,
  general: Briefcase,
};

/* ── Service type icon ── */
function getServiceIcon(service: string) {
  const s = (service || "").toLowerCase();
  if (s.includes("cac") || s.includes("registration") || s.includes("compliance")) return Shield;
  if (s.includes("tax") || s.includes("tin") || s.includes("tcc")) return FileCheck;
  if (s.includes("licence") || s.includes("nafdac") || s.includes("permit")) return Award;
  if (s.includes("website") || s.includes("brand")) return Globe;
  if (s.includes("automation") || s.includes("crm")) return Bot;
  if (s.includes("training") || s.includes("skill") || s.includes("cohort")) return GraduationCap;
  if (s.includes("social") || s.includes("media")) return Palette;
  if (s.includes("foreign") || s.includes("cerpac")) return MapPin;
  if (s.includes("scuml")) return Shield;
  return Briefcase;
}

/* ── Importance icon ── */
function getImportanceIcon(service: string) {
  const s = (service || "").toLowerCase();
  if (s.includes("cac") || s.includes("compliance") || s.includes("licence") || s.includes("scuml")) return Shield;
  if (s.includes("tax") || s.includes("tin")) return Lock;
  if (s.includes("website") || s.includes("brand") || s.includes("social")) return Globe;
  if (s.includes("automation") || s.includes("crm")) return TrendingUp;
  if (s.includes("training") || s.includes("skill")) return Target;
  return TrendingUp;
}

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

function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ── Next Unlock logic ── */
function getNextUnlock(service: string, department: string, _status: string) {
  const s = (service || "").toLowerCase();

  if (s.includes("cac") || s.includes("registration")) {
    return {
      title: "Tax Compliance (TIN + VAT)",
      why: "Without tax compliance, you cannot bid for government contracts or get a Tax Clearance Certificate.",
      dept: "bizdoc",
      icon: FileCheck,
    };
  }
  if (s.includes("tax") || s.includes("tin") || s.includes("tcc")) {
    return {
      title: "Industry Licence for Your Sector",
      why: "Every sector has specific regulatory requirements. Operating without the right licence puts your business at risk.",
      dept: "bizdoc",
      icon: Award,
    };
  }
  if (s.includes("licence") || s.includes("permit") || s.includes("nafdac")) {
    return {
      title: "Brand Identity & Website",
      why: "Your compliance is sorted. Now premium clients need to trust you instantly online.",
      dept: "systemise",
      icon: Globe,
    };
  }
  if (s.includes("website") || s.includes("brand")) {
    return {
      title: "Business Automation & CRM",
      why: "Your brand is live. Now automate the parts of your business that repeat every week.",
      dept: "systemise",
      icon: Bot,
    };
  }
  if (s.includes("automation") || s.includes("crm") || s.includes("dashboard")) {
    return {
      title: "Team Training & Enablement",
      why: "Systems are only as good as the people using them. Train your team.",
      dept: "skills",
      icon: GraduationCap,
    };
  }
  if (s.includes("training") || s.includes("skill") || s.includes("cohort")) {
    return {
      title: "Full Business Documentation",
      why: "Make sure your business structure, contracts, and compliance are fully documented.",
      dept: "bizdoc",
      icon: FileCheck,
    };
  }
  return {
    title: "Business Positioning Guide",
    why: "Not sure what your business needs next? Our advisor can map your full requirements.",
    dept: "general",
    icon: Target,
  };
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

const STATUS_STEPS = ["Not Started", "In Progress", "Waiting on Client", "Submitted", "Completed"];
const STATUS_STEP_ICONS = [Circle, Clock, Users, FileCheck, CheckCircle];

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

/* ── Growth roadmap steps ── */
function getGrowthRoadmap(currentService: string, currentStatus: string) {
  const s = (currentService || "").toLowerCase();
  const isCompleted = currentStatus === "Completed";

  const steps = [
    { icon: Shield, title: "CAC Registration", desc: "Legal recognition", dept: "bizdoc" },
    { icon: FileCheck, title: "Tax Compliance", desc: "TIN + VAT filings", dept: "bizdoc" },
    { icon: Award, title: "Industry Licence", desc: "Sector permits", dept: "bizdoc" },
    { icon: Globe, title: "Brand & Website", desc: "Online presence", dept: "systemise" },
    { icon: Bot, title: "Automation & CRM", desc: "Smart systems", dept: "systemise" },
    { icon: GraduationCap, title: "Team Training", desc: "Capability building", dept: "skills" },
  ];

  // Determine which step is current
  let currentIdx = 0;
  if (s.includes("cac") || s.includes("registration")) currentIdx = 0;
  else if (s.includes("tax") || s.includes("tin") || s.includes("tcc")) currentIdx = 1;
  else if (s.includes("licence") || s.includes("permit") || s.includes("nafdac")) currentIdx = 2;
  else if (s.includes("website") || s.includes("brand")) currentIdx = 3;
  else if (s.includes("automation") || s.includes("crm")) currentIdx = 4;
  else if (s.includes("training") || s.includes("skill")) currentIdx = 5;

  return steps.map((step, i) => ({
    ...step,
    state: i < currentIdx ? "delivered" as const
      : i === currentIdx ? (isCompleted ? "delivered" as const : "active" as const)
      : i === currentIdx + 1 ? "next" as const
      : "locked" as const,
  }));
}

/* ── Pulse animation style ── */
const pulseKeyframes = `
@keyframes subtlePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(180, 140, 76, 0.3); }
  50% { box-shadow: 0 0 0 6px rgba(180, 140, 76, 0); }
}
`;

/* ────────────────────────────────────────────────────────────────────────── */
/*  BUSINESS GROWTH GUIDE                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

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
  const clientMessages = activity.filter((a) => a.action === "client_note");

  const isBizdoc = (task.department || "").toLowerCase() === "bizdoc";
  const activeBankDetails = bankDetails
    ? isBizdoc && bankDetails.bizdoc.configured
      ? bankDetails.bizdoc
      : bankDetails.general
    : null;

  const smartPrompts = getSmartPrompts(task.service, task.status, task.department);

  /* ── Computed: service status counts ── */
  const isCompleted = task.status === "Completed";
  const isActive = !isCompleted && task.status !== "Not Started";
  const deliveredCount = isCompleted ? 1 : 0;
  const activeCount = isActive ? 1 : (task.status === "Not Started" ? 1 : 0);
  const nextUnlock = getNextUnlock(task.service, task.department, task.status);
  const nextUnlockColor = DEPT_COLORS[nextUnlock.dept] || GOLD;

  /* ── Departments the client is NOT using ── */
  const currentDept = (task.department || "").toLowerCase();
  const allDepts = [
    {
      key: "bizdoc",
      name: "BIZDOC",
      color: DEPT_COLORS.bizdoc,
      shortDesc: "Compliance & Docs",
      url: "/bizdoc",
    },
    {
      key: "systemise",
      name: "SYSTEMISE",
      color: DEPT_COLORS.systemise,
      shortDesc: "Systems & Brand",
      url: "/systemise",
    },
    {
      key: "skills",
      name: "SKILLS",
      color: DEPT_COLORS.skills,
      shortDesc: "Training & AI",
      url: "/skills",
    },
  ];
  const unusedDepts = allDepts.filter((d) => d.key !== currentDept);

  /* ── Invoices ── */
  const hasInvoices = invoiceSummary && invoiceSummary.invoices.length > 0;

  /* ── Visual helpers ── */
  const ServiceIcon = getServiceIcon(task.service);
  const ImportanceIcon = getImportanceIcon(task.service);
  const currentStepIdx = STATUS_STEPS.indexOf(task.status);
  const roadmap = getGrowthRoadmap(task.service, task.status);

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }}>
      <style>{pulseKeyframes}</style>
      <PageMeta
        title={`${task.businessName || task.clientName} - Business Growth Guide | HAMZURY`}
        description="Your personal business growth guide. Track services, unlock next steps, and talk to your advisor."
      />

      {/* ════════════════════════════════════════════════════════════════ */}
      {/*  HEADER                                                        */}
      {/* ════════════════════════════════════════════════════════════════ */}
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

      <main className="max-w-2xl mx-auto px-5 md:px-8">

        {/* ── Welcome header ── */}
        <div className="pt-10 pb-8">
          <p className="text-[14px] font-light mb-1" style={{ color: MUTED }}>
            Welcome back, {task.clientName}
          </p>
          <h1
            className="text-[24px] md:text-[28px] font-light tracking-tight leading-tight"
            style={{ color: DARK, letterSpacing: "-0.025em" }}
          >
            {task.businessName || task.clientName}
          </h1>
        </div>


        {/* ════════════════════════════════════════════════════════════════ */}
        {/*  SECTION 1: STATUS CARD — Infographic style                    */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div className="mb-8">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-4"
            style={{ color: MUTED }}
          >
            Current Service
          </p>

          <div
            className="rounded-2xl p-6 mb-4"
            style={{
              backgroundColor: WHITE,
              border: `1px solid ${BORDER}`,
            }}
          >
            {/* Top row: Big icon + service name + status badge */}
            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isCompleted ? `${GREEN}10` : `${GOLD}10`,
                }}
              >
                <ServiceIcon size={28} style={{ color: isCompleted ? GREEN : GOLD }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-[18px] font-medium leading-snug mb-1.5"
                  style={{ color: DARK }}
                >
                  {task.service}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: isCompleted ? `${GREEN}12` : `${GOLD}12`,
                      color: isCompleted ? GREEN : GOLD,
                    }}
                  >
                    {isCompleted ? <CheckCircle size={10} /> : <Clock size={10} />}
                    {isCompleted ? "Delivered" : task.status === "Not Started" ? "Queued" : "Active"}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${DEPT_COLORS[(task.department || "").toLowerCase()] || DARK}10`,
                      color: DEPT_COLORS[(task.department || "").toLowerCase()] || DARK,
                    }}
                  >
                    {(() => {
                      const DeptIcon = DEPT_ICONS[(task.department || "").toLowerCase()] || Briefcase;
                      return <DeptIcon size={9} />;
                    })()}
                    {task.department || "HAMZURY"}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual stepper progress */}
            {!isCompleted && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  {STATUS_STEPS.map((step, i) => {
                    const StepIcon = STATUS_STEP_ICONS[i];
                    const isCurrentStep = i === currentStepIdx;
                    const isPast = i < currentStepIdx;
                    const isFuture = i > currentStepIdx;
                    return (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center relative"
                            style={{
                              backgroundColor: isPast ? `${GREEN}15` : isCurrentStep ? `${GOLD}15` : `${DARK}06`,
                              animation: isCurrentStep ? "subtlePulse 2s ease-in-out infinite" : undefined,
                            }}
                          >
                            <StepIcon
                              size={14}
                              style={{
                                color: isPast ? GREEN : isCurrentStep ? GOLD : `${DARK}25`,
                              }}
                            />
                          </div>
                          <span
                            className="text-[8px] font-medium mt-1 text-center leading-tight max-w-[56px]"
                            style={{
                              color: isPast ? GREEN : isCurrentStep ? GOLD : `${DARK}30`,
                            }}
                          >
                            {step === "Waiting on Client" ? "Waiting" : step === "Not Started" ? "Queued" : step}
                          </span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div
                            className="flex-1 h-0.5 mx-1 rounded-full mt-[-12px]"
                            style={{
                              backgroundColor: isPast ? `${GREEN}40` : `${DARK}08`,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-end mt-1">
                  <span className="text-[11px] font-medium tabular-nums" style={{ color: GOLD }}>
                    {task.progress}%
                  </span>
                </div>
              </div>
            )}

            {/* Delivered date or deadline */}
            {isCompleted && task.updatedAt && (
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={14} style={{ color: GREEN }} />
                <p className="text-[12px] font-light" style={{ color: MUTED }}>
                  Delivered {formatDate(task.updatedAt)}
                </p>
              </div>
            )}
            {!isCompleted && task.deadline && (
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} style={{ color: GOLD }} />
                <p className="text-[12px] font-light" style={{ color: MUTED }}>
                  Expected {formatDate(task.deadline)}
                </p>
              </div>
            )}

            {/* Why this matters — with icon */}
            <div
              className="flex items-start gap-2.5 rounded-xl px-4 py-3"
              style={{ backgroundColor: CREAM }}
            >
              <ImportanceIcon size={16} className="shrink-0 mt-0.5" style={{ color: GOLD }} />
              <p
                className="text-[12px] font-light leading-relaxed"
                style={{ color: `${DARK}80` }}
              >
                {getServiceImportance(task.service)}
              </p>
            </div>

            {/* Checklist mini-summary if exists */}
            {checklist.length > 0 && (
              <div
                className="flex items-center gap-3 mt-4 pt-3"
                style={{ borderTop: `1px solid ${DARK}06` }}
              >
                <FileCheck size={14} style={{ color: completedChecklist.length === checklist.length ? GREEN : GOLD }} />
                <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: `${DARK}08` }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((completedChecklist.length / checklist.length) * 100)}%`,
                      backgroundColor: completedChecklist.length === checklist.length ? GREEN : GOLD,
                    }}
                  />
                </div>
                <span className="text-[11px] font-medium tabular-nums" style={{ color: MUTED }}>
                  {completedChecklist.length}/{checklist.length}
                </span>
              </div>
            )}
          </div>

          {/* Subscription monthly tasks if applicable */}
          {subHistory && subHistory.monthlyTasks.length > 0 && (
            <div
              className="rounded-2xl p-6 mb-4"
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
        </div>


        {/* ════════════════════════════════════════════════════════════════ */}
        {/*  SECTION 2: GROWTH JOURNEY — Visual Roadmap                    */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} style={{ color: GOLD }} />
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: MUTED }}
            >
              Growth Roadmap
            </p>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
          >
            <div className="space-y-0">
              {roadmap.map((step, i) => {
                const StepIcon = step.icon;
                const isDelivered = step.state === "delivered";
                const isActiveStep = step.state === "active";
                const isNext = step.state === "next";
                const isLocked = step.state === "locked";
                const stepColor = isDelivered ? GREEN : isActiveStep ? GOLD : isNext ? GOLD : `${DARK}25`;

                return (
                  <div key={step.title}>
                    <div className="flex items-start gap-4">
                      {/* Icon with status indicator */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                          style={{
                            backgroundColor: isDelivered ? `${GREEN}12`
                              : isActiveStep ? `${GOLD}12`
                              : isNext ? `${GOLD}08`
                              : `${DARK}04`,
                            animation: isActiveStep ? "subtlePulse 2s ease-in-out infinite" : undefined,
                          }}
                        >
                          {isDelivered ? (
                            <CheckCircle size={20} style={{ color: GREEN }} />
                          ) : isLocked ? (
                            <Lock size={18} style={{ color: `${DARK}20` }} />
                          ) : isNext ? (
                            <Unlock size={18} style={{ color: GOLD }} />
                          ) : (
                            <StepIcon size={20} style={{ color: GOLD }} />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4
                            className="text-[14px] font-medium"
                            style={{
                              color: isLocked ? `${DARK}35` : DARK,
                            }}
                          >
                            {step.title}
                          </h4>
                          {isDelivered && (
                            <span
                              className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: `${GREEN}12`, color: GREEN }}
                            >
                              Done
                            </span>
                          )}
                          {isActiveStep && (
                            <span
                              className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: `${GOLD}12`, color: GOLD }}
                            >
                              Now
                            </span>
                          )}
                        </div>
                        <p
                          className="text-[11px] font-light"
                          style={{ color: isLocked ? `${DARK}25` : MUTED }}
                        >
                          {step.desc}
                        </p>
                        {isNext && (
                          <button
                            onClick={() => setChatOpen(true)}
                            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:opacity-90"
                            style={{ backgroundColor: nextUnlockColor, color: WHITE }}
                          >
                            <Sparkles size={11} />
                            Activate
                            <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Connector line */}
                    {i < roadmap.length - 1 && (
                      <div className="flex items-center ml-[19px]">
                        <div
                          className="w-0.5 h-5"
                          style={{
                            backgroundColor: isDelivered ? `${GREEN}30` : `${DARK}08`,
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


        {/* ════════════════════════════════════════════════════════════════ */}
        {/*  SECTION 3: ANALYTICS — Icon stat cards                        */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Active", value: activeCount, color: isActive ? GREEN : MUTED, icon: Zap, iconColor: isActive ? GREEN : MUTED },
            { label: "Delivered", value: deliveredCount, color: deliveredCount > 0 ? GREEN : MUTED, icon: FileCheck, iconColor: deliveredCount > 0 ? GREEN : MUTED },
            { label: "Next", value: 1, color: GOLD, icon: Unlock, iconColor: GOLD },
          ].map((stat) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl p-5 flex flex-col items-center gap-2"
                style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.iconColor}10` }}
                >
                  <StatIcon size={20} style={{ color: stat.iconColor }} />
                </div>
                <p
                  className="text-[28px] font-light tabular-nums"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>


        {/* ════════════════════════════════════════════════════════════════ */}
        {/*  SECTION 4: DEPARTMENTS NOT YET ACTIVATED — Icon cards          */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {unusedDepts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={14} style={{ color: MUTED }} />
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: MUTED }}
              >
                Not Yet Activated
              </p>
            </div>
            <div className="space-y-3">
              {unusedDepts.map((dept) => {
                const DeptIcon = DEPT_ICONS[dept.key] || Briefcase;
                return (
                  <button
                    key={dept.key}
                    onClick={() => setChatOpen(true)}
                    className="w-full text-left rounded-2xl p-5 transition-all hover:shadow-sm group"
                    style={{
                      backgroundColor: WHITE,
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${dept.color}10` }}
                      >
                        <DeptIcon size={24} style={{ color: dept.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[14px] font-medium mb-0.5"
                          style={{ color: dept.color }}
                        >
                          {dept.name}
                        </p>
                        <p className="text-[12px] font-light" style={{ color: MUTED }}>
                          {dept.shortDesc}
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-1 transition-all group-hover:gap-2"
                        style={{ color: dept.color }}
                      >
                        <span className="text-[11px] font-medium">Explore</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}


        {/* ════════════════════════════════════════════════════════════════ */}
        {/*  SECTION 5: FOUNDER QUOTE — with decorative icon               */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden"
          style={{
            backgroundColor: WHITE,
            border: `1px solid ${GOLD}15`,
          }}
        >
          {/* Large decorative quote icon */}
          <Quote
            size={80}
            className="absolute top-3 right-4"
            style={{ color: GOLD, opacity: 0.06 }}
          />
          <div className="relative flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${GOLD}10` }}
            >
              <Quote size={18} style={{ color: GOLD }} />
            </div>
            <div>
              <p
                className="text-[14px] font-light leading-relaxed italic mb-3"
                style={{ color: DARK }}
              >
                "{founderQuote}"
              </p>
              <p className="text-[12px] font-medium" style={{ color: GOLD }}>
                -- Muhammad Hamzury
              </p>
            </div>
          </div>
        </div>


        {/* ════════════════════════════════════════════════════════════════ */}
        {/*  SECTION 6: ACTIONS — Icon-first app-style buttons             */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setChatOpen(true)}
            className="flex flex-col items-center gap-3 py-6 rounded-2xl transition-all hover:shadow-sm"
            style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${DARK}06` }}
            >
              <MessageSquare size={22} style={{ color: DARK }} />
            </div>
            <span className="text-[11px] font-medium text-center leading-tight" style={{ color: DARK }}>
              Advisor
            </span>
          </button>
          <button
            onClick={() =>
              window.open(
                "https://wa.me/2348067149356?text=I'd like to schedule a call. My ref: " + task.ref,
                "_blank"
              )
            }
            className="flex flex-col items-center gap-3 py-6 rounded-2xl transition-all hover:shadow-sm"
            style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${DARK}06` }}
            >
              <Calendar size={22} style={{ color: DARK }} />
            </div>
            <span className="text-[11px] font-medium text-center leading-tight" style={{ color: DARK }}>
              Book Call
            </span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("message-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-3 py-6 rounded-2xl transition-all hover:shadow-sm"
            style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${DARK}06` }}
            >
              <Send size={22} style={{ color: DARK }} />
            </div>
            <span className="text-[11px] font-medium text-center leading-tight" style={{ color: DARK }}>
              Message
            </span>
          </button>
        </div>


        {/* ════════════════════════════════════════════════════════════════ */}
        {/*  INVOICES (if any)                                             */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {hasInvoices && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={14} style={{ color: MUTED }} />
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: MUTED }}
              >
                Invoices
              </p>
            </div>

            {/* Summary strip */}
            <div
              className="grid grid-cols-3 gap-4 rounded-2xl p-5 mb-4"
              style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
            >
              <div className="text-center">
                <BarChart3 size={16} className="mx-auto mb-1.5" style={{ color: DARK }} />
                <p className="text-[16px] font-semibold" style={{ color: DARK }}>
                  {formatNaira(invoiceSummary!.total)}
                </p>
                <p className="text-[9px] font-medium uppercase tracking-wider mt-0.5" style={{ color: MUTED }}>
                  Total
                </p>
              </div>
              <div className="text-center">
                <CheckCircle size={16} className="mx-auto mb-1.5" style={{ color: GREEN }} />
                <p className="text-[16px] font-semibold" style={{ color: GREEN }}>
                  {formatNaira(invoiceSummary!.paid)}
                </p>
                <p className="text-[9px] font-medium uppercase tracking-wider mt-0.5" style={{ color: MUTED }}>
                  Paid
                </p>
              </div>
              <div className="text-center">
                <AlertCircle size={16} className="mx-auto mb-1.5" style={{ color: invoiceSummary!.total - invoiceSummary!.paid > 0 ? "#DC2626" : GREEN }} />
                <p
                  className="text-[16px] font-semibold"
                  style={{
                    color: invoiceSummary!.total - invoiceSummary!.paid > 0 ? "#DC2626" : GREEN,
                  }}
                >
                  {formatNaira(invoiceSummary!.total - invoiceSummary!.paid)}
                </p>
                <p className="text-[9px] font-medium uppercase tracking-wider mt-0.5" style={{ color: MUTED }}>
                  Balance
                </p>
              </div>
            </div>

            {/* Individual invoices */}
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
                        <span className="text-[11px] font-mono font-medium" style={{ color: DARK }}>
                          {inv.number}
                        </span>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${statusColor}12`, color: statusColor }}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-semibold" style={{ color: DARK }}>
                          {formatNaira(inv.total)}
                        </span>
                        {balance > 0 && (
                          <span className="text-[11px] font-light" style={{ color: "#DC2626" }}>
                            Balance: {formatNaira(balance)}
                          </span>
                        )}
                      </div>
                      {inv.dueDate && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={9} style={{ color: `${DARK}30` }} />
                          <p className="text-[10px]" style={{ color: `${DARK}30` }}>
                            Due: {formatDate(inv.dueDate)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bank transfer section */}
                    {!isPaid && balance > 0 && activeBankDetails?.configured && (
                      <div className="px-5 pb-4">
                        <div
                          className="rounded-xl p-3 mb-3"
                          style={{ backgroundColor: CREAM, border: `1px solid ${DARK}06` }}
                        >
                          <p
                            className="text-[9px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                            style={{ color: DARK }}
                          >
                            <CreditCard size={10} /> Bank Transfer Details
                          </p>
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px]" style={{ color: MUTED }}>Bank</span>
                              <span className="text-[11px] font-medium" style={{ color: DARK }}>
                                {activeBankDetails!.bankName}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[11px]" style={{ color: MUTED }}>Account Name</span>
                              <span className="text-[11px] font-medium" style={{ color: DARK }}>
                                {activeBankDetails!.accountName}
                              </span>
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
                              <p className="text-[10px] text-center" style={{ color: GREEN }}>
                                Copied!
                              </p>
                            )}
                          </div>
                          <p className="text-[10px] mt-2 text-center" style={{ color: MUTED }}>
                            Transfer {formatNaira(balance)} then click below
                          </p>
                        </div>

                        {hasClaimed ? (
                          <div
                            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl"
                            style={{ backgroundColor: "#DCFCE7" }}
                          >
                            <CheckCircle size={12} style={{ color: GREEN }} />
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
                            style={{ backgroundColor: DARK, color: GOLD }}
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
        )}


        {/* ════════════════════════════════════════════════════════════════ */}
        {/*  SECTION 7: MESSAGE                                            */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div id="message-section" className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Send size={14} style={{ color: MUTED }} />
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: MUTED }}
            >
              Send a message
            </p>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
          >
            {messageSent && (
              <div
                className="flex items-center gap-2 p-3 mx-5 mt-4 rounded-xl"
                style={{ backgroundColor: "#DCFCE7" }}
              >
                <CheckCircle size={14} style={{ color: GREEN }} />
                <p className="text-[12px] font-medium" style={{ color: "#166534" }}>
                  Message sent. Your team has been notified.
                </p>
              </div>
            )}

            <textarea
              ref={msgRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full p-5 text-[14px] font-light bg-transparent resize-none focus:outline-none"
              style={{ color: DARK, minHeight: 100 }}
              maxLength={1000}
            />
            <div className="flex items-center justify-between px-5 pb-4">
              <span className="text-[10px]" style={{ color: `${DARK}25` }}>
                {message.length}/1000
              </span>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || noteMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-30"
                style={{ backgroundColor: DARK, color: GOLD }}
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
              className="flex items-center gap-2 p-3 rounded-xl mt-3"
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
            <div className="mt-4">
              <div className="flex items-center gap-1.5 mb-3">
                <MessageSquare size={11} style={{ color: `${DARK}35` }} />
                <p
                  className="text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: `${DARK}35` }}
                >
                  Previous Messages
                </p>
              </div>
              <div className="space-y-2">
                {clientMessages.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl px-4 py-3"
                    style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}` }}
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

          {/* Recent activity log */}
          {activity.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Clock size={11} style={{ color: `${DARK}35` }} />
                <p
                  className="text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: `${DARK}35` }}
                >
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
                    <span className="text-[10px]" style={{ color: `${DARK}30` }}>
                      {timeAgo(a.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        {/* ════════════════════════════════════════════════════════════════ */}
        {/*  FOOTER                                                        */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div
          className="text-center pt-6 pb-8"
          style={{ borderTop: `1px solid ${DARK}06` }}
        >
          <p className="text-[10px]" style={{ color: `${DARK}30` }}>
            Ref: {task.ref} &middot; Last updated: {formatDate(task.updatedAt)}
          </p>
        </div>
      </main>

      {/* AI Advisor Chat -- controlled, opens when client clicks upsell */}
      <ChatWidget department="general" open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
