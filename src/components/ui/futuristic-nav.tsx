"use client"; 
 
import React, { useState, useEffect } from "react"; 
import { motion } from "framer-motion"; 
import { Home, Calendar, QrCode, User, Contact, ShieldCheck, LogOut } from "lucide-react"; 
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
 
interface NavItem { 
  id: number; 
  icon: React.ReactNode; 
  label: string; 
  href: string;
} 
 
const LumaBar = () => { 
  const { data: session } = useSession();
  const pathname = usePathname();

  // Don't show the volunteer navbar in the admin panel
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    return null;
  }

  const baseItems: NavItem[] = [ 
    { id: 0, icon: <Home size={22} />, label: "Home", href: "/dashboard" }, 
    { id: 1, icon: <Calendar size={22} />, label: "Events", href: "/events" }, 
    { id: 2, icon: <QrCode size={22} />, label: "Check In", href: "/checkin" }, 
    { id: 3, icon: <Contact size={22} />, label: "Contact", href: "/contact" }, 
  ];

  // Only add Profile if user is logged in
  const items = session 
    ? [...baseItems, { id: 4, icon: <User size={22} />, label: "Profile", href: "/profile" }]
    : baseItems;

  // Find active index based on pathname
  const activeIndex = items.findIndex(item => pathname === item.href);
  const [active, setActive] = useState(activeIndex === -1 ? 0 : activeIndex);

  // Update active state when pathname changes
  useEffect(() => {
    const index = items.findIndex(item => pathname === item.href);
    if (index !== -1) setActive(index);
  }, [pathname, items]);
 
  const isAdmin = session && (session.user as any).role === "ADMIN";
  const extraItemsCount = (session ? (isAdmin ? 2 : 1) : 1); // Admin + Logout OR just Logout OR just Login
  const totalItemsCount = items.length + extraItemsCount;

  return ( 
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-100 w-full max-w-fit px-4"> 
      <div className="relative flex items-center justify-center gap-2 md:gap-4 bg-white/10 dark:bg-black/20 backdrop-blur-3xl rounded-full px-4 md:px-8 py-3 shadow-2xl border border-white/20 overflow-hidden"> 
        
        {/* Logos Section */}
        <div className="flex items-center gap-3 mr-4 pr-4 border-r border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative h-10 w-10 rounded-full bg-white border border-white/20 shadow-lg overflow-hidden transition-transform group-hover:scale-110">
              <Image 
                src="/nss.png" 
                alt="NSS" 
                fill 
                className="object-contain p-1.5"
              />
            </div>
            <div className="relative h-10 w-10 transition-transform group-hover:scale-110">
              <Image 
                src="/inspiria.png" 
                alt="Inspiria" 
                fill 
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Active Indicator Glow */} 
        <motion.div 
          layoutId="active-indicator" 
          className="absolute w-12 h-12 bg-linear-to-r from-nss-blue to-nss-red rounded-full blur-2xl -z-10" 
          animate={{ 
            // Calculate position relative to items (ignoring logos section width)
            // This is a bit tricky with dynamic width, using percentage based on index
            left: `calc(100px + ${active * (100 / totalItemsCount)}% + ${100 / totalItemsCount / 2}%)`, 
            translateX: "-50%", 
          }} 
          transition={{ type: "spring", stiffness: 500, damping: 30 }} 
        /> 
 
        {items.map((item, index) => { 
          const isActive = index === active; 
          return ( 
            <motion.div key={item.id} className="relative flex flex-col items-center group"> 
              {/* Button */} 
              <Link href={item.href} onClick={() => setActive(index)}>
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  animate={{ scale: isActive ? 1.2 : 1 }} 
                  className={`flex items-center justify-center w-10 h-10 transition-colors relative z-10 ${isActive ? 'text-white' : 'text-blue-100/60 hover:text-white'}`} 
                > 
                  {item.icon} 
                </motion.div> 
              </Link>
 
              {/* Tooltip */} 
              <span className="absolute top-full mt-4 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl bg-nss-blue-dark text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl pointer-events-none"> 
                {item.label} 
              </span> 
            </motion.div> 
          ); 
        })}

        {/* Admin Portal if applicable */}
        {isAdmin && (
          <motion.div className="relative flex flex-col items-center group"> 
            <Link href="/admin">
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                className="flex items-center justify-center w-10 h-10 text-inspiria-yellow hover:text-white transition-colors relative z-10" 
              > 
                <ShieldCheck size={22} /> 
              </motion.div> 
            </Link>
            <span className="absolute top-full mt-4 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl bg-nss-blue-dark text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl pointer-events-none"> 
              Admin Portal 
            </span> 
          </motion.div>
        )}

        {/* Auth Toggle (Sign Out / Login) */}
        {session ? (
          <motion.div className="relative flex flex-col items-center group"> 
            <button onClick={() => signOut({ callbackUrl: '/' })}>
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                className="flex items-center justify-center w-10 h-10 text-nss-red hover:text-white transition-colors relative z-10" 
              > 
                <LogOut size={22} /> 
              </motion.div> 
            </button>
            <span className="absolute top-full mt-4 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl bg-nss-blue-dark text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl pointer-events-none"> 
              Sign Out 
            </span> 
          </motion.div>
        ) : (
          <motion.div className="relative flex flex-col items-center group"> 
            <Link href="/auth/login">
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                className="flex items-center justify-center w-10 h-10 text-white hover:text-inspiria-yellow transition-colors relative z-10" 
              > 
                <User size={22} /> 
              </motion.div> 
            </Link>
            <span className="absolute top-full mt-4 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl bg-nss-blue-dark text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl pointer-events-none"> 
              Login 
            </span> 
          </motion.div>
        )}
      </div> 
    </div> 
  ); 
}; 
 
export default LumaBar; 
