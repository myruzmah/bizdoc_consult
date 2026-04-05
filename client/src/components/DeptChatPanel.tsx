import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { MessageSquare, Send, ChevronUp, ChevronDown, Users } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   HAMZURY — Inter-Department Chat Panel
   Reusable collapsible panel for staff dashboards.
   Sits fixed at bottom-right; shows threads between departments.
   ═══════════════════════════════════════════════════════════════════════ */

const GOLD = "#B48C4C";
const DARK = "#1D1D1F";
const MILK = "#FFFAF6";
const GREEN = "#1B4D3E";

type Props = {
  department: string;   // current user's department
  staffId: string;      // current user's staff ref
  staffName: string;    // current user's name
};

export default function DeptChatPanel({ department, staffId, staffName }: Props) {
  // ── State ──────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newThreadDept, setNewThreadDept] = useState("");
  const [showNewThread, setShowNewThread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Queries ────────────────────────────────────────────────────────────
  const threadsQuery = trpc.deptChat.threads.useQuery(
    { department },
    { refetchInterval: 15000 },
  );
  const unreadQuery = trpc.deptChat.unreadCount.useQuery(
    { department, staffId },
    { refetchInterval: 10000 },
  );
  const threadMessages = trpc.deptChat.thread.useQuery(
    { threadId: activeThread || "" },
    { enabled: !!activeThread, refetchInterval: 5000 },
  );

  // ── Mutations ──────────────────────────────────────────────────────────
  const sendMutation = trpc.deptChat.send.useMutation({
    onSuccess: () => {
      setNewMessage("");
      threadsQuery.refetch();
      if (activeThread) threadMessages.refetch();
    },
  });
  const markReadMutation = trpc.deptChat.markRead.useMutation();

  // ── Auto-scroll to newest message ──────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages.data]);

  // ── Mark thread as read when opened ────────────────────────────────────
  useEffect(() => {
    if (activeThread) {
      markReadMutation.mutate({ threadId: activeThread, staffId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThread]);

  // ── Send handler ───────────────────────────────────────────────────────
  const handleSend = () => {
    if (!newMessage.trim()) return;

    if (activeThread) {
      // Reply to existing thread
      const thread = threads.find((t) => t.threadId === activeThread);
      sendMutation.mutate({
        threadId: activeThread,
        toDepartment:
          thread?.toDepartment === department
            ? thread?.fromDepartment
            : thread?.toDepartment || undefined,
        message: newMessage.trim(),
      });
    } else if (showNewThread && newThreadDept) {
      // Start new thread
      const threadId = `${department}-${newThreadDept}-${Date.now()}`;
      sendMutation.mutate({
        threadId,
        toDepartment: newThreadDept,
        message: newMessage.trim(),
      });
      setActiveThread(threadId);
      setShowNewThread(false);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────
  const threads = threadsQuery.data || [];
  const messages = threadMessages.data || [];
  const unreadCount = unreadQuery.data || 0;

  const DEPTS = [
    "bizdoc",
    "systemise",
    "skills",
    "media",
    "bizdev",
    "hr",
    "finance",
    "cso",
  ];

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-0 right-4 z-40" style={{ width: 340 }}>
      {/* ── Header toggle ─────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-t-xl"
        style={{ backgroundColor: GREEN, color: "#fff" }}
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={16} />
          <span className="text-[13px] font-medium">Team Chat</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-red-500 text-white font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {/* ── Chat panel body ───────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="bg-white border border-t-0 rounded-b-xl shadow-2xl flex flex-col"
          style={{ height: 380, borderColor: "rgba(0,0,0,0.08)" }}
        >
          {activeThread ? (
            /* ── Thread view (messages) ──────────────────────────────── */
            <>
              <div
                className="px-3 py-2 border-b flex items-center gap-2"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                <button
                  onClick={() => setActiveThread(null)}
                  className="text-[12px]"
                  style={{ color: GOLD }}
                >
                  ← Back
                </button>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: DARK }}
                >
                  {threads.find((t) => t.threadId === activeThread)
                    ?.toDepartment || "Thread"}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {[...messages].reverse().map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.fromStaffId === staffId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className="max-w-[75%] px-3 py-2 rounded-xl text-[12px]"
                      style={{
                        backgroundColor:
                          msg.fromStaffId === staffId ? GREEN : "#f3f3f3",
                        color: msg.fromStaffId === staffId ? "#fff" : DARK,
                      }}
                    >
                      {msg.fromStaffId !== staffId && (
                        <p
                          className="text-[10px] font-medium mb-0.5"
                          style={{ color: GOLD }}
                        >
                          {msg.fromName}
                        </p>
                      )}
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : (
            /* ── Thread list ─────────────────────────────────────────── */
            <div className="flex-1 overflow-y-auto">
              <div
                className="px-3 py-2 border-b"
                style={{ borderColor: "rgba(0,0,0,0.06)" }}
              >
                <button
                  onClick={() => setShowNewThread((v) => !v)}
                  className="text-[12px] font-medium flex items-center gap-1"
                  style={{ color: GOLD }}
                >
                  <Users size={12} /> New conversation
                </button>
              </div>

              {showNewThread && (
                <div
                  className="px-3 py-2 border-b flex gap-2"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <select
                    value={newThreadDept}
                    onChange={(e) => setNewThreadDept(e.target.value)}
                    className="flex-1 text-[12px] border rounded px-2 py-1"
                    style={{ borderColor: "rgba(0,0,0,0.1)" }}
                  >
                    <option value="">Select department...</option>
                    {DEPTS.filter((d) => d !== department).map((d) => (
                      <option key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {threads.length === 0 ? (
                <div
                  className="px-3 py-8 text-center text-[12px]"
                  style={{ color: "#999" }}
                >
                  No conversations yet. Start one above.
                </div>
              ) : (
                threads.map((t) => (
                  <button
                    key={t.threadId}
                    onClick={() => setActiveThread(t.threadId)}
                    className="w-full text-left px-3 py-2.5 border-b hover:bg-[#FAFAFA] transition-colors"
                    style={{ borderColor: "rgba(0,0,0,0.04)" }}
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className="text-[12px] font-medium"
                        style={{ color: DARK }}
                      >
                        {t.fromDepartment === department
                          ? t.toDepartment
                          : t.fromDepartment}
                      </span>
                      <span className="text-[10px]" style={{ color: "#999" }}>
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      className="text-[11px] mt-0.5 truncate"
                      style={{ color: "#666" }}
                    >
                      {t.fromName}: {t.message.slice(0, 60)}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}

          {/* ── Message input ─────────────────────────────────────────── */}
          <div
            className="px-3 py-2 border-t flex gap-2"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                activeThread
                  ? "Type a message..."
                  : showNewThread
                    ? "Start conversation..."
                    : "Select a thread..."
              }
              disabled={!activeThread && !showNewThread}
              className="flex-1 text-[12px] border rounded-full px-3 py-2 outline-none"
              style={{
                borderColor: "rgba(0,0,0,0.08)",
                backgroundColor: MILK,
              }}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || sendMutation.isPending}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40"
              style={{ backgroundColor: GREEN, color: GOLD }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
