import { useState } from "react";
import {
  LayoutDashboard, CheckSquare, CalendarPlus, UserPlus, Search,
  MessageSquare, LogOut, Clock, UserCheck, Users, Phone, Send,
  Menu, X, Scissors, ChevronRight,
} from "lucide-react";

// ─── Auth Gate ─────────────────────────────────────────────────────────────
const AUTH_KEY = "tilz-spa-auth";
const AUTH_EXPIRY_MS = 8 * 60 * 60 * 1000;
const VALID_CREDS = { email: "reception@tilzspa.com", password: "TilzSpa@2026", role: "receptionist" };

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
        <p style={{ fontSize: 14, color: "#B76E79", fontWeight: 600, marginBottom: 32 }}>Receptionist Dashboard</p>
        <div style={{ marginBottom: 16, textAlign: "left" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#3C2415", display: "block", marginBottom: 6 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="reception@tilzspa.com"
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

type Section = "today" | "checkin" | "booking" | "walkins" | "lookup" | "messages";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const TODAYS_APPOINTMENTS = [
  { id: 1, client: "Amina Bakare", phone: "0801-234-5678", service: "Full Body Massage", time: "9:00 AM", endTime: "10:00 AM", therapist: "Fatima", status: "checked-in" as const, category: "spa" },
  { id: 2, client: "Bola Adekunle", phone: "0802-345-6789", service: "Steam & Sauna", time: "10:00 AM", endTime: "10:45 AM", therapist: "Grace", status: "checked-in" as const, category: "sauna" },
  { id: 3, client: "Chidinma Obi", phone: "0803-456-7890", service: "Haircut & Beard", time: "10:30 AM", endTime: "11:00 AM", therapist: "Emeka", status: "waiting" as const, category: "barbing" },
  { id: 4, client: "Damilola Yusuf", phone: "0804-567-8901", service: "Facial Treatment", time: "11:00 AM", endTime: "11:45 AM", therapist: "Fatima", status: "waiting" as const, category: "spa" },
  { id: 5, client: "Ese Ighalo", phone: "0805-678-9012", service: "Hot Stone Massage", time: "12:00 PM", endTime: "1:15 PM", therapist: "Grace", status: "upcoming" as const, category: "spa" },
  { id: 6, client: "Funke Akindele", phone: "0806-789-0123", service: "Manicure & Pedicure", time: "1:00 PM", endTime: "2:00 PM", therapist: "Blessing", status: "upcoming" as const, category: "spa" },
  { id: 7, client: "Gbemisola Taiwo", phone: "0807-890-1234", service: "Sauna Session", time: "2:00 PM", endTime: "2:30 PM", therapist: "Grace", status: "upcoming" as const, category: "sauna" },
  { id: 8, client: "Halima Musa", phone: "0808-901-2345", service: "Hair Wash & Style", time: "3:00 PM", endTime: "3:45 PM", therapist: "Emeka", status: "upcoming" as const, category: "barbing" },
  { id: 9, client: "Ifeoma Nwankwo", phone: "0809-012-3456", service: "Full Body Massage", time: "4:00 PM", endTime: "5:00 PM", therapist: "Fatima", status: "upcoming" as const, category: "spa" },
  { id: 10, client: "Janet Okafor", phone: "0810-123-4567", service: "Steam & Sauna", time: "5:00 PM", endTime: "5:45 PM", therapist: "Grace", status: "upcoming" as const, category: "sauna" },
];

const CLIENT_DATABASE = [
  { id: 1, name: "Amina Bakare", phone: "0801-234-5678", visits: 12, lastVisit: "2026-04-07", preferences: "Prefers lavender oil, firm pressure", history: ["Full Body Massage", "Hot Stone Massage", "Facial Treatment"] },
  { id: 2, name: "Bola Adekunle", phone: "0802-345-6789", visits: 8, lastVisit: "2026-04-07", preferences: "Allergic to eucalyptus", history: ["Steam & Sauna", "Full Body Massage"] },
  { id: 3, name: "Chidinma Obi", phone: "0803-456-7890", visits: 3, lastVisit: "2026-04-07", preferences: "Likes short beard trim", history: ["Haircut & Beard"] },
  { id: 4, name: "Funke Akindele", phone: "0806-789-0123", visits: 15, lastVisit: "2026-04-06", preferences: "VIP client, prefers morning slots", history: ["Full Body Massage", "Manicure & Pedicure", "Facial Treatment", "Hot Stone Massage"] },
  { id: 5, name: "Halima Musa", phone: "0808-901-2345", visits: 5, lastVisit: "2026-04-06", preferences: "Prefers Emeka for barbing", history: ["Hair Wash & Style", "Haircut & Beard"] },
  { id: 6, name: "Khadijah Abubakar", phone: "0811-234-5678", visits: 4, lastVisit: "2026-03-30", preferences: "Likes cool sauna temperature", history: ["Sauna Session", "Steam & Sauna"] },
];

const WHATSAPP_MESSAGES = [
  { id: 1, from: "Khadijah Abubakar", phone: "0811-234-5678", message: "Hello, I want to book a sauna session for tomorrow", time: "9:20 AM", read: false },
  { id: 2, from: "Lola Ogundimu", phone: "0812-345-6789", message: "Is there availability for a massage today?", time: "9:05 AM", read: false },
  { id: 3, from: "Maryam Bello", phone: "0813-456-7890", message: "Can I come with my friend? We want couples massage", time: "8:45 AM", read: true },
  { id: 4, from: "Ngozi Eze", phone: "0814-567-8901", message: "I need to cancel my appointment for Thursday", time: "8:30 AM", read: true },
  { id: 5, from: "Amina Bakare", phone: "0801-234-5678", message: "On my way, will be there in 10 minutes", time: "8:15 AM", read: true },
];

const QUICK_REPLIES = [
  "Hello! Thank you for reaching out to Tilz Spa. How can we help you today?",
  "We have availability today. What service are you interested in?",
  "Your booking is confirmed. See you soon!",
  "We're sorry, that time slot is fully booked. Would another time work?",
  "Our opening hours are Mon-Fri 9AM-7PM, Sat 10AM-6PM.",
];

const SERVICES = [
  "Full Body Massage", "Hot Stone Massage", "Facial Treatment",
  "Manicure & Pedicure", "Steam & Sauna", "Sauna Session",
  "Haircut & Beard", "Hair Wash & Style",
];

const THERAPISTS = ["Fatima", "Grace", "Emeka", "Blessing"];

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM",
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  "checked-in": { label: "Checked In", bg: "#DCFCE7", text: "#166534" },
  "waiting":    { label: "Waiting", bg: "#FEF9C3", text: "#854D0E" },
  "upcoming":   { label: "Upcoming", bg: "#DBEAFE", text: "#1E40AF" },
};

const CATEGORY_COLORS: Record<string, string> = {
  spa: ROSE_GOLD,
  sauna: GOLD,
  barbing: CHOCOLATE,
};

// Timeline hours: 9 AM to 7 PM
const TIMELINE_HOURS = Array.from({ length: 11 }, (_, i) => {
  const h = 9 + i;
  return { hour: h, label: h <= 12 ? `${h}${h < 12 ? "AM" : "PM"}` : `${h - 12}PM` };
});

// ─── Main Component ─────────────────────────────────────────────────────────
export default function TilzSpaReceptionistDashboard() {
  const [authed, setAuthed] = useState(() => !!getAuth());
  const [activeSection, setActiveSection] = useState<Section>("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lookupSearch, setLookupSearch] = useState("");

  const handleLogout = () => { localStorage.removeItem(AUTH_KEY); setAuthed(false); };

  if (!authed) return <TilzSpaLoginGate onAuth={() => setAuthed(true)} />;
  const [checkedIn, setCheckedIn] = useState<number[]>(
    TODAYS_APPOINTMENTS.filter(a => a.status === "checked-in").map(a => a.id)
  );

  // Booking form
  const [bookingForm, setBookingForm] = useState({
    name: "", phone: "", service: "", date: "2026-04-08", time: "", therapist: "", notes: "",
  });

  // Walk-in form
  const [walkinForm, setWalkinForm] = useState({
    name: "", phone: "", service: "", therapist: "", notes: "",
  });

  const sidebarItems: { key: Section; icon: React.ElementType; label: string }[] = [
    { key: "today",    icon: LayoutDashboard, label: "Today" },
    { key: "checkin",  icon: CheckSquare,     label: "Check In" },
    { key: "booking",  icon: CalendarPlus,    label: "New Booking" },
    { key: "walkins",  icon: UserPlus,        label: "Walk-Ins" },
    { key: "lookup",   icon: Search,          label: "Client Lookup" },
    { key: "messages", icon: MessageSquare,   label: "Messages" },
  ];

  const checkedInCount = checkedIn.length;
  const totalToday = TODAYS_APPOINTMENTS.length;
  const remainingCount = totalToday - checkedInCount;

  const filteredClients = CLIENT_DATABASE.filter(c =>
    c.name.toLowerCase().includes(lookupSearch.toLowerCase()) ||
    c.phone.includes(lookupSearch)
  );

  function handleCheckIn(id: number) {
    if (!checkedIn.includes(id)) {
      setCheckedIn(prev => [...prev, id]);
    }
  }

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
        <div className="h-16 flex items-center justify-between px-5 border-b shrink-0" style={{ borderColor: `${ROSE_GOLD}20` }}>
          <div className="flex items-center gap-2">
            <Scissors size={18} style={{ color: ROSE_GOLD }} />
            <span className="md:hidden lg:block font-semibold text-sm" style={{ color: ROSE_GOLD }}>Tilz Reception</span>
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
              {key === "messages" && WHATSAPP_MESSAGES.filter(m => !m.read).length > 0 && (
                <span className="md:hidden lg:flex ml-auto w-5 h-5 rounded-full items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: ROSE_GOLD }}>
                  {WHATSAPP_MESSAGES.filter(m => !m.read).length}
                </span>
              )}
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
                Tilz Spa by Tilda <span className="text-xs font-normal opacity-50">/ Receptionist</span>
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

            {/* ── Today ── */}
            {activeSection === "today" && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border p-5" style={{ borderColor: `${CHOCOLATE}10` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${CHOCOLATE}10`, color: CHOCOLATE }}>
                      <Clock size={16} />
                    </div>
                    <p className="text-2xl font-semibold" style={{ color: CHOCOLATE }}>{totalToday}</p>
                    <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Appointments Today</p>
                  </div>
                  <div className="bg-white rounded-2xl border p-5" style={{ borderColor: `${CHOCOLATE}10` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${ROSE_GOLD}15`, color: ROSE_GOLD }}>
                      <UserCheck size={16} />
                    </div>
                    <p className="text-2xl font-semibold" style={{ color: CHOCOLATE }}>{checkedInCount}</p>
                    <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Checked In</p>
                  </div>
                  <div className="bg-white rounded-2xl border p-5" style={{ borderColor: `${CHOCOLATE}10` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${GOLD}15`, color: GOLD }}>
                      <Users size={16} />
                    </div>
                    <p className="text-2xl font-semibold" style={{ color: CHOCOLATE }}>{remainingCount}</p>
                    <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Remaining</p>
                  </div>
                  <div className="bg-white rounded-2xl border p-5" style={{ borderColor: `${CHOCOLATE}10` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `#22C55E15`, color: "#22C55E" }}>
                      <UserPlus size={16} />
                    </div>
                    <p className="text-2xl font-semibold" style={{ color: CHOCOLATE }}>2</p>
                    <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Walk-Ins</p>
                  </div>
                </div>

                {/* Visual Timeline */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Schedule Timeline</h2>
                  <div className="relative">
                    {/* Hour labels */}
                    <div className="flex border-b pb-2 mb-3" style={{ borderColor: `${CHOCOLATE}10` }}>
                      {TIMELINE_HOURS.map(h => (
                        <div key={h.hour} className="flex-1 text-center text-[10px] font-medium" style={{ color: `${CHOCOLATE}50` }}>
                          {h.label}
                        </div>
                      ))}
                    </div>

                    {/* Appointment blocks */}
                    <div className="space-y-2">
                      {TODAYS_APPOINTMENTS.map(a => {
                        // Parse start time to position
                        const timeParts = a.time.match(/(\d+):(\d+)\s*(AM|PM)/);
                        if (!timeParts) return null;
                        let startHour = parseInt(timeParts[1]);
                        const startMin = parseInt(timeParts[2]);
                        if (timeParts[3] === "PM" && startHour !== 12) startHour += 12;

                        const endParts = a.endTime.match(/(\d+):(\d+)\s*(AM|PM)/);
                        if (!endParts) return null;
                        let endHour = parseInt(endParts[1]);
                        const endMin = parseInt(endParts[2]);
                        if (endParts[3] === "PM" && endHour !== 12) endHour += 12;

                        const startOffset = ((startHour - 9) + startMin / 60) / 10 * 100;
                        const duration = ((endHour - startHour) + (endMin - startMin) / 60) / 10 * 100;
                        const isChecked = checkedIn.includes(a.id);

                        return (
                          <div key={a.id} className="relative h-8">
                            <div
                              className="absolute h-full rounded-md flex items-center px-2 text-[10px] font-medium text-white overflow-hidden whitespace-nowrap"
                              style={{
                                left: `${Math.max(0, startOffset)}%`,
                                width: `${Math.max(8, duration)}%`,
                                backgroundColor: CATEGORY_COLORS[a.category] || CAPPUCCINO,
                                opacity: isChecked ? 1 : 0.7,
                              }}
                            >
                              {a.client.split(" ")[0]} - {a.service}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 mt-4 pt-3 border-t" style={{ borderColor: `${CHOCOLATE}08` }}>
                      {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                        <div key={cat} className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                          <span className="text-[10px] font-medium capitalize" style={{ color: `${CHOCOLATE}60` }}>{cat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Appointment list */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>All Appointments</h2>
                  <div className="space-y-2">
                    {TODAYS_APPOINTMENTS.map(a => {
                      const isChecked = checkedIn.includes(a.id);
                      const statusInfo = isChecked
                        ? { label: "Checked In", bg: "#DCFCE7", text: "#166534" }
                        : STATUS_MAP[a.status];
                      return (
                        <div key={a.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ backgroundColor: CREAM }}>
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[a.category] }} />
                            <div>
                              <span className="text-sm font-medium" style={{ color: CHOCOLATE }}>{a.client}</span>
                              <p className="text-[10px]" style={{ color: `${CHOCOLATE}50` }}>{a.service} with {a.therapist}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono" style={{ color: `${CHOCOLATE}60` }}>{a.time}</span>
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}
                            >
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Check In ── */}
            {activeSection === "checkin" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Check In Clients</h2>
                  <div className="space-y-3">
                    {TODAYS_APPOINTMENTS.map(a => {
                      const isChecked = checkedIn.includes(a.id);
                      return (
                        <div
                          key={a.id}
                          className="flex items-center justify-between py-3 px-4 rounded-xl border"
                          style={{
                            borderColor: isChecked ? "#16653420" : `${CHOCOLATE}10`,
                            backgroundColor: isChecked ? "#DCFCE708" : "white",
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[a.category] }} />
                            <div>
                              <p className="text-sm font-medium" style={{ color: CHOCOLATE }}>{a.client}</p>
                              <p className="text-xs" style={{ color: `${CHOCOLATE}50` }}>{a.service}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs font-mono" style={{ color: `${CHOCOLATE}60` }}>{a.time}</p>
                              <p className="text-[10px]" style={{ color: `${CHOCOLATE}40` }}>{a.therapist}</p>
                            </div>
                            {isChecked ? (
                              <div
                                className="px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1"
                                style={{ backgroundColor: "#DCFCE7", color: "#166534" }}
                              >
                                <UserCheck size={14} /> Checked In
                              </div>
                            ) : (
                              <button
                                onClick={() => handleCheckIn(a.id)}
                                className="px-4 py-2 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90"
                                style={{ backgroundColor: ROSE_GOLD }}
                              >
                                Check In
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── New Booking ── */}
            {activeSection === "booking" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-6" style={{ color: CHOCOLATE }}>New Booking</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Client Name</label>
                      <input
                        type="text"
                        value={bookingForm.name}
                        onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                        placeholder="Full name"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Phone Number</label>
                      <input
                        type="tel"
                        value={bookingForm.phone}
                        onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        placeholder="0801-234-5678"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Service</label>
                      <select
                        value={bookingForm.service}
                        onChange={e => setBookingForm({ ...bookingForm, service: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE, backgroundColor: "white" }}
                      >
                        <option value="">Select service...</option>
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Date</label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Time</label>
                      <select
                        value={bookingForm.time}
                        onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE, backgroundColor: "white" }}
                      >
                        <option value="">Select time...</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Therapist</label>
                      <select
                        value={bookingForm.therapist}
                        onChange={e => setBookingForm({ ...bookingForm, therapist: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE, backgroundColor: "white" }}
                      >
                        <option value="">Select therapist...</option>
                        {THERAPISTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Notes</label>
                      <textarea
                        value={bookingForm.notes}
                        onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                        placeholder="Any special requests or notes..."
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: ROSE_GOLD }}
                    >
                      Book Appointment
                    </button>
                    <button
                      className="px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:opacity-90"
                      style={{ backgroundColor: `#25D36620`, color: "#25D366" }}
                    >
                      <Send size={14} /> Book via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Walk-Ins ── */}
            {activeSection === "walkins" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-2" style={{ color: CHOCOLATE }}>Quick Walk-In Booking</h2>
                  <p className="text-xs mb-6" style={{ color: `${CHOCOLATE}50` }}>Fast entry for clients who arrive without an appointment.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Client Name</label>
                      <input
                        type="text"
                        value={walkinForm.name}
                        onChange={e => setWalkinForm({ ...walkinForm, name: e.target.value })}
                        placeholder="Full name"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Phone Number</label>
                      <input
                        type="tel"
                        value={walkinForm.phone}
                        onChange={e => setWalkinForm({ ...walkinForm, phone: e.target.value })}
                        placeholder="0801-234-5678"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Service</label>
                      <select
                        value={walkinForm.service}
                        onChange={e => setWalkinForm({ ...walkinForm, service: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE, backgroundColor: "white" }}
                      >
                        <option value="">Select service...</option>
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Assign Therapist</label>
                      <select
                        value={walkinForm.therapist}
                        onChange={e => setWalkinForm({ ...walkinForm, therapist: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE, backgroundColor: "white" }}
                      >
                        <option value="">Next available</option>
                        {THERAPISTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: `${CHOCOLATE}70` }}>Notes</label>
                      <input
                        type="text"
                        value={walkinForm.notes}
                        onChange={e => setWalkinForm({ ...walkinForm, notes: e.target.value })}
                        placeholder="Quick notes..."
                        className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE }}
                      />
                    </div>
                  </div>
                  <button
                    className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: ROSE_GOLD }}
                  >
                    Add Walk-In
                  </button>
                </div>

                {/* Today's walk-ins */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Today's Walk-Ins</h2>
                  <div className="space-y-2">
                    {[
                      { name: "Nkechi Udom", service: "Sauna Session", time: "10:15 AM", therapist: "Grace" },
                      { name: "Rashida Lawal", service: "Haircut & Beard", time: "11:45 AM", therapist: "Emeka" },
                    ].map((w, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ backgroundColor: CREAM }}>
                        <div>
                          <span className="text-sm font-medium" style={{ color: CHOCOLATE }}>{w.name}</span>
                          <p className="text-[10px]" style={{ color: `${CHOCOLATE}50` }}>{w.service} with {w.therapist}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono" style={{ color: `${CHOCOLATE}60` }}>{w.time}</span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#DCFCE7", color: "#166534" }}>Walk-In</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Client Lookup ── */}
            {activeSection === "lookup" && (
              <div className="space-y-6">
                <div className="relative max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: `${CHOCOLATE}40` }} />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={lookupSearch}
                    onChange={e => setLookupSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: `${CHOCOLATE}15`, color: CHOCOLATE, backgroundColor: "white" }}
                  />
                </div>

                {filteredClients.length === 0 && lookupSearch && (
                  <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: `${CHOCOLATE}10` }}>
                    <p className="text-sm" style={{ color: `${CHOCOLATE}50` }}>No clients found matching "{lookupSearch}"</p>
                  </div>
                )}

                <div className="space-y-4">
                  {filteredClients.map(c => (
                    <div key={c.id} className="bg-white rounded-2xl border p-5" style={{ borderColor: `${CHOCOLATE}10` }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold" style={{ color: CHOCOLATE }}>{c.name}</h3>
                            {c.visits >= 5 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${GOLD}20`, color: GOLD }}>VIP</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone size={12} style={{ color: `${CHOCOLATE}40` }} />
                            <span className="text-xs font-mono" style={{ color: `${CHOCOLATE}60` }}>{c.phone}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold" style={{ color: CHOCOLATE }}>{c.visits}</p>
                          <p className="text-[10px]" style={{ color: `${CHOCOLATE}50` }}>visits</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-lg p-3" style={{ backgroundColor: CREAM }}>
                          <p className="text-[10px] font-medium mb-1" style={{ color: `${CHOCOLATE}50` }}>Last Visit</p>
                          <p className="text-xs" style={{ color: CHOCOLATE }}>{c.lastVisit}</p>
                        </div>
                        <div className="rounded-lg p-3" style={{ backgroundColor: CREAM }}>
                          <p className="text-[10px] font-medium mb-1" style={{ color: `${CHOCOLATE}50` }}>Preferences</p>
                          <p className="text-xs" style={{ color: CHOCOLATE }}>{c.preferences}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-[10px] font-medium mb-1.5" style={{ color: `${CHOCOLATE}50` }}>Service History</p>
                        <div className="flex flex-wrap gap-1.5">
                          {c.history.map((h, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ROSE_GOLD}15`, color: ROSE_GOLD }}>
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Messages ── */}
            {activeSection === "messages" && (
              <div className="space-y-6">
                {/* Incoming messages */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>
                    WhatsApp Messages
                    <span className="ml-2 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${ROSE_GOLD}15`, color: ROSE_GOLD }}>
                      {WHATSAPP_MESSAGES.filter(m => !m.read).length} unread
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {WHATSAPP_MESSAGES.map(m => (
                      <div
                        key={m.id}
                        className="flex items-start gap-3 py-3 px-4 rounded-xl border"
                        style={{
                          borderColor: m.read ? `${CHOCOLATE}08` : `${ROSE_GOLD}30`,
                          backgroundColor: m.read ? "white" : `${ROSE_GOLD}05`,
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                          style={{ backgroundColor: m.read ? CAPPUCCINO : ROSE_GOLD }}
                        >
                          {m.from.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium" style={{ color: CHOCOLATE }}>{m.from}</p>
                            <span className="text-[10px]" style={{ color: `${CHOCOLATE}40` }}>{m.time}</span>
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: `${CHOCOLATE}50` }}>{m.phone}</p>
                          <p className="text-sm mt-1" style={{ color: `${CHOCOLATE}80` }}>{m.message}</p>
                        </div>
                        {!m.read && (
                          <div className="w-2 h-2 rounded-full shrink-0 mt-2" style={{ backgroundColor: ROSE_GOLD }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Replies */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Quick Reply Templates</h2>
                  <div className="space-y-2">
                    {QUICK_REPLIES.map((r, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-lg" style={{ backgroundColor: CREAM }}>
                        <p className="text-sm flex-1 mr-3" style={{ color: CHOCOLATE }}>{r}</p>
                        <button
                          className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all hover:opacity-90"
                          style={{ backgroundColor: `#25D36615`, color: "#25D366" }}
                        >
                          <Send size={10} /> Send
                        </button>
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
