import { useState } from "react";
import {
  LayoutDashboard, DollarSign, TrendingUp, Receipt, FileText,
  LogOut, Wallet, CreditCard, ArrowUpRight, ArrowDownRight,
  Calendar, Filter, Download, PieChart, BarChart3, Menu, X, Scissors,
} from "lucide-react";

// ─── Brand ──────────────────────────────────────────────────────────────────
const CHOCOLATE  = "#3C2415";
const CAPPUCCINO = "#C4A882";
const ROSE_GOLD  = "#B76E79";
const GOLD       = "#D4AF6F";
const CREAM      = "#F5F0E8";

type Section = "overview" | "transactions" | "analytics" | "expenses" | "reports";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { id: 1, date: "2026-04-07", client: "Funke Akindele", service: "Full Body Massage", amount: 25000, method: "Transfer", status: "completed" as const },
  { id: 2, date: "2026-04-07", client: "Halima Musa", service: "Hair Wash & Style", amount: 8000, method: "Cash", status: "completed" as const },
  { id: 3, date: "2026-04-07", client: "Amina Bakare", service: "Steam & Sauna", amount: 15000, method: "Transfer", status: "completed" as const },
  { id: 4, date: "2026-04-07", client: "Chidinma Obi", service: "Haircut & Beard", amount: 5000, method: "POS", status: "pending" as const },
  { id: 5, date: "2026-04-06", client: "Bola Adekunle", service: "Hot Stone Massage", amount: 30000, method: "Transfer", status: "completed" as const },
  { id: 6, date: "2026-04-06", client: "Damilola Yusuf", service: "Facial Treatment", amount: 18000, method: "POS", status: "completed" as const },
  { id: 7, date: "2026-04-06", client: "Ese Ighalo", service: "Manicure & Pedicure", amount: 12000, method: "Cash", status: "refunded" as const },
  { id: 8, date: "2026-04-05", client: "Gbemisola Taiwo", service: "Sauna Session", amount: 10000, method: "Transfer", status: "completed" as const },
  { id: 9, date: "2026-04-05", client: "Funke Akindele", service: "Facial Treatment", amount: 18000, method: "Transfer", status: "completed" as const },
  { id: 10, date: "2026-04-04", client: "Amina Bakare", service: "Full Body Massage", amount: 25000, method: "Transfer", status: "completed" as const },
  { id: 11, date: "2026-04-04", client: "Halima Musa", service: "Haircut & Beard", amount: 5000, method: "Cash", status: "completed" as const },
  { id: 12, date: "2026-04-03", client: "Bola Adekunle", service: "Steam & Sauna", amount: 15000, method: "POS", status: "completed" as const },
];

const EXPENSES = [
  { id: 1, date: "2026-04-01", category: "Rent", description: "Monthly rent - April", amount: 350000 },
  { id: 2, date: "2026-04-01", category: "Salaries", description: "Staff salaries - April", amount: 480000 },
  { id: 3, date: "2026-04-02", category: "Utilities", description: "Electricity bill", amount: 45000 },
  { id: 4, date: "2026-04-02", category: "Utilities", description: "Water bill", amount: 12000 },
  { id: 5, date: "2026-04-03", category: "Products", description: "Massage oils restocking", amount: 85000 },
  { id: 6, date: "2026-04-03", category: "Products", description: "Facial creams and scrubs", amount: 62000 },
  { id: 7, date: "2026-04-04", category: "Marketing", description: "Instagram ad campaign", amount: 30000 },
  { id: 8, date: "2026-04-05", category: "Equipment", description: "Steam room maintenance", amount: 75000 },
  { id: 9, date: "2026-04-06", category: "Utilities", description: "Internet subscription", amount: 18000 },
  { id: 10, date: "2026-04-06", category: "Marketing", description: "Flyer printing", amount: 15000 },
];

const REVENUE_BY_DAY = [
  { day: "Mon", revenue: 142000 },
  { day: "Tue", revenue: 118000 },
  { day: "Wed", revenue: 135000 },
  { day: "Thu", revenue: 98000 },
  { day: "Fri", revenue: 185000 },
  { day: "Sat", revenue: 210000 },
  { day: "Sun", revenue: 0 },
];

