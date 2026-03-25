import { useState } from "react";
import { Eye, EyeOff, LogIn, ChevronDown } from "lucide-react";

const TEAL  = "#0A1F1C";
const GOLD  = "#C9A97E";
const CREAM = "#F8F5F0";
const WHITE = "#FFFFFF";
const DARK  = "#2C2C2C";

const ROLES = [
  { id: "ceo",     label: "Chief Executive Officer",  dashboard: "/hub/ceo"     },
  { id: "cso",     label: "Client Success Officer",   dashboard: "/hub/cso"     },
  { id: "finance", label: "Finance Officer",          dashboard: "/hub/finance" },
  { id: "hr",      label: "HR Officer",               dashboard: "/hub/hr"      },
  { id: "bizdev",  label: "Business Development",     dashboard: "/hub/bizdev"  },
];

export default function StaffLoginPage() {
  const [role, setRole]       = useState(ROLES[0].id);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password) { setError("Enter your password."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      window.location.href = data.dashboard;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: CREAM }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-3xl font-light tracking-tight mb-1" style={{ color: TEAL, letterSpacing: "-0.04em" }}>
            HAMZURY
          </div>
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase" style={{ color: GOLD }}>
            Staff Portal
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="rounded-3xl p-8 border space-y-5"
          style={{ backgroundColor: WHITE, borderColor: `${GOLD}25`, boxShadow: "0 4px 40px rgba(10,31,28,0.08)" }}
        >
          <div>
            <h1 className="text-xl font-semibold tracking-tight" style={{ color: TEAL }}>
              Welcome back
            </h1>
            <p className="text-[13px] mt-1" style={{ color: DARK, opacity: 0.5 }}>
              Sign in to your dashboard
            </p>
          </div>

          {/* Role selector */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: DARK, opacity: 0.5 }}>
              Your Role
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none appearance-none pr-10"
                style={{ borderColor: `${GOLD}40`, backgroundColor: CREAM, color: TEAL }}
              >
                {ROLES.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: TEAL, opacity: 0.4 }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: DARK, opacity: 0.5 }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none pr-10 disabled:opacity-50 transition-all"
                style={{ borderColor: error ? "#EF4444" : `${GOLD}40`, backgroundColor: CREAM, color: DARK }}
                onFocus={e => (e.currentTarget.style.borderColor = TEAL)}
                onBlur={e => (e.currentTarget.style.borderColor = error ? "#EF4444" : `${GOLD}40`)}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-70 transition-opacity"
                style={{ color: TEAL }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && <p className="text-[11px] mt-1.5" style={{ color: "#EF4444" }}>{error}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: TEAL, color: WHITE }}
          >
            <LogIn size={16} />
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {/* Founder link */}
          <div className="text-center pt-1">
            <a href="/founder" className="text-[11px] opacity-30 hover:opacity-60 transition-opacity" style={{ color: TEAL }}>
              Founder Access →
            </a>
          </div>
        </form>

        {/* Back */}
        <div className="text-center mt-6">
          <a href="/" className="text-[12px] opacity-40 hover:opacity-70 transition-opacity" style={{ color: TEAL }}>
            ← Back to hamzury.com
          </a>
        </div>
      </div>
    </div>
  );
}
