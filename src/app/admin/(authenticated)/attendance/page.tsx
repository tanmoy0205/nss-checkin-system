'use client';

import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export default function AdminAttendance() {
  const [pending, setPending] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [approvedToday, setApprovedToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCheckins() {
      try {
        const res = await fetch("/api/admin/attendance");
        const data = await res.json();
        if (data.ok) {
          setPending(data.pending);
          setRecent(data.recent);
          setApprovedToday(data.approvedTodayCount);
        }
      } catch (error) {
        console.error("Failed to fetch checkins:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCheckins();
  }, []);

  const handleVerify = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/admin/attendance/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      
      if (res.ok) {
        // Move item from pending to recent if verification succeeded
        const item = pending.find(p => p.id === id);
        if (item) {
          setPending(pending.filter(p => p.id !== id));
          setRecent([{ ...item, status }, ...recent].slice(0, 10));
          if (status === 'APPROVED') setApprovedToday(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-16 w-16 border-4 border-nss-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
          ATTENDANCE <span className="text-nss-blue underline decoration-nss-red decoration-8 underline-offset-8">VERIFY</span>
        </h1>
        <p className="text-gray-400 font-black text-xs uppercase tracking-[0.4em]">Review and approve volunteer activity</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center gap-6">
          <div className="h-14 w-14 bg-inspiria-yellow/10 rounded-2xl flex items-center justify-center text-inspiria-yellow-dark">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Review</p>
            <p className="text-3xl font-black text-gray-900 tabular-nums">{pending.length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center gap-6">
          <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Approved Today</p>
            <p className="text-3xl font-black text-gray-900 tabular-nums">{approvedToday}</p>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-8">
        {pending.length > 0 ? (
          pending.map((item) => (
            <div key={item.id} className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden group">
              <div className="flex flex-col lg:flex-row">
                {/* Evidence Photo */}
                <div className="lg:w-80 h-64 lg:h-auto relative bg-gray-100 overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-300 gap-3">
                      <ImageIcon size={48} />
                      <span className="text-[10px] font-black uppercase tracking-widest">No photo provided</span>
                    </div>
                  )}
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black text-nss-blue uppercase tracking-widest shadow-xl">
                    Evidence
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 p-10 md:p-14 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-nss-blue/5 rounded-2xl flex items-center justify-center text-nss-blue">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-gray-900 tracking-tight uppercase">{item.users?.name}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.users?.email}</p>
                        </div>
                      </div>
                      <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{item.events?.title}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="px-6 py-3 bg-nss-red/5 text-nss-red rounded-2xl border border-nss-red/10 text-xl font-black tabular-nums">
                        {item.hours} HOURS
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-y border-gray-50">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} className="text-nss-blue" /> Location
                      </p>
                      <p className="text-sm font-black text-gray-700 uppercase tracking-tight">{item.events?.location || "Campus Drive"}</p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} className="text-nss-blue" /> Submitted
                      </p>
                      <p className="text-sm font-black text-gray-700 uppercase tracking-tight">{new Date(item.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Volunteer Notes</p>
                      <p className="text-sm font-medium text-gray-600 italic leading-relaxed">"{item.notes}"</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      onClick={() => handleVerify(item.id, 'APPROVED')}
                      className="flex-1 py-5 bg-nss-blue text-white font-black rounded-2xl hover:bg-nss-blue-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-nss-blue/20 uppercase tracking-widest text-xs"
                    >
                      <ShieldCheck size={18} /> Approve Check-in
                    </button>
                    <button 
                      onClick={() => handleVerify(item.id, 'REJECTED')}
                      className="flex-1 py-5 bg-white text-nss-red border-2 border-nss-red/20 font-black rounded-2xl hover:bg-nss-red/5 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-40 bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-200/50">
            <div className="h-24 w-24 bg-green-50 rounded-4xl flex items-center justify-center text-green-600 mx-auto mb-8">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-4">All Caught Up!</h2>
            <p className="text-gray-400 font-black text-xs uppercase tracking-[0.3em]">No pending attendance verifications</p>
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      {recent.length > 0 && (
        <div className="space-y-12 pt-16 border-t border-gray-100">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">RECENT ACTIVITY</h2>
            <div className="h-1.5 w-24 bg-nss-blue rounded-full mt-2" />
          </div>

          <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="text-left py-8 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Volunteer</th>
                    <th className="text-left py-8 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Event</th>
                    <th className="text-center py-8 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Hours</th>
                    <th className="text-center py-8 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Date</th>
                    <th className="text-right py-8 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recent.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-8 px-10">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-white shadow-lg group-hover:scale-110 transition-transform bg-gray-100 shrink-0">
                            {activity.users?.profile_picture ? (
                              <img 
                                src={activity.users.profile_picture} 
                                alt={activity.users.name}
                                className="h-full w-full object-cover" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.users.name)}&background=random`;
                                }}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-300">
                                <User size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">{activity.users?.name}</span>
                            <span className="text-[9px] font-black text-gray-400 tracking-widest truncate">{activity.users?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-6">
                        <span className="text-sm font-black text-gray-600 uppercase tracking-tight block truncate max-w-50">
                          {activity.events?.title}
                        </span>
                      </td>
                      <td className="py-8 px-6 text-center">
                        <span className="px-4 py-1.5 bg-nss-blue/5 text-nss-blue text-xs font-black rounded-full border border-nss-blue/10">
                          {activity.hours}h
                        </span>
                      </td>
                      <td className="py-8 px-6 text-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-8 px-10 text-right">
                        {activity.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 text-[9px] font-black rounded-full border border-green-100 uppercase tracking-widest shadow-sm">
                            <CheckCircle size={12} /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-nss-red text-[9px] font-black rounded-full border border-red-100 uppercase tracking-widest shadow-sm">
                            <XCircle size={12} /> Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
