'use client';

import { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  PlusCircle,
  Download,
  ShieldCheck,
  Zap,
  Star,
  User as UserIcon,
  CheckCircle,
  XCircle,
  Clock3,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>({
    stats: {
      totalVolunteers: 0,
      volunteerGrowth: 0,
      totalHours: 0,
      weeklyHours: 0,
      pendingVerifications: 0,
      activeCheckins: 0,
    },
    topVolunteers: [],
    recentEvents: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        if (json.ok) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const statCards = useMemo(() => [
    { 
      label: "TOTAL VOLUNTEERS", 
      value: data.stats.totalVolunteers, 
      icon: Users, 
      color: "bg-blue-600", 
      trend: data.stats.volunteerGrowth > 0 ? `+${data.stats.volunteerGrowth} joined` : null, 
      description: "Active unit members" 
    },
    { 
      label: "TOTAL HOURS", 
      value: data.stats.totalHours, 
      icon: Clock, 
      color: "bg-nss-red", 
      trend: data.stats.weeklyHours > 0 ? `${data.stats.weeklyHours}h this week` : null, 
      description: "Collective community impact" 
    },
    { 
      label: "PENDING VERIFY", 
      value: data.stats.pendingVerifications, 
      icon: ShieldCheck, 
      color: "bg-inspiria-yellow-dark", 
      trend: data.stats.pendingVerifications > 0 ? `${data.stats.pendingVerifications} urgent` : null, 
      description: "Needs admin approval" 
    },
    { 
      label: "LIVE EVENTS", 
      value: data.stats.activeCheckins, 
      icon: Zap, 
      color: "bg-green-600", 
      trend: data.stats.activeCheckins > 0 ? `${data.stats.activeCheckins} active now` : null, 
      description: "Ongoing drives today" 
    },
  ], [data.stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-16 w-16 border-4 border-nss-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
            UNIT <span className="text-nss-blue underline decoration-nss-red decoration-8 underline-offset-8">OVERVIEW</span>
          </h1>
          <p className="text-gray-400 font-black text-xs uppercase tracking-[0.4em]">Inspiria Knowledge Campus • NSS Admin Control</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-8 py-5 bg-white border border-gray-100 rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/30 group">
            <Download size={18} className="text-nss-blue group-hover:scale-110 transition-transform" />
            Export Data
          </button>
          <Link 
            href="/admin/events?create=true" 
            className="flex items-center gap-3 px-8 py-5 bg-nss-blue text-white rounded-3xl text-xs font-black uppercase tracking-widest hover:bg-nss-blue-dark transition-all shadow-2xl shadow-nss-blue/30 group"
          >
            <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
            Host Event
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className={`absolute top-0 right-0 h-40 w-40 ${card.color} opacity-[0.03] rounded-full -mr-16 -mt-16 blur-3xl`} />
            <div className={`h-16 w-16 ${card.color} rounded-2xl flex items-center justify-center text-white shadow-2xl mb-10 group-hover:scale-110 transition-transform`}>
              <card.icon size={32} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">{card.label}</p>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-5xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">{card.value}</span>
              {card.trend && (
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest mb-1 whitespace-nowrap">
                  {card.trend}
                </span>
              )}
            </div>
            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Events Activity */}
        <div className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">RECENT EVENTS</h2>
              <div className="h-1.5 w-24 bg-nss-red rounded-full mt-2" />
            </div>
            <Link href="/admin/events" className="flex items-center gap-3 text-xs font-black text-nss-blue hover:text-nss-red uppercase tracking-widest transition-colors group">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-6 flex-1">
            {data.recentEvents.length > 0 ? (
              <div className="space-y-4">
                {data.recentEvents.map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-4xl transition-all group border border-transparent hover:border-gray-100 shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-6 overflow-hidden">
                      <div className="h-12 w-12 bg-nss-blue/5 rounded-2xl flex items-center justify-center text-nss-blue group-hover:bg-nss-blue group-hover:text-white transition-all shrink-0">
                        <Zap size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">{event.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                          <MapPin size={10} /> {event.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="px-3 py-1 bg-nss-blue/5 text-nss-blue text-[9px] font-black rounded-full border border-nss-blue/10 uppercase tracking-widest">
                        {event.category || "General"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50/30 rounded-[3rem] border-4 border-dashed border-gray-100 h-full flex flex-col items-center justify-center">
                <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mb-6 shadow-sm">
                  <ShieldCheck size={40} />
                </div>
                <p className="text-sm font-black text-gray-300 uppercase tracking-[0.3em]">No events found</p>
              </div>
            )}
          </div>

          <Link 
            href="/admin/events" 
            className="w-full mt-10 py-5 bg-gray-50 text-gray-400 hover:text-nss-blue hover:bg-nss-blue/5 border border-dashed border-gray-200 rounded-3xl transition-all font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 group"
          >
            Show More Events
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Top Volunteers (Elite Squad) */}
        <div className="bg-nss-blue-dark rounded-[4rem] p-12 shadow-2xl shadow-nss-blue/30 relative overflow-hidden flex flex-col h-full">
          <div className="absolute inset-0 bg-linear-to-br from-nss-blue via-nss-blue-dark to-black opacity-60" />
          <div className="relative z-10 flex flex-col h-full">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-12">ELITE SQUAD</h2>
            
            <div className="space-y-6 flex-1">
              {data.topVolunteers.length > 0 ? data.topVolunteers.map((v: any, i: number) => (
                <div key={v.id} className="flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                  <div className="relative shrink-0">
                    <div className="h-16 w-16 bg-nss-blue rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl border-2 border-white/10 overflow-hidden group-hover:scale-110 transition-transform">
                      {v.profile_picture ? (
                        <img 
                          src={v.profile_picture} 
                          alt={v.name}
                          className="h-full w-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(v.name)}&background=random`;
                          }}
                        />
                      ) : (
                        <span className="text-xl font-black">{i + 1}</span>
                      )}
                    </div>
                    {i === 0 && <Star size={20} className="absolute -top-3 -right-3 text-inspiria-yellow fill-inspiria-yellow animate-pulse drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-white uppercase tracking-tight leading-tight mb-1">{v.name}</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-nss-red text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-nss-red/20">
                        {v.total_hours}h IMPACT
                      </span>
                      <span className="text-[10px] font-black text-blue-100/30 uppercase tracking-[0.2em]">Rank #{i + 1}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center text-[10px] font-black border-2 transition-transform group-hover:rotate-12 ${
                      i === 0 ? "bg-inspiria-yellow/20 text-inspiria-yellow border-inspiria-yellow/30" : 
                      i === 1 ? "bg-gray-400/20 text-gray-400 border-gray-400/30" : 
                      "bg-orange-400/20 text-orange-400 border-orange-400/30"
                    }`}>
                      #{i + 1}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center">
                  <p className="text-blue-100/30 font-black uppercase tracking-widest text-xs">No data available yet</p>
                </div>
              )}
            </div>

            <Link 
              href="/admin/leaderboard"
              className="w-full mt-10 py-5 bg-white text-nss-blue-dark font-black rounded-2xl hover:bg-inspiria-yellow transition-all uppercase tracking-widest text-[10px] shadow-xl shadow-black/20 flex items-center justify-center gap-3 group"
            >
              Unit Leaderboard
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
