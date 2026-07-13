import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShoppingBag, 
  Star, 
  Heart, 
  Check, 
  Sparkles,
  Shield,
  Leaf,
  Droplet,
  Compass
} from 'lucide-react';
import { Product } from '../constants';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite
}: QuickViewModalProps) {
  if (!product) return null;

  // Derive specialized premium details based on category
  const getProductDetails = (cat: string) => {
    switch (cat) {
      case 'Skincare':
        return {
          ingredients: [
            'Bio-Fermented Rose Extract',
            'Vegan Squalane',
            'Triple-Weight Hyaluronic Acid',
            'White Peony Peptides',
            '24K Gold Flake Infusion'
          ],
          ritual: 'Warm 2-3 drops in the palms of your hands. Press gently into cleansed, damp skin morning and evening. Sweep upwards and outwards for a sculpted, luminous finish.',
          certifications: ['Cruelty-Free', '100% Vegan', 'Dermatologist Tested', 'Gluten-Free']
        };
      case 'Makeup':
        return {
          ingredients: [
            'Organic Cold-Pressed Shea Butter',
            'Mineral Micro-Light Reflectors',
            'Rosehip Seed Elixir',
            'Wild Candelilla Wax',
            'Botanical Vitamin E'
          ],
          ritual: 'Glide smoothly over lips or blend gently onto high points of the face using fingertips. Build layers to transition from a sheer daytime tint to a bold, rich velvet finish.',
          certifications: ['Non-Comedogenic', 'Lead-Free Pigments', 'Fragrance-Free', 'Clean Mineral Base']
        };
      case 'Body Care':
      default:
        return {
          ingredients: [
            'Cold-Pressed Sweet Almond Oil',
            'French Pink Clay Minerals',
            'Dead Sea Crystallized Salts',
            'Organic Roman Chamomile Extract',
            'Pure Unrefined Cocoa Butter'
          ],
          ritual: 'Apply generously over the body immediately after a warm bath while skin is damp. Massage in circular luxury strokes to lock in absolute moisture and soothe the senses.',
          certifications: ['Paraben-Free', '100% Biodegradable', 'Ethically Sourced', 'Synthetic-Dye Free']
        };
    }
  };

  const details = getProductDetails(product.category);
  const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2D142C]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative bg-white rounded-[32px] overflow-hidden max-w-4xl w-full shadow-2xl z-10 border border-pink-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm hover:bg-pink-50 rounded-full transition-colors text-zinc-600 shadow-sm border border-pink-100/50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Premium Image with Badges */}
            <div className="md:w-1/2 relative bg-pink-50/20 aspect-[4/5] md:aspect-auto overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent hidden md:block" />
              
              {/* Floating luxury stickers */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-[#2D142C] text-[#FFF0F5] text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  {discountPct}% OFF
                </span>
                {product.isBestSeller && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    BESTSELLER
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-pink-100 text-hot-pink border border-pink-200 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    NEW FORMULA
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Product Info */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & Rating */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-hot-pink uppercase tracking-[0.2em]">{product.category}</span>
                  <div className="flex items-center gap-1 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100/50">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-zinc-800">{product.rating}</span>
                    <span className="text-[10px] text-zinc-400 font-sans">({product.reviews} reviews)</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-zinc-950 tracking-wide">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-zinc-950">${product.price}</span>
                  <span className="text-sm text-zinc-400 line-through">${product.originalPrice}</span>
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    Save ${product.originalPrice - product.price}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-zinc-600 leading-relaxed font-sans">
                  {product.description}
                </p>

                {/* Interactive Formula Ingredients Section */}
                <div className="space-y-2 pt-2 border-t border-pink-50">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <Leaf className="w-3.5 h-3.5 text-hot-pink" /> Core Luxury Ingredients
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {details.ingredients.map((ing, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] md:text-xs text-zinc-700 bg-pink-50/50 border border-pink-100/50 px-2.5 py-1 rounded-full hover:border-hot-pink transition-colors"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Application Ritual */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <Droplet className="w-3.5 h-3.5 text-hot-pink" /> The Application Ritual
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed font-sans italic bg-pink-50/20 p-3 rounded-2xl border border-pink-100/30">
                    "{details.ritual}"
                  </p>
                </div>

                {/* Certifications / Badges */}
                <div className="flex gap-4 pt-2">
                  {details.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                      <Check className="w-3 h-3 text-green-600" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase and Favorite Controls */}
              <div className="pt-4 border-t border-pink-100 flex items-center gap-3">
                <button
                  onClick={() => {
                    onToggleFavorite(product.id);
                  }}
                  className={`p-3.5 border rounded-full transition-all ${
                    isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-500' 
                    : 'border-pink-200 text-zinc-500 hover:bg-pink-50/50'
                  }`}
                  title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                </button>

                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-1 py-3.5 bg-[#2D142C] hover:bg-hot-pink text-[#FFF0F5] hover:text-white rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  Reserve & Add to Cart
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
