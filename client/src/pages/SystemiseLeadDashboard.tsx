import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import type { StaffUser } from "@/lib/types";
import PageMeta from "@/components/PageMeta";
import NotificationBell from "@/components/NotificationBell";
import DeptChatPanel from "@/components/DeptChatPanel";
import AgentSuggestionCard from "@/components/AgentSuggestionCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "wouter";
import {
  Loader2, LogOut, Briefcase, CalendarDays, Users, BarChart3,
  Clock, CheckCircle2, AlertCircle, Send, ArrowRight, ArrowLeft,
  LayoutDashboard, Target, ClipboardList, Play, Flag,
  ChevronDown, ChevronUp, RotateCcw,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

// ─── Palette ──────────────────────────────────────────────────────────────────
const TEAL = "#2563EB";
const GOLD = "#B48C4C";
const TEAL_LIGHT = "rgba(37,99,235,0.08)";
const MILK = "#FFFAF6";
const WHITE = "#FFFFFF";

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "overview" | "queue" | "review" | "stats" | "projects" | "appointments" | "applications";

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Not Started":       { bg: "rgba(107,114,128,0.08)", text: "#6B7280", border: "#D1D5DB" },
  "In Progress":       { bg: "rgba(59,130,246,0.10)",  text: "#3B82F6", border: "#93C5FD" },
  "Waiting on Client": { bg: "rgba(234,179,8,0.12)",   text: "#B45309", border: "#FCD34D" },
  "Submitted":         { bg: "rgba(139,92,246,0.10)",  text: "#7C3AED", border: "#C4B5FD" },
  "Completed":         { bg: "rgba(34,197,94,0.10)",   text: "#16A34A", border: "#86EFAC" },
};

const KANBAN_COLUMNS = ["Not Started", "In Progress", "Waiting on Client", "Submitted", "Completed"] as const;

function daysSince(dateStr: string | null | undefined): number {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS["Not Started"];
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 999,
      fontSize: 12, fontWeight: 500, background: c.bg, color: c.text,
    }}>
      {status}
    </span>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────
