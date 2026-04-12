'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, User, Phone, BookOpen, GraduationCap, ArrowRight, Heart, Users } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    course: "",
    semester: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          course: formData.course,
          semester: formData.semester,
          gender: formData.gender,
        }),
      });

      if (res.ok) {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Account created, but failed to log in automatically.");
        } else {
          router.push("/dashboard");
        }
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nss-blue-dark flex items-center justify-center p-6 pt-32 pb-20 relative overflow-hidden font-sans">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-75 h-75 bg-inspiria-blue/20 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-75 h-75 bg-nss-red/10 rounded-full blur-[180px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-xl w-full relative z-10">
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-black/60 border border-white/10 overflow-hidden">
          <div className="bg-nss-blue p-16 text-center text-white relative">
            <div className="absolute inset-0 bg-linear-to-br from-nss-blue via-nss-blue-dark to-black opacity-70" />
            <div className="relative z-10">
              <div className="flex justify-center -space-x-4 mb-10">
                <div className="h-24 w-24 bg-white rounded-4xl p-2 shadow-2xl transform -rotate-6 transition-transform hover:rotate-0">
                  <img src="/nss.png" alt="NSS Logo" className="h-full w-full object-contain" />
                </div>
                <div className="h-24 w-24 bg-white rounded-4xl p-2 shadow-2xl transform rotate-6 transition-transform hover:rotate-0">
                  <img src="/inspiria.png" alt="Inspiria Logo" className="h-full w-full object-contain" />
                </div>
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-4">Join the Unit</h1>
              <p className="text-blue-200 text-xs font-black uppercase tracking-[0.4em]">Become an NSS Volunteer</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-3xl text-sm font-black border border-red-100 animate-in fade-in zoom-in duration-300 flex items-center gap-4">
                <div className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-medium"
                    placeholder="Robin Hood"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-medium"
                    placeholder="robin@inspiria.edu.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                  <input
                    type="tel"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-medium"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Course</label>
                <div className="relative group">
                  <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-medium"
                    placeholder="BCA / BBA / Media"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Semester</label>
                <div className="relative group">
                  <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-medium"
                    placeholder="1st / 3rd / 5th"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                <div className="relative group">
                  <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                  <select
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-medium appearance-none"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-medium"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-medium"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-nss-blue text-white font-black text-lg rounded-2xl hover:bg-nss-blue-dark transition-all shadow-xl shadow-nss-blue/20 flex items-center justify-center gap-3 group disabled:opacity-50 active:scale-95"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-4 text-gray-400 tracking-[0.3em] font-black">Or Register With</span></div>
            </div>

            <button
              type="button"
              onClick={() => signIn("google")}
              className="w-full py-4 border-2 border-gray-100 text-gray-700 font-black text-sm rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-4 group"
            >
              <svg className="h-5 w-5 transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              CONTINUE WITH GOOGLE
            </button>
          </form>

          <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
              Already a Volunteer?{" "}
              <Link href="/auth/login" className="text-nss-red hover:underline ml-2">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-center flex items-center justify-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
          <img src="/nss.png" alt="NSS Logo" className="h-4 w-4 object-contain" />
          Serving with Pride
        </div>
      </div>
    </div>
  );
}
