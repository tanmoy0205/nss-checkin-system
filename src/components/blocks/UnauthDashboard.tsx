"use client";

import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from "@/components/blocks/animated-gallery";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { TheInfiniteGrid } from "@/components/ui/the-infinite-grid";
import { GridBody, DraggableContainer, GridItem } from "@/components/ui/infinite-drag-scroll";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559027615-cd93739bee0d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb8?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2031&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2098&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop",
];

interface UnauthDashboardProps {
  impactImages?: string[];
}

export const UnauthDashboard = ({ impactImages = [] }: UnauthDashboardProps) => {
  // Mix real images with fallback if we don't have enough
  const displayImages = impactImages.length >= 12 
    ? impactImages 
    : [...impactImages, ...FALLBACK_IMAGES.slice(0, 12 - impactImages.length)];

  const col1 = displayImages.slice(0, 4);
  const col2 = displayImages.slice(4, 8);
  const col3 = displayImages.slice(8, 12);

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Hero and Gallery Merged with TheInfiniteGrid Background */}
      <TheInfiniteGrid className="bg-white relative z-20 overflow-visible">
        <section className="relative pt-32 pb-0 px-6 text-center z-30 pointer-events-none">
          <ContainerStagger className="max-w-5xl mx-auto space-y-6">
            <ContainerAnimated>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-nss-blue/5 border border-nss-blue/10 text-nss-blue font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                <Heart className="size-4 fill-nss-red text-nss-red" />
                Not Me But You
              </div>
            </ContainerAnimated>

            <ContainerAnimated>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] uppercase">
                Join the <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-nss-blue via-nss-blue-dark to-nss-red">
                  Movement.
                </span>
              </h1>
            </ContainerAnimated>

            <ContainerAnimated className="max-w-2xl mx-auto px-4">
              <p className="text-base sm:text-xl text-gray-500 font-medium leading-relaxed">
                Experience the power of collective impact. Join the Inspiria Knowledge Campus NSS Unit and help us transform communities through dedicated service.
              </p>
            </ContainerAnimated>

            <ContainerAnimated className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-8 sm:pt-20 pointer-events-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-10 py-6 bg-nss-red text-white font-black text-lg rounded-2xl hover:bg-nss-red-dark transition-all shadow-xl shadow-nss-red/20 uppercase tracking-widest group"
              >
                <Link href="/auth/login" className="flex items-center justify-center gap-3">
                  Join Us Now
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-10 py-6 border-2 border-gray-100 font-black text-lg rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest"
              >
                <Link href="/events" className="flex items-center justify-center">Our Impact</Link>
              </Button>
            </ContainerAnimated>
          </ContainerStagger>
        </section>

        {/* Decorative Background Glow (shared across hero and gallery) */}
        <div 
          className="pointer-events-none absolute top-[20%] left-1/2 -translate-x-1/2 z-10 h-[40vh] w-full max-w-7xl opacity-30" 
          style={{ 
            background: "radial-gradient(circle, rgba(0,51,102,0.2) 0%, rgba(238,44,60,0.1) 50%, transparent 100%)", 
            filter: "blur(100px)", 
          }} 
        />

        {/* New Infinite Drag Scroll Gallery Section */}
        <section className="relative h-[60vh] sm:h-[80vh] w-full mt-[-5vh] sm:mt-[10vh] z-20">
          <DraggableContainer variant="masonry" className="bg-transparent">
            <GridBody>
              {displayImages.map((src, index) => (
                <GridItem 
                  key={index} 
                  className="relative h-40 w-28 sm:h-54 sm:w-36 md:h-96 md:w-64 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white group"
                >
                  <img 
                    src={src} 
                    alt="NSS Impact" 
                    className="pointer-events-none absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <p className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Impact</p>
                  </div>
                </GridItem>
              ))}
            </GridBody>
          </DraggableContainer>
        </section>
      </TheInfiniteGrid>

      {/* Stats Section - Immediately following the gallery scroll */}
      <section className="py-12 sm:py-20 bg-gray-50 relative overflow-hidden">
        <ContainerStagger className="mx-auto max-w-7xl px-4 relative z-10">
          <ContainerAnimated className="text-center mb-6">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter uppercase mb-4 sm:mb-6">Our Growing <span className="text-nss-blue">Family</span></h2>
            <p className="text-sm sm:text-xl text-gray-500 font-medium max-w-2xl mx-auto">Numbers that speak for our commitment and the impact we create together.</p>
          </ContainerAnimated>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
            {[
              { label: "Dedicated Volunteers", value: "500+", icon: Users, color: "text-nss-blue" },
              { label: "Events Organized", value: "150+", icon: Calendar, color: "text-nss-red" },
              { label: "Community Hours", value: "10k+", icon: Clock, color: "text-inspiria-yellow" },
            ].map((stat, i) => (
              <ContainerAnimated key={i}>
                <div className="bg-white p-8 sm:p-12 rounded-4xl sm:rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center group hover:scale-105 transition-all h-full">
                  <div className={`${stat.color} mb-6 sm:mb-8 flex justify-center`}>
                    <stat.icon size={32} className="sm:size-12" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-4xl sm:text-6xl font-black text-gray-900 mb-2 tracking-tighter">{stat.value}</h3>
                  <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] sm:tracking-[0.3em]">{stat.label}</p>
                </div>
              </ContainerAnimated>
            ))}
          </div>
        </ContainerStagger>
      </section>

      {/* Bottom CTA for Unauth Users */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <ContainerStagger className="max-w-7xl mx-auto">
          <ContainerAnimated>
            <div className="bg-nss-blue-dark rounded-[2.5rem] sm:rounded-[4rem] p-10 sm:p-20 text-center relative overflow-hidden shadow-2xl shadow-nss-blue-dark/40">
              <div className="absolute inset-0 bg-linear-to-br from-nss-blue via-nss-blue-dark to-black opacity-80" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 sm:mb-8 tracking-tighter uppercase leading-tight">
                  Ready to create <br /> an <span className="text-inspiria-yellow">impact?</span>
                </h2>
                <p className="text-blue-100/70 text-sm sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto font-medium">
                  Join the NSS unit today and start your journey of community transformation and personal growth.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto px-12 py-6 bg-white text-nss-blue-dark font-black text-lg sm:text-xl rounded-2xl hover:bg-inspiria-yellow transition-all uppercase tracking-widest shadow-2xl"
                >
                  <Link href="/auth/register">Sign Up Now</Link>
                </Button>
              </div>
            </div>
          </ContainerAnimated>
        </ContainerStagger>
      </section>
    </div>
  );
};
