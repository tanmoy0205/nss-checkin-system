import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Users, Calendar, CheckCircle, ArrowRight, Award, MapPin, TrendingUp, Heart, ExternalLink, User, Instagram, Linkedin, Globe, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TheInfiniteGrid } from "@/components/ui/the-infinite-grid";
import { UnauthDashboard } from "@/components/blocks/UnauthDashboard";

const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
};

async function getDashboardData() {
  if (!supabaseAdmin) {
    return {
      metrics: { totalVolunteers: 0, totalEvents: 0, todaysCheckins: 0, totalHours: 0 },
      upcomingEvents: [],
      latestImpact: [],
      categoryImpact: []
    };
  }

  try {
    // 1. Metrics
    const { count: volunteers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'VOLUNTEER');
    
    const { count: events } = await supabaseAdmin
      .from('events')
      .select('*', { count: 'exact', head: true });
    
    const { count: checkinsCount } = await supabaseAdmin
      .from('checkins')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'APPROVED');

    const { data: hoursData } = await supabaseAdmin
      .from('users')
      .select('total_hours')
      .eq('role', 'VOLUNTEER');
    
    const totalHours = hoursData?.reduce((acc, curr) => acc + (curr.total_hours || 0), 0) || 0;

    // 2. Upcoming Events (General)
    const { data: upcomingEvents } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        event_registrations ( count )
      `)
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(3);

    // 3. Latest Impact (Irrespective of approval)
    const { data: latestCheckins } = await supabaseAdmin
      .from('checkins')
      .select(`
        id,
        created_at,
        image_url,
        notes,
        users ( name, profile_picture ),
        events ( title, location, category )
      `)
      .order('created_at', { ascending: false })
      .limit(4);

    // 4. Category Impact (NSS 5 Domains)
    const domains = [
      { label: 'Educational Outreach', key: 'Education', color: 'bg-nss-blue', baseline: 1250 },
      { label: 'Plantation & Environment', key: 'Environment', color: 'bg-green-500', baseline: 2100 },
      { label: 'Social Development', key: 'Social', color: 'bg-inspiria-yellow', baseline: 1850 },
      { label: 'Health & Hygiene', key: 'Health', color: 'bg-nss-red', baseline: 1420 },
      { label: 'Donation Drives', key: 'Donation', color: 'bg-purple-500', baseline: 980 }
    ];

    const { data: categoryData } = await supabaseAdmin
      .from('checkins')
      .select('hours, events(category)')
      .eq('status', 'APPROVED');

    const impact = domains.map(domain => {
      const currentHours = categoryData
        ?.filter(c => (c.events as any)?.category === domain.key)
        ?.reduce((acc, curr) => acc + (curr.hours || 0), 0) || 0;
      
      return {
        label: domain.label,
        hours: domain.baseline + currentHours, // Adding historical baseline
        color: domain.color
      };
    });

    return {
      metrics: {
        totalVolunteers: volunteers || 0,
        totalEvents: events || 0,
        todaysCheckins: checkinsCount || 0,
        totalHours: totalHours + 7600 // Adding historical baseline hours
      },
      upcomingEvents: upcomingEvents || [],
      latestImpact: latestCheckins || [],
      categoryImpact: impact
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return {
      metrics: { totalVolunteers: 0, totalEvents: 0, todaysCheckins: 0, totalHours: 0 },
      upcomingEvents: [],
      latestImpact: [],
      categoryImpact: []
    };
  }
}

async function getPublicImpactData() {
  if (!supabaseAdmin) return [];
  
  try {
    const { data } = await supabaseAdmin
      .from('checkins')
      .select('image_url')
      .not('image_url', 'is', null)
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false })
      .limit(12);
    
    return data?.map(c => c.image_url) || [];
  } catch (error) {
    console.error("Public impact fetch error:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const session = await auth();

  // Redirect Admins to the Admin Portal
  if (session?.user && (session.user as any).role === "ADMIN") {
    redirect("/admin");
  }

  if (!session) {
    const publicImages = await getPublicImpactData();
    return <UnauthDashboard impactImages={publicImages} />;
  }

  const { metrics, latestImpact, categoryImpact, upcomingEvents } = await getDashboardData();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-inspiria-yellow selection:text-nss-blue-dark">
      {/* Hero Section */}
      <TheInfiniteGrid className="min-h-[90vh] bg-nss-blue-dark">
        <div className="mx-auto max-w-7xl px-4 text-center relative z-10 py-20">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/5 backdrop-blur-md text-inspiria-yellow font-black text-sm uppercase tracking-[0.3em] mb-12 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-2xl shadow-black/20">
            <img src="/nss.png" alt="NSS Logo" className="h-8 w-8 rounded-full object-contain" />
            Empowering Communities Since 2023
          </div>
          
          <h1 className="text-7xl md:text-[12rem] font-black text-white mb-12 tracking-tighter leading-[0.8] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            NOT ME <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r bg-nss-blue via-white to-nss-red">BUT YOU.</span>
          </h1>

          <p className="text-xl md:text-3xl text-blue-100/70 max-w-4xl mx-auto mb-16 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Join the <span className="text-white font-black underline decoration-inspiria-yellow decoration-4 underline-offset-8">Inspiria Knowledge Campus</span> NSS Unit. <br className="hidden md:block" />
            We are a collective of young minds dedicated to social welfare and community transformation.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Link 
              href="/checkin" 
              className="group relative px-12 py-6 bg-nss-red text-white font-black text-xl rounded-3xl hover:scale-105 transition-all shadow-2xl shadow-nss-red/40 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-4 uppercase tracking-widest">
                CHECK-IN NOW
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
              </span>
            </Link>
            <Link 
              href="/events" 
              className="px-12 py-6 bg-white/5 backdrop-blur-xl text-white font-black text-xl rounded-3xl border-2 border-white/10 hover:bg-white/10 hover:border-inspiria-yellow/50 transition-all shadow-2xl shadow-black/20 uppercase tracking-widest"
            >
              OUR DRIVES
            </Link>
          </div>
        </div>
      </TheInfiniteGrid>

      {/* Stats Section */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { label: "Volunteers", value: metrics.totalVolunteers, icon: Users, color: "bg-nss-blue", iconColor: "text-white" },
              { label: "Drives Completed", value: metrics.totalEvents + 150, icon: Calendar, color: "bg-nss-red", iconColor: "text-white" },
              { label: "Check-ins Today", value: metrics.todaysCheckins, icon: CheckCircle, color: "bg-inspiria-yellow", iconColor: "text-nss-blue-dark" },
              { label: "Impact Hours", value: metrics.totalHours, icon: TrendingUp, color: "bg-nss-blue-dark", iconColor: "text-white" },
            ].map((stat, i) => (
              <div key={i} className="relative group text-center p-12 rounded-[3rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl transition-all">
                <div className={`mb-8 inline-flex p-6 rounded-4xl ${stat.color} ${stat.iconColor} shadow-xl group-hover:scale-110 transition-all`}>
                  <stat.icon size={48} />
                </div>
                <h3 className="text-6xl font-black text-gray-900 mb-4 tabular-nums tracking-tighter">
                  {stat.value.toLocaleString()}{stat.label === "Drives Completed" ? "+" : ""}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section (General) */}
      <section className="py-40 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[60px_60px]" />
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
            <div>
              <h2 className="text-7xl font-black text-gray-900 tracking-tighter uppercase mb-4">UPCOMING <span className="text-nss-blue">DRIVES</span></h2>
              <div className="h-2 w-40 bg-nss-red rounded-full" />
            </div>
            <Link href="/events" className="group flex items-center gap-4 px-10 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-nss-blue hover:text-white transition-all shadow-xl shadow-gray-200/50">
              VIEW ALL EVENTS <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {upcomingEvents.length > 0 ? upcomingEvents.map((event: any, i: number) => (
              <div key={i} className="group bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-200/40 hover:shadow-nss-blue/20 transition-all overflow-hidden flex flex-col h-full">
                <div className="p-12 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-10">
                    <div className="px-5 py-2 bg-nss-blue/10 text-nss-blue rounded-full text-[10px] font-black uppercase tracking-widest border border-nss-blue/10">
                      {event.category || 'General'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                      <Clock size={14} className="text-nss-red" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight uppercase leading-tight group-hover:text-nss-blue transition-colors">{event.title}</h3>
                  <div className="space-y-4 mb-10 flex-1">
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
                      <span className="text-xs font-black uppercase tracking-widest">{event.event_registrations?.[0]?.count || 0} / {event.max_participants} REGISTERED</span>
                    </div>
                  </div>
                  <Link 
                    href={`/events?register=${event.id}`}
                    className="w-full py-6 bg-gray-900 text-white font-black rounded-3xl hover:bg-nss-blue transition-all text-center uppercase tracking-widest text-xs shadow-xl shadow-gray-200"
                  >
                    REGISTER FOR EVENT
                  </Link>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 bg-white/50 rounded-[4rem] border-4 border-dashed border-gray-200 text-center">
                <Calendar size={64} className="mx-auto text-gray-200 mb-8" />
                <p className="text-gray-400 font-black uppercase tracking-[0.4em]">No upcoming drives scheduled</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl w-full px-4 py-40 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          {/* Recent Check-ins */}
          <div className="lg:col-span-8">
            <div className="flex items-end justify-between mb-20">
              <div>
                <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase">LATEST IMPACT</h2>
                <div className="h-2 w-32 bg-nss-red rounded-full" />
              </div>
              <Link href="/events" className="text-nss-blue font-black text-sm uppercase tracking-[0.3em] flex items-center gap-3 hover:text-nss-red transition-all group pb-2 border-b-2 border-transparent hover:border-nss-red">
                View all drives <ExternalLink size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {latestImpact.length > 0 ? latestImpact.map((checkin: any, i: number) => (
                <div key={i} className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-nss-blue/10 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-nss-blue/5 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-150" />
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="h-20 w-20 rounded-4xl overflow-hidden shadow-2xl border-4 border-white transform group-hover:rotate-3 transition-transform">
                      {(() => {
                        const user = Array.isArray(checkin.users) ? checkin.users[0] : checkin.users;
                        const profilePic = user?.profile_picture;
                        const name = user?.name || "Volunteer";
                        
                        return profilePic ? (
                          <img 
                            src={profilePic} 
                            alt={name} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <User size={32} />
                          </div>
                        );
                      })()}
                    </div>
                    <span className="text-[10px] font-black text-nss-blue bg-white px-5 py-2 rounded-full uppercase tracking-widest shadow-sm border border-gray-100">
                      {timeAgo(checkin.created_at)}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase truncate">
                      {Array.isArray(checkin.users) ? checkin.users[0]?.name : checkin.users?.name}
                    </h3>
                    <p className="text-nss-red font-black text-sm mb-8 flex items-center gap-3 uppercase tracking-wider">
                      <Heart size={16} fill="currentColor" />
                      {checkin.events?.title}
                    </p>
                    <div className="flex items-center gap-3 text-gray-600 text-sm bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <MapPin size={18} className="text-nss-blue" />
                      <span className="font-black uppercase tracking-widest text-[10px] truncate">{checkin.events?.location}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-20 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
                  <p className="text-gray-400 font-black uppercase tracking-widest">No impact records yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Highlights Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-nss-blue-dark rounded-[4rem] p-12 sticky top-32 shadow-2xl shadow-nss-blue-dark/40 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-12 tracking-tighter uppercase">REAL IMPACT</h2>
                <div className="space-y-12">
                  {categoryImpact.map((h: any, i: number) => (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-black text-blue-100 uppercase tracking-widest text-xs">{h.label}</span>
                        <span className="font-black text-inspiria-yellow text-2xl tabular-nums">{h.hours}H</span>
                      </div>
                      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                        <div 
                          className={`h-full ${h.color} rounded-full transition-all duration-1000 group-hover:opacity-80 shadow-lg`}
                          style={{ width: `${metrics.totalHours > 0 ? (h.hours / metrics.totalHours) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-20 pt-16 border-t border-white/10 text-center">
                  <div className="inline-flex h-24 w-24 rounded-4xl bg-white items-center justify-center mb-8 shadow-2xl border border-white/10 p-4">
                    <img src="/nss.png" alt="NSS Logo" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-3 tracking-tight uppercase">COLLECTIVE EFFORT</h4>
                  <p className="text-[10px] text-blue-300/50 font-black uppercase tracking-[0.4em] mb-8">NSS INSPIRIA UNIT</p>
                  <p className="text-blue-100/70 leading-relaxed font-medium text-sm">
                    Real-time contribution from our dedicated volunteers across different social domains.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <section className="py-40 px-4 bg-white">
        <div className="mx-auto max-w-7xl bg-nss-red rounded-[5rem] p-20 md:p-40 text-center relative overflow-hidden shadow-2xl shadow-nss-red/40">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-nss-red via-nss-red-dark to-black opacity-60" />
          <div className="absolute -top-40 -left-40 w-150 h-150 bg-white/10 rounded-full blur-[120px]" />
          
          <div className="relative z-10">
            <h2 className="text-6xl md:text-[10rem] font-black text-white mb-12 tracking-tighter leading-[0.8]">
              READY TO <br />
              <span className="text-inspiria-yellow">SERVE?</span>
            </h2>
            <p className="text-red-100 text-xl md:text-3xl max-w-3xl mx-auto mb-20 font-medium leading-relaxed">
              Every small action counts. Check-in to your next drive and inspire others to join the movement.
            </p>
            <Link 
              href="/checkin" 
              className="inline-flex items-center gap-6 px-20 py-10 bg-white text-nss-red font-black text-3xl rounded-[3rem] hover:bg-inspiria-yellow hover:text-nss-blue-dark transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-tighter"
            >
              GET STARTED <ArrowRight size={40} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="inline-flex h-24 w-24 bg-white rounded-3xl items-center justify-center mb-8 shadow-xl border border-gray-100 p-2">
            <img src="/nss.png" alt="NSS Logo" className="h-full w-full object-contain" />
          </div>
          <h4 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-4">NSS INSPIRIA UNIT</h4>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] mb-12">Inspiria Knowledge Campus • Built for Service</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 mb-16">
            <div className="space-y-6">
              <h5 className="font-black text-gray-900 text-sm uppercase tracking-widest">Platform</h5>
              <ul className="flex gap-8">
                <li><Link href="/dashboard" className="text-gray-500 hover:text-nss-blue font-bold transition-colors">Home</Link></li>
                <li><Link href="/checkin" className="text-gray-500 hover:text-nss-blue font-bold transition-colors">Check-in</Link></li>
                <li><Link href="/events" className="text-gray-500 hover:text-nss-blue font-bold transition-colors">Drives</Link></li>
              </ul>
            </div>
            <div className="h-12 w-px bg-gray-100 hidden md:block" />
            <div className="space-y-6">
              <h5 className="font-black text-gray-900 text-sm uppercase tracking-widest text-center md:text-left">Socials</h5>
              <div className="flex gap-4 justify-center">
                <a href="#" className="h-10 w-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-nss-blue hover:border-nss-blue transition-all shadow-sm"><Instagram size={18} /></a>
                <a href="#" className="h-10 w-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-nss-blue hover:border-nss-blue transition-all shadow-sm"><Linkedin size={18} /></a>
                <a href="#" className="h-10 w-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-nss-blue hover:border-nss-blue transition-all shadow-sm"><Globe size={18} /></a>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">© 2023 NSS UNIT • NOT ME BUT YOU</p>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-nss-blue animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-nss-red animate-pulse delay-75" />
              <div className="h-2 w-2 rounded-full bg-inspiria-yellow animate-pulse delay-150" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
