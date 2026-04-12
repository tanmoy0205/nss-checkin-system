'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Send, CheckCircle, Mail, MessageSquare, User, Heart } from "lucide-react";

export default function ContactPage() {
  const { data: session } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-nss-blue-dark flex flex-col font-sans selection:bg-inspiria-yellow selection:text-nss-blue-dark relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-375 h-375 bg-inspiria-blue/20 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-375 h-375 bg-nss-red/10 rounded-full blur-[200px] translate-y-1/2 -translate-x-1/2" />

      <main className="mx-auto max-w-5xl px-6 py-32 relative z-10 grow flex flex-col">
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-black/60 border border-white/10 overflow-hidden">
          <div className="bg-nss-blue p-20 md:p-32 text-center text-white relative">
            <div className="absolute inset-0 bg-linear-to-br from-nss-blue via-nss-blue-dark to-black opacity-70" />
            <div className="relative z-10">
              <div className="flex justify-center -space-x-4 mb-12">
                <div className="h-24 w-24 bg-white rounded-4xl p-2 shadow-2xl transform -rotate-6 transition-transform hover:rotate-0">
                  <img src="/nss.png" className="h-full w-full object-contain" />
                </div>
                <div className="h-24 w-24 bg-white rounded-4xl p-2 shadow-2xl transform rotate-6 transition-transform hover:rotate-0">
                  <img src="/inspiria.png" className="h-full w-full object-contain" />
                </div>
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8">Get in Touch</h1>
              <p className="text-blue-100 max-w-2xl mx-auto text-xl font-medium leading-relaxed opacity-80">
                Have a question about NSS drives or feedback for our unit? We&apos;re here to listen and help.
              </p>
            </div>
          </div>

          <div className="p-12 md:p-20">
            {submitted ? (
              <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="h-32 w-32 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <CheckCircle className="text-green-500" size={60} />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Message Received!</h2>
                <p className="text-gray-500 mb-12 text-lg font-medium">Thank you for reaching out. Our team will get back to you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-12 py-5 bg-nss-blue text-white font-black text-lg rounded-2xl hover:bg-nss-blue-dark transition-all shadow-xl shadow-nss-blue/20 active:scale-95"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                      <input
                        type="text"
                        required
                        defaultValue={session?.user?.name || ""}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-medium"
                        placeholder="John Doe"
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
                        defaultValue={session?.user?.email || ""}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-medium"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                    <select className="w-full pl-14 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none appearance-none cursor-pointer font-medium">
                      <option>Support & Assistance</option>
                      <option>Volunteer Feedback</option>
                      <option>Report Technical Issue</option>
                      <option>Collaboration Suggestion</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-4xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none resize-none font-medium"
                    placeholder="How can we help you today?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-nss-blue text-white font-black text-xl rounded-2xl hover:bg-nss-blue-dark transition-all shadow-2xl shadow-nss-blue/20 flex items-center justify-center gap-4 group disabled:opacity-50 active:scale-95"
                >
                  {loading ? "SENDING MESSAGE..." : "SUBMIT INQUIRY"}
                  {!loading && <Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={24} />}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 text-center flex items-center justify-center gap-3 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">
          <img src="/nss.png" alt="NSS Logo" className="h-4 w-4 object-contain" />
          NSS Inspiria • Built for the Community
        </div>
      </main>
    </div>
  );
};