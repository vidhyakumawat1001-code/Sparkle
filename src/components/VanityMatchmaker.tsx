import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  RotateCcw, 
  ShoppingBag,
  Heart,
  Star,
  Award,
  TrendingUp,
  Flame
} from 'lucide-react';
import { Product } from '../constants';

interface VanityMatchmakerProps {
  products: Product[];
  onAddMultiToCart: (products: Product[]) => void;
  onOpenQuickView: (product: Product) => void;
}

type StepType = 'goal' | 'texture' | 'aroma' | 'result';

export default function VanityMatchmaker({
  products,
  onAddMultiToCart,
  onOpenQuickView
}: VanityMatchmakerProps) {
  const [step, setStep] = useState<StepType>('goal');
  
  // Quiz selections
  const [goal, setGoal] = useState<'radiant' | 'velvet' | 'hydration' | null>(null);
  const [texture, setTexture] = useState<'light' | 'rich' | null>(null);
  const [aroma, setAroma] = useState<'floral' | 'earthy' | null>(null);

  const resetQuiz = () => {
    setStep('goal');
    setGoal(null);
    setTexture(null);
    setAroma(null);
  };

  // Logic to determine the matched products bundle
  const getMatchedBundle = () => {
    let matchedIds: string[] = [];
    let routineTitle = '';
    let routineSlogan = '';
    
    if (goal === 'radiant') {
      matchedIds = ['1', '8', '7']; // Rose Quartz Serum + Satin Shimmer Highlighter + Blossom Toner
      routineTitle = 'Celestial Radiance Trio';
      routineSlogan = 'Refines texture, balances pH, and infuses your high points with an iridescent golden-hour glow.';
    } else if (goal === 'velvet') {
      matchedIds = ['2', '5', '9']; // Cushion Lipstick + Radiance Foundation + Rose-Gold Body Oil
      routineTitle = 'Velvet Opulence Ritual';
      routineSlogan = 'Unlocks seamless skin-like coverage, weightless cashmere lips, and satin-shimmer body luminosity.';
    } else {
      matchedIds = ['4', '3', '7']; // Midnight Elixir + Whipped Silk Butter + Blossom Toner
      routineTitle = 'Overnight Silk Rejuvenation';
      routineSlogan = 'Drenches the skin barrier with intense rich peptide butter and overnight recovery active oils.';
    }

    // Find actual products
    const matchedProducts = products.filter(p => matchedIds.includes(p.id));
    
    // Fallback if some deleted or missing
    if (matchedProducts.length < 3) {
      // just pick first 3
      return {
        items: products.slice(0, 3),
        title: 'Bespoke Essentials Ritual',
        slogan: 'Our luxury skin-and-color formulary recommended precisely for your custom bio-profile.'
      };
    }

    return {
      items: matchedProducts,
      title: routineTitle,
      slogan: routineSlogan
    };
  };

  const bundle = getMatchedBundle();
  const originalTotalPrice = bundle.items.reduce((sum, item) => sum + item.originalPrice, 0);
  const bundleDiscountPrice = Math.round(bundle.items.reduce((sum, item) => sum + item.price, 0) * 0.8); // Additional 20% off as a special bundle discount
  const savingsAmount = originalTotalPrice - bundleDiscountPrice;

  const handleAddBundleToCart = () => {
    onAddMultiToCart(bundle.items);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#FFF5F6]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-hot-pink font-semibold tracking-widest uppercase text-xs mb-3.5 block">BESPOKE SKIN MATCHING</span>
          <h2 className="text-3xl md:text-4xl font-serif text-zinc-950">Curate Your Custom Ritual</h2>
          <div className="w-16 h-0.5 bg-brand-pink mx-auto mt-4 mb-5"></div>
          <p className="text-zinc-500 text-xs">
            Answer three quick formulation questions and let our virtual esthetician formulate your absolute perfect 3-step luxury cosmetics set.
          </p>
        </div>

        {/* Interactive Matchmaker Widget Box */}
        <div className="bg-white rounded-[40px] border border-pink-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          
          {/* Left Side: Progress & Info */}
          <div className="md:col-span-4 bg-[#2D142C] p-8 text-[#FFF0F5] flex flex-col justify-between border-b md:border-b-0 md:border-r border-pink-100/15">
            <div>
              <div className="flex items-center gap-2 text-[#FFD1DC] mb-6">
                <Sparkles className="w-5 h-5" />
                <span className="font-serif font-bold text-lg tracking-wider">Vanity Esthetician</span>
              </div>
              
              <div className="space-y-6 my-10">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === 'goal' ? 'bg-[#FFD1DC] text-[#2D142C] scale-110' : goal ? 'bg-green-600 text-white' : 'bg-pink-900/40 text-pink-300'
                  }`}>
                    {goal ? <Check className="w-3.5 h-3.5" /> : '1'}
                  </div>
                  <span className={`text-xs font-semibold ${step === 'goal' ? 'text-white' : 'text-pink-300/60'}`}>Bespoke Goal</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === 'texture' ? 'bg-[#FFD1DC] text-[#2D142C] scale-110' : texture ? 'bg-green-600 text-white' : 'bg-pink-900/40 text-pink-300'
                  }`}>
                    {texture ? <Check className="w-3.5 h-3.5" /> : '2'}
                  </div>
                  <span className={`text-xs font-semibold ${step === 'texture' ? 'text-white' : 'text-pink-300/60'}`}>Texture Affinity</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === 'aroma' ? 'bg-[#FFD1DC] text-[#2D142C] scale-110' : aroma ? 'bg-green-600 text-white' : 'bg-pink-900/40 text-pink-300'
                  }`}>
                    {aroma ? <Check className="w-3.5 h-3.5" /> : '3'}
                  </div>
                  <span className={`text-xs font-semibold ${step === 'aroma' ? 'text-white' : 'text-pink-300/60'}`}>Botanical Essence</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-pink-200/50 leading-relaxed font-sans pt-6 border-t border-pink-900/30">
              Your results are dynamically evaluated with clean clinical actives in mind. FSC Recyclable luxurious vanity tubes included.
            </div>
          </div>

          {/* Right Side: Dynamic Interactive Content Area */}
          <div className="md:col-span-8 p-8 md:p-12 flex flex-col justify-between bg-white">
            
            <AnimatePresence mode="wait">
              
              {/* STEP 1: SKIN GOAL */}
              {step === 'goal' && (
                <motion.div
                  key="goal-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[10px] font-bold text-hot-pink uppercase tracking-widest">Question 1 of 3</span>
                    <h3 className="text-xl md:text-2xl font-serif text-zinc-950 font-bold mt-1">What is your principal vanity skin objective?</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <button
                      onClick={() => { setGoal('radiant'); setStep('texture'); }}
                      className="w-full text-left p-4 rounded-2xl border border-pink-100 hover:border-hot-pink hover:bg-pink-50/10 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-hot-pink transition-colors">Dewy Radiance & High Glow</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Reflect pure sunlight, illuminate details, and plump cell hydration.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-pink-300 group-hover:text-hot-pink transition-colors group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => { setGoal('velvet'); setStep('texture'); }}
                      className="w-full text-left p-4 rounded-2xl border border-pink-100 hover:border-hot-pink hover:bg-pink-50/10 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-hot-pink transition-colors">Velvet Smooth Finish & Pore Coverage</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Achieve flawless silk airbrush finish with rich luxury textures.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-pink-300 group-hover:text-hot-pink transition-colors group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => { setGoal('hydration'); setStep('texture'); }}
                      className="w-full text-left p-4 rounded-2xl border border-pink-100 hover:border-hot-pink hover:bg-pink-50/10 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-hot-pink transition-colors">Deep Restoration & Hydrating Guard</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Drench dry cells overnight, calming skin redness and irritations.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-pink-300 group-hover:text-hot-pink transition-colors group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: TEXTURE PREFERENCE */}
              {step === 'texture' && (
                <motion.div
                  key="texture-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[10px] font-bold text-hot-pink uppercase tracking-widest">Question 2 of 3</span>
                    <h3 className="text-xl md:text-2xl font-serif text-zinc-950 font-bold mt-1">Which serum texture does your skin crave?</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <button
                      onClick={() => { setTexture('light'); setStep('aroma'); }}
                      className="w-full text-left p-4 rounded-2xl border border-pink-100 hover:border-hot-pink hover:bg-pink-50/10 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-hot-pink transition-colors">Ultra-Lightweight & Breathable Elixirs</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Absorbs instantly, leaves a clean satin water-finish with zero heaviness.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-pink-300 group-hover:text-hot-pink transition-colors group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => { setTexture('rich'); setStep('aroma'); }}
                      className="w-full text-left p-4 rounded-2xl border border-pink-100 hover:border-hot-pink hover:bg-pink-50/10 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-hot-pink transition-colors">Rich, Melting Whipped Crèmes & Oils</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Slow-release hydration barrier, ultra-comforting wrap for thirsty skin.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-pink-300 group-hover:text-hot-pink transition-colors group-hover:translate-x-1" />
                    </button>
                  </div>

                  <button 
                    onClick={() => setStep('goal')}
                    className="text-xs font-bold text-zinc-400 hover:text-hot-pink uppercase tracking-wider flex items-center gap-1"
                  >
                    ← Back to step 1
                  </button>
                </motion.div>
              )}

              {/* STEP 3: AROMA ESSENCE */}
              {step === 'aroma' && (
                <motion.div
                  key="aroma-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-[10px] font-bold text-hot-pink uppercase tracking-widest">Question 3 of 3</span>
                    <h3 className="text-xl md:text-2xl font-serif text-zinc-950 font-bold mt-1">What botanical fragrance calms your aura?</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <button
                      onClick={() => { setAroma('floral'); setStep('result'); }}
                      className="w-full text-left p-4 rounded-2xl border border-pink-100 hover:border-hot-pink hover:bg-pink-50/10 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-hot-pink transition-colors">Rose Bloom & White Peony Scent</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Freshly picked summer garden, romantic light, sweet clean floral notes.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-pink-300 group-hover:text-hot-pink transition-colors group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => { setAroma('earthy'); setStep('result'); }}
                      className="w-full text-left p-4 rounded-2xl border border-[#FFF0F5] hover:border-hot-pink hover:bg-pink-50/10 transition-all group flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-hot-pink transition-colors">French Lavender & Amber Musk</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Warm twilight woods, relaxing aromatherapeutic herbaceous lavender scent.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-pink-300 group-hover:text-hot-pink transition-colors group-hover:translate-x-1" />
                    </button>
                  </div>

                  <button 
                    onClick={() => setStep('texture')}
                    className="text-xs font-bold text-zinc-400 hover:text-hot-pink uppercase tracking-wider flex items-center gap-1"
                  >
                    ← Back to step 2
                  </button>
                </motion.div>
              )}

              {/* RESULT: BESPOKE BUNDLE DISCOVERED */}
              {step === 'result' && (
                <motion.div
                  key="result-step"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                        <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> Bespoke Match Formulated
                      </span>
                      <h3 className="text-xl md:text-2xl font-serif text-zinc-950 font-bold mt-2">{bundle.title}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed mt-1 max-w-xl">{bundle.slogan}</p>
                    </div>
                    
                    <button
                      onClick={resetQuiz}
                      className="text-zinc-400 hover:text-hot-pink p-2 rounded-full hover:bg-pink-50 transition-colors"
                      title="Re-formulate"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Matched Items Cards */}
                  <div className="grid grid-cols-3 gap-3 md:gap-4 pt-2">
                    {bundle.items.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => onOpenQuickView(item)}
                        className="group cursor-pointer bg-pink-50/15 border border-pink-100 rounded-2xl overflow-hidden p-2 text-center hover:border-hot-pink hover:bg-pink-50/20 transition-all relative"
                      >
                        <div className="aspect-[4/5] rounded-xl overflow-hidden mb-2 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          </div>
                        </div>
                        <h4 className="font-serif text-[10px] md:text-xs font-bold text-zinc-900 line-clamp-1 group-hover:text-hot-pink transition-colors">{item.name}</h4>
                        <p className="text-[9px] md:text-xs font-bold text-zinc-800 mt-0.5">${item.price}</p>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary and Purchase Button */}
                  <div className="pt-4 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <span className="text-zinc-400 line-through text-xs">${originalTotalPrice}</span>
                        <span className="text-xl font-black text-zinc-950">${bundleDiscountPrice}</span>
                      </div>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-0.5">Matched Routine Bundle Deal: Save ${savingsAmount} (20% Off!)</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={resetQuiz}
                        className="px-4 py-3 border border-pink-200 hover:bg-pink-50 text-zinc-600 rounded-full font-bold uppercase tracking-wider text-[10px]"
                      >
                        Start Over
                      </button>
                      <button
                        onClick={handleAddBundleToCart}
                        className="flex-1 sm:flex-none px-6 py-3 bg-[#2D142C] hover:bg-hot-pink text-[#FFF0F5] hover:text-white rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Buy Ritual Set
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
}