function PriorityBadge({ score }: { score: number | null | undefined }) {
  const s = score ?? 0;
  let label = "Low", color = "#6B7280";
  if (s >= 7) { label = "High"; color = "#DC2626"; }
  else if (s >= 4) { label = "Medium"; color = "#F59E0B"; }
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, color, background: `${color}15`,
    }}>
      {label} ({s})
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SystemiseLeadDashboard() {
  const { user, loading, logout } = useAuth({ redirectOnUnauthenticated: true });
  const staffUser = user as StaffUser;
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reworkNotes, setReworkNotes] = useState<Record<number, string>>({});

  // ─── Queries ──────────────────────────────────────────────────────────────
  const tasksQuery = trpc.tasks.byDepartment.useQuery(
    { department: "systemise" },
    { refetchInterval: 15000 },
  );
  const pendingQuery = trpc.tasks.pending.useQuery(undefined, { refetchInterval: 15000 });
  const appointmentsQuery = trpc.systemise.appointments.useQuery(undefined, { refetchInterval: 30000 });
  const joinAppsQuery = trpc.systemise.joinApplications.useQuery(undefined, { refetchInterval: 30000 });
  const weeklyTargetsQuery = trpc.weeklyTargets.byDepartment.useQuery(
    { department: "systemise" },
    { refetchInterval: 60000 },
  );

  // ─── Mutations ────────────────────────────────────────────────────────────
  const updateStatus = trpc.tasks.updateStatus.useMutation({
    onSuccess: () => { toast.success("Status updated"); tasksQuery.refetch(); pendingQuery.refetch(); },
    onError: () => toast.error("Failed to update status"),
  });
  const submitTask = trpc.tasks.submit.useMutation({
    onSuccess: () => { toast.success("Task submitted for review"); tasksQuery.refetch(); pendingQuery.refetch(); },
    onError: () => toast.error("Failed to submit task"),
  });
  const approveMutation = trpc.tasks.approve.useMutation({
    onSuccess: () => { toast.success("Task approved & completed"); tasksQuery.refetch(); pendingQuery.refetch(); },
    onError: (e) => toast.error(e.message || "Failed to approve"),
  });
  const reworkMutation = trpc.tasks.flagRework.useMutation({
    onSuccess: () => { toast.success("Task flagged for rework"); tasksQuery.refetch(); pendingQuery.refetch(); },
    onError: () => toast.error("Failed to flag task"),
  });

  // ─── Agent Suggestions ────────────────────────────────────────────────────
  const suggestionsQuery = trpc.agents.suggestions.useQuery({ department: "systemise" });
  const reviewMutation = trpc.agents.reviewSuggestion.useMutation({
    onSuccess: () => suggestionsQuery.refetch(),
  });

  // ─── Derived data ─────────────────────────────────────────────────────────
  const allTasks = (tasksQuery.data ?? []) as any[];
  const submittedTasks = allTasks.filter((t: any) => t.status === "Submitted");
  const activeTasks = allTasks.filter((t: any) => t.status !== "Completed");
  const completedThisMonth = allTasks.filter((t: any) => {
    if (t.status !== "Completed" || !t.completedAt) return false;
    const d = new Date(t.completedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const avgDays = (() => {
    const completed = allTasks.filter((t: any) => t.status === "Completed" && t.completedAt && t.createdAt);
    if (completed.length === 0) return "—";
    const total = completed.reduce((sum: number, t: any) => {
      const ms = new Date(t.completedAt).getTime() - new Date(t.createdAt).getTime();
      return sum + ms / (1000 * 60 * 60 * 24);
    }, 0);
    return (total / completed.length).toFixed(1);
  })();

  const statusBreakdown = allTasks.reduce((acc: Record<string, number>, t: any) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const reworkCount = allTasks.filter((t: any) => t.isRework).length;
  const reworkRate = allTasks.length > 0 ? Math.round((reworkCount / allTasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: MILK }}>
        <Loader2 className="animate-spin" size={28} style={{ color: GOLD }} />
      </div>
    );
  }
  if (!user) return null;

  const appointments = appointmentsQuery.data || [];
  const joinApps = joinAppsQuery.data || [];

  const sidebarItems: { key: Section; icon: React.ElementType; label: string; badge?: number }[] = [
    { key: "overview",     icon: LayoutDashboard, label: "Overview" },
    { key: "queue",        icon: ClipboardList,   label: "Task Queue" },
    { key: "review",       icon: CheckCircle2,    label: "QA Review", badge: submittedTasks.length || undefined },
    { key: "stats",        icon: BarChart3,        label: "Stats" },
    { key: "projects",     icon: Briefcase,        label: "Projects" },
    { key: "appointments", icon: CalendarDays,     label: "Appointments" },
    { key: "applications", icon: Users,            label: "Applications" },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: MILK }}>
      <PageMeta title="Systemise Operations | HAMZURY" description="Systemise department lead dashboard" />

      {/* ── Sidebar ── */}
      <div className="w-16 md:w-60 flex flex-col h-full shrink-0" style={{ backgroundColor: TEAL }}>
        <div className="h-16 flex items-center justify-center md:justify-start md:px-5 border-b shrink-0" style={{ borderColor: `${GOLD}20` }}>
          <Briefcase size={18} style={{ color: GOLD }} />
          <span className="hidden md:block ml-2.5 font-medium text-sm" style={{ color: GOLD }}>Systemise Ops</span>
        </div>
        <div className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {sidebarItems.map(({ key, icon: Icon, label, badge }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className="w-full flex items-center justify-center md:justify-start md:px-3 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: activeSection === key ? `${GOLD}18` : "transparent",
                color: activeSection === key ? GOLD : `${GOLD}60`,
              }}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden md:block ml-3 text-sm font-normal">{label}</span>
              {badge != null && badge > 0 && (
                <span className="hidden md:inline-flex ml-auto items-center justify-center text-[10px] font-bold rounded-full px-1.5 min-w-[18px] h-[18px]" style={{ backgroundColor: GOLD, color: WHITE }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="p-3 border-t shrink-0" style={{ borderColor: `${GOLD}15` }}>
          <button onClick={() => logout()} className="w-full flex items-center justify-center md:justify-start md:px-3 py-2.5 rounded-xl transition-all text-sm" style={{ color: `${GOLD}50` }}>
            <LogOut size={16} className="shrink-0" />
            <span className="hidden md:block ml-3 font-normal">Sign Out</span>
          </button>
          <Link href="/" className="w-full flex items-center justify-center md:justify-start md:px-3 py-2.5 rounded-xl transition-all text-sm mt-1" style={{ color: `${GOLD}50` }}>
            <ArrowLeft size={16} className="shrink-0" />
            <span className="hidden md:block ml-3 font-normal">Back to HAMZURY</span>
          </Link>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 flex items-center justify-between px-6 border-b shrink-0 bg-white" style={{ borderColor: `${TEAL}10` }}>
          <div>
            <h1 className="text-base font-medium" style={{ color: TEAL }}>
              {sidebarItems.find(s => s.key === activeSection)?.label || "Overview"}
            </h1>
            <p className="text-xs opacity-40" style={{ color: TEAL }}>
              {staffUser?.name || staffUser?.displayName || "Lead"} · Dept Lead
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 md:p-8" style={{ maxWidth: 1100 }}>
            <AgentSuggestionCard
              suggestions={(suggestionsQuery.data || []) as any}
              onAccept={(id) => reviewMutation.mutate({ id, action: "accepted" })}
              onReject={(id) => reviewMutation.mutate({ id, action: "rejected" })}
              isLoading={suggestionsQuery.isLoading}
            />

            {activeSection === "overview" && (
              <OverviewSection
                activeTasks={activeTasks.length}
                completedThisMonth={completedThisMonth.length}
                avgDays={avgDays}
                submittedCount={submittedTasks.length}
                reworkRate={reworkRate}
                appointments={appointments}
                weeklyTargetsQuery={weeklyTargetsQuery}
              />
            )}
            {activeSection === "queue" && (
              <TaskQueueTab
                tasks={allTasks}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                onStartTask={(id: number) => updateStatus.mutate({ id, status: "In Progress" })}
                onSubmitTask={(id: number) => submitTask.mutate({ id })}
                isUpdating={updateStatus.isPending || submitTask.isPending}
              />
            )}
            {activeSection === "review" && (
              <QAReviewTab
                tasks={submittedTasks}
                reworkNotes={reworkNotes}
                setReworkNotes={setReworkNotes}
                onApprove={(id: number) => approveMutation.mutate({ id })}
                onRework={(id: number) => reworkMutation.mutate({ id, reason: reworkNotes[id] || "" })}
                isUpdating={approveMutation.isPending || reworkMutation.isPending}
              />
            )}
            {activeSection === "stats" && (
              <StatsTab
                total={activeTasks.length}
                completedThisMonth={completedThisMonth.length}
                avgDays={avgDays}
                breakdown={statusBreakdown}
              />
            )}
            {activeSection === "projects" && (
              <ProjectsBoard tasks={allTasks} onStatusChange={(id, status) => updateStatus.mutate({ id, status: status as any })} />
            )}
            {activeSection === "appointments" && <AppointmentsTable appointments={appointments} />}
            {activeSection === "applications" && <ApplicationsTable applications={joinApps} />}
          </div>
        </ScrollArea>
      </div>

      <DeptChatPanel department="systemise" staffId={staffUser?.staffRef || ""} staffName={staffUser?.name || "Staff"} />
    </div>
  );
}

// ─── Overview Section ────────────────────────────────────────────────────────
function OverviewSection({
  activeTasks, completedThisMonth, avgDays, submittedCount, reworkRate, appointments, weeklyTargetsQuery,
}: {
  activeTasks: number; completedThisMonth: number; avgDays: string;
  submittedCount: number; reworkRate: number; appointments: any[]; weeklyTargetsQuery: any;
}) {
  const upcomingAppointments = appointments.filter((a: any) => a.status === "pending" || a.status === "confirmed").length;

  const STAT_CARDS = [
    { label: "Active Tasks", value: activeTasks, icon: ClipboardList, color: TEAL },
    { label: "Completed This Month", value: completedThisMonth, icon: CheckCircle2, color: "#16A34A" },
    { label: "Avg Completion (days)", value: avgDays, icon: BarChart3, color: "#3B82F6" },
    { label: "Submitted for QA", value: submittedCount, icon: Send, color: "#7C3AED" },
    { label: "Rework Rate", value: `${reworkRate}%`, icon: RotateCcw, color: "#EF4444" },
    { label: "Upcoming Appointments", value: upcomingAppointments, icon: CalendarDays, color: GOLD },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <Icon size={16} className="mx-auto mb-2" style={{ color }} />
            <p className="text-xl font-medium leading-none mb-1" style={{ color }}>{value}</p>
            <p className="text-[10px] uppercase tracking-wider opacity-40" style={{ color: TEAL }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: WHITE, borderRadius: 16, border: "1px solid #E5E7EB", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 16 }}>
          <Target size={16} style={{ color: GOLD }} /> My Weekly Targets
        </div>
        {weeklyTargetsQuery.isLoading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#9CA3AF" }}>
            <Loader2 size={16} className="animate-spin" /> Loading targets...
          </div>
        ) : !weeklyTargetsQuery.data?.length ? (
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>No targets set for this week.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {weeklyTargetsQuery.data.map((target: any) => (
              <div key={target.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px", borderRadius: 8, border: "1px solid #F3F4F6", background: MILK,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: TEAL }}>{target.title || target.description}</div>
                  {target.metric && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{target.metric}</div>}
                </div>
                <span style={{
                  padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: target.status === "completed" ? "rgba(34,197,94,0.10)" : target.status === "in_progress" ? "rgba(59,130,246,0.10)" : "rgba(234,179,8,0.12)",
                  color: target.status === "completed" ? "#16A34A" : target.status === "in_progress" ? "#3B82F6" : "#B45309",
                }}>
                  {target.status === "completed" ? "Done" : target.status === "in_progress" ? "In Progress" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Task Queue Tab ──────────────────────────────────────────────────────────
function TaskQueueTab({
  tasks, expandedId, setExpandedId, onStartTask, onSubmitTask, isUpdating,
}: {
  tasks: any[]; expandedId: number | null; setExpandedId: (id: number | null) => void;
  onStartTask: (id: number) => void; onSubmitTask: (id: number) => void; isUpdating: boolean;
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = statusFilter === "all" ? tasks : tasks.filter((t) => t.status === statusFilter);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, color: "#6B7280" }}>Filter:</span>
        {["all", ...KANBAN_COLUMNS].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: "4px 12px", borderRadius: 999, border: "1px solid #E5E7EB",
            background: statusFilter === s ? TEAL : WHITE,
            color: statusFilter === s ? WHITE : "#374151",
            fontSize: 12, cursor: "pointer", fontWeight: statusFilter === s ? 600 : 400,
          }}>
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div style={{ background: WHITE, borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "100px 1.2fr 1fr 120px 100px 110px 60px",
          padding: "10px 16px", background: "#F9FAFB", fontSize: 12, fontWeight: 600, color: "#6B7280",
          borderBottom: "1px solid #E5E7EB",
        }}>
          <span>Ref #</span><span>Client</span><span>Service</span><span>Status</span><span>Priority</span><span>Created</span><span></span>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>No tasks found</div>
        )}

        {filtered.map((task: any) => (
          <div key={task.id}>
            <div onClick={() => setExpandedId(expandedId === task.id ? null : task.id)} style={{
              display: "grid", gridTemplateColumns: "100px 1.2fr 1fr 120px 100px 110px 60px",
              padding: "12px 16px", alignItems: "center", cursor: "pointer",
              borderBottom: "1px solid #F3F4F6", fontSize: 13,
              background: expandedId === task.id ? TEAL_LIGHT : "transparent",
              transition: "background 0.15s",
            }}>
              <span style={{ fontFamily: "monospace", fontWeight: 600, color: TEAL }}>{task.ref}</span>
              <span style={{ fontWeight: 500 }}>{task.clientName}</span>
              <span style={{ color: "#6B7280" }}>{task.service}</span>
              <StatusBadge status={task.status} />
              <PriorityBadge score={task.leadScore} />
              <span style={{ color: "#9CA3AF", fontSize: 12 }}>{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "—"}</span>
              <span style={{ color: "#9CA3AF" }}>{expandedId === task.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
            </div>

            {expandedId === task.id && (
              <div style={{ padding: "16px 24px", background: "#FAFBFC", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div><div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Business Name</div><div style={{ fontSize: 13 }}>{task.businessName || "—"}</div></div>
                  <div><div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Phone</div><div style={{ fontSize: 13 }}>{task.phone || "—"}</div></div>
                  <div><div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Quoted Price</div><div style={{ fontSize: 13 }}>{task.quotedPrice ? `₦${Number(task.quotedPrice).toLocaleString()}` : "—"}</div></div>
                  <div><div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Deadline</div><div style={{ fontSize: 13 }}>{task.deadline || "—"}</div></div>
                </div>
                {task.notes && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Notes</div>
                    <div style={{ fontSize: 13, background: WHITE, border: "1px solid #E5E7EB", borderRadius: 6, padding: "8px 12px", whiteSpace: "pre-wrap" }}>{task.notes}</div>
                  </div>
                )}
                {task.isRework && task.reworkNote && (
                  <div style={{ marginBottom: 16, padding: "8px 12px", borderRadius: 6, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                    <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 600, marginBottom: 2 }}>Rework Required</div>
                    <div style={{ fontSize: 13, color: "#B91C1C" }}>{task.reworkNote}</div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  {task.status === "Not Started" && (
                    <button disabled={isUpdating} onClick={() => onStartTask(task.id)} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "7px 16px", borderRadius: 6, border: "none",
                      background: TEAL, color: WHITE, fontSize: 13, fontWeight: 500,
                      cursor: isUpdating ? "not-allowed" : "pointer", opacity: isUpdating ? 0.6 : 1,
                    }}>
                      <Play size={14} /> Start Task
                    </button>
                  )}
                  {(task.status === "In Progress" || task.status === "Waiting on Client") && (
                    <button disabled={isUpdating} onClick={() => onSubmitTask(task.id)} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "7px 16px", borderRadius: 6, border: "none",
                      background: "#7C3AED", color: WHITE, fontSize: 13, fontWeight: 500,
                      cursor: isUpdating ? "not-allowed" : "pointer", opacity: isUpdating ? 0.6 : 1,
                    }}>
                      <Send size={14} /> Submit for Review
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: "#9CA3AF" }}>{filtered.length} task{filtered.length !== 1 ? "s" : ""} shown</div>
    </div>
  );
}

// ─── QA Review Tab ───────────────────────────────────────────────────────────
function QAReviewTab({
  tasks, reworkNotes, setReworkNotes, onApprove, onRework, isUpdating,
}: {
  tasks: any[]; reworkNotes: Record<number, string>; setReworkNotes: (v: Record<number, string>) => void;
  onApprove: (id: number) => void; onRework: (id: number) => void; isUpdating: boolean;
}) {
  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF", background: WHITE, borderRadius: 10, border: "1px solid #E5E7EB" }}>
        <CheckCircle2 size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
        <div style={{ fontSize: 14 }}>No tasks pending review</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {tasks.map((task: any) => (
        <div key={task.id} style={{ background: WHITE, borderRadius: 10, border: "1px solid #E5E7EB", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <span style={{ fontFamily: "monospace", fontWeight: 600, color: TEAL, marginRight: 12 }}>{task.ref}</span>
              <span style={{ fontWeight: 500 }}>{task.clientName}</span>
              <span style={{ color: "#9CA3AF", marginLeft: 8, fontSize: 13 }}>— {task.service}</span>
            </div>
            <StatusBadge status={task.status} />
          </div>
          {task.notes && (
            <div style={{ fontSize: 13, background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: 6, padding: "8px 12px", marginBottom: 12, whiteSpace: "pre-wrap" }}>
              {task.notes}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16, fontSize: 13 }}>
            <div><span style={{ color: "#9CA3AF", fontSize: 11 }}>Quoted Price</span><div>{task.quotedPrice ? `₦${Number(task.quotedPrice).toLocaleString()}` : "—"}</div></div>
            <div><span style={{ color: "#9CA3AF", fontSize: 11 }}>Business</span><div>{task.businessName || "—"}</div></div>
            <div><span style={{ color: "#9CA3AF", fontSize: 11 }}>Phone</span><div>{task.phone || "—"}</div></div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <textarea
              placeholder="Rework note (required if flagging for rework)..."
              value={reworkNotes[task.id] || ""}
              onChange={(e) => setReworkNotes({ ...reworkNotes, [task.id]: e.target.value })}
              style={{ width: "100%", minHeight: 56, padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={isUpdating} onClick={() => onApprove(task.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, border: "none",
              background: "#16A34A", color: WHITE, fontSize: 13, fontWeight: 500,
              cursor: isUpdating ? "not-allowed" : "pointer", opacity: isUpdating ? 0.6 : 1,
            }}>
              <CheckCircle2 size={14} /> Approve & Complete
            </button>
            <button disabled={isUpdating || !(reworkNotes[task.id] || "").trim()} onClick={() => onRework(task.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6,
              border: "1px solid #E5E7EB", background: WHITE, color: "#DC2626", fontSize: 13, fontWeight: 500,
              cursor: (isUpdating || !(reworkNotes[task.id] || "").trim()) ? "not-allowed" : "pointer",
              opacity: (isUpdating || !(reworkNotes[task.id] || "").trim()) ? 0.5 : 1,
            }}>
              <Flag size={14} /> Flag for Rework
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Stats Tab ───────────────────────────────────────────────────────────────
function StatsTab({ total, completedThisMonth, avgDays, breakdown }: {
  total: number; completedThisMonth: number; avgDays: string; breakdown: Record<string, number>;
}) {
  const statCards = [
    { label: "Active Tasks", value: total, color: TEAL },
    { label: "Completed This Month", value: completedThisMonth, color: "#16A34A" },
    { label: "Avg Completion (days)", value: avgDays, color: "#3B82F6" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: WHITE, borderRadius: 10, border: "1px solid #E5E7EB", padding: "20px 24px" }}>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: WHITE, borderRadius: 10, border: "1px solid #E5E7EB", padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Tasks by Status</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(STATUS_COLORS).map(([status, colors]) => {
            const count = breakdown[status] || 0;
            const totalAll = Object.values(breakdown).reduce((a, b) => a + b, 0) || 1;
            const pct = Math.round((count / totalAll) * 100);
            return (
              <div key={status} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 140, fontSize: 13, color: "#374151" }}>{status}</div>
                <div style={{ flex: 1, height: 22, background: "#F3F4F6", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: colors.text, borderRadius: 6, transition: "width 0.3s", minWidth: count > 0 ? 4 : 0 }} />
                </div>
                <div style={{ width: 50, textAlign: "right", fontSize: 13, fontWeight: 600, color: colors.text }}>{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Projects Kanban Board ───────────────────────────────────────────────────
function ProjectsBoard({ tasks, onStatusChange }: { tasks: any[]; onStatusChange: (id: number, status: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${KANBAN_COLUMNS.length}, 1fr)`, gap: 16, overflowX: "auto", minWidth: 900 }}>
      {KANBAN_COLUMNS.map((col) => {
        const colTasks = tasks.filter((t: any) => (t.status || "Not Started") === col);
        const sc = STATUS_COLORS[col] || STATUS_COLORS["Not Started"];
        return (
          <div key={col} style={{ minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ backgroundColor: sc.bg, color: sc.text, padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{col}</span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>{colTasks.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {colTasks.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: "#9CA3AF", fontSize: 13, border: "1px dashed #D1D5DB", borderRadius: 8 }}>No tasks</div>
              )}
              {colTasks.map((task: any) => {
                const days = daysSince(task.createdAt);
                return (
                  <div key={task.id} style={{
                    backgroundColor: WHITE, border: `1px solid ${sc.border}`, borderRadius: 10,
                    padding: 14, cursor: "default", transition: "box-shadow 0.15s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 6, lineHeight: 1.3 }}>{task.clientName || task.businessName || "Unnamed"}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{task.serviceType || task.service || "—"}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: GOLD, fontWeight: 600, fontFamily: "monospace" }}>{task.ref || task.referenceCode || "—"}</span>
                      <span style={{ fontSize: 11, color: days > 7 ? "#EF4444" : "#9CA3AF", display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> {days}d</span>
                    </div>
                    <select value={task.status || "Not Started"} onChange={(e) => onStatusChange(task.id, e.target.value)}
                      style={{ width: "100%", fontSize: 12, padding: "5px 8px", borderRadius: 6, border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB", color: "#374151", cursor: "pointer", outline: "none" }}>
                      {KANBAN_COLUMNS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Appointments Table ──────────────────────────────────────────────────────
function AppointmentsTable({ appointments }: { appointments: any[] }) {
  const sorted = useMemo(
    () => [...appointments].sort((a, b) => new Date(b.preferredDate || b.createdAt).getTime() - new Date(a.preferredDate || a.createdAt).getTime()),
    [appointments],
  );
  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      pending: { bg: "rgba(234,179,8,0.12)", text: "#B45309" }, confirmed: { bg: "rgba(59,130,246,0.10)", text: "#3B82F6" },
      completed: { bg: "rgba(34,197,94,0.10)", text: "#16A34A" }, cancelled: { bg: "rgba(239,68,68,0.10)", text: "#EF4444" },
    };
    const s = map[status] || map.pending;
    return <span style={{ backgroundColor: s.bg, color: s.text, padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500, textTransform: "capitalize" }}>{status}</span>;
  };

  return (
    <div style={{ backgroundColor: WHITE, borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: TEAL, margin: 0 }}>Upcoming Appointments</h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>Clarity Desk sessions</p>
      </div>
      {sorted.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>No appointments yet</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: "#F9FAFB" }}>
                {["Client", "Date", "Time", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((a: any, i: number) => (
                <tr key={a.id || i} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: "#1A1A1A" }}>{a.clientName || "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#6B7280" }}>{a.preferredDate || "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#6B7280" }}>{a.preferredTime || "—"}</td>
                  <td style={{ padding: "10px 16px" }}>{statusBadge(a.status || "pending")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Applications Table ──────────────────────────────────────────────────────
function ApplicationsTable({ applications }: { applications: any[] }) {
  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      new: { bg: "rgba(59,130,246,0.10)", text: "#3B82F6" }, reviewed: { bg: "rgba(234,179,8,0.12)", text: "#B45309" },
      accepted: { bg: "rgba(34,197,94,0.10)", text: "#16A34A" }, rejected: { bg: "rgba(239,68,68,0.10)", text: "#EF4444" },
    };
    const s = map[status] || map.new;
    return <span style={{ backgroundColor: s.bg, color: s.text, padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500, textTransform: "capitalize" }}>{status}</span>;
  };

  return (
    <div style={{ backgroundColor: WHITE, borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: TEAL, margin: 0 }}>Join Us Applications</h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>People who applied to join the Systemise team</p>
      </div>
      {applications.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>No applications yet</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: "#F9FAFB" }}>
                {["Name", "Phone", "Role Interest", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((a: any, i: number) => (
                <tr key={a.id || i} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "10px 16px", fontWeight: 500, color: "#1A1A1A" }}>{a.fullName || "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#6B7280" }}>{a.phone || "—"}</td>
                  <td style={{ padding: "10px 16px", color: "#6B7280" }}>{a.roleInterest || "—"}</td>
                  <td style={{ padding: "10px 16px" }}>{statusBadge(a.status || "new")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
