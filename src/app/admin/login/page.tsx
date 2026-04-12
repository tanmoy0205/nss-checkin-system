'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid admin credentials");
      } else {
        // After login, we must check if the user is actually an admin.
        // The middleware or the layout will redirect them if they aren't.
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 pt-32 pb-20 relative overflow-hidden font-sans">
      {/* Background elements - darker for admin */}
      <div className="absolute top-0 right-0 w-250 h-250 bg-nss-blue/10 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-250 h-250 bg-nss-red/5 rounded-full blur-[180px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-zinc-900 rounded-[3.5rem] shadow-2xl shadow-black border border-white/5 overflow-hidden">
          <div className="bg-nss-blue-dark p-14 text-center text-white relative">
            <div className="absolute inset-0 bg-linear-to-br from-black via-nss-blue-dark to-nss-blue opacity-40" />
            <div className="relative z-10">
              <div className="flex justify-center mb-10">
                <div className="h-24 w-24 bg-white rounded-3xl p-2 shadow-2xl transform hover:scale-110 transition-transform">
                  <ShieldCheck size={80} className="text-nss-blue-dark h-full w-full" />
                </div>
              </div>
              <h1 className="text-4xl font-black tracking-tighter mb-3 uppercase">ADMIN <span className="text-nss-red">PORTAL</span></h1>
              <p className="text-blue-100/40 text-[10px] font-black uppercase tracking-[0.4em]">Authorized Access Only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-zinc-900/50">
            {error && (
              <div className="bg-red-500/10 text-red-500 p-5 rounded-2xl text-xs font-black border border-red-500/20 animate-in fade-in zoom-in duration-300 flex items-center gap-4 uppercase tracking-widest">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-1">Admin Identity</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-nss-blue transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-black border border-white/5 rounded-2xl focus:ring-4 focus:ring-nss-blue/10 focus:border-nss-blue focus:bg-zinc-900 transition-all outline-none font-black text-sm text-white placeholder:text-zinc-700"
                  placeholder="admin@nss.inspiria"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-1">Secure Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-nss-blue transition-colors" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-black border border-white/5 rounded-2xl focus:ring-4 focus:ring-nss-blue/10 focus:border-nss-blue focus:bg-zinc-900 transition-all outline-none font-black text-sm text-white placeholder:text-zinc-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-nss-blue text-white font-black text-lg rounded-2xl hover:bg-nss-blue-dark transition-all shadow-2xl shadow-nss-blue/20 flex items-center justify-center gap-4 group disabled:opacity-50 active:scale-95 uppercase tracking-tighter"
            >
              {loading ? "AUTHENTICATING..." : "ENTER PORTAL"}
              {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />}
            </button>
          </form>

          <div className="p-10 bg-black/50 border-t border-white/5 text-center">
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] leading-relaxed">
              If you have lost your credentials, contact the System Administrator or NSS Unit Head.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center text-zinc-700 font-black text-[10px] uppercase tracking-[0.5em]">
          SECURE INFRASTRUCTURE
        </div>
      </div>
    </div>
  );
}
