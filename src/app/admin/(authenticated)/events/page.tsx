'use client';

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { 
  Calendar, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Plus,
  Filter,
  MoreVertical,
  ExternalLink,
  Edit,
  Trash2,
  X,
  CheckCircle,
  Award,
  BarChart3,
  QrCode,
  Download,
  Info,
  VenetianMask,
  Fingerprint,
  Check,
  Link as LinkIcon,
  Copy
} from "lucide-react";
import { useSession } from "next-auth/react";
import { ProfileImage } from "@/components/ui/ProfileImage";

export default function AdminEvents() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isFetchingAnalytics, setIsFetchingAnalytics] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Filters for Analytics
  const [genderFilter, setGenderFilter] = useState("");
  const [casteFilter, setCasteFilter] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    hoursGranted: 0,
    maxParticipants: 100,
    category: "General",
    certificateLayoutUrl: ""
  });

  async function fetchEvents() {
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      if (data.ok) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchEventAnalytics(id: string) {
    setIsFetchingAnalytics(true);
    setIsAnalyticsOpen(true);
    try {
      const res = await fetch(`/api/admin/events?id=${id}`);
      const data = await res.json();
      if (data.ok) {
        setSelectedEvent(data.event);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsFetchingAnalytics(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle Create Event from URL Param
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      openCreateModal();
      // Clean up the URL
      router.replace('/admin/events');
    }
  }, [searchParams, router]);

  const openCreateModal = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      eventDate: "",
      hoursGranted: 0,
      maxParticipants: 100,
      category: "General",
      certificateLayoutUrl: ""
    });
    setIsCreating(true);
  };

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsCreating(false);
        setFormData({
          title: "",
          description: "",
          location: "",
          eventDate: "",
          hoursGranted: 0,
          maxParticipants: 100,
          category: "General",
          certificateLayoutUrl: ""
        });
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedEvent.id, ...formData }),
      });

      if (res.ok) {
        setIsEditing(false);
        setSelectedEvent(null);
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsDeleting(false);
        setSelectedEvent(null);
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => 
      e.title?.toLowerCase().includes(search.toLowerCase()) || 
      e.location?.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  const filteredParticipants = useMemo(() => {
    if (!selectedEvent?.event_registrations) return [];
    return selectedEvent.event_registrations.filter((reg: any) => {
      const genderMatch = !genderFilter || reg.users?.gender === genderFilter;
      const casteMatch = !casteFilter || reg.users?.caste === casteFilter;
      return genderMatch && casteMatch;
    });
  }, [selectedEvent, genderFilter, casteFilter]);

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
            UNIT <span className="text-nss-blue underline decoration-nss-red decoration-4 underline-offset-4">EVENTS</span>
          </h1>
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">Organize and manage unit activities</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-white p-1.5 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 w-full md:w-80 group focus-within:ring-4 focus-within:ring-nss-blue/5 transition-all">
            <div className="h-10 w-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-focus-within:text-nss-blue transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="SEARCH EVENTS..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-black text-[9px] uppercase tracking-widest text-gray-700 placeholder:text-gray-300"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="h-14 w-14 bg-nss-blue text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-nss-blue/20 hover:scale-110 active:scale-95 transition-all"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="p-8 space-y-6 flex-1">
                <div className="flex items-start justify-between">
                  <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                    new Date(event.date) > new Date() ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                  }`}>
                    {new Date(event.date) > new Date() ? 'Upcoming' : 'Completed'}
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === event.id ? null : event.id)}
                      className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-nss-blue transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeMenu === event.id && (
                      <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in duration-200">
                        <button 
                          onClick={() => {
                            setSelectedEvent(event);
                            setFormData({
                              title: event.title,
                              description: event.description || "",
                              location: event.location,
                              eventDate: new Date(event.date).toISOString().slice(0, 16),
                              hoursGranted: event.hours_granted || 0,
                              maxParticipants: event.max_participants || 100,
                              category: event.category || "General",
                              certificateLayoutUrl: event.certificate_layout_url || ""
                            });
                            setIsEditing(true);
                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 text-gray-700 transition-colors"
                        >
                          <Edit size={14} className="text-nss-blue" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedEvent(event);
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

                <div className="space-y-3">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-nss-blue transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                    {event.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-nss-red">
                      <Calendar size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-nss-blue">
                      <MapPin size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-nss-blue leading-none">{event.hours_granted || 0}</span>
                      <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest mt-1">Hours</span>
                    </div>
                    <div className="h-6 w-px bg-gray-100" />
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-gray-900 leading-none">{event.event_registrations?.[0]?.count || 0}/{event.max_participants || 100}</span>
                      <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest mt-1">Joined</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        <Users size={12} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 flex gap-2">
                <button 
                  onClick={() => fetchEventAnalytics(event.id)}
                  className="flex-1 py-4 bg-white hover:bg-nss-blue hover:text-white rounded-2xl transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-gray-100 shadow-sm group/btn"
                >
                  <BarChart3 size={14} className="group-hover/btn:scale-110 transition-transform" /> Analytics
                </button>
                <button 
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsQrOpen(true);
                  }}
                  className="h-12 w-12 bg-white hover:bg-nss-blue hover:text-white text-gray-400 rounded-2xl transition-all flex items-center justify-center border border-gray-100 shadow-sm"
                  title="Generate QR Code"
                >
                  <QrCode size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-32 bg-gray-50/30 rounded-[3rem] border border-dashed border-gray-200 mt-8">
            <div className="h-24 w-24 bg-white rounded-4xl flex items-center justify-center text-gray-200 mx-auto mb-8 shadow-sm">
              <Calendar size={48} />
            </div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">No events found</p>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {isQrOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-nss-blue-dark/60 backdrop-blur-md" onClick={() => setIsQrOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-nss-blue text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <QrCode size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">EVENT QR CODE</h2>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Share for easy check-in</p>
                </div>
              </div>
              <button onClick={() => setIsQrOpen(false)} className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-nss-red shadow-sm transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-12 flex flex-col items-center space-y-10">
              <div className="p-10 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200">
                <div className="bg-white p-6 rounded-3xl shadow-2xl">
                  <QRCode 
                    value={`${window.location.origin}/checkin?eventId=${selectedEvent.id}`}
                    size={240}
                    level="H"
                  />
                </div>
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-500 font-medium px-8">
                  Volunteers can scan this code to automatically fill event details during check-in.
                </p>
              </div>

              <div className="w-full space-y-4">
                <button 
                  onClick={() => {
                    const url = `${window.location.origin}/checkin?eventId=${selectedEvent.id}`;
                    navigator.clipboard.writeText(url);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  }}
                  className="w-full py-6 bg-nss-blue text-white font-black rounded-3xl hover:bg-nss-blue-dark transition-all flex items-center justify-center gap-4 uppercase tracking-widest text-xs shadow-xl shadow-nss-blue/20"
                >
                  {copySuccess ? <Check size={18} /> : <Copy size={18} />}
                  {copySuccess ? "COPIED TO CLIPBOARD" : "COPY CHECK-IN LINK"}
                </button>
                <button 
                  onClick={() => window.print()}
                  className="w-full py-6 bg-gray-900 text-white font-black rounded-3xl hover:bg-black transition-all flex items-center justify-center gap-4 uppercase tracking-widest text-xs"
                >
                  <Download size={18} /> DOWNLOAD FOR PRINT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-nss-blue-dark/60 backdrop-blur-md" onClick={() => { setIsCreating(false); setIsEditing(false); }} />
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-full">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50 shrink-0">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{isCreating ? 'CREATE EVENT' : 'EDIT EVENT'}</h2>
                <div className="h-1 w-16 bg-nss-red rounded-full mt-2" />
              </div>
              <button onClick={() => { setIsCreating(false); setIsEditing(false); }} className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-nss-red shadow-sm transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 overflow-auto space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all"
                  placeholder="E.G. BLOOD DONATION CAMP"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all"
                    placeholder="E.G. MAIN AUDITORIUM"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date & Time</label>
                  <div className="relative group/date">
                    <input 
                      type="datetime-local" 
                      className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-8 focus:ring-nss-blue/5 focus:border-nss-blue focus:bg-white outline-none font-black text-gray-700 transition-all uppercase tracking-tighter text-sm appearance-none cursor-pointer shadow-inner"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-nss-blue group-hover/date:scale-110 transition-transform">
                      <Calendar size={20} />
                    </div>
                  </div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest px-2 mt-1 italic">Click to open the advanced scheduler</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hours Granted</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all"
                    value={formData.hoursGranted}
                    onChange={(e) => setFormData({...formData, hoursGranted: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Participants</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Category</label>
                <select 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="General">General Awareness</option>
                  <option value="Health">Health & Hygiene</option>
                  <option value="Environment">Environmental Protection</option>
                  <option value="Education">Literacy & Education</option>
                  <option value="Social">Social Welfare</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all resize-none"
                  placeholder="TELL VOLUNTEERS ABOUT THE EVENT..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Certificate Layout URL (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-nss-blue/5 outline-none font-black text-gray-700 transition-all"
                  placeholder="HTTPS://CLOUDINARY.COM/CERT-LAYOUT.JPG"
                  value={formData.certificateLayoutUrl}
                  onChange={(e) => setFormData({...formData, certificateLayoutUrl: e.target.value})}
                />
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest px-1 italic">Will be used for automatic certificate generation later.</p>
              </div>
            </div>

            <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex gap-4 shrink-0">
              <button 
                onClick={() => { setIsCreating(false); setIsEditing(false); }}
                className="flex-1 py-5 bg-white border border-gray-200 text-gray-500 font-black rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-[10px]"
              >
                Cancel
              </button>
              <button 
                onClick={isCreating ? handleCreate : handleUpdate}
                className="flex-1 py-5 bg-nss-blue text-white font-black rounded-2xl hover:bg-nss-blue-dark shadow-xl shadow-nss-blue/20 transition-all uppercase tracking-widest text-[10px]"
              >
                {isCreating ? 'CREATE EVENT' : 'SAVE CHANGES'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {isAnalyticsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-nss-blue-dark/60 backdrop-blur-md" onClick={() => setIsAnalyticsOpen(false)} />
          <div className="relative w-full max-w-5xl bg-gray-50 rounded-[4rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500 h-full max-h-[90vh]">
            <div className="p-10 bg-white border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-nss-blue/10 rounded-4xl flex items-center justify-center text-nss-blue shadow-inner">
                  <BarChart3 size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    {selectedEvent?.title || 'EVENT ANALYTICS'}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <MapPin size={12} className="text-nss-red" /> {selectedEvent?.location}
                    </div>
                    <div className="h-1 w-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      <Calendar size={12} className="text-nss-blue" /> {selectedEvent ? new Date(selectedEvent.date).toLocaleDateString() : ''}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsAnalyticsOpen(false)}
                  className="h-14 w-14 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-nss-red rounded-2xl flex items-center justify-center transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {isFetchingAnalytics ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="h-16 w-16 border-4 border-nss-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-10 shrink-0">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Total Registered</span>
                    <span className="text-2xl font-black text-nss-blue">{selectedEvent?.event_registrations?.length || 0}</span>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Available Slots</span>
                    <span className="text-2xl font-black text-gray-900">{(selectedEvent?.max_participants || 100) - (selectedEvent?.event_registrations?.length || 0)}</span>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Male Participation</span>
                    <span className="text-2xl font-black text-nss-blue">
                      {selectedEvent?.event_registrations?.filter((r: any) => r.users?.gender === 'Male').length || 0}
                    </span>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Female Participation</span>
                    <span className="text-2xl font-black text-nss-red">
                      {selectedEvent?.event_registrations?.filter((r: any) => r.users?.gender === 'Female').length || 0}
                    </span>
                  </div>
                </div>

                {/* Filters & List */}
                <div className="flex-1 flex flex-col min-h-0 px-10 pb-10">
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col min-h-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-nss-blue">
                          <Users size={18} />
                        </div>
                        <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Participants List</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                          <VenetianMask size={14} className="text-gray-400" />
                          <select 
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="bg-transparent border-none outline-none text-[9px] font-black uppercase tracking-widest text-gray-600 appearance-none cursor-pointer"
                          >
                            <option value="">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                          <Fingerprint size={14} className="text-gray-400" />
                          <select 
                            value={casteFilter}
                            onChange={(e) => setCasteFilter(e.target.value)}
                            className="bg-transparent border-none outline-none text-[9px] font-black uppercase tracking-widest text-gray-600 appearance-none cursor-pointer"
                          >
                            <option value="">All Categories</option>
                            <option value="General">General</option>
                            <option value="OBC">OBC</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                      <table className="w-full border-collapse">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-gray-50/80 backdrop-blur-md">
                            <th className="text-left py-5 px-8 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Volunteer</th>
                            <th className="text-left py-5 px-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Gender</th>
                            <th className="text-left py-5 px-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Category</th>
                            <th className="text-left py-5 px-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Joined</th>
                            <th className="text-right py-5 px-8 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredParticipants.map((reg: any) => (
                            <tr key={reg.id} className="hover:bg-gray-50/30 transition-colors">
                              <td className="py-5 px-8">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 bg-gray-100 rounded-xl overflow-hidden shadow-sm shrink-0">
                                      <ProfileImage 
                                        src={reg.users?.profile_picture} 
                                        alt={reg.users?.name}
                                        className="h-full w-full object-cover" 
                                        size={16}
                                      />
                                    </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-black text-gray-900 tracking-tight">{reg.users?.name}</span>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest truncate">{reg.users?.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 px-6">
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{reg.users?.gender || 'N/A'}</span>
                              </td>
                              <td className="py-5 px-6">
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{reg.users?.caste || 'N/A'}</span>
                              </td>
                              <td className="py-5 px-6">
                                <span className="text-[10px] font-black text-gray-400 tracking-widest">{new Date(reg.created_at).toLocaleDateString()}</span>
                              </td>
                              <td className="py-5 px-8 text-right">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 text-[8px] font-black rounded-full border border-green-100 uppercase tracking-widest">
                                  <Check size={10} /> {reg.status}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {filteredParticipants.length === 0 && (
                        <div className="text-center py-20 bg-gray-50/30">
                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">No participants match the filters</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleting && selectedEvent && (
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
                  You are about to delete <span className="font-black text-gray-900">{selectedEvent.title}</span>. This will also remove all registrations for this event.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDelete(selectedEvent.id)}
                  className="w-full py-5 bg-nss-red text-white font-black rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 transition-all uppercase tracking-widest text-xs"
                >
                  Yes, Delete Event
                </button>
                <button 
                  onClick={() => setIsDeleting(false)}
                  className="w-full py-5 bg-gray-50 text-gray-400 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                >
                  No, Keep It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
