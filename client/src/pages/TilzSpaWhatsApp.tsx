import { useState } from "react";
import { Link } from "wouter";
import {
  MessageSquare, Settings, List, Send, Zap, BarChart3, CheckCircle2, Circle,
  ChevronDown, ChevronRight, Save, ToggleLeft, ToggleRight, RefreshCw,
  ArrowLeft, Shield, ExternalLink,
} from "lucide-react";

const CHOCOLATE  = "#3C2415";
const CAPPUCCINO = "#C4A882";
const GOLD       = "#D4AF6F";
const CREAM      = "#F5F0E8";
const IVORY      = "#FAF7F2";

type Section = "setup" | "templates" | "automation" | "log" | "api";

const SETUP_STEPS = [
  "Go to business.facebook.com and create a Meta Business account",
  "Go to developers.facebook.com \u2192 Create App \u2192 Select \"Business\" type",
  "Add \"WhatsApp\" product to the app",
  "In WhatsApp > Getting Started, note the Phone Number ID and Access Token",
  "Set up a webhook URL (will be provided by HAMZURY)",
  "Verify your business phone number (0817 237 1818)",
  "Apply for WhatsApp Business API access (takes 1\u20133 days)",
];

const DEFAULT_TEMPLATES: Record<string, string> = {
  "Welcome Message":
    "Hello! Welcome to Tilz Spa \u2726 How can we help you today? Reply with:\n1\uFE0F\u20E3 Book an appointment\n2\uFE0F\u20E3 View our services\n3\uFE0F\u20E3 Check prices\n4\uFE0F\u20E3 Get directions",
  "Booking Confirmation":
    "Your appointment is confirmed \u2726\n\uD83D\uDCC5 {date}\n\u23F0 {time}\n\uD83D\uDC86 {service}\n\uD83D\uDCCD Wuse 2, Abuja\nPlease arrive 10 minutes early.",
  "Reminder (24h before)":
    "Hi {name} \uD83D\uDC4B Reminder: Your Tilz Spa appointment is tomorrow at {time}. We\u2019re looking forward to seeing you \u2726",
  "Post-Visit":
    "Thank you for visiting Tilz Spa \u2726 We hope you feel restored! Would you like to book your next visit?",
  "Review Request":
    "Hi {name}! We\u2019d love your feedback. Please leave us a quick Google review: {link} \u2726",
};

const DEFAULT_RULES = [
  { id: "auto-reply", label: "Auto-reply to new messages", on: true },
  { id: "booking-confirm", label: "Send booking confirmations automatically", on: true },
  { id: "reminder-24h", label: "Send 24-hour reminders", on: true },
  { id: "post-visit", label: "Send post-visit follow-up (2 hours after appointment)", on: false },
  { id: "review-req", label: "Send review request (24 hours after visit)", on: false },
  { id: "reactivation", label: "Send reactivation message (30 days inactive)", on: false },
];

const MOCK_LOG = [
  { date: "2026-04-07 14:32", name: "Aisha M.", phone: "0812***4421", dir: "in", type: "New enquiry", status: "Replied" },
  { date: "2026-04-07 14:33", name: "Aisha M.", phone: "0812***4421", dir: "out", type: "Welcome", status: "Delivered" },
  { date: "2026-04-07 11:05", name: "Blessing O.", phone: "0903***8812", dir: "out", type: "Reminder", status: "Delivered" },
  { date: "2026-04-06 18:22", name: "Fatima A.", phone: "0817***3301", dir: "in", type: "Booking request", status: "Replied" },
  { date: "2026-04-06 18:23", name: "Fatima A.", phone: "0817***3301", dir: "out", type: "Booking Confirmation", status: "Delivered" },
  { date: "2026-04-06 16:00", name: "Grace E.", phone: "0809***5590", dir: "out", type: "Post-Visit", status: "Read" },
  { date: "2026-04-06 09:15", name: "Chioma N.", phone: "0706***2209", dir: "in", type: "Price enquiry", status: "Replied" },
  { date: "2026-04-05 20:40", name: "Halima U.", phone: "0813***7766", dir: "out", type: "Review Request", status: "Delivered" },
  { date: "2026-04-05 14:12", name: "Sandra K.", phone: "0810***1134", dir: "in", type: "Directions", status: "Replied" },
  { date: "2026-04-05 10:00", name: "Amina B.", phone: "0816***4455", dir: "out", type: "Reactivation", status: "Delivered" },
];

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "setup",      label: "Setup Guide",   icon: <Settings size={18} /> },
  { id: "templates",  label: "Templates",      icon: <MessageSquare size={18} /> },
  { id: "automation", label: "Automation",      icon: <Zap size={18} /> },
  { id: "log",        label: "Message Log",     icon: <List size={18} /> },
  { id: "api",        label: "API Status",      icon: <Shield size={18} /> },
];

