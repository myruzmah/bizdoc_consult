import { useState } from "react";
import {
  LayoutDashboard, CalendarDays, DollarSign, Users, UserCog,
  MessageSquare, Package, Settings, LogOut, Star, TrendingUp,
  CheckCircle2, Clock, XCircle, AlertTriangle, Search, ChevronLeft,
  ChevronRight, Scissors, Menu, X,
} from "lucide-react";

// ─── Auth Gate ─────────────────────────────────────────────────────────────
const AUTH_KEY = "tilz-spa-auth";
const AUTH_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours
const VALID_CREDS = { email: "founder@tilzspa.com", password: "TilzSpa@2026", role: "founder" };

function getAuth(): { role: string; email: string; loginTime: number } | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.loginTime > AUTH_EXPIRY_MS) { localStorage.removeItem(AUTH_KEY); return null; }
    return data;
  } catch { return null; }
}

function TilzSpaLoginGate({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === VALID_CREDS.email && password === VALID_CREDS.password) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ role: VALID_CREDS.role, email, loginTime: Date.now() }));
      onAuth();
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ backgroundColor: "#F5F0E8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: "#FFFFFF", borderRadius: 20, padding: "48px 36px", maxWidth: 400, width: "100%", boxShadow: "0 8px 32px rgba(60,36,21,0.10)", textAlign: "center" }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#3C2415", letterSpacing: 1 }}>Tilz Spa</span>
        </div>
        <p style={{ fontSize: 14, color: "#B76E79", fontWeight: 600, marginBottom: 32 }}>Founder Dashboard</p>
        <div style={{ marginBottom: 16, textAlign: "left" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#3C2415", display: "block", marginBottom: 6 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="founder@tilzspa.com"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #C4A88240", fontSize: 14, color: "#3C2415", backgroundColor: "#FAF7F2", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 24, textAlign: "left" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#3C2415", display: "block", marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter password"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #C4A88240", fontSize: 14, color: "#3C2415", backgroundColor: "#FAF7F2", outline: "none", boxSizing: "border-box" }} />
        </div>
        {error && <p style={{ color: "#DC2626", fontSize: 13, marginBottom: 16, fontWeight: 500 }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", backgroundColor: "#3C2415", color: "#F5F0E8", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 }}>Sign In</button>
        <p style={{ marginTop: 32, fontSize: 11, color: "#C4A88280" }}>Powered by <span style={{ color: "#D4AF6F", fontWeight: 600 }}>HAMZURY</span></p>
      </form>
    </div>
  );
}

// ─── Brand ──────────────────────────────────────────────────────────────────
const CHOCOLATE  = "#3C2415";
const CAPPUCCINO = "#C4A882";
const ROSE_GOLD  = "#B76E79";
const GOLD       = "#D4AF6F";
const CREAM      = "#F5F0E8";

type Section = "overview" | "appointments" | "revenue" | "clients" | "staff" | "whatsapp" | "inventory" | "settings";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const APPOINTMENTS = [
  { id: 1, client: "Amina Bakare", service: "Full Body Massage", time: "9:00 AM", status: "confirmed" as const, therapist: "Fatima" },
  { id: 2, client: "Bola Adekunle", service: "Steam & Sauna", time: "10:00 AM", status: "confirmed" as const, therapist: "Grace" },
  { id: 3, client: "Chidinma Obi", service: "Haircut & Beard", time: "10:30 AM", status: "pending" as const, therapist: "Emeka" },
  { id: 4, client: "Damilola Yusuf", service: "Facial Treatment", time: "11:00 AM", status: "completed" as const, therapist: "Fatima" },
  { id: 5, client: "Ese Ighalo", service: "Hot Stone Massage", time: "12:00 PM", status: "cancelled" as const, therapist: "Grace" },
  { id: 6, client: "Funke Akindele", service: "Manicure & Pedicure", time: "1:00 PM", status: "confirmed" as const, therapist: "Blessing" },
  { id: 7, client: "Gbemisola Taiwo", service: "Sauna Session", time: "2:00 PM", status: "pending" as const, therapist: "Grace" },
  { id: 8, client: "Halima Musa", service: "Hair Wash & Style", time: "3:00 PM", status: "confirmed" as const, therapist: "Emeka" },
];

const CLIENTS = [
  { id: 1, name: "Amina Bakare", phone: "0801-234-5678", visits: 12, spent: 185000, lastVisit: "2026-04-05", vip: true },
  { id: 2, name: "Bola Adekunle", phone: "0802-345-6789", visits: 8, spent: 120000, lastVisit: "2026-04-06", vip: true },
  { id: 3, name: "Chidinma Obi", phone: "0803-456-7890", visits: 3, spent: 45000, lastVisit: "2026-04-01", vip: false },
  { id: 4, name: "Damilola Yusuf", phone: "0804-567-8901", visits: 6, spent: 92000, lastVisit: "2026-04-04", vip: true },
  { id: 5, name: "Ese Ighalo", phone: "0805-678-9012", visits: 2, spent: 28000, lastVisit: "2026-03-28", vip: false },
  { id: 6, name: "Funke Akindele", phone: "0806-789-0123", visits: 15, spent: 230000, lastVisit: "2026-04-07", vip: true },
  { id: 7, name: "Gbemisola Taiwo", phone: "0807-890-1234", visits: 1, spent: 15000, lastVisit: "2026-04-03", vip: false },
  { id: 8, name: "Halima Musa", phone: "0808-901-2345", visits: 5, spent: 78000, lastVisit: "2026-04-06", vip: true },
];

const STAFF_LIST = [
  { id: 1, name: "Fatima Abdullahi", role: "Therapist", status: "active" as const, rating: 4.8, clientsServed: 48, revenue: 720000 },
  { id: 2, name: "Grace Okonkwo", role: "Therapist", status: "active" as const, rating: 4.6, clientsServed: 42, revenue: 630000 },
  { id: 3, name: "Emeka Nwosu", role: "Barber", status: "active" as const, rating: 4.9, clientsServed: 65, revenue: 520000 },
  { id: 4, name: "Blessing Eze", role: "Therapist", status: "active" as const, rating: 4.5, clientsServed: 36, revenue: 540000 },
  { id: 5, name: "Zainab Suleiman", role: "Receptionist", status: "active" as const, rating: 4.7, clientsServed: 0, revenue: 0 },
  { id: 6, name: "Ahmed Ibrahim", role: "Barber", status: "inactive" as const, rating: 4.3, clientsServed: 28, revenue: 224000 },
];

const WHATSAPP_MESSAGES = [
  { id: 1, from: "Amina Bakare", message: "Hi, I'd like to book a massage for Saturday", time: "9:15 AM", type: "incoming" as const },
  { id: 2, from: "System", message: "Booking confirmed for Bola Adekunle - Steam & Sauna at 10:00 AM", time: "8:45 AM", type: "outgoing" as const },
  { id: 3, from: "Chidinma Obi", message: "Can I reschedule my appointment to 2pm?", time: "8:30 AM", type: "incoming" as const },
  { id: 4, from: "System", message: "Reminder: Your appointment is tomorrow at 1:00 PM - Tilz Spa", time: "7:00 AM", type: "outgoing" as const },
  { id: 5, from: "Funke Akindele", message: "Do you have availability for next Tuesday?", time: "Yesterday", type: "incoming" as const },
];

const WHATSAPP_TEMPLATES = [
  { id: 1, name: "Booking Confirmation", message: "Hi {name}, your appointment for {service} on {date} at {time} is confirmed. See you at Tilz Spa!" },
  { id: 2, name: "Appointment Reminder", message: "Hi {name}, this is a friendly reminder about your appointment tomorrow at {time}. Reply YES to confirm." },
  { id: 3, name: "Thank You", message: "Thank you for visiting Tilz Spa, {name}! We hope you enjoyed your {service}. Book again soon!" },
  { id: 4, name: "Promo Message", message: "Hi {name}! This week at Tilz Spa: 20% off all massage treatments. Book now!" },
];

const INVENTORY = [
  { id: 1, name: "Massage Oil (Lavender)", category: "Spa", stock: 12, threshold: 5, unit: "bottles", lastRestocked: "2026-03-25" },
  { id: 2, name: "Massage Oil (Coconut)", category: "Spa", stock: 3, threshold: 5, unit: "bottles", lastRestocked: "2026-03-10" },
  { id: 3, name: "Facial Cream", category: "Spa", stock: 8, threshold: 4, unit: "jars", lastRestocked: "2026-04-01" },
  { id: 4, name: "Shaving Cream", category: "Barbing", stock: 15, threshold: 5, unit: "cans", lastRestocked: "2026-03-28" },
  { id: 5, name: "Hair Clippers Blades", category: "Barbing", stock: 2, threshold: 3, unit: "sets", lastRestocked: "2026-02-15" },
  { id: 6, name: "Steam Aromatherapy Oils", category: "Sauna", stock: 6, threshold: 3, unit: "bottles", lastRestocked: "2026-03-20" },
  { id: 7, name: "Disposable Towels", category: "General", stock: 45, threshold: 20, unit: "packs", lastRestocked: "2026-04-02" },
  { id: 8, name: "Nail Polish Set", category: "Spa", stock: 1, threshold: 3, unit: "sets", lastRestocked: "2026-01-15" },
];

const REVENUE_BY_SERVICE = [
  { category: "Spa", revenue: 1850000, percentage: 52 },
  { category: "Sauna", revenue: 920000, percentage: 26 },
  { category: "Barbing", revenue: 780000, percentage: 22 },
];

const RECENT_TRANSACTIONS = [
  { id: 1, date: "2026-04-07", client: "Funke Akindele", service: "Full Body Massage", amount: 25000, method: "Transfer" },
  { id: 2, date: "2026-04-07", client: "Halima Musa", service: "Hair Wash & Style", amount: 8000, method: "Cash" },
  { id: 3, date: "2026-04-06", client: "Bola Adekunle", service: "Steam & Sauna", amount: 15000, method: "Transfer" },
  { id: 4, date: "2026-04-06", client: "Damilola Yusuf", service: "Facial Treatment", amount: 18000, method: "POS" },
  { id: 5, date: "2026-04-05", client: "Amina Bakare", service: "Hot Stone Massage", amount: 30000, method: "Transfer" },
];

const BUSINESS_HOURS = [
  { day: "Monday", open: "9:00 AM", close: "7:00 PM", active: true },
  { day: "Tuesday", open: "9:00 AM", close: "7:00 PM", active: true },
  { day: "Wednesday", open: "9:00 AM", close: "7:00 PM", active: true },
  { day: "Thursday", open: "9:00 AM", close: "7:00 PM", active: true },
  { day: "Friday", open: "9:00 AM", close: "7:00 PM", active: true },
  { day: "Saturday", open: "10:00 AM", close: "6:00 PM", active: true },
  { day: "Sunday", open: "Closed", close: "Closed", active: false },
];

const SERVICE_PRICING = [
  { id: 1, name: "Full Body Massage", category: "Spa", price: 25000, duration: "60 min" },
  { id: 2, name: "Hot Stone Massage", category: "Spa", price: 30000, duration: "75 min" },
  { id: 3, name: "Facial Treatment", category: "Spa", price: 18000, duration: "45 min" },
  { id: 4, name: "Manicure & Pedicure", category: "Spa", price: 12000, duration: "60 min" },
  { id: 5, name: "Steam & Sauna", category: "Sauna", price: 15000, duration: "45 min" },
  { id: 6, name: "Sauna Session", category: "Sauna", price: 10000, duration: "30 min" },
  { id: 7, name: "Haircut & Beard", category: "Barbing", price: 5000, duration: "30 min" },
  { id: 8, name: "Hair Wash & Style", category: "Barbing", price: 8000, duration: "45 min" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatNaira(n: number) {
  return "₦" + n.toLocaleString();
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "#DCFCE7", text: "#166534" },
  pending:   { bg: "#FEF9C3", text: "#854D0E" },
  completed: { bg: "#DBEAFE", text: "#1E40AF" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B" },
};

// ─── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-2xl border p-5" style={{ borderColor: `${CHOCOLATE}10` }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>{icon}</div>
      </div>
      <p className="text-2xl font-semibold" style={{ color: CHOCOLATE }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: `${CHOCOLATE}70` }}>{label}</p>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function TilzSpaFounderDashboard() {
  const [authed, setAuthed] = useState(() => !!getAuth());
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  const handleLogout = () => { localStorage.removeItem(AUTH_KEY); setAuthed(false); };

  if (!authed) return <TilzSpaLoginGate onAuth={() => setAuthed(true)} />;

  const sidebarItems: { key: Section; icon: React.ElementType; label: string }[] = [
    { key: "overview",     icon: LayoutDashboard, label: "Overview" },
    { key: "appointments", icon: CalendarDays,    label: "Appointments" },
    { key: "revenue",      icon: DollarSign,      label: "Revenue" },
    { key: "clients",      icon: Users,           label: "Clients" },
    { key: "staff",        icon: UserCog,         label: "Staff" },
    { key: "whatsapp",     icon: MessageSquare,   label: "WhatsApp" },
    { key: "inventory",    icon: Package,         label: "Inventory" },
    { key: "settings",     icon: Settings,        label: "Settings" },
  ];

  const filteredClients = CLIENTS.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.phone.includes(clientSearch)
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: CREAM }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <div
        className={`fixed md:relative z-50 md:z-auto h-full flex flex-col shrink-0 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } w-64 md:w-16 lg:w-60`}
        style={{ backgroundColor: CHOCOLATE }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b shrink-0" style={{ borderColor: `${CAPPUCCINO}20` }}>
          <div className="flex items-center gap-2">
            <Scissors size={18} style={{ color: ROSE_GOLD }} />
            <span className="md:hidden lg:block font-semibold text-sm" style={{ color: CAPPUCCINO }}>Tilz Spa</span>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={18} style={{ color: CAPPUCCINO }} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {sidebarItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => { setActiveSection(key); setSidebarOpen(false); }}
              className="w-full flex items-center md:justify-center lg:justify-start px-3 lg:px-3 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: activeSection === key ? `${ROSE_GOLD}25` : "transparent",
                color: activeSection === key ? ROSE_GOLD : `${CAPPUCCINO}70`,
              }}
            >
              <Icon size={18} className="shrink-0" />
              <span className="md:hidden lg:block ml-3 text-sm font-normal">{label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t shrink-0" style={{ borderColor: `${CAPPUCCINO}15` }}>
          <button onClick={handleLogout} className="w-full flex items-center md:justify-center lg:justify-start px-3 py-2.5 rounded-xl transition-all text-sm" style={{ color: `${CAPPUCCINO}50` }}>
            <LogOut size={16} className="shrink-0" />
            <span className="md:hidden lg:block ml-3 font-normal">Sign Out</span>
          </button>
          <p className="text-center mt-2 text-[10px] md:hidden lg:block" style={{ color: `${CAPPUCCINO}30` }}>Powered by HAMZURY</p>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b shrink-0 bg-white" style={{ borderColor: `${CHOCOLATE}10` }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} style={{ color: CHOCOLATE }} />
            </button>
            <div>
              <h1 className="text-base font-medium" style={{ color: CHOCOLATE }}>
                Tilz Spa by Tilda <span className="text-xs font-normal opacity-50">/ Founder Dashboard</span>
              </h1>
              <p className="text-xs" style={{ color: `${CHOCOLATE}50` }}>
                {sidebarItems.find(s => s.key === activeSection)?.label}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: `${CHOCOLATE}08`, color: CHOCOLATE }}>
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl">

            {/* ── Overview ── */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <StatCard label="Today's Revenue" value={formatNaira(96000)} icon={<DollarSign size={16} />} color={GOLD} />
                  <StatCard label="Total Clients" value="127" icon={<Users size={16} />} color={ROSE_GOLD} />
                  <StatCard label="Appointments Today" value="8" icon={<CalendarDays size={16} />} color={CHOCOLATE} />
                  <StatCard label="Monthly Revenue" value={formatNaira(3550000)} icon={<TrendingUp size={16} />} color="#22C55E" />
                  <StatCard label="Avg Rating" value="4.7" icon={<Star size={16} />} color={GOLD} />
                  <StatCard label="Rebooking Rate" value="68%" icon={<CheckCircle2 size={16} />} color={ROSE_GOLD} />
                </div>

                {/* Quick appointments */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Today's Appointments</h2>
                  <div className="space-y-2">
                    {APPOINTMENTS.slice(0, 5).map(a => (
                      <div key={a.id} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: CREAM }}>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono w-16" style={{ color: `${CHOCOLATE}60` }}>{a.time}</span>
                          <span className="text-sm font-medium" style={{ color: CHOCOLATE }}>{a.client}</span>
                          <span className="text-xs" style={{ color: `${CHOCOLATE}50` }}>{a.service}</span>
                        </div>
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: STATUS_STYLES[a.status].bg, color: STATUS_STYLES[a.status].text }}
                        >
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue by service */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Revenue by Category</h2>
                  <div className="space-y-3">
                    {REVENUE_BY_SERVICE.map(r => (
                      <div key={r.category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: CHOCOLATE }}>{r.category}</span>
                          <span className="font-medium" style={{ color: CHOCOLATE }}>{formatNaira(r.revenue)} ({r.percentage}%)</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ backgroundColor: `${CHOCOLATE}10` }}>
                          <div className="h-full rounded-full" style={{ width: `${r.percentage}%`, backgroundColor: ROSE_GOLD }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Appointments ── */}
            {activeSection === "appointments" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="p-6 border-b" style={{ borderColor: `${CHOCOLATE}08` }}>
                    <h2 className="text-sm font-semibold" style={{ color: CHOCOLATE }}>All Appointments</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: CREAM }}>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Client</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Service</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Time</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Therapist</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {APPOINTMENTS.map(a => (
                          <tr key={a.id} className="border-t" style={{ borderColor: `${CHOCOLATE}06` }}>
                            <td className="px-6 py-3 font-medium" style={{ color: CHOCOLATE }}>{a.client}</td>
                            <td className="px-6 py-3" style={{ color: `${CHOCOLATE}70` }}>{a.service}</td>
                            <td className="px-6 py-3 font-mono text-xs" style={{ color: `${CHOCOLATE}60` }}>{a.time}</td>
                            <td className="px-6 py-3" style={{ color: `${CHOCOLATE}70` }}>{a.therapist}</td>
                            <td className="px-6 py-3">
                              <span
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: STATUS_STYLES[a.status].bg, color: STATUS_STYLES[a.status].text }}
                              >
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Revenue ── */}
            {activeSection === "revenue" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard label="This Month" value={formatNaira(3550000)} icon={<TrendingUp size={16} />} color={GOLD} />
                  <StatCard label="Last Month" value={formatNaira(3120000)} icon={<DollarSign size={16} />} color={CHOCOLATE} />
                  <StatCard label="Growth" value="+13.8%" icon={<TrendingUp size={16} />} color="#22C55E" />
                </div>

                {/* Revenue by Service */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Revenue by Category</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {REVENUE_BY_SERVICE.map(r => (
                      <div key={r.category} className="rounded-xl p-4" style={{ backgroundColor: CREAM }}>
                        <p className="text-xs font-medium" style={{ color: `${CHOCOLATE}60` }}>{r.category}</p>
                        <p className="text-xl font-semibold mt-1" style={{ color: CHOCOLATE }}>{formatNaira(r.revenue)}</p>
                        <p className="text-xs mt-1" style={{ color: ROSE_GOLD }}>{r.percentage}% of total</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="p-6 border-b" style={{ borderColor: `${CHOCOLATE}08` }}>
                    <h2 className="text-sm font-semibold" style={{ color: CHOCOLATE }}>Recent Transactions</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: CREAM }}>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Date</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Client</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Service</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Amount</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_TRANSACTIONS.map(t => (
                          <tr key={t.id} className="border-t" style={{ borderColor: `${CHOCOLATE}06` }}>
                            <td className="px-6 py-3 text-xs font-mono" style={{ color: `${CHOCOLATE}60` }}>{t.date}</td>
                            <td className="px-6 py-3 font-medium" style={{ color: CHOCOLATE }}>{t.client}</td>
                            <td className="px-6 py-3" style={{ color: `${CHOCOLATE}70` }}>{t.service}</td>
                            <td className="px-6 py-3 font-medium" style={{ color: CHOCOLATE }}>{formatNaira(t.amount)}</td>
                            <td className="px-6 py-3">
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${GOLD}20`, color: CHOCOLATE }}>
                                {t.method}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Clients ── */}
            {activeSection === "clients" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: `${CHOCOLATE}40` }} />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={clientSearch}
                      onChange={e => setClientSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE, backgroundColor: "white" }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: `${CHOCOLATE}50` }}>{filteredClients.length} clients</span>
                </div>

                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: CREAM }}>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Client</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Phone</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Visits</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Total Spent</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Last Visit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClients.map(c => (
                          <tr key={c.id} className="border-t" style={{ borderColor: `${CHOCOLATE}06` }}>
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium" style={{ color: CHOCOLATE }}>{c.name}</span>
                                {c.vip && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${GOLD}20`, color: GOLD }}>VIP</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-3 font-mono text-xs" style={{ color: `${CHOCOLATE}60` }}>{c.phone}</td>
                            <td className="px-6 py-3" style={{ color: `${CHOCOLATE}70` }}>{c.visits}</td>
                            <td className="px-6 py-3 font-medium" style={{ color: CHOCOLATE }}>{formatNaira(c.spent)}</td>
                            <td className="px-6 py-3 text-xs" style={{ color: `${CHOCOLATE}60` }}>{c.lastVisit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Staff ── */}
            {activeSection === "staff" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {STAFF_LIST.map(s => (
                    <div key={s.id} className="bg-white rounded-2xl border p-5" style={{ borderColor: `${CHOCOLATE}10` }}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-semibold" style={{ color: CHOCOLATE }}>{s.name}</h3>
                          <p className="text-xs" style={{ color: `${CHOCOLATE}50` }}>{s.role}</p>
                        </div>
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: s.status === "active" ? "#DCFCE7" : "#FEE2E2",
                            color: s.status === "active" ? "#166534" : "#991B1B",
                          }}
                        >
                          {s.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-lg p-2 text-center" style={{ backgroundColor: CREAM }}>
                          <p className="text-xs font-semibold" style={{ color: CHOCOLATE }}>{s.rating}</p>
                          <p className="text-[10px]" style={{ color: `${CHOCOLATE}50` }}>Rating</p>
                        </div>
                        <div className="rounded-lg p-2 text-center" style={{ backgroundColor: CREAM }}>
                          <p className="text-xs font-semibold" style={{ color: CHOCOLATE }}>{s.clientsServed}</p>
                          <p className="text-[10px]" style={{ color: `${CHOCOLATE}50` }}>Clients</p>
                        </div>
                        <div className="rounded-lg p-2 text-center" style={{ backgroundColor: CREAM }}>
                          <p className="text-xs font-semibold" style={{ color: CHOCOLATE }}>{formatNaira(s.revenue)}</p>
                          <p className="text-[10px]" style={{ color: `${CHOCOLATE}50` }}>Revenue</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── WhatsApp ── */}
            {activeSection === "whatsapp" && (
              <div className="space-y-6">
                {/* Messages */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Recent Messages</h2>
                  <div className="space-y-3">
                    {WHATSAPP_MESSAGES.map(m => (
                      <div
                        key={m.id}
                        className={`flex ${m.type === "outgoing" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="max-w-md rounded-xl px-4 py-3"
                          style={{
                            backgroundColor: m.type === "outgoing" ? `${CHOCOLATE}08` : "white",
                            border: m.type === "incoming" ? `1px solid ${CHOCOLATE}15` : "none",
                          }}
                        >
                          <p className="text-[10px] font-medium mb-1" style={{ color: m.type === "outgoing" ? ROSE_GOLD : CHOCOLATE }}>
                            {m.from}
                          </p>
                          <p className="text-sm" style={{ color: CHOCOLATE }}>{m.message}</p>
                          <p className="text-[10px] mt-1" style={{ color: `${CHOCOLATE}40` }}>{m.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Templates */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Message Templates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {WHATSAPP_TEMPLATES.map(t => (
                      <div key={t.id} className="rounded-xl p-4" style={{ backgroundColor: CREAM }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: CHOCOLATE }}>{t.name}</p>
                        <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>{t.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auto-reply */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-3" style={{ color: CHOCOLATE }}>Auto-Reply Settings</h2>
                  <div className="space-y-3">
                    {[
                      { label: "After-hours reply", enabled: true },
                      { label: "Booking confirmation", enabled: true },
                      { label: "Appointment reminder (24h before)", enabled: true },
                      { label: "Thank you after visit", enabled: false },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: CREAM }}>
                        <span className="text-sm" style={{ color: CHOCOLATE }}>{s.label}</span>
                        <div
                          className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
                          style={{ backgroundColor: s.enabled ? ROSE_GOLD : `${CHOCOLATE}20` }}
                        >
                          <div
                            className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all"
                            style={{ left: s.enabled ? "22px" : "2px" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Inventory ── */}
            {activeSection === "inventory" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Total Products" value={String(INVENTORY.length)} icon={<Package size={16} />} color={CHOCOLATE} />
                  <StatCard label="Low Stock" value={String(INVENTORY.filter(i => i.stock <= i.threshold).length)} icon={<AlertTriangle size={16} />} color="#EF4444" />
                  <StatCard label="Categories" value="4" icon={<Package size={16} />} color={GOLD} />
                  <StatCard label="Last Restock" value="Apr 2" icon={<Clock size={16} />} color={ROSE_GOLD} />
                </div>

                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: CREAM }}>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Product</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Category</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Stock</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Status</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Last Restocked</th>
                        </tr>
                      </thead>
                      <tbody>
                        {INVENTORY.map(item => {
                          const lowStock = item.stock <= item.threshold;
                          return (
                            <tr key={item.id} className="border-t" style={{ borderColor: `${CHOCOLATE}06` }}>
                              <td className="px-6 py-3 font-medium" style={{ color: CHOCOLATE }}>{item.name}</td>
                              <td className="px-6 py-3" style={{ color: `${CHOCOLATE}70` }}>{item.category}</td>
                              <td className="px-6 py-3" style={{ color: lowStock ? "#EF4444" : CHOCOLATE }}>
                                <span className="font-semibold">{item.stock}</span> <span className="text-xs opacity-50">{item.unit}</span>
                              </td>
                              <td className="px-6 py-3">
                                {lowStock ? (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                                    Reorder
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>
                                    In Stock
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-3 text-xs font-mono" style={{ color: `${CHOCOLATE}60` }}>{item.lastRestocked}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Settings ── */}
            {activeSection === "settings" && (
              <div className="space-y-6">
                {/* Business Hours */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Business Hours</h2>
                  <div className="space-y-2">
                    {BUSINESS_HOURS.map(h => (
                      <div key={h.day} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: h.active ? CREAM : `${CHOCOLATE}05` }}>
                        <span className="text-sm font-medium w-24" style={{ color: CHOCOLATE }}>{h.day}</span>
                        {h.active ? (
                          <span className="text-sm" style={{ color: `${CHOCOLATE}70` }}>{h.open} - {h.close}</span>
                        ) : (
                          <span className="text-sm" style={{ color: `${CHOCOLATE}40` }}>Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Pricing */}
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="p-6 border-b" style={{ borderColor: `${CHOCOLATE}08` }}>
                    <h2 className="text-sm font-semibold" style={{ color: CHOCOLATE }}>Service Pricing</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: CREAM }}>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Service</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Category</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Price</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SERVICE_PRICING.map(s => (
                          <tr key={s.id} className="border-t" style={{ borderColor: `${CHOCOLATE}06` }}>
                            <td className="px-6 py-3 font-medium" style={{ color: CHOCOLATE }}>{s.name}</td>
                            <td className="px-6 py-3" style={{ color: `${CHOCOLATE}70` }}>{s.category}</td>
                            <td className="px-6 py-3 font-medium" style={{ color: CHOCOLATE }}>{formatNaira(s.price)}</td>
                            <td className="px-6 py-3 text-xs" style={{ color: `${CHOCOLATE}60` }}>{s.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-3" style={{ color: CHOCOLATE }}>Notification Preferences</h2>
                  <div className="space-y-3">
                    {[
                      { label: "New booking alert", enabled: true },
                      { label: "Cancellation alert", enabled: true },
                      { label: "Daily revenue summary", enabled: true },
                      { label: "Low stock alert", enabled: true },
                      { label: "Staff absence notification", enabled: false },
                      { label: "Weekly performance report", enabled: true },
                    ].map((n, i) => (
                      <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: CREAM }}>
                        <span className="text-sm" style={{ color: CHOCOLATE }}>{n.label}</span>
                        <div
                          className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
                          style={{ backgroundColor: n.enabled ? ROSE_GOLD : `${CHOCOLATE}20` }}
                        >
                          <div
                            className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all"
                            style={{ left: n.enabled ? "22px" : "2px" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
