'use client';

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, Camera, FileText, Send, CheckCircle, ArrowLeft, X, UploadCloud, Heart, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CheckInContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const [formData, setFormData] = useState({
    eventName: "",
    activityType: "Environment",
    location: "",
    hours: "1",
    notes: ""
  });

  useEffect(() => {
    // Redirect Admin to Admin Portal if they try to access checkin
    if (session?.user && (session.user as any).role === "ADMIN") {
      router.push("/admin");
    }
  }, [session, router]);

  // Handle QR Auto-fill from URL params
  useEffect(() => {
    const eventId = searchParams.get('eventId');
    if (eventId) {
      const fetchEventDetails = async () => {
        try {
          const res = await fetch(`/api/events?id=${eventId}`);
          const data = await res.json();
          if (data.ok && data.event) {
            setFormData({
              eventName: data.event.title,
              activityType: data.event.category || "General",
              location: data.event.location,
              hours: data.event.hours_granted.toString(),
              notes: ""
            });
            setIsAutoFilled(true);
          }
        } catch (error) {
          console.error("Failed to auto-fill event details:", error);
        }
      };
      fetchEventDetails();
    }
  }, [searchParams]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", image);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        const uploadData = await uploadRes.json();
        
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || "Failed to upload photo");
        }

        imageUrl = uploadData.url;
      }

      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          userId: (session?.user as any)?.id,
          eventId: searchParams.get('eventId') // Track the specific event
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || "Failed to submit check-in"}`);
      }
    } catch (error: any) {
      console.error("Check-in error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <main className="mx-auto max-w-xl px-4 py-24 text-center">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-12">
            <div className="h-24 w-24 bg-blue-50 rounded-4xl flex items-center justify-center mx-auto mb-8">
              <Calendar className="text-nss-blue" size={48} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Access Restricted</h1>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">You must be logged in to submit a check-in. This helps us track your volunteer hours accurately.</p>
            <Link 
              href="/auth/login"
              className="block w-full py-5 bg-nss-blue text-white font-black rounded-2xl hover:bg-nss-blue-dark transition-all shadow-xl shadow-nss-blue/20 uppercase tracking-widest"
            >
              Login to Continue
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-nss-red selection:text-white">
      <main className="mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="bg-nss-blue p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-nss-blue via-nss-blue-dark to-black opacity-60" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">Event Check-In</h1>
              <p className="text-blue-100 max-w-lg mx-auto font-medium text-lg opacity-80">Submit your attendance for today&apos;s drive and share your impact.</p>
            </div>
          </div>

          <div className="p-10 md:p-20">
            {submitted ? (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="h-32 w-32 bg-green-50 rounded-4xl flex items-center justify-center mx-auto mb-10 border-4 border-green-100">
                  <CheckCircle className="text-green-500" size={64} />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">Check-In Successful!</h2>
                <p className="text-gray-500 mb-12 font-medium text-lg">Your attendance has been recorded. Great job, volunteer!</p>
                <div className="flex flex-col sm:flex-row gap-6 max-w-md mx-auto">
                  <Link 
                    href="/profile"
                    className="grow py-5 bg-nss-blue text-white font-black rounded-2xl hover:bg-nss-blue-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-nss-blue/20 uppercase tracking-widest"
                  >
                    <ArrowLeft size={20} />
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ eventName: "", activityType: "Environment", location: "", hours: "1", notes: "" });
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="grow py-5 bg-gray-50 text-gray-700 font-black rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 uppercase tracking-widest"
                  >
                    New Check-In
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1">Event Details</label>
                  <div className="space-y-6">
                    <div className="relative group">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        required
                        readOnly
                        value={formData.eventName}
                        className="w-full pl-14 pr-6 py-4 border border-gray-100 rounded-2xl bg-blue-50/30 cursor-not-allowed outline-none font-black text-gray-700"
                        placeholder="Event Name"
                      />
                      {isAutoFilled && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[8px] font-black text-nss-blue uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                          <ShieldCheck size={12} /> Fixed by Admin
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <select 
                          value={formData.activityType}
                          disabled
                          className="w-full px-6 py-4 border border-gray-100 rounded-2xl bg-blue-50/30 cursor-not-allowed outline-none font-black text-gray-700 appearance-none opacity-100"
                        >
                          <option>Environment</option>
                          <option>Education</option>
                          <option>Health</option>
                          <option>Social Awareness</option>
                          <option>General</option>
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-nss-blue">
                          <ShieldCheck size={18} />
                        </div>
                      </div>

                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          required
                          readOnly
                          value={formData.location}
                          className="w-full pl-14 pr-6 py-4 border border-gray-100 rounded-2xl bg-blue-50/30 cursor-not-allowed outline-none font-black text-gray-700"
                          placeholder="Location"
                        />
                        {isAutoFilled && (
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[8px] font-black text-nss-blue uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                            <ShieldCheck size={12} /> Fixed
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative group">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        required
                        readOnly
                        value={formData.hours}
                        className="w-full pl-14 pr-6 py-4 border border-gray-100 rounded-2xl bg-blue-50/30 cursor-not-allowed outline-none font-black text-gray-700"
                        placeholder="Hours"
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[8px] font-black text-nss-blue uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                        <ShieldCheck size={12} /> Fixed by Admin
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1">Drive Evidence</label>
                  <div className="relative">
                    {!imagePreview ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-48 border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-nss-blue/20 transition-all cursor-pointer group shadow-inner"
                      >
                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-nss-blue shadow-sm mb-4 transition-all group-hover:scale-110">
                          <UploadCloud size={32} />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-nss-blue transition-colors text-center px-6">
                          Click to upload or drag & drop drive photo
                        </p>
                      </div>
                    ) : (
                      <div className="relative h-64 w-full rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-700" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={removeImage}
                            className="p-4 bg-white text-nss-red rounded-2xl shadow-2xl hover:bg-nss-red hover:text-white transition-all font-black flex items-center gap-3 uppercase text-xs tracking-widest"
                          >
                            <X size={20} /> Remove Photo
                          </button>
                        </div>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1">Reflections</label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-5 text-gray-400 group-focus-within:text-nss-blue transition-colors" size={18} />
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none resize-none font-black text-gray-700"
                      placeholder="What did you achieve today? Share your thoughts..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-nss-blue text-white font-black rounded-2xl hover:bg-nss-blue-dark transition-all shadow-2xl shadow-nss-blue/30 flex items-center justify-center gap-4 group disabled:opacity-50 uppercase tracking-tighter text-xl active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      SUBMITTING...
                    </>
                  ) : (
                    <>
                      SUBMIT CHECK-IN
                      <Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={24} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default function CheckInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-nss-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckInContent />
    </Suspense>
  );
}
