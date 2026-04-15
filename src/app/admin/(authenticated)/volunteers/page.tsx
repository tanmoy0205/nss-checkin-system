'use client';

import { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  ExternalLink,
  Filter,
  MoreVertical,
  Fingerprint,
  VenetianMask,
  X,
  Award,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  Heart,
  XCircle
} from "lucide-react";
import { ProfileImage } from "@/components/ui/ProfileImage";

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  async function fetchVolunteers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.ok) {
        setVolunteers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch volunteers:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchVolunteerDetails = async (id: string) => {
    setIsFetchingDetails(true);
    try {
      const res = await fetch(`/api/admin/users?id=${id}`);
      const data = await res.json();
      if (data.ok) {
        setSelectedVolunteer(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch volunteer details:", error);
    } finally {
      setIsFetchingDetails(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleEdit = (volunteer: any) => {
    setEditData({
      id: volunteer.id,
      name: volunteer.name || "",
      email: volunteer.email || "",
      phone: volunteer.phone || "",
      course: volunteer.course || "",
      semester: volunteer.semester || "",
      gender: volunteer.gender || "",
      caste: volunteer.caste || "",
      hobbies: volunteer.hobbies || "",
    });
    setIsEditing(true);
    setActiveMenu(null);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setIsEditing(false);
        if (selectedVolunteer?.id === editData.id) {
          setSelectedVolunteer({ ...selectedVolunteer, ...editData });
        }
        setEditData(null);
        fetchVolunteers();
      }
    } catch (error) {
      console.error("Failed to update volunteer:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsDeleting(false);
        setSelectedVolunteer(null);
        fetchVolunteers();
      }
    } catch (error) {
      console.error("Failed to delete volunteer:", error);
    }
  };

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(v => 
      v.name?.toLowerCase().includes(search.toLowerCase()) || 
      v.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [volunteers, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-16 w-16 border-4 border-nss-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-8 animate-in fade-in duration-700 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 shrink-0">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2 uppercase">
            VOLUNTEER <span className="text-nss-blue underline decoration-nss-red decoration-4 underline-offset-4">ROSTER</span>
          </h1>
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">Manage and track your unit members</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-1.5 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 w-full md:w-80 group focus-within:ring-4 focus-within:ring-nss-blue/5 transition-all">
          <div className="h-10 w-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-focus-within:text-nss-blue transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="SEARCH BY NAME OR EMAIL..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-black text-[9px] uppercase tracking-widest text-gray-700 placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="flex-1 bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col min-h-0 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-nss-blue/5 rounded-xl flex items-center justify-center text-nss-blue">
              <Users size={20} />
            </div>
            <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{filteredVolunteers.length} Members Enrolled</span>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all">
            <Filter size={14} /> Filter List
          </button>
        </div>

        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50/80 backdrop-blur-md">
                <th className="text-left py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100">Volunteer Details</th>
                <th className="text-left py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100">Contact</th>
                <th className="text-left py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100">Academic</th>
                <th className="text-left py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100">Gender & Caste</th>
                <th className="text-center py-6 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100">Total Hours</th>
                <th className="text-right py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="py-8 px-8">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform shrink-0">
                        <ProfileImage 
                          src={volunteer.profile_picture} 
                          alt={volunteer.name}
                          className="h-full w-full object-cover" 
                          size={20}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-base font-black text-gray-900 tracking-tight">{volunteer.name || "Unnamed"}</span>
                        <span className="text-[9px] font-black text-nss-blue uppercase tracking-widest opacity-50">{volunteer.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 text-[11px] font-black text-gray-500 group-hover:text-nss-blue transition-colors truncate">
                        <Mail size={12} className="opacity-50 shrink-0" /> {volunteer.email}
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-black text-gray-500 truncate">
                        <Phone size={12} className="opacity-50 shrink-0" /> {volunteer.phone || "Not Set"}
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 text-[11px] font-black text-gray-500 truncate">
                        <BookOpen size={12} className="opacity-50 text-nss-red shrink-0" /> {volunteer.course || "N/A"}
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-black text-gray-500 truncate">
                        <GraduationCap size={12} className="opacity-50 text-nss-red shrink-0" /> {volunteer.semester || "N/A"} SEM
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 text-[11px] font-black text-gray-500">
                        <VenetianMask size={12} className="opacity-50 text-nss-blue shrink-0" /> {volunteer.gender || "Not Set"}
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] font-black text-gray-500">
                        <Fingerprint size={12} className="opacity-50 text-nss-blue shrink-0" /> {volunteer.caste || "Not Set"}
                      </div>
                    </div>
                  </td>
                  <td className="py-8 px-6 text-center">
                    <div className="inline-flex flex-col items-center p-3 bg-nss-blue/5 rounded-2xl border border-nss-blue/10 min-w-16">
                      <span className="text-xl font-black text-nss-blue tabular-nums leading-none">{volunteer.total_hours || 0}</span>
                      <span className="text-[7px] font-black text-nss-blue/40 uppercase tracking-widest mt-1">HRS</span>
                    </div>
                  </td>
                  <td className="py-8 px-8 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => fetchVolunteerDetails(volunteer.id)}
                        className="p-3 bg-gray-50 hover:bg-nss-blue hover:text-white rounded-xl text-gray-400 transition-all shadow-sm group/btn"
                      >
                        <ExternalLink size={16} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === volunteer.id ? null : volunteer.id)}
                          className={`p-3 rounded-xl transition-all shadow-sm ${activeMenu === volunteer.id ? 'bg-nss-blue text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-400'}`}
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {activeMenu === volunteer.id && (
                          <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in duration-200">
                            <button 
                              onClick={() => handleEdit(volunteer)}
                              className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                            >
                              <Edit size={14} className="text-nss-blue" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                            </button>
                            <button 
                              onClick={() => {
                                fetchVolunteerDetails(volunteer.id);
                                setIsDeleting(true);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-red-50 text-nss-red transition-colors"
                            >
                              <Trash2 size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredVolunteers.length === 0 && (
            <div className="text-center py-20 bg-gray-50/30">
              <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6 shadow-sm">
                <Users size={40} />
              </div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">No volunteers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Volunteer Details Modal */}
      {(selectedVolunteer || isFetchingDetails) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-nss-blue-dark/60 backdrop-blur-md" onClick={() => setSelectedVolunteer(null)} />
          
          {isFetchingDetails ? (
            <div className="relative h-64 w-64 bg-white rounded-[3rem] flex items-center justify-center shadow-2xl">
              <div className="h-16 w-16 border-4 border-nss-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="relative w-full max-w-4xl bg-gray-50 rounded-[3.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] animate-in slide-in-from-bottom-8 duration-500">
              {/* Left Column: Profile Card */}
              <div className="w-full md:w-80 bg-white border-r border-gray-100 flex flex-col shrink-0">
              <div className="relative shrink-0">
                <div className="h-32 bg-nss-blue-dark relative">
                  <div className="absolute inset-0 bg-linear-to-br from-nss-blue to-black opacity-40" />
                  <button 
                    onClick={() => setSelectedVolunteer(null)}
                    className="absolute top-6 left-6 h-10 w-10 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center backdrop-blur-md transition-all z-10"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
                  <div className="h-32 w-32 bg-white rounded-4xl p-1.5 shadow-2xl border-4 border-white overflow-hidden group">
                    <ProfileImage 
                      src={selectedVolunteer.profile_picture} 
                      alt={selectedVolunteer.name}
                      className="h-full w-full object-cover rounded-3xl group-hover:scale-110 transition-transform duration-500" 
                      size={40}
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-8 pt-20 pb-10 flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <div className="text-center space-y-2 mb-8">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none uppercase">{selectedVolunteer.name}</h3>
                  <div className="flex flex-col items-center gap-1.5">
                    <p className="text-[10px] font-black text-nss-blue tracking-widest">{selectedVolunteer.email}</p>
                    <span className="px-4 py-1 bg-nss-blue/5 text-nss-blue text-[9px] font-black rounded-full border border-nss-blue/10 uppercase tracking-[0.2em]">
                      {selectedVolunteer.gender}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Volunteer ID</p>
                    <p className="text-sm font-black text-gray-900 tracking-widest">{selectedVolunteer.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-center">
                      <CheckCircle size={16} className="text-nss-blue mx-auto mb-2" />
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-ins</p>
                      <p className="text-xl font-black text-nss-blue tabular-nums leading-none">
                        {selectedVolunteer.checkins?.filter((c: any) => c.status === 'APPROVED').length || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 text-center">
                      <Clock size={16} className="text-nss-red mx-auto mb-2" />
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Hours</p>
                      <p className="text-xl font-black text-nss-red tabular-nums leading-none">{selectedVolunteer.total_hours}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                    <Award size={14} className="text-inspiria-yellow" /> Milestones
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteer.total_hours >= 3 && (
                      <span className="px-3 py-1.5 bg-inspiria-yellow/5 text-inspiria-yellow-dark text-[8px] font-black rounded-full border border-inspiria-yellow/10 uppercase tracking-widest">
                        First Drive
                      </span>
                    )}
                    {selectedVolunteer.total_hours >= 120 && (
                      <span className="px-3 py-1.5 bg-nss-blue/5 text-nss-blue text-[8px] font-black rounded-full border border-nss-blue/10 uppercase tracking-widest">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details & Activity */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="p-10 flex-1 overflow-auto space-y-12 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {/* Information Section */}
                <section className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">PERSONAL INFO</h2>
                      <div className="h-1 w-16 bg-nss-red rounded-full mt-2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Phone size={12} className="text-nss-blue" /> Phone Number
                      </p>
                      <p className="text-sm font-black text-gray-700">{selectedVolunteer.phone || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Fingerprint size={12} className="text-nss-blue" /> Caste / Category
                      </p>
                      <p className="text-sm font-black text-gray-700">{selectedVolunteer.caste || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <BookOpen size={12} className="text-nss-blue" /> Course
                      </p>
                      <p className="text-sm font-black text-gray-700">{selectedVolunteer.course || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <GraduationCap size={12} className="text-nss-blue" /> Semester
                      </p>
                      <p className="text-sm font-black text-gray-700">{selectedVolunteer.semester || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <img src="/nss.png" alt="NSS Logo" className="h-4 w-4 object-contain" /> Hobbies & Interests
                    </p>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                      {selectedVolunteer.hobbies ? `"${selectedVolunteer.hobbies}"` : "No hobbies shared yet."}
                    </p>
                  </div>
                </section>

                {/* Activity History */}
                <section className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">RECENT ACTIVITY</h2>
                    <div className="h-1 w-16 bg-nss-blue rounded-full mt-2" />
                  </div>
                  <div className="space-y-4">
                    {selectedVolunteer.checkins?.length > 0 ? (
                      selectedVolunteer.checkins.slice(0, 5).map((checkin: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                              checkin.status === 'APPROVED' ? 'bg-green-50 text-green-600 border border-green-100' : 
                              checkin.status === 'REJECTED' ? 'bg-red-50 text-nss-red border border-red-100' : 
                              'bg-inspiria-yellow/10 text-inspiria-yellow-dark border border-inspiria-yellow/20'
                            }`}>
                              {checkin.status === 'APPROVED' ? <CheckCircle size={18} /> : 
                               checkin.status === 'REJECTED' ? <XCircle size={18} /> : <Clock size={18} />}
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                {checkin.created_at ? new Date(checkin.created_at).toLocaleDateString() : "No Date"}
                              </p>
                              <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{checkin.events?.title || "Unknown Event"}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-nss-blue tabular-nums">{checkin.hours}H</span>
                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-0.5">{checkin.status}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-gray-100/50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No recent activity found</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
              {/* Footer Actions */}
              <div className="p-8 bg-white border-t border-gray-100 flex gap-4 shrink-0">
                <button 
                  onClick={() => handleEdit(selectedVolunteer)}
                  className="flex-1 py-4 bg-gray-50 hover:bg-nss-blue hover:text-white rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group"
                >
                  <Edit size={14} className="group-hover:scale-110 transition-transform" /> Edit Profile
                </button>
                <button 
                  onClick={() => setIsDeleting(true)}
                  className="flex-1 py-4 bg-red-50 text-nss-red hover:bg-nss-red hover:text-white rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group"
                >
                  <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> Delete Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

      {/* Edit Volunteer Modal */}
      {isEditing && editData && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-nss-blue-dark/60 backdrop-blur-md" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">EDIT VOLUNTEER</h2>
                <div className="h-1 w-16 bg-nss-blue rounded-full mt-2" />
              </div>
              <button onClick={() => setIsEditing(false)} className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-nss-red shadow-sm transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 overflow-auto max-h-[60vh] space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                  <select 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all appearance-none"
                    value={editData.gender}
                    onChange={(e) => setEditData({...editData, gender: e.target.value})}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Caste / Category</label>
                  <select 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all appearance-none"
                    value={editData.caste}
                    onChange={(e) => setEditData({...editData, caste: e.target.value})}
                  >
                    <option value="">Select Caste</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Course</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all"
                    value={editData.course}
                    onChange={(e) => setEditData({...editData, course: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Semester</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all"
                    value={editData.semester}
                    onChange={(e) => setEditData({...editData, semester: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hobbies & Interests</label>
                <textarea 
                  rows={3}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all resize-none"
                  value={editData.hobbies}
                  onChange={(e) => setEditData({...editData, hobbies: e.target.value})}
                />
              </div>
            </div>

            <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-5 bg-white border border-gray-200 text-gray-500 font-black rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-[10px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate}
                className="flex-1 py-5 bg-nss-blue text-white font-black rounded-2xl hover:bg-nss-blue-dark shadow-xl shadow-nss-blue/20 transition-all uppercase tracking-widest text-[10px]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && selectedVolunteer && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsDeleting(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-12 text-center space-y-8">
              <div className="h-24 w-24 bg-red-50 text-nss-red rounded-4xl flex items-center justify-center mx-auto animate-bounce">
                <Trash2 size={48} />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">ARE YOU SURE?</h2>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  You are about to delete <span className="font-black text-gray-900">{selectedVolunteer.name}</span>. This action is permanent and will remove all their records from the database.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDelete(selectedVolunteer.id)}
                  className="w-full py-5 bg-nss-red text-white font-black rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 transition-all uppercase tracking-widest text-xs"
                >
                  Yes, Delete Volunteer
                </button>
                <button 
                  onClick={() => setIsDeleting(false)}
                  className="w-full py-5 bg-gray-50 text-gray-400 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                >
                  No, Keep Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