/* ──────────────────────── Component ──────────────────────── */

export default function TilzSpaWhatsApp() {
  const [section, setSection] = useState<Section>("setup");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checklist, setChecklist] = useState<boolean[]>(SETUP_STEPS.map(() => false));
  const [templates, setTemplates] = useState<Record<string, string>>({ ...DEFAULT_TEMPLATES });
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [rules, setRules] = useState(DEFAULT_RULES.map(r => ({ ...r })));
  const [apiFields, setApiFields] = useState({ phoneId: "", token: "", webhook: "https://hamzury.com/api/whatsapp/tilz-spa/webhook" });
  const [connected, setConnected] = useState(false);

  const toggleCheck = (i: number) => setChecklist(prev => prev.map((v, idx) => idx === i ? !v : v));
  const toggleRule = (id: string) => setRules(prev => prev.map(r => r.id === id ? { ...r, on: !r.on } : r));

  const saveTemplate = (key: string) => {
    setSavedNote(key);
    setTimeout(() => setSavedNote(null), 1500);
  };

  /* ─── Sidebar ─── */
  const Sidebar = () => (
    <aside
      className="fixed md:static top-0 left-0 h-full w-64 z-40 flex flex-col py-6 px-4 transition-transform duration-200"
      style={{
        backgroundColor: CHOCOLATE,
        transform: sidebarOpen ? "translateX(0)" : undefined,
      }}
    >
      <div className="mb-8 px-2">
        <Link href="/clients/tilz-spa">
          <span className="flex items-center gap-2 text-[12px] font-medium cursor-pointer" style={{ color: CAPPUCCINO }}>
            <ArrowLeft size={14} /> Back to Tilz Spa
          </span>
        </Link>
        <h2 className="text-[18px] font-bold mt-4" style={{ color: CREAM }}>WhatsApp</h2>
        <p className="text-[12px] mt-1" style={{ color: CAPPUCCINO }}>Automation Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(item => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setSidebarOpen(false); }}
              className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: active ? `${GOLD}25` : "transparent",
                color: active ? GOLD : CAPPUCCINO,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 px-2">
        <p className="text-[11px]" style={{ color: `${CAPPUCCINO}80` }}>
          Powered by <Link href="/"><span className="underline cursor-pointer" style={{ color: GOLD }}>HAMZURY</span></Link>
        </p>
      </div>
    </aside>
  );

  /* ─── Setup Guide ─── */
  const SetupGuide = () => (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: CHOCOLATE }}>WhatsApp Cloud API Setup</h2>
      <p className="text-[14px] mb-8" style={{ color: "#5A3E2B" }}>
        Follow each step to connect your WhatsApp Business number to Tilz Spa automation.
      </p>
      <ol className="space-y-4">
        {SETUP_STEPS.map((step, i) => (
          <li key={i}>
            <button
              onClick={() => toggleCheck(i)}
              className="flex items-start gap-3 w-full text-left rounded-xl p-4 transition-colors"
              style={{ backgroundColor: checklist[i] ? `${GOLD}15` : "#FFFFFF", border: `1px solid ${checklist[i] ? GOLD : CAPPUCCINO}30` }}
            >
              {checklist[i]
                ? <CheckCircle2 size={20} className="mt-0.5 shrink-0" style={{ color: "#25D366" }} />
                : <Circle size={20} className="mt-0.5 shrink-0" style={{ color: CAPPUCCINO }} />
              }
              <span className="text-[14px]" style={{ color: CHOCOLATE, textDecoration: checklist[i] ? "line-through" : undefined }}>
                <span className="font-semibold" style={{ color: GOLD }}>Step {i + 1}:</span> {step}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="text-[13px] mt-6" style={{ color: "#5A3E2B" }}>
        {checklist.filter(Boolean).length} / {SETUP_STEPS.length} steps completed
      </p>
    </div>
  );

  /* ─── Templates ─── */
  const Templates = () => (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: CHOCOLATE }}>Auto-Reply Templates</h2>
      <p className="text-[14px] mb-8" style={{ color: "#5A3E2B" }}>
        Edit message templates below. Use {"{name}"}, {"{date}"}, {"{time}"}, {"{service}"}, {"{link}"} as placeholders.
      </p>
      <div className="space-y-6">
        {Object.keys(templates).map(key => (
          <div key={key} className="rounded-xl p-5" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${CAPPUCCINO}25` }}>
            <label className="block text-[13px] font-semibold mb-2" style={{ color: CHOCOLATE }}>{key}</label>
            <textarea
              value={templates[key]}
              onChange={e => setTemplates(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full rounded-lg p-3 text-[14px] leading-relaxed resize-y outline-none focus:ring-2"
              style={{ backgroundColor: IVORY, color: CHOCOLATE, minHeight: 100, borderColor: `${CAPPUCCINO}40`, focusRingColor: GOLD } as React.CSSProperties}
              rows={4}
            />
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => saveTemplate(key)}
                className="flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: CHOCOLATE, color: CREAM }}
              >
                <Save size={14} /> Save
              </button>
              {savedNote === key && (
                <span className="text-[13px] font-medium" style={{ color: "#25D366" }}>Saved!</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─── Automation Rules ─── */
  const AutomationRules = () => (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: CHOCOLATE }}>Automation Rules</h2>
      <p className="text-[14px] mb-8" style={{ color: "#5A3E2B" }}>
        Toggle automations on or off. Changes take effect immediately.
      </p>
      <div className="space-y-3">
        {rules.map(rule => (
          <div
            key={rule.id}
            className="flex items-center justify-between rounded-xl p-4"
            style={{ backgroundColor: "#FFFFFF", border: `1px solid ${CAPPUCCINO}25` }}
          >
            <span className="text-[14px] font-medium" style={{ color: CHOCOLATE }}>{rule.label}</span>
            <button onClick={() => toggleRule(rule.id)} className="shrink-0">
              {rule.on
                ? <ToggleRight size={32} style={{ color: "#25D366" }} />
                : <ToggleLeft size={32} style={{ color: CAPPUCCINO }} />
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─── Message Log ─── */
  const MessageLog = () => (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: CHOCOLATE }}>Message Log</h2>
      <p className="text-[14px] mb-8" style={{ color: "#5A3E2B" }}>Recent WhatsApp messages (last 7 days).</p>

      <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${CAPPUCCINO}25` }}>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr style={{ backgroundColor: CREAM }}>
              {["Date", "Client", "Phone", "Dir", "Type", "Status"].map(h => (
                <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: CHOCOLATE }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_LOG.map((row, i) => (
              <tr key={i} className="border-t" style={{ borderColor: `${CAPPUCCINO}15`, backgroundColor: i % 2 === 0 ? "#FFFFFF" : IVORY }}>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#5A3E2B" }}>{row.date}</td>
                <td className="px-4 py-3 whitespace-nowrap font-medium" style={{ color: CHOCOLATE }}>{row.name}</td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#5A3E2B" }}>{row.phone}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                      backgroundColor: row.dir === "in" ? "#E8F5E9" : `${GOLD}20`,
                      color: row.dir === "in" ? "#2E7D32" : "#8B6914",
                    }}
                  >
                    {row.dir === "in" ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    {row.dir === "in" ? "In" : "Out"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: "#5A3E2B" }}>{row.type}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{
                      backgroundColor: row.status === "Read" ? "#E3F2FD" : row.status === "Delivered" ? "#E8F5E9" : `${GOLD}20`,
                      color: row.status === "Read" ? "#1565C0" : row.status === "Delivered" ? "#2E7D32" : "#8B6914",
                    }}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ─── API Status ─── */
  const ApiStatus = () => (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: CHOCOLATE }}>API Status</h2>
      <p className="text-[14px] mb-8" style={{ color: "#5A3E2B" }}>
        Connection settings for WhatsApp Cloud API.
      </p>

      {/* Status indicator */}
      <div className="flex items-center gap-3 mb-8 rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${CAPPUCCINO}25` }}>
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: connected ? "#25D366" : "#E53935" }}
        />
        <span className="text-[14px] font-semibold" style={{ color: connected ? "#25D366" : "#E53935" }}>
          {connected ? "Connected" : "Not Connected"}
        </span>
      </div>

      <div className="space-y-4">
        {/* Phone Number ID */}
        <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${CAPPUCCINO}25` }}>
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: CHOCOLATE }}>Phone Number ID</label>
          <input
            type="text"
            value={apiFields.phoneId}
            onChange={e => setApiFields(p => ({ ...p, phoneId: e.target.value }))}
            placeholder="e.g. 109234567890123"
            className="w-full rounded-lg px-3 py-2.5 text-[14px] outline-none focus:ring-2"
            style={{ backgroundColor: IVORY, color: CHOCOLATE }}
          />
        </div>

        {/* Access Token */}
        <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${CAPPUCCINO}25` }}>
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: CHOCOLATE }}>Access Token</label>
          <input
            type="password"
            value={apiFields.token}
            onChange={e => setApiFields(p => ({ ...p, token: e.target.value }))}
            placeholder="Paste your permanent access token"
            className="w-full rounded-lg px-3 py-2.5 text-[14px] outline-none focus:ring-2"
            style={{ backgroundColor: IVORY, color: CHOCOLATE }}
          />
        </div>

        {/* Webhook URL */}
        <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: `1px solid ${CAPPUCCINO}25` }}>
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: CHOCOLATE }}>Webhook URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={apiFields.webhook}
              readOnly
              className="flex-1 rounded-lg px-3 py-2.5 text-[14px] outline-none"
              style={{ backgroundColor: `${CREAM}`, color: "#5A3E2B" }}
            />
            <button
              onClick={() => navigator.clipboard.writeText(apiFields.webhook)}
              className="shrink-0 rounded-lg px-3 py-2.5 text-[12px] font-semibold"
              style={{ backgroundColor: `${GOLD}20`, color: "#8B6914" }}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Test Connection */}
        <button
          onClick={() => setConnected(c => !c)}
          className="flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-opacity hover:opacity-90 mt-4"
          style={{ backgroundColor: CHOCOLATE, color: CREAM }}
        >
          <RefreshCw size={16} /> Test Connection
        </button>
      </div>

      <div className="mt-8 rounded-xl p-4" style={{ backgroundColor: `${GOLD}10`, border: `1px solid ${GOLD}30` }}>
        <p className="text-[13px]" style={{ color: "#5A3E2B" }}>
          <span className="font-semibold">Need help?</span> The HAMZURY team can configure the webhook and verify your connection.
          Contact your account manager or{" "}
          <a href="https://wa.me/2349122276633" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: GOLD }}>
            message HAMZURY on WhatsApp <ExternalLink size={12} className="inline" />
          </a>.
        </p>
      </div>
    </div>
  );

  const PANELS: Record<Section, React.ReactNode> = {
    setup: <SetupGuide />,
    templates: <Templates />,
    automation: <AutomationRules />,
    log: <MessageLog />,
    api: <ApiStatus />,
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: IVORY }}>
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(p => !p)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-10 h-10 rounded-xl shadow-lg"
        style={{ backgroundColor: CHOCOLATE, color: CREAM }}
      >
        <BarChart3 size={18} />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — always visible on desktop */}
      <div className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-screen px-6 py-10 md:py-12 md:px-12 max-w-4xl">
        {PANELS[section]}

        {/* Footer */}
        <div className="mt-16 pt-6" style={{ borderTop: `1px solid ${CAPPUCCINO}20` }}>
          <p className="text-[12px]" style={{ color: CAPPUCCINO }}>
            Tilz Spa WhatsApp Automation &middot; Powered by{" "}
            <Link href="/"><span className="underline cursor-pointer" style={{ color: GOLD }}>HAMZURY</span></Link>
          </p>
        </div>
      </main>
    </div>
  );
}
