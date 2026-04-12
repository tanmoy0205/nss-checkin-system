'use client';

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  CheckCircle, 
  ArrowRight, 
  Heart, 
  X,
  ShieldCheck,
  Zap,
  Star,
  Info
} from "lucide-react";

function EventsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  
  // Registration Modal State
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/events/register");
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

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle URL param registration
  useEffect(() => {
    const regId = searchParams.get('register');
    if (regId && events.length > 0) {
      const event = events.find(e => e.id === regId);
      if (event && !event.user_registration?.[0]) {
        setSelectedEvent(event);
        setShowRegModal(true);
      }
    }
  }, [searchParams, events]);

  const handleRegister = async () => {
    if (!session) {
      window.location.href = "/auth/login";
      return;
    }

    setRegLoading(true);
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: selectedEvent.id }),
      });

      const data = await res.json();
      if (data.ok) {
        setRegSuccess(true);
        setTimeout(() => {
          setShowRegModal(false);
          setRegSuccess(false);
          fetchEvents();
        }, 2000);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setRegLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title?.toLowerCase().includes(search.toLowerCase()) || 
                           e.location?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || e.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  const categories = ["All", "Education", "Environment", "Social", "Health", "Donation"];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-inspiria-yellow selection:text-nss-blue-dark">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 bg-nss-blue-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-150 h-150 bg-nss-blue/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-150 h-150 bg-nss-red/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase">
            UNIT <span className="text-inspiria-yellow">DRIVES</span>
          </h1>
          <p className="text-xl text-blue-100/70 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Join our mission to transform lives. Explore upcoming events and register to make your impact count.
          </p>
          
          {/* Search & Filter Bar */}
          <div className="max-w-4xl mx-auto bg-white p-4 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-4 items-center border border-gray-100">
            <div className="flex-1 flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-3xl w-full">
              <Search className="text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="SEARCH FOR DRIVES..." 
                className="bg-transparent border-none outline-none font-black text-[10px] uppercase tracking-widest text-gray-700 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-auto pb-2 md:pb-0 w-full md:w-auto px-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                    category === cat ? 'bg-nss-blue text-white shadow-xl shadow-nss-blue/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-32 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="h-20 w-20 border-8 border-nss-blue border-t-transparent rounded-full animate-spin shadow-2xl" />
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Fetching unit drives...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredEvents.map((event, i) => {
                const isRegistered = event.user_registration?.length > 0;
                const isFull = (event.event_registrations?.[0]?.count || 0) >= event.max_participants;
                const isUpcoming = new Date(event.date) > new Date();

                return (
                  <div key={i} className="group bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-200/40 hover:shadow-nss-blue/20 transition-all duration-500 overflow-hidden flex flex-col relative">
                    {isRegistered && (
                      <div className="absolute top-8 right-8 z-10 bg-green-500 text-white p-3 rounded-2xl shadow-xl animate-bounce">
                        <CheckCircle size={20} />
                      </div>
                    )}
                    
                    <div className="p-12 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-10">
                        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          event.category === 'Education' ? 'bg-nss-blue/10 text-nss-blue border-nss-blue/10' :
                          event.category === 'Environment' ? 'bg-green-100 text-green-600 border-green-200' :
                          'bg-nss-red/10 text-nss-red border-nss-red/10'
                        }`}>
                          {event.category || 'General'}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                          <Clock size={14} className="text-nss-red" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>

                      <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight uppercase leading-tight group-hover:text-nss-blue transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-sm text-gray-500 font-medium line-clamp-3 mb-10 leading-relaxed">
                        {event.description || "Join us for this impactful community drive at Inspiria Knowledge Campus."}
                      </p>

                      <div className="space-y-4 mb-10 mt-auto">
                        <div className="flex items-center gap-4 text-gray-500">
                          <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-nss-blue shrink-0">
                            <MapPin size={18} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500">
                          <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-nss-red shrink-0">
                            <Users size={18} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest">
                            {event.event_registrations?.[0]?.count || 0} / {event.max_participants} JOINED
                          </span>
                        </div>
                      </div>

                      {isRegistered ? (
                        <div className="w-full py-6 bg-green-50 text-green-600 font-black rounded-3xl text-center uppercase tracking-widest text-[10px] border border-green-100 flex items-center justify-center gap-2 shadow-inner">
                          <ShieldCheck size={16} /> YOU ARE REGISTERED
                        </div>
                      ) : !isUpcoming ? (
                        <div className="w-full py-6 bg-gray-50 text-gray-400 font-black rounded-3xl text-center uppercase tracking-widest text-[10px] border border-gray-100">
                          DRIVE COMPLETED
                        </div>
                      ) : isFull ? (
                        <div className="w-full py-6 bg-red-50 text-nss-red font-black rounded-3xl text-center uppercase tracking-widest text-[10px] border border-red-100">
                          REGISTRATION FULL
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowRegModal(true);
                          }}
                          className="w-full py-6 bg-gray-900 text-white font-black rounded-3xl hover:bg-nss-blue transition-all text-center uppercase tracking-widest text-xs shadow-xl shadow-gray-200 flex items-center justify-center gap-3 group/btn"
                        >
                          REGISTER NOW <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-40 bg-gray-50 rounded-[5rem] border-4 border-dashed border-gray-100">
              <Calendar size={80} className="mx-auto text-gray-200 mb-8" />
              <h3 className="text-3xl font-black text-gray-300 uppercase tracking-[0.2em]">No drives found</h3>
              <p className="text-gray-400 font-medium mt-4">Try adjusting your search or category filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {showRegModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-nss-blue-dark/80 backdrop-blur-xl" onClick={() => !regLoading && setShowRegModal(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {regSuccess ? (
              <div className="p-20 text-center space-y-8">
                <div className="h-32 w-32 bg-green-50 text-green-500 rounded-4xl flex items-center justify-center mx-auto border-4 border-green-100 animate-bounce">
                  <CheckCircle size={64} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">SUCCESS!</h2>
                  <p className="text-gray-500 font-medium text-lg">You are now registered for <span className="text-nss-blue font-black">{selectedEvent.title}</span>.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-12 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-4 text-nss-blue">
                    <img src="/nss.png" alt="NSS Logo" className="h-12 w-12 object-contain" />
                    <h2 className="text-3xl font-black tracking-tighter uppercase">CONFIRM REGISTRATION</h2>
                  </div>
                  <button onClick={() => setShowRegModal(false)} className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-nss-red transition-all shadow-sm">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="p-12 space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black text-gray-900 leading-none uppercase tracking-tight">{selectedEvent.title}</h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                        <Calendar size={12} className="text-nss-red" /> {new Date(selectedEvent.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                        <MapPin size={12} className="text-nss-blue" /> {selectedEvent.location}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-nss-blue/5 rounded-3xl border border-nss-blue/10 flex items-start gap-6">
                    <div className="h-12 w-12 bg-nss-blue text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                      <Star size={24} className="fill-current" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-nss-blue-dark uppercase mb-1 tracking-tight">Earn {selectedEvent.hours_granted} Hours</h4>
                      <p className="text-sm text-gray-500 font-medium">By participating in this drive, you contribute to our mission and earn verified community impact hours.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-6">
                    <button 
                      onClick={handleRegister}
                      disabled={regLoading}
                      className="w-full py-8 bg-nss-blue text-white font-black rounded-3xl hover:bg-nss-blue-dark transition-all text-xl uppercase tracking-tighter shadow-2xl shadow-nss-blue/30 flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                      {regLoading ? (
                        <div className="h-8 w-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>YES, REGISTER ME <Zap size={24} /></>
                      )}
                    </button>
                    <button 
                      onClick={() => setShowRegModal(false)}
                      className="w-full py-6 bg-gray-50 text-gray-400 font-black rounded-3xl hover:bg-gray-100 transition-all text-xs uppercase tracking-widest"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="inline-flex h-16 w-16 bg-white rounded-3xl items-center justify-center mb-8 shadow-xl border border-gray-100">
            <img src="/nss.png" alt="NSS Logo" className="h-10 w-10 object-contain" />
          </div>
          <h4 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-4">NSS INSPIRIA UNIT</h4>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Inspiria Knowledge Campus • Built for Service</p>
        </div>
      </footer>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-nss-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
