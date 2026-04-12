'use client';

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register') || pathname.startsWith('/admin/login');

  // Don't show the volunteer navbar in the admin panel or auth pages
  if (pathname.startsWith('/admin') || isAuthPage) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/dashboard" },
    { name: "Check In", href: "/checkin" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-nss-blue-dark/80 backdrop-blur-2xl shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3 sm:gap-6 group">
              <div className="flex -space-x-3 sm:-space-x-4">
                <div className="relative h-10 w-10 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl border-2 border-white/20 shadow-2xl bg-white overflow-hidden transition-all group-hover:scale-110 group-hover:rotate-3 z-20">
                  <Image 
                    src="/nss.png" 
                    alt="NSS Logo" 
                    priority
                    fill
                    sizes="(max-width: 640px) 40px, 64px"
                    className="object-contain p-0.5 sm:p-1"
                  />
                </div>
                <div className="relative h-10 w-10 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl border-2 border-white/20 shadow-2xl bg-white overflow-hidden transition-all group-hover:scale-110 group-hover:-rotate-3 z-10">
                  <Image 
                    src="/inspiria.png" 
                    alt="Inspiria Logo" 
                    fill
                    sizes="(max-width: 640px) 40px, 64px"
                    className="object-contain p-1 sm:p-2"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black tracking-tighter text-white leading-none group-hover:text-inspiria-yellow transition-colors uppercase sm:normal-case">NSS Unit</span>
                <span className="text-[8px] sm:text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] sm:tracking-[0.4em]">Inspiria Campus</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-black text-blue-100/70 hover:text-inspiria-yellow uppercase tracking-widest transition-all hover:-translate-y-px"
                >
                  {link.name}
                </Link>
              ))}
              
              {session ? (
                <div className="flex items-center gap-6 pl-6 border-l border-white/10">
                  {(session.user as any).role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm font-black text-inspiria-yellow hover:text-white uppercase tracking-widest transition-colors"
                    >
                      <ShieldCheck size={16} />
                      Admin Portal
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-sm font-black text-blue-100/70 hover:text-white uppercase tracking-widest transition-colors"
                  >
                    <User size={16} className="text-inspiria-yellow" />
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-nss-red/10 text-nss-red text-sm font-black uppercase tracking-widest hover:bg-nss-red hover:text-white transition-all shadow-lg"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : !isAuthPage ? (
                <Link
                  href="/auth/login"
                  className="rounded-2xl bg-white px-8 py-3 text-sm font-black text-nss-blue-dark hover:bg-inspiria-yellow hover:text-nss-blue-dark transition-all shadow-xl shadow-black/20 uppercase tracking-widest"
                >
                  Login
                </Link>
              ) : null}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              suppressHydrationWarning
              className="inline-flex items-center justify-center rounded-xl p-2 text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-nss-blue-dark border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-2 px-4 pt-4 pb-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-2xl px-4 py-4 text-base font-black text-blue-100/70 hover:bg-white/5 hover:text-inspiria-yellow uppercase tracking-widest transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {session ? (
              <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-2xl px-4 py-4 text-base font-black text-blue-100/70 hover:bg-white/5 hover:text-white uppercase tracking-widest transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <User size={20} className="text-inspiria-yellow" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-base font-black text-nss-red hover:bg-nss-red/10 uppercase tracking-widest transition-all"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <Link
                  href="/auth/login"
                  className="block rounded-2xl bg-white px-4 py-5 text-center text-base font-black text-nss-blue-dark hover:bg-inspiria-yellow transition-all uppercase tracking-widest"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
