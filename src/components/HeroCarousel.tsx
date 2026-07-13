import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface HeroCarouselProps {
  onShopNowClick: () => void;
}

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1920',
    badge: 'CRUELTY-FREE & VEGAN',
    title: 'Rose Quartz Dew.',
    accentTitle: 'Reimagine Luminous Skincare.',
    desc: 'Experience organic botanical luxury. Sparkle formulas combine clinical botanicals with genuine rose quartz crystal extracts for 24-hour weightless radiance.',
    cta: 'Shop Dewy Radiance'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1920',
    badge: 'HIGH-PIGMENT SATIN TOUCH',
    title: 'Satin Lip Velvet.',
    accentTitle: 'Velvety Finish, Nourished Lips.',
    desc: 'Our vegan matte cushion formulas blend deep natural mineral pigmentation with botanical flower nectar to deliver beautiful, ultra-comfortable satin elegance.',
    cta: 'Explore Velvet Color'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=1920',
    badge: 'BOTANICAL CELL RENEWAL',
    title: 'Midnight Elixir.',
    accentTitle: 'Overnight Recovery Ritual.',
    desc: 'Infuse your cell-rejuvenation sleep cycle with active French lavender extracts, triple-molecular peptide compounds, and sustainable moisture sealers.',
    cta: 'Claim Midnight Secrets'
  }
];

export default function HeroCarousel({ onShopNowClick }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  // Auto-play interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="relative h-[85vh] md:h-[90vh] flex items-center overflow-hidden bg-[#FFF5F6] border-b border-pink-100/50">
      
      {/* Background Images with AnimatePresence */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img 
              src={SLIDES[current].image} 
              alt={SLIDES[current].title} 
              className="w-full h-full object-cover opacity-60 mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Soft pink gradient overlays for pristine readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F6] via-[#FFF5F6]/75 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#FFF0F5]/30 to-transparent"></div>
      </div>

      {/* Main Slide Text Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-10">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-pink-100/80 backdrop-blur-sm border border-pink-200/50 px-4 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-hot-pink animate-pulse" />
                <span className="text-hot-pink font-bold tracking-[0.2em] uppercase text-[9px] md:text-[10px]">
                  {SLIDES[current].badge}
                </span>
              </div>

              {/* Headings */}
              <h2 className="text-4xl md:text-7xl font-serif leading-tight text-zinc-950 font-bold">
                {SLIDES[current].title} <br />
                <span className="italic text-hot-pink font-medium font-serif">
                  {SLIDES[current].accentTitle}
                </span>
              </h2>

              {/* Description */}
              <p className="text-zinc-600 text-xs md:text-sm max-w-md leading-relaxed font-sans">
                {SLIDES[current].desc}
              </p>

              {/* Interactive Luxury CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={onShopNowClick}
                  className="px-8 py-3.5 bg-[#2D142C] text-[#FFF0F5] hover:bg-hot-pink hover:text-white transition-all rounded-full font-bold tracking-wider text-[10px] md:text-xs uppercase flex items-center gap-2 group shadow-lg shadow-pink-900/10"
                >
                  {SLIDES[current].cta}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onShopNowClick}
                  className="px-8 py-3.5 border border-[#2D142C] text-zinc-800 hover:bg-[#2D142C] hover:text-white transition-all rounded-full font-bold tracking-wider text-[10px] md:text-xs uppercase"
                >
                  Explore Rituals
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Navigation Left/Right Buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-zinc-700 shadow-sm border border-pink-100 transition-colors z-20 hidden md:block"
        title="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-zinc-700 shadow-sm border border-pink-100 transition-colors z-20 hidden md:block"
        title="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Premium Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? 'bg-hot-pink w-6 shadow-md shadow-pink-300' : 'bg-hot-pink/20 hover:bg-hot-pink/40'
            }`}
            title={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
