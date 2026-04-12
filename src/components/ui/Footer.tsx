import Link from "next/link";
import { Instagram, Linkedin, Globe, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 sm:py-20 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div className="inline-flex h-16 w-16 sm:h-24 sm:w-24 bg-white rounded-2xl sm:rounded-3xl items-center justify-center mb-6 sm:mb-8 shadow-xl border border-gray-100 p-2">
          <img src="/nss.png" alt="NSS Logo" className="h-full w-full object-contain" />
        </div>
        <h4 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase mb-3 sm:mb-4">NSS INSPIRIA UNIT</h4>
        <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-8 sm:mb-12">
          Inspiria Knowledge Campus • Built for Service
        </p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 mb-12 sm:mb-16">
          <div className="space-y-4 sm:space-y-6">
            <h5 className="font-black text-gray-900 text-xs sm:text-sm uppercase tracking-widest">Platform</h5>
            <ul className="flex gap-6 sm:gap-8 justify-center">
              <li><Link href="/dashboard" className="text-gray-500 hover:text-nss-blue font-bold text-sm transition-colors">Home</Link></li>
              <li><Link href="/checkin" className="text-gray-500 hover:text-nss-blue font-bold text-sm transition-colors">Check-in</Link></li>
              <li><Link href="/events" className="text-gray-500 hover:text-nss-blue font-bold text-sm transition-colors">Drives</Link></li>
            </ul>
          </div>
          
          <div className="h-px w-20 bg-gray-200 md:h-12 md:w-px hidden sm:block" />
          
          <div className="space-y-4 sm:space-y-6">
            <h5 className="font-black text-gray-900 text-xs sm:text-sm uppercase tracking-widest">Socials</h5>
            <div className="flex gap-4 justify-center">
              <a href="#" className="h-10 w-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-nss-blue hover:border-nss-blue transition-all shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="h-10 w-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-nss-blue hover:border-nss-blue transition-all shadow-sm">
                <Linkedin size={18} />
              </a>
              <a href="#" className="h-10 w-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-nss-blue hover:border-nss-blue transition-all shadow-sm">
                <Globe size={18} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 sm:pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2 text-gray-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em]">
            <span>© 2023 NSS UNIT</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">NOT ME BUT YOU <Heart size={10} className="fill-nss-red text-nss-red" /></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-nss-blue animate-pulse" />
            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-nss-red animate-pulse delay-75" />
            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-inspiria-yellow animate-pulse delay-150" />
          </div>
        </div>
      </div>
    </footer>
  );
}