const REVENUE_BY_SERVICE = [
  { category: "Spa Treatments", revenue: 1850000, color: ROSE_GOLD },
  { category: "Sauna & Steam", revenue: 920000, color: GOLD },
  { category: "Barbing Salon", revenue: 780000, color: CHOCOLATE },
];

const TOP_CLIENTS = [
  { name: "Funke Akindele", visits: 15, spent: 375000 },
  { name: "Amina Bakare", visits: 12, spent: 300000 },
  { name: "Bola Adekunle", visits: 8, spent: 240000 },
  { name: "Damilola Yusuf", visits: 6, spent: 168000 },
  { name: "Halima Musa", visits: 5, spent: 130000 },
  { name: "Chidinma Obi", visits: 3, spent: 75000 },
  { name: "Gbemisola Taiwo", visits: 2, spent: 45000 },
  { name: "Ese Ighalo", visits: 2, spent: 42000 },
  { name: "Khadijah Abubakar", visits: 4, spent: 112000 },
  { name: "Lola Ogundimu", visits: 3, spent: 90000 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatNaira(n: number) {
  return "₦" + n.toLocaleString();
}

const TX_STATUS: Record<string, { bg: string; text: string }> = {
  completed: { bg: "#DCFCE7", text: "#166534" },
  pending:   { bg: "#FEF9C3", text: "#854D0E" },
  refunded:  { bg: "#FEE2E2", text: "#991B1B" },
};

const EXPENSE_COLORS: Record<string, string> = {
  Rent: "#3C2415",
  Salaries: "#B76E79",
  Utilities: "#D4AF6F",
  Products: "#C4A882",
  Marketing: "#22C55E",
  Equipment: "#3B82F6",
};

// ─── Stat Card ──────────────────────────────────────────────────────────────
function FinCard({ label, value, icon, color, sub }: { label: string; value: string; icon: React.ReactNode; color: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border p-5" style={{ borderColor: `${CHOCOLATE}10` }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>{icon}</div>
      </div>
      <p className="text-2xl font-semibold" style={{ color: CHOCOLATE }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: `${CHOCOLATE}70` }}>{label}</p>
      {sub && <p className="text-[10px] mt-0.5" style={{ color }}>{sub}</p>}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function TilzSpaFinanceDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [txFilter, setTxFilter] = useState<"all" | "Transfer" | "Cash" | "POS">("all");

  const totalRevenue = TRANSACTIONS.filter(t => t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0);

  const sidebarItems: { key: Section; icon: React.ElementType; label: string }[] = [
    { key: "overview",     icon: LayoutDashboard, label: "Overview" },
    { key: "transactions", icon: Receipt,         label: "Transactions" },
    { key: "analytics",    icon: BarChart3,        label: "Revenue Analytics" },
    { key: "expenses",     icon: Wallet,           label: "Expenses" },
    { key: "reports",      icon: FileText,         label: "Reports" },
  ];

  const filteredTransactions = txFilter === "all"
    ? TRANSACTIONS
    : TRANSACTIONS.filter(t => t.method === txFilter);

  // Expense totals by category
  const expenseByCategory = EXPENSES.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

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
        <div className="h-16 flex items-center justify-between px-5 border-b shrink-0" style={{ borderColor: `${GOLD}20` }}>
          <div className="flex items-center gap-2">
            <DollarSign size={18} style={{ color: GOLD }} />
            <span className="md:hidden lg:block font-semibold text-sm" style={{ color: GOLD }}>Tilz Finance</span>
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
                backgroundColor: activeSection === key ? `${GOLD}25` : "transparent",
                color: activeSection === key ? GOLD : `${CAPPUCCINO}70`,
              }}
            >
              <Icon size={18} className="shrink-0" />
              <span className="md:hidden lg:block ml-3 text-sm font-normal">{label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t shrink-0" style={{ borderColor: `${CAPPUCCINO}15` }}>
          <button className="w-full flex items-center md:justify-center lg:justify-start px-3 py-2.5 rounded-xl transition-all text-sm" style={{ color: `${CAPPUCCINO}50` }}>
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
                Tilz Spa by Tilda <span className="text-xs font-normal opacity-50">/ Finance Dashboard</span>
              </h1>
              <p className="text-xs" style={{ color: `${CHOCOLATE}50` }}>
                {sidebarItems.find(s => s.key === activeSection)?.label}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: `${CHOCOLATE}08`, color: CHOCOLATE }}>
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
                  <FinCard label="Today's Revenue" value={formatNaira(53000)} icon={<DollarSign size={16} />} color={GOLD} sub="+12% vs yesterday" />
                  <FinCard label="This Week" value={formatNaira(386000)} icon={<TrendingUp size={16} />} color="#22C55E" />
                  <FinCard label="This Month" value={formatNaira(3550000)} icon={<BarChart3 size={16} />} color={CHOCOLATE} />
                  <FinCard label="Outstanding" value={formatNaira(45000)} icon={<CreditCard size={16} />} color="#EAB308" sub="3 pending" />
                  <FinCard label="Expenses (Month)" value={formatNaira(totalExpenses)} icon={<Wallet size={16} />} color="#EF4444" />
                  <FinCard label="Net Profit" value={formatNaira(3550000 - totalExpenses)} icon={<PieChart size={16} />} color="#22C55E" sub="Margin: 67%" />
                </div>

                {/* Quick summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                    <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Revenue by Service</h2>
                    <div className="space-y-3">
                      {REVENUE_BY_SERVICE.map(r => (
                        <div key={r.category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                            <span className="text-sm" style={{ color: CHOCOLATE }}>{r.category}</span>
                          </div>
                          <span className="text-sm font-medium" style={{ color: CHOCOLATE }}>{formatNaira(r.revenue)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                    <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Top Expenses</h2>
                    <div className="space-y-3">
                      {Object.entries(expenseByCategory)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([cat, amt]) => (
                          <div key={cat} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EXPENSE_COLORS[cat] || CAPPUCCINO }} />
                              <span className="text-sm" style={{ color: CHOCOLATE }}>{cat}</span>
                            </div>
                            <span className="text-sm font-medium" style={{ color: CHOCOLATE }}>{formatNaira(amt)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Recent transactions */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Latest Transactions</h2>
                  <div className="space-y-2">
                    {TRANSACTIONS.slice(0, 5).map(t => (
                      <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: CREAM }}>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono w-20" style={{ color: `${CHOCOLATE}50` }}>{t.date}</span>
                          <span className="text-sm font-medium" style={{ color: CHOCOLATE }}>{t.client}</span>
                          <span className="text-xs hidden md:inline" style={{ color: `${CHOCOLATE}50` }}>{t.service}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold" style={{ color: CHOCOLATE }}>{formatNaira(t.amount)}</span>
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: TX_STATUS[t.status].bg, color: TX_STATUS[t.status].text }}
                          >
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Transactions ── */}
            {activeSection === "transactions" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium" style={{ color: `${CHOCOLATE}60` }}>Filter:</span>
                  {(["all", "Transfer", "Cash", "POS"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setTxFilter(f)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        backgroundColor: txFilter === f ? GOLD : "white",
                        color: txFilter === f ? "white" : CHOCOLATE,
                        border: `1px solid ${txFilter === f ? GOLD : `${CHOCOLATE}15`}`,
                      }}
                    >
                      {f === "all" ? "All Methods" : f}
                    </button>
                  ))}
                  <span className="text-xs ml-auto" style={{ color: `${CHOCOLATE}50` }}>{filteredTransactions.length} transactions</span>
                </div>

                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: CREAM }}>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Date</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Client</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Service</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Amount</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Method</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map(t => (
                          <tr key={t.id} className="border-t" style={{ borderColor: `${CHOCOLATE}06` }}>
                            <td className="px-6 py-3 text-xs font-mono" style={{ color: `${CHOCOLATE}60` }}>{t.date}</td>
                            <td className="px-6 py-3 font-medium" style={{ color: CHOCOLATE }}>{t.client}</td>
                            <td className="px-6 py-3" style={{ color: `${CHOCOLATE}70` }}>{t.service}</td>
                            <td className="px-6 py-3 font-semibold" style={{ color: CHOCOLATE }}>{formatNaira(t.amount)}</td>
                            <td className="px-6 py-3">
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${GOLD}20`, color: CHOCOLATE }}>
                                {t.method}
                              </span>
                            </td>
                            <td className="px-6 py-3">
                              <span
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: TX_STATUS[t.status].bg, color: TX_STATUS[t.status].text }}
                              >
                                {t.status}
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

            {/* ── Revenue Analytics ── */}
            {activeSection === "analytics" && (
              <div className="space-y-6">
                {/* Revenue by Service */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Revenue by Service Category</h2>
                  <div className="space-y-4">
                    {REVENUE_BY_SERVICE.map(r => {
                      const total = REVENUE_BY_SERVICE.reduce((s, x) => s + x.revenue, 0);
                      const pct = Math.round((r.revenue / total) * 100);
                      return (
                        <div key={r.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span style={{ color: CHOCOLATE }}>{r.category}</span>
                            <span className="font-medium" style={{ color: CHOCOLATE }}>{formatNaira(r.revenue)} ({pct}%)</span>
                          </div>
                          <div className="h-3 rounded-full" style={{ backgroundColor: `${CHOCOLATE}08` }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: r.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Revenue by Day */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <h2 className="text-sm font-semibold mb-4" style={{ color: CHOCOLATE }}>Revenue by Day of Week</h2>
                  <div className="flex items-end gap-3 h-48">
                    {REVENUE_BY_DAY.map(d => {
                      const maxRev = Math.max(...REVENUE_BY_DAY.map(x => x.revenue));
                      const height = maxRev > 0 ? (d.revenue / maxRev) * 100 : 0;
                      return (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] font-medium" style={{ color: CHOCOLATE }}>{formatNaira(d.revenue)}</span>
                          <div className="w-full rounded-t-lg transition-all" style={{ height: `${height}%`, backgroundColor: d.revenue > 150000 ? GOLD : `${GOLD}60`, minHeight: d.revenue > 0 ? "8px" : "2px" }} />
                          <span className="text-xs font-medium" style={{ color: `${CHOCOLATE}60` }}>{d.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Clients */}
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="p-6 border-b" style={{ borderColor: `${CHOCOLATE}08` }}>
                    <h2 className="text-sm font-semibold" style={{ color: CHOCOLATE }}>Top 10 Clients by Spend</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: CREAM }}>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>#</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Client</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Visits</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Total Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TOP_CLIENTS.map((c, i) => (
                          <tr key={c.name} className="border-t" style={{ borderColor: `${CHOCOLATE}06` }}>
                            <td className="px-6 py-3">
                              <span
                                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                                style={{
                                  backgroundColor: i < 3 ? `${GOLD}20` : `${CHOCOLATE}08`,
                                  color: i < 3 ? GOLD : `${CHOCOLATE}60`,
                                }}
                              >
                                {i + 1}
                              </span>
                            </td>
                            <td className="px-6 py-3 font-medium" style={{ color: CHOCOLATE }}>{c.name}</td>
                            <td className="px-6 py-3" style={{ color: `${CHOCOLATE}70` }}>{c.visits}</td>
                            <td className="px-6 py-3 font-semibold" style={{ color: CHOCOLATE }}>{formatNaira(c.spent)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Expenses ── */}
            {activeSection === "expenses" && (
              <div className="space-y-6">
                {/* Category summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(expenseByCategory).map(([cat, amt]) => (
                    <div key={cat} className="bg-white rounded-2xl border p-4" style={{ borderColor: `${CHOCOLATE}10` }}>
                      <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: EXPENSE_COLORS[cat] || CAPPUCCINO }} />
                      <p className="text-lg font-semibold" style={{ color: CHOCOLATE }}>{formatNaira(amt)}</p>
                      <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>{cat}</p>
                    </div>
                  ))}
                </div>

                {/* Expense table */}
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: `${CHOCOLATE}08` }}>
                    <h2 className="text-sm font-semibold" style={{ color: CHOCOLATE }}>All Expenses</h2>
                    <span className="text-sm font-semibold" style={{ color: ROSE_GOLD }}>Total: {formatNaira(totalExpenses)}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: CREAM }}>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Date</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Category</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Description</th>
                          <th className="text-left px-6 py-3 font-medium text-xs" style={{ color: `${CHOCOLATE}60` }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {EXPENSES.map(e => (
                          <tr key={e.id} className="border-t" style={{ borderColor: `${CHOCOLATE}06` }}>
                            <td className="px-6 py-3 text-xs font-mono" style={{ color: `${CHOCOLATE}60` }}>{e.date}</td>
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: EXPENSE_COLORS[e.category] || CAPPUCCINO }} />
                                <span style={{ color: `${CHOCOLATE}70` }}>{e.category}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3" style={{ color: CHOCOLATE }}>{e.description}</td>
                            <td className="px-6 py-3 font-semibold" style={{ color: CHOCOLATE }}>{formatNaira(e.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Reports ── */}
            {activeSection === "reports" && (
              <div className="space-y-6">
                {/* Daily Summary */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold" style={{ color: CHOCOLATE }}>Daily Summary - April 7, 2026</h2>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: `${GOLD}15`, color: GOLD }}>
                      <Download size={12} /> Export
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-xl p-4" style={{ backgroundColor: CREAM }}>
                      <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Revenue</p>
                      <p className="text-lg font-semibold" style={{ color: CHOCOLATE }}>{formatNaira(53000)}</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: CREAM }}>
                      <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Transactions</p>
                      <p className="text-lg font-semibold" style={{ color: CHOCOLATE }}>4</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: CREAM }}>
                      <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Avg Ticket</p>
                      <p className="text-lg font-semibold" style={{ color: CHOCOLATE }}>{formatNaira(13250)}</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: CREAM }}>
                      <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Walk-ins</p>
                      <p className="text-lg font-semibold" style={{ color: CHOCOLATE }}>1</p>
                    </div>
                  </div>
                </div>

                {/* Weekly Summary */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold" style={{ color: CHOCOLATE }}>Weekly Summary - Week 14</h2>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: `${GOLD}15`, color: GOLD }}>
                      <Download size={12} /> Export
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-xl p-4" style={{ backgroundColor: CREAM }}>
                      <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Revenue</p>
                      <p className="text-lg font-semibold" style={{ color: CHOCOLATE }}>{formatNaira(386000)}</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: CREAM }}>
                      <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Transactions</p>
                      <p className="text-lg font-semibold" style={{ color: CHOCOLATE }}>32</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: CREAM }}>
                      <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>New Clients</p>
                      <p className="text-lg font-semibold" style={{ color: CHOCOLATE }}>7</p>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: CREAM }}>
                      <p className="text-xs" style={{ color: `${CHOCOLATE}60` }}>Rebooking %</p>
                      <p className="text-lg font-semibold" style={{ color: CHOCOLATE }}>64%</p>
                    </div>
                  </div>
                </div>

                {/* Monthly P&L */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: `${CHOCOLATE}10` }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold" style={{ color: CHOCOLATE }}>Monthly P&L - April 2026</h2>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: `${GOLD}15`, color: GOLD }}>
                      <Download size={12} /> Export
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg" style={{ backgroundColor: `#DCFCE720` }}>
                      <div className="flex items-center gap-2">
                        <ArrowUpRight size={16} style={{ color: "#22C55E" }} />
                        <span className="text-sm font-medium" style={{ color: CHOCOLATE }}>Total Revenue</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "#22C55E" }}>{formatNaira(3550000)}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg" style={{ backgroundColor: `#FEE2E220` }}>
                      <div className="flex items-center gap-2">
                        <ArrowDownRight size={16} style={{ color: "#EF4444" }} />
                        <span className="text-sm font-medium" style={{ color: CHOCOLATE }}>Total Expenses</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "#EF4444" }}>-{formatNaira(totalExpenses)}</span>
                    </div>
                    <div className="h-px" style={{ backgroundColor: `${CHOCOLATE}10` }} />
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg" style={{ backgroundColor: `${GOLD}10` }}>
                      <span className="text-sm font-bold" style={{ color: CHOCOLATE }}>Net Profit</span>
                      <span className="text-lg font-bold" style={{ color: GOLD }}>{formatNaira(3550000 - totalExpenses)}</span>
                    </div>

                    {/* Expense breakdown */}
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: `${CHOCOLATE}08` }}>
                      <h3 className="text-xs font-semibold mb-3" style={{ color: `${CHOCOLATE}60` }}>Expense Breakdown</h3>
                      {Object.entries(expenseByCategory)
                        .sort((a, b) => b[1] - a[1])
                        .map(([cat, amt]) => (
                          <div key={cat} className="flex items-center justify-between py-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: EXPENSE_COLORS[cat] || CAPPUCCINO }} />
                              <span className="text-sm" style={{ color: `${CHOCOLATE}70` }}>{cat}</span>
                            </div>
                            <span className="text-sm font-medium" style={{ color: CHOCOLATE }}>{formatNaira(amt)}</span>
                          </div>
                        ))}
                    </div>
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
