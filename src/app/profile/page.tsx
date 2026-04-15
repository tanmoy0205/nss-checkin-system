'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, CreditCard, CheckCircle, Clock, Award, Calendar, Phone, BookOpen, GraduationCap, Edit2, Save, X, ShieldCheck, XCircle, Heart, UserCircle, Fingerprint, MapPin, ArrowRight } from "lucide-react";
import { ProfileImage } from "@/components/ui/ProfileImage";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    course: "",
    semester: "",
    gender: "",
    caste: "",
    hobbies: "",
  });

  useEffect(() => {
    // Redirect Admin to Admin Portal if they try to access volunteer profile
    if (session?.user && (session.user as any).role === "ADMIN") {
      router.push("/admin");
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data.ok) {
          setUser(data.user);
          setFormData({
            phone: data.user.phone || "",
            course: data.user.course || "",
            semester: data.user.semester || "",
            gender: data.user.gender || "",
            caste: data.user.caste || "",
            hobbies: data.user.hobbies || "",
          });
        }

        const historyRes = await fetch("/api/user/attendance");
        const historyData = await historyRes.json();
        if (historyData.ok) {
          setHistory(historyData.attendance || []);
        }

        // Fetch My Registered Drives
        const regsRes = await fetch("/api/user/registrations");
        const regsData = await regsRes.json();
        if (regsData.ok) {
          setMyRegistrations(regsData.registrations || []);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch("/api/user/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setUser({ ...user, ...formData });
        setEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-nss-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profileData = {
    name: user?.name || "Volunteer",
    email: user?.email || "",
    gender: user?.gender || "Not Set",
    volunteerId: user?.id?.slice(0, 8).toUpperCase() || "NSS-NEW",
    totalCheckins: user?.total_checkins || 0,
    totalHours: user?.total_hours || 0,
    milestones: (user?.milestones as string[]) || ["New Volunteer"],
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-nss-red selection:text-white">
      <main className="mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-32">
              <div className="bg-nss-blue-dark h-40 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-nss-blue via-nss-blue-dark to-black opacity-60" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
              </div>
              <div className="px-10 pb-12">
                <div className="relative -mt-20 mb-10">
                  <div className="h-40 w-40 bg-white rounded-[2.5rem] p-2 shadow-2xl mx-auto border-4 border-white overflow-hidden group">
                    <ProfileImage 
                      src={user?.profile_picture} 
                      alt={profileData.name} 
                      className="h-full w-full object-cover rounded-4xl" 
                      size={64}
                    />
                  </div>
                </div>
                
                <div className="text-center space-y-2 mb-12">
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight">{profileData.name}</h1>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-nss-blue font-black text-sm">{profileData.email}</p>
                    <span className="px-4 py-1 bg-nss-blue/5 text-nss-blue text-[10px] font-black rounded-full border border-nss-blue/10 uppercase tracking-[0.2em]">
                      {profileData.gender}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-nss-blue shadow-sm">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Volunteer ID</p>
                      <p className="text-lg font-black text-gray-900 tracking-tight">{profileData.volunteerId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 shadow-sm text-center">
                      <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-nss-blue mx-auto mb-4 shadow-sm">
                        <CheckCircle size={20} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-ins</p>
                      <p className="text-3xl font-black text-nss-blue tabular-nums">{profileData.totalCheckins}</p>
                    </div>
                    <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 shadow-sm text-center">
                      <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-nss-red mx-auto mb-4 shadow-sm">
                        <Clock size={20} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hours</p>
                      <p className="text-3xl font-black text-nss-red tabular-nums">{profileData.totalHours}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-xs font-black text-gray-400 mb-6 flex items-center gap-3 uppercase tracking-[0.4em]">
                    <Award size={18} className="text-inspiria-yellow" />
                    Milestones
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {profileData.milestones.map((m: string, i: number) => (
                      <span key={i} className="px-5 py-2 bg-inspiria-yellow/5 text-inspiria-yellow-dark text-[10px] font-black rounded-full border border-inspiria-yellow/10 uppercase tracking-widest">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details & History */}
          <div className="lg:col-span-8 space-y-12">
            {/* User Details Form */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden p-10 md:p-14">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter">VOLUNTEER INFO</h2>
                  <div className="h-1.5 w-20 bg-nss-red rounded-full mt-2" />
                </div>
                {!editing ? (
                  <button 
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-nss-blue hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-3 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                      <X size={16} /> Cancel
                    </button>
                    <button 
                      onClick={handleUpdateProfile}
                      className="flex items-center gap-3 px-6 py-3 bg-nss-blue text-white hover:bg-nss-blue-dark rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
                    >
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Phone size={14} className="text-nss-blue" /> Phone Number
                  </label>
                  <input
                    type="text"
                    disabled={!editing}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-black text-gray-700 disabled:opacity-70 disabled:bg-gray-50/50"
                    placeholder="Not provided"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <UserCircle size={14} className="text-nss-blue" /> Gender
                  </label>
                  <select
                    disabled={!editing}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-black text-gray-700 disabled:opacity-70 disabled:bg-gray-50/50"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Fingerprint size={14} className="text-nss-blue" /> Caste / Category
                  </label>
                  <select
                    disabled={!editing}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-black text-gray-700 disabled:opacity-70 disabled:bg-gray-50/50"
                    value={formData.caste}
                    onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                  >
                    <option value="">Select Caste</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <BookOpen size={14} className="text-nss-blue" /> Course
                  </label>
                  <input
                    type="text"
                    disabled={!editing}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-black text-gray-700 disabled:opacity-70 disabled:bg-gray-50/50"
                    placeholder="e.g. BCA"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <GraduationCap size={14} className="text-nss-blue" /> Semester
                  </label>
                  <input
                    type="text"
                    disabled={!editing}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-black text-gray-700 disabled:opacity-70 disabled:bg-gray-50/50"
                    placeholder="e.g. 3rd"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <img src="/nss.png" alt="NSS Logo" className="h-4 w-4 object-contain" /> Your Hobbies & Interests
                </label>
                <textarea
                  disabled={!editing}
                  rows={3}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white transition-all outline-none font-black text-gray-700 disabled:opacity-70 disabled:bg-gray-50/50 resize-none"
                  placeholder="Tell us what you love to do... (e.g. Photography, Teaching, Planting)"
                  value={formData.hobbies}
                  onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                />
              </div>
            </div>

            {/* My Registered Drives */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden p-10 md:p-14 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-nss-blue/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-end justify-between mb-12 relative z-10">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                    <Calendar size={32} className="text-nss-blue" />
                    MY REGISTERED DRIVES
                  </h2>
                  <div className="h-1.5 w-24 bg-nss-blue rounded-full mt-2" />
                </div>
              </div>

              {myRegistrations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  {myRegistrations.map((event, i) => {
                    const isCompleted = new Date(event.date) < new Date();
                    return (
                      <div key={i} className="group bg-gray-50 rounded-[2.5rem] border border-gray-100 p-10 hover:bg-white hover:shadow-2xl transition-all">
                        <div className="flex items-center justify-between mb-8">
                          <div className="px-4 py-1.5 bg-nss-blue/10 text-nss-blue rounded-full text-[9px] font-black uppercase tracking-widest border border-nss-blue/10">
                            {event.category || 'General'}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 font-black text-[9px] uppercase tracking-widest">
                            <Clock size={12} className="text-nss-red" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-6 tracking-tight uppercase leading-tight group-hover:text-nss-blue transition-colors truncate">{event.title}</h4>
                        <div className="space-y-3 mb-10">
                          <div className="flex items-center gap-3 text-gray-500">
                            <MapPin size={16} className="text-nss-blue shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-widest truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-500">
                            <Award size={16} className="text-nss-red shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{event.hours_granted} HOURS</span>
                          </div>
                        </div>
                        
                        {isCompleted ? (
                          <Link 
                            href={`/checkin?eventId=${event.id}`}
                            className="w-full py-5 bg-nss-blue text-white font-black rounded-2xl hover:bg-nss-blue-dark transition-all text-center uppercase tracking-widest text-[10px] shadow-lg shadow-nss-blue/20 flex items-center justify-center gap-2"
                          >
                            CHECK-IN NOW <ArrowRight size={14} />
                          </Link>
                        ) : (
                          <div className="w-full py-5 bg-white border border-gray-100 text-gray-300 font-black rounded-2xl text-center uppercase tracking-widest text-[9px]">
                            UPCOMING EVENT
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                  <p className="text-gray-400 font-black uppercase tracking-[0.3em]">No registered drives found.</p>
                </div>
              )}
            </div>

            {/* History Table */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden p-10 md:p-14">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                    <Calendar size={32} className="text-nss-blue" />
                    CHECK-IN HISTORY
                  </h2>
                  <div className="h-1.5 w-24 bg-nss-blue rounded-full mt-2" />
                </div>
              </div>
              
              {history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-6 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Date</th>
                        <th className="text-left py-6 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Event</th>
                        <th className="text-left py-6 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Status</th>
                        <th className="text-right py-6 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {history.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors group">
                          <td className="py-8 px-4 text-xs font-black text-gray-500 whitespace-nowrap">{new Date(row.created_at).toLocaleDateString()}</td>
                          <td className="py-8 px-4">
                            <div className="flex flex-col">
                              <span className="text-lg font-black text-nss-blue group-hover:text-nss-red transition-colors truncate max-w-50 md:max-w-xs">{row.events?.title}</span>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{row.events?.location}</span>
                            </div>
                          </td>
                          <td className="py-8 px-4">
                            {row.status === 'APPROVED' ? (
                              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 text-[9px] font-black rounded-full border border-green-100 uppercase tracking-widest shadow-sm">
                                <ShieldCheck size={12} /> Approved
                              </span>
                            ) : row.status === 'REJECTED' ? (
                              <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-[9px] font-black rounded-full border border-red-100 uppercase tracking-widest shadow-sm">
                                <XCircle size={12} /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-4 py-2 bg-inspiria-yellow/5 text-inspiria-yellow-dark text-[9px] font-black rounded-full border border-inspiria-yellow/10 uppercase tracking-widest shadow-sm">
                                <Clock size={12} /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-8 px-4 text-right">
                            <span className="inline-flex px-5 py-2 bg-nss-blue/5 text-nss-blue text-xs font-black rounded-full border border-nss-blue/10">
                              {row.hours}h
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                  <p className="text-gray-400 font-black uppercase tracking-[0.3em]">No check-ins found yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
