'use client';

import { useState, useEffect } from "react";
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  Search,
  User as UserIcon,
  Award,
  ArrowUpRight,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function AdminLeaderboard() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/admin/users"); // Reuse users API
        const data = await res.json();
        if (data.ok) {
          // Sort by hours descending
          const sorted = data.users.sort((a: any, b: any) => (b.total_hours || 0) - (a.total_hours || 0));
          setVolunteers(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const filteredVolunteers = volunteers.filter(v => 
    v.name?.toLowerCase().includes(search.toLowerCase()) || 
    v.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-16 w-16 border-4 border-nss-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const topThree = filteredVolunteers.slice(0, 3);
  const theRest = filteredVolunteers.slice(3);

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
            UNIT <span className="text-nss-blue underline decoration-nss-red decoration-8 underline-offset-8">LEADERBOARD</span>
          </h1>
          <p className="text-gray-400 font-black text-xs uppercase tracking-[0.4em]">Recognizing excellence in community service</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-4xl border border-gray-100 shadow-xl shadow-gray-200/40 w-full md:w-96 group focus-within:ring-4 focus-within:ring-nss-blue/5 transition-all">
          <div className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-focus-within:text-nss-blue transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="SEARCH VOLUNTEER..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-black text-[10px] uppercase tracking-widest text-gray-700 placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Podium Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end pt-20">
        {/* Silver - Rank 2 */}
        {topThree[1] && (
          <div className="order-2 md:order-1 bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-2xl relative pt-20 group hover:-translate-y-2 transition-all duration-500">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="h-28 w-28 rounded-4xl bg-gray-100 border-4 border-white shadow-2xl overflow-hidden">
                  {topThree[1].profile_picture ? (
                    <img 
                      src={topThree[1].profile_picture} 
                      alt={topThree[1].name}
                      className="h-full w-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[1].name)}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300"><UserIcon size={32} /></div>
                  )}
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-10 w-10 bg-gray-200 rounded-xl flex items-center justify-center border-4 border-white shadow-xl">
                  <Medal size={20} className="text-gray-500" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight truncate">{topThree[1].name}</h3>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <Clock size={14} className="text-gray-400" />
                <span className="text-lg font-black text-gray-700 tabular-nums">{topThree[1].total_hours}h</span>
              </div>
            </div>
          </div>
        )}

        {/* Gold - Rank 1 */}
        {topThree[0] && (
          <div className="order-1 md:order-2 bg-nss-blue-dark rounded-[4rem] p-12 shadow-2xl shadow-nss-blue/30 relative pt-28 group hover:-translate-y-4 transition-all duration-500">
            <div className="absolute inset-0 bg-linear-to-br from-nss-blue via-nss-blue-dark to-black opacity-60 rounded-[4rem]" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10">
              <div className="relative">
                <div className="h-36 w-32 rounded-[2.5rem] bg-nss-blue border-4 border-white shadow-2xl overflow-hidden">
                  {topThree[0].profile_picture ? (
                    <img 
                      src={topThree[0].profile_picture} 
                      alt={topThree[0].name}
                      className="h-full w-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[0].name)}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white/30"><UserIcon size={48} /></div>
                  )}
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 h-14 w-14 bg-inspiria-yellow rounded-2xl flex items-center justify-center border-4 border-nss-blue-dark shadow-2xl rotate-12">
                  <Trophy size={28} className="text-nss-blue-dark" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-6 relative z-10">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter truncate">{topThree[0].name}</h3>
              <div className="inline-flex flex-col items-center gap-1">
                <div className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
                  <span className="text-4xl font-black text-inspiria-yellow tabular-nums">{topThree[0].total_hours}</span>
                  <span className="ml-2 text-xs font-black text-blue-100 uppercase tracking-widest">Impact Hours</span>
                </div>
                <p className="text-[10px] font-black text-blue-100/40 uppercase tracking-[0.4em] mt-4">Unit Champion</p>
              </div>
            </div>
          </div>
        )}

        {/* Bronze - Rank 3 */}
        {topThree[2] && (
          <div className="order-3 bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-2xl relative pt-20 group hover:-translate-y-2 transition-all duration-500">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="h-28 w-28 rounded-4xl bg-gray-100 border-4 border-white shadow-2xl overflow-hidden">
                  {topThree[2].profile_picture ? (
                    <img 
                      src={topThree[2].profile_picture} 
                      alt={topThree[2].name}
                      className="h-full w-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topThree[2].name)}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300"><UserIcon size={32} /></div>
                  )}
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center border-4 border-white shadow-xl">
                  <Medal size={20} className="text-orange-600" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight truncate">{topThree[2].name}</h3>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <Clock size={14} className="text-gray-400" />
                <span className="text-lg font-black text-gray-700 tabular-nums">{topThree[2].total_hours}h</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* List Table */}
      <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-nss-red/5 rounded-xl flex items-center justify-center text-nss-red">
              <Star size={20} />
            </div>
            <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Volunteer Rankings</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <TrendingUp size={14} className="text-green-500" /> Real-time Update
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left py-8 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Rank</th>
                <th className="text-left py-8 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Volunteer</th>
                <th className="text-center py-8 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Achievement</th>
                <th className="text-right py-8 px-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Total Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredVolunteers.map((volunteer, index) => (
                <tr key={volunteer.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-10 px-10">
                    <span className={`text-2xl font-black transition-colors tabular-nums ${
                      index === 0 ? "text-inspiria-yellow" : 
                      index === 1 ? "text-gray-400" : 
                      index === 2 ? "text-orange-400" : 
                      "text-gray-200 group-hover:text-nss-blue"
                    }`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="py-10 px-6">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                        {volunteer.profile_picture ? (
                          <img 
                            src={volunteer.profile_picture} 
                            alt={volunteer.name}
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(volunteer.name)}&background=random`;
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300">
                            <UserIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-900 tracking-tight">{volunteer.name}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{volunteer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-10 px-6 text-center">
                    {(volunteer.total_hours || 0) > 50 ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-inspiria-yellow/10 text-inspiria-yellow-dark text-[9px] font-black rounded-full border border-inspiria-yellow/20 uppercase tracking-widest">
                        <Award size={12} /> Elite Volunteer
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-nss-blue text-[9px] font-black rounded-full border border-blue-100 uppercase tracking-widest">
                        Active Member
                      </span>
                    )}
                  </td>
                  <td className="py-10 px-10 text-right">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors">
                      <span className="text-2xl font-black text-gray-900 tabular-nums">{volunteer.total_hours}</span>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">HRS</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredVolunteers.length === 0 && (
            <div className="text-center py-32 bg-gray-50/30">
              <div className="h-24 w-24 bg-white rounded-4xl flex items-center justify-center text-gray-200 mx-auto mb-8 shadow-sm">
                <Star size={48} />
              </div>
              <p className="text-sm font-black text-gray-300 uppercase tracking-[0.4em]">No volunteers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
