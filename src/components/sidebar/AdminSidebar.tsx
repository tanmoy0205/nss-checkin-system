'use client';

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Calendar, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Volunteers", href: "/admin/volunteers" },
  { icon: Star, label: "Leaderboard", href: "/admin/leaderboard" },
  { icon: CalendarCheck, label: "Attendance", href: "/admin/attendance" },
  { icon: Calendar, label: "Events", href: "/admin/events" },
];

export default function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="w-80 h-screen sticky top-0 bg-nss-blue-dark border-r border-white/5 flex flex-col font-sans">
      {/* Admin Branding */}
      <div className="p-10">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-16 w-16 bg-white rounded-2xl p-2 shadow-2xl shrink-0">
            <img src="/nss.png" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-tighter leading-none">ADMIN PANEL</span>
            <span className="text-[10px] font-black text-nss-red uppercase tracking-[0.3em]">NSS Inspiria</span>
          </div>
        </div>
        <div className="h-px w-full bg-white/10" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between px-6 py-5 rounded-3xl transition-all group ${
                isActive 
                  ? "bg-nss-blue text-white shadow-2xl shadow-nss-blue/20" 
                  : "text-blue-100/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={22} className={isActive ? "text-white" : "text-blue-100/30 group-hover:text-white transition-colors"} />
                <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
              </div>
              <ChevronRight size={16} className={`transition-transform ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"}`} />
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-8">
        <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 bg-nss-blue rounded-2xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-black text-white truncate uppercase tracking-tight">{session?.user?.name || "Admin"}</span>
              <span className="text-[10px] font-black text-blue-100/40 tracking-widest truncate">{session?.user?.email}</span>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-4 bg-nss-red/10 text-nss-red hover:bg-nss-red hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em]"
          >
            <LogOut size={16} />
            Logout Session
          </button>
        </div>
      </div>
    </aside>
  );
}
