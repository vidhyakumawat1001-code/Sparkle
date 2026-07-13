import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Heart,
  Plus,
  Minus,
  Trash2,
  Check,
  CreditCard,
  QrCode,
  Sparkles,
  Info,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { PRODUCTS, Product } from './constants';
import AdminPanel from './components/AdminPanel';
import HeroCarousel from './components/HeroCarousel';
import VanityMatchmaker from './components/VanityMatchmaker';
import QuickViewModal from './components/QuickViewModal';

export default function App() {
  // Top level state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sparkle_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return PRODUCTS;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Skincare' | 'Makeup' | 'Body Care'>('All');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Luxury Quick View State
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Checkout process states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment' | 'confirmation' | 'success'>('shipping');
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'paypal' | 'upi' | 'applepay'>('card');
  
  // Checkout form states
  const [shippingForm, setShippingForm] = useState({
    name: 'Vidhya Kumawat',
    email: 'vidhyakumawat1001@gmail.com',
    address: '102 Sparkle Luxury Avenue',
    city: 'Mumbai',
    zip: '400001',
    phone: '+91 98765 43210'
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '4111 2222 3333 4444',
    expiry: '12/28',
    cvv: '123',
    upiId: 'vidhya@paytm'
  });

  const [orderId, setOrderId] = useState('');

  // Save products to local storage
  useEffect(() => {
    localStorage.setItem('sparkle_products', JSON.stringify(products));
  }, [products]);

  // Product Admin handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setNotification(`"${newProduct.name}" uploaded to the catalog!`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    setNotification(`"${updatedProduct.name}" details updated!`);
    
    // Also update product details in cart if already there
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.product.id === updatedProduct.id 
          ? { ...item, product: updatedProduct } 
          : item
      )
    );
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (product) {
      setNotification(`"${product.name}" removed from the catalog.`);
    }
    // Also remove from cart
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleResetProducts = () => {
    setProducts(PRODUCTS);
    setNotification("Catalog restored to premium originals.");
    setCart([]);
  };

  // Auto-dismiss notification toast
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Scroll to section with a dynamic offset & filter selection
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, category: 'All' | 'Skincare' | 'Makeup' | 'Body Care') => {
    e.preventDefault();
    setActiveTab(category);
    
    const targetSection = document.getElementById('featured');
    if (targetSection) {
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    setNotification(`Filtering store for ${category}`);
  };

  const handleShopNowClick = () => {
    setActiveTab('All');
    const targetSection = document.getElementById('featured');
    if (targetSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setNotification(`"${product.name}" added to your Sparkle Cart!`);
  };

  const addMultipleToCart = (itemsToAdd: Product[]) => {
    setCart((prevCart) => {
      let newCart = [...prevCart];
      itemsToAdd.forEach((product) => {
        const existingIdx = newCart.findIndex((item) => item.product.id === product.id);
        if (existingIdx > -1) {
          newCart[existingIdx] = {
            ...newCart[existingIdx],
            quantity: newCart[existingIdx].quantity + 1
          };
        } else {
          newCart.push({ product, quantity: 1 });
        }
      });
      return newCart;
    });
    setNotification(`Premium 3-Step Routine Set added to your Bag!`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    setNotification('Item removed from cart');
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Pricing calculations
  const originalTotal = cart.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
  const discountedTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalSavings = originalTotal - discountedTotal;
  const shippingCost = discountedTotal > 50 ? 0 : discountedTotal > 0 ? 10 : 0;
  const finalTotal = discountedTotal + shippingCost;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const startCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setCheckoutStep('shipping');
  };

  const submitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('payment');
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('confirmation');
  };

  const placeOrder = () => {
    const randomId = 'SPK-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
    setCheckoutStep('success');
    setCart([]); // Clear cart upon successful order
  };

  // Search filter
  const filteredProductsBySearch = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'All' || product.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FFF5F6] selection:bg-brand-pink selection:text-zinc-950 text-zinc-800 font-sans antialiased overflow-x-hidden">
      
      {/* Promo banner at the top */}
      <div className="bg-[#1A0917] text-[#FFF0F5] text-center text-xs py-2 tracking-widest font-medium">
        ✨ MID-SUMMER BEAUTY SALE: EXTRA 20% OFF ALL PRODUCTS | FREE SHIPPING ON ORDERS OVER $50 ✨
      </div>

      {/* Sticky Header */}
      <Header 
        cartItemCount={cartItemCount} 
        onCartOpen={() => setIsCartOpen(true)}
        onNavClick={handleNavClick}
        activeTab={activeTab}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAdminOpen={() => setIsAdminOpen(true)}
      />

      {/* Main Sections */}
      <main className="relative pt-16">
        
        {/* Dynamic Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#2D142C] text-[#FFF0F5] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-pink-400/30 font-medium text-sm"
            >
              <Sparkles className="w-4 h-4 text-[#FFD1DC] animate-pulse" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <HeroCarousel onShopNowClick={handleShopNowClick} />

        <OfferBanners onShopNowClick={handleShopNowClick} />

        <CategorySection onCategorySelect={(cat) => {
          setActiveTab(cat);
          const targetSection = document.getElementById('featured');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }} />

        {/* Filterable Products Showcase */}
        <section id="featured" className="py-24 bg-[#FFF5F6] scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-hot-pink font-semibold tracking-widest uppercase text-xs mb-3 block">Luxurious Formulas</span>
              <h2 className="text-4xl md:text-5xl font-serif text-zinc-950 mb-4">Curated Sparkle Store</h2>
              <div className="w-16 h-1 bg-brand-pink mx-auto mb-6"></div>
              <p className="text-zinc-500 text-sm">
                Each formula is dermatologically refined with clinical grade active botanicals and rich minerals to let your true light shine.
              </p>
            </div>

            {/* Sticky/Interactive Tab Control */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
              {(['All', 'Skincare', 'Makeup', 'Body Care'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                    activeTab === tab 
                    ? 'bg-hot-pink text-white shadow-md shadow-pink-200 scale-105' 
                    : 'bg-white text-zinc-600 hover:bg-pink-100/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredProductsBySearch.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl p-8 shadow-sm">
                <Info className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-serif mb-2">No Products Found</h3>
                <p className="text-zinc-500">We couldn't find any products in "{activeTab}" category matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProductsBySearch.map((product) => {
                  const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                  const isFav = favorites.includes(product.id);
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={product.id}
                      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-100"
                    >
                      <div 
                        onClick={() => {
                          setSelectedProductForDetail(product);
                          setIsQuickViewOpen(true);
                        }}
                        className="relative aspect-[4/5] bg-pink-50/20 overflow-hidden cursor-pointer"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Interactive floating elements */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="bg-[#2D142C] text-[#FFF0F5] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                            {discountPct}% OFF
                          </span>
                          {product.isBestSeller && (
                            <span className="bg-brand-pink text-zinc-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                              BESTSELLER
                            </span>
                          )}
                          {product.isNew && (
                            <span className="bg-hot-pink text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                              NEW
                            </span>
                          )}
                        </div>

                        {/* Favorite button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                            setNotification(isFav ? 'Removed from favorites' : 'Saved to your wishlist!');
                          }}
                          className="absolute top-4 right-4 p-2.5 bg-white/95 hover:bg-white rounded-full shadow-md text-zinc-700 transition-colors z-10"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500 scale-110' : 'text-zinc-500'}`} />
                        </button>

                        {/* Dual Add to Cart & Quick View Overlay Buttons */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-pink-900/40 via-transparent to-transparent flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProductForDetail(product);
                              setIsQuickViewOpen(true);
                            }}
                            className="flex-1 py-3 bg-white text-[#2D142C] hover:bg-[#2D142C] hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-xl"
                          >
                            Quick View
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="flex-1 py-3 bg-[#2D142C] text-[#FFF0F5] hover:bg-hot-pink hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Add
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <p className="text-[10px] text-hot-pink font-semibold uppercase tracking-widest">{product.category}</p>
                            <h3 
                              onClick={() => {
                                setSelectedProductForDetail(product);
                                setIsQuickViewOpen(true);
                              }}
                              className="font-serif text-lg text-zinc-950 hover:text-hot-pink transition-colors mt-0.5 cursor-pointer font-bold"
                            >
                              {product.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 bg-pink-50 px-2 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                            <span className="text-xs font-semibold text-zinc-800">{product.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">{product.description}</p>

                        <div className="flex items-center justify-between border-t border-pink-50 pt-4 mt-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-zinc-950">${product.price}</span>
                            <span className="text-xs text-zinc-400 line-through">${product.originalPrice}</span>
                          </div>
                          <button 
                            onClick={() => addToCart(product)}
                            className="text-xs font-bold text-hot-pink hover:text-[#2D142C] tracking-wider uppercase flex items-center gap-1 transition-colors"
                          >
                            Add To Bag <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <VanityMatchmaker 
          products={products} 
          onAddMultiToCart={addMultipleToCart} 
          onOpenQuickView={(product) => { 
            setSelectedProductForDetail(product); 
            setIsQuickViewOpen(true); 
          }} 
        />

        <BrandStory />

        <Newsletter />
      </main>

      <Footer />

      {/* Admin Panel Overlay */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
      />

      {/* Premium detailed Quick View Modal overlay */}
      <QuickViewModal 
        product={selectedProductForDetail}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedProductForDetail(null);
        }}
        onAddToCart={addToCart}
        isFavorite={selectedProductForDetail ? favorites.includes(selectedProductForDetail.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* Cart Drawer Panel Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-[#2D142C]/50 backdrop-blur-sm"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
              >
                {/* Drawer Header */}
                <div className="px-6 py-6 bg-pink-50/80 border-b border-pink-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-hot-pink" />
                    <h2 className="text-xl font-serif">Your Sparkle Bag</h2>
                    <span className="bg-hot-pink text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {cartItemCount}
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 hover:bg-pink-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-600" />
                  </button>
                </div>

                {/* Drawer Contents */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                      <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-brand-pink" />
                      </div>
                      <h3 className="text-xl font-serif text-zinc-950 mb-2">Your cart is empty</h3>
                      <p className="text-zinc-500 text-sm max-w-xs mb-8">
                        Explore our premium organic formulas and add luxurious cosmetics to your vanity.
                      </p>
                      <button 
                        onClick={() => {
                          setIsCartOpen(false);
                          handleShopNowClick();
                        }}
                        className="px-8 py-3.5 bg-hot-pink text-white hover:bg-[#2D142C] transition-colors rounded-full font-medium text-xs tracking-widest uppercase"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const savings = (item.product.originalPrice - item.product.price) * item.quantity;
                      return (
                        <div key={item.product.id} className="flex gap-4 p-4 rounded-2xl bg-pink-50/30 border border-pink-100/50">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-20 h-24 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <span className="text-[9px] font-semibold text-hot-pink uppercase tracking-widest">{item.product.category}</span>
                            <h4 className="font-serif text-sm text-zinc-950 line-clamp-1 mt-0.5">{item.product.name}</h4>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{item.product.description.substring(0, 45)}...</p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm font-bold text-zinc-950">${item.product.price}</span>
                              <span className="text-[11px] text-zinc-400 line-through">${item.product.originalPrice}</span>
                            </div>

                            {/* Quantity controls */}
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-pink-100/30">
                              <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden bg-white">
                                <button 
                                  onClick={() => updateQuantity(item.product.id, -1)}
                                  className="px-2 py-1 hover:bg-pink-50 text-zinc-600 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 text-xs font-bold text-zinc-800">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.product.id, 1)}
                                  className="px-2 py-1 hover:bg-pink-50 text-zinc-600 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button 
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-zinc-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Drawer Footer Sticky Summary */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-pink-100 bg-pink-50/50 space-y-4">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-zinc-500">
                        <span>Original Subtotal</span>
                        <span className="line-through">${originalTotal}</span>
                      </div>
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Sparkle Discount Savings</span>
                        <span>-${totalSavings}</span>
                      </div>
                      <div className="flex justify-between text-zinc-500">
                        <span>Shipping</span>
                        <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-zinc-950 pt-2 border-t border-pink-100">
                        <span>Estimated Total</span>
                        <span>${finalTotal}</span>
                      </div>
                    </div>

                    <button 
                      onClick={startCheckout}
                      className="w-full py-4 bg-hot-pink text-white hover:bg-[#2D142C] transition-all rounded-full font-semibold tracking-widest text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-pink-200"
                    >
                      Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-zinc-400 text-center">
                      Secure checkout powered by Stripe. SSL Encrypted connection.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Modal Dialog */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 bg-[#2D142C]/60 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl z-10 border border-pink-100 flex flex-col md:flex-row max-h-[90vh]"
            >
              
              {/* Checkout Progress Left Side on Desktop */}
              <div className="p-8 bg-pink-50/50 md:w-5/12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-pink-100">
                <div>
                  <div className="flex items-center gap-2 text-hot-pink mb-4">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-serif text-lg tracking-tight font-bold">Checkout</span>
                  </div>
                  
                  {/* Visual Steps Indicator */}
                  <div className="space-y-4 my-8">
                    <StepIndicator step={1} active={checkoutStep === 'shipping'} completed={checkoutStep !== 'shipping'} label="Shipping Info" />
                    <StepIndicator step={2} active={checkoutStep === 'payment'} completed={checkoutStep === 'confirmation' || checkoutStep === 'success'} label="Payment Options" />
                    <StepIndicator step={3} active={checkoutStep === 'confirmation'} completed={checkoutStep === 'success'} label="Review & Pay" />
                    <StepIndicator step={4} active={checkoutStep === 'success'} completed={false} label="Success" />
                  </div>
                </div>

                <div className="hidden md:block pt-6 border-t border-pink-200/50">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-500">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span>Secure 256-bit SSL transaction verified by Sparkle Trust.</span>
                  </div>
                </div>
              </div>

              {/* Form Input Right Side */}
              <div className="p-8 flex-1 overflow-y-auto">
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-pink-50 rounded-full transition-colors text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>

                {checkoutStep === 'shipping' && (
                  <form onSubmit={submitShipping} className="space-y-4">
                    <h3 className="text-xl font-serif text-zinc-950 mb-4">Shipping Details</h3>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-hot-pink text-sm bg-pink-50/10"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-hot-pink text-sm bg-pink-50/10"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Shipping Address</label>
                      <input 
                        required
                        type="text" 
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-hot-pink text-sm bg-pink-50/10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">City</label>
                        <input 
                          required
                          type="text" 
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-hot-pink text-sm bg-pink-50/10"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">ZIP / Postal Code</label>
                        <input 
                          required
                          type="text" 
                          value={shippingForm.zip}
                          onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-hot-pink text-sm bg-pink-50/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                      <input 
                        required
                        type="text" 
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-hot-pink text-sm bg-pink-50/10"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-4 mt-4 bg-hot-pink text-white hover:bg-zinc-900 transition-colors rounded-full text-xs font-semibold uppercase tracking-widest"
                    >
                      Continue To Payment
                    </button>
                  </form>
                )}

                {checkoutStep === 'payment' && (
                  <form onSubmit={submitPayment} className="space-y-5">
                    <h3 className="text-xl font-serif text-zinc-950">Select Payment Option</h3>
                    
                    {/* Payment Mode Selector Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button"
                        onClick={() => setSelectedPayment('card')}
                        className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${selectedPayment === 'card' ? 'border-hot-pink bg-pink-50/30 text-hot-pink shadow-inner' : 'border-pink-100 hover:bg-pink-50/20'}`}
                      >
                        <CreditCard className="w-4 h-4" /> Credit Card
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSelectedPayment('paypal')}
                        className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${selectedPayment === 'paypal' ? 'border-hot-pink bg-pink-50/30 text-hot-pink shadow-inner' : 'border-pink-100 hover:bg-pink-50/20'}`}
                      >
                        <span className="font-bold italic text-blue-800">PayPal</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSelectedPayment('upi')}
                        className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${selectedPayment === 'upi' ? 'border-hot-pink bg-pink-50/30 text-hot-pink shadow-inner' : 'border-pink-100 hover:bg-pink-50/20'}`}
                      >
                        <QrCode className="w-4 h-4" /> UPI / NetBanking
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSelectedPayment('applepay')}
                        className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${selectedPayment === 'applepay' ? 'border-hot-pink bg-pink-50/30 text-hot-pink shadow-inner' : 'border-pink-100 hover:bg-pink-50/20'}`}
                      >
                        <span className="font-semibold text-zinc-900"> Pay</span>
                      </button>
                    </div>

                    {/* Specific Subform Views */}
                    {selectedPayment === 'card' && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Card Number</label>
                          <input 
                            required
                            type="text" 
                            value={paymentForm.cardNumber}
                            onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 text-sm bg-pink-50/10 focus:outline-none focus:ring-1 focus:ring-hot-pink"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Expiry Date</label>
                            <input 
                              required
                              type="text" 
                              placeholder="MM/YY"
                              value={paymentForm.expiry}
                              onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-pink-100 text-sm bg-pink-50/10 focus:outline-none focus:ring-1 focus:ring-hot-pink"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">CVV / CVC</label>
                            <input 
                              required
                              type="password" 
                              maxLength={3}
                              value={paymentForm.cvv}
                              onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-pink-100 text-sm bg-pink-50/10 focus:outline-none focus:ring-1 focus:ring-hot-pink"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPayment === 'paypal' && (
                      <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100 text-center space-y-2">
                        <p className="text-xs text-zinc-600">You will be securely redirected to PayPal sandbox to complete this payment.</p>
                        <span className="text-xs font-bold text-blue-700">vidhyakumawat1001@gmail.com</span>
                      </div>
                    )}

                    {selectedPayment === 'upi' && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">UPI ID (VPA)</label>
                          <input 
                            required
                            type="text" 
                            placeholder="username@bank"
                            value={paymentForm.upiId}
                            onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#D946EF]/20 text-sm bg-pink-50/10 focus:outline-none focus:ring-1 focus:ring-hot-pink"
                          />
                        </div>
                        <div className="p-3 bg-[#FFF5F6] border border-[#FFD1DC] rounded-xl flex items-center gap-3">
                          <QrCode className="w-8 h-8 text-[#D946EF]" />
                          <span className="text-[11px] text-zinc-500">Scan QR Code option will be prompt on submit.</span>
                        </div>
                      </div>
                    )}

                    {selectedPayment === 'applepay' && (
                      <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-center">
                        <p className="text-xs text-zinc-600">Complete the authentication prompt using FaceID or Apple TouchID security.</p>
                      </div>
                    )}

                    <div className="flex gap-4 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setCheckoutStep('shipping')}
                        className="flex-1 py-3.5 border border-pink-200 hover:bg-pink-50 rounded-full text-xs font-semibold uppercase tracking-widest text-zinc-600"
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 py-3.5 bg-hot-pink text-white hover:bg-zinc-900 rounded-full text-xs font-semibold uppercase tracking-widest shadow-md"
                      >
                        Review Order
                      </button>
                    </div>
                  </form>
                )}

                {checkoutStep === 'confirmation' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-serif text-zinc-950 mb-2">Order Review</h3>
                      <p className="text-xs text-zinc-500">Please review your delivery details before processing payment.</p>
                    </div>

                    <div className="p-4 bg-pink-50/30 rounded-2xl border border-pink-100 text-xs space-y-2">
                      <div className="flex justify-between"><span className="font-semibold">Deliver To:</span><span>{shippingForm.name}</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Address:</span><span className="text-right">{shippingForm.address}, {shippingForm.city}</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Phone:</span><span>{shippingForm.phone}</span></div>
                      <div className="flex justify-between"><span className="font-semibold">Payment Via:</span><span className="uppercase">{selectedPayment}</span></div>
                    </div>

                    <div className="border-t border-pink-100 pt-4">
                      <div className="flex justify-between text-base font-bold text-zinc-950">
                        <span>Total to Pay:</span>
                        <span>${finalTotal}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button 
                        onClick={() => setCheckoutStep('payment')}
                        className="flex-1 py-3.5 border border-pink-200 hover:bg-pink-50 rounded-full text-xs font-semibold uppercase tracking-widest text-zinc-600"
                      >
                        Modify Details
                      </button>
                      <button 
                        onClick={placeOrder}
                        className="flex-1 py-3.5 bg-zinc-950 text-white hover:bg-hot-pink rounded-full text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Sparkles className="w-4 h-4 text-[#FFD1DC]" /> Complete Checkout
                      </button>
                    </div>
                  </div>
                )}

                {checkoutStep === 'success' && (
                  <div className="text-center py-6 space-y-6">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                      <Check className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif text-zinc-950">Order Confirmed!</h3>
                      <p className="text-xs text-zinc-500">Thank you for choosing Sparkle, your luxury rituals are on the way.</p>
                      <p className="text-sm font-bold text-hot-pink pt-2">Order ID: {orderId}</p>
                    </div>

                    {/* Fun Interactive Order Tracker */}
                    <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100/50 text-left space-y-4">
                      <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-400">Order Status</h4>
                      
                      <div className="space-y-3">
                        <TrackerStep active={true} completed={true} title="Payment Captured" desc="Successfully paid via your selected method" />
                        <TrackerStep active={true} completed={false} title="Preparing Package" desc="Sanitized and securely bubble-wrapped" />
                        <TrackerStep active={false} completed={false} title="Dispatched with Premium Delivery" desc="Free fast-shipping partner courier" />
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsCheckoutOpen(false)}
                      className="w-full py-4 bg-hot-pink text-white hover:bg-[#2D142C] transition-colors rounded-full text-xs font-semibold uppercase tracking-widest"
                    >
                      Continue Exploring Store
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents helper
function Header({ 
  cartItemCount, 
  onCartOpen, 
  onNavClick,
  activeTab,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  onAdminOpen
}: { 
  cartItemCount: number; 
  onCartOpen: () => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, category: 'All' | 'Skincare' | 'Makeup' | 'Body Care') => void;
  activeTab: 'All' | 'Skincare' | 'Makeup' | 'Body Care';
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAdminOpen: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-10 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-3 shadow-md border-b border-pink-100' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Navigation links & Hamburger menu */}
        <div className="flex items-center gap-8">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-[#2D142C] hover:text-hot-pink p-1">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-widest uppercase">
            {(['Skincare', 'Makeup', 'Body Care'] as const).map((cat) => (
              <a 
                key={cat}
                href={`#${cat.toLowerCase()}`}
                onClick={(e) => onNavClick(e, cat)}
                className={`transition-colors relative pb-1 ${activeTab === cat ? 'text-hot-pink' : 'text-zinc-700 hover:text-hot-pink'}`}
              >
                {cat}
                {activeTab === cat && (
                  <motion.div layoutId="headerActiveIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-hot-pink" />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Beautiful brand logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group">
            <h1 className="text-3xl md:text-4xl font-serif tracking-widest text-[#2D142C] group-hover:text-hot-pink transition-colors">
              SPARKLE
            </h1>
          </a>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-4">
          
          {/* Interactive Search Expandable Area */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 160, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Search formulas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3.5 py-1.5 text-xs rounded-full border border-pink-200 bg-white/90 focus:outline-none focus:ring-1 focus:ring-hot-pink"
                />
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="p-2 text-zinc-700 hover:text-hot-pink rounded-full hover:bg-pink-50/50 transition-colors"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </div>

          <button 
            onClick={onAdminOpen}
            className="p-2 text-zinc-700 hover:text-hot-pink rounded-full hover:bg-pink-50/50 transition-colors flex items-center gap-1 px-2.5 py-1 border border-pink-100 bg-pink-50/20 text-[10px] font-bold uppercase tracking-widest transition-all"
            title="Admin Dashboard"
          >
            <ShieldCheck className="w-4 h-4 text-hot-pink" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Interactive Shopping Cart Icon Trigger */}
          <button 
            onClick={onCartOpen}
            className="p-2.5 bg-pink-100/80 hover:bg-pink-100 text-[#2D142C] hover:text-hot-pink rounded-full transition-all relative scale-105"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-hot-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <React.Fragment>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#2D142C]/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[110] p-8 flex flex-col justify-between"
            >
              <div className="space-y-12">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif text-[#2D142C] tracking-widest">SPARKLE</h2>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-pink-50 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-6 text-xl font-serif text-zinc-800">
                  <a href="#skincare" onClick={(e) => { setIsMobileMenuOpen(false); onNavClick(e, 'Skincare'); }} className="hover:text-hot-pink transition-colors">Skincare</a>
                  <a href="#makeup" onClick={(e) => { setIsMobileMenuOpen(false); onNavClick(e, 'Makeup'); }} className="hover:text-hot-pink transition-colors">Makeup</a>
                  <a href="#body-care" onClick={(e) => { setIsMobileMenuOpen(false); onNavClick(e, 'Body Care'); }} className="hover:text-hot-pink transition-colors">Body Care</a>
                  <a href="#featured" onClick={(e) => { setIsMobileMenuOpen(false); onNavClick(e, 'All'); }} className="hover:text-hot-pink transition-colors">Featured Shop</a>
                  <button 
                    onClick={() => { setIsMobileMenuOpen(false); onAdminOpen(); }} 
                    className="hover:text-hot-pink text-left font-serif text-xl flex items-center gap-2 transition-colors border-t border-pink-100 pt-4"
                  >
                    <ShieldCheck className="w-5 h-5 text-hot-pink" /> Sparkle Admin Portal
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-pink-100">
                <div className="flex gap-4">
                  <Instagram className="w-5 h-5 text-zinc-400 hover:text-hot-pink cursor-pointer" />
                  <Facebook className="w-5 h-5 text-zinc-400 hover:text-hot-pink cursor-pointer" />
                  <Twitter className="w-5 h-5 text-zinc-400 hover:text-hot-pink cursor-pointer" />
                </div>
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero({ onShopNowClick }: { onShopNowClick: () => void }) {
  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden bg-gradient-to-r from-pink-50 to-pink-100">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=1920" 
          alt="Luxury Beauty" 
          className="w-full h-full object-cover mix-blend-multiply opacity-60"
          referrerPolicy="no-referrer"
        />
        {/* Soft pink gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F6] via-[#FFF5F6]/70 to-transparent"></div>
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#FFF0F5]/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 bg-pink-100/80 backdrop-blur-sm border border-pink-200/50 px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-hot-pink" />
            <span className="text-hot-pink font-bold tracking-[0.2em] uppercase text-[10px]">
              CRUELTY-FREE & VEGAN
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-serif leading-tight mb-6 text-zinc-950 font-bold">
            Organic Glow. <br />
            <span className="italic text-hot-pink font-medium font-serif">Naturally Beautiful.</span>
          </h2>

          <p className="text-zinc-600 text-sm md:text-base mb-10 max-w-md leading-relaxed">
            Experience organic botanical luxury. Sparkle formulas combine clinical botanicals with minerals for 24-hour weightless radiance. Now up to <strong className="text-hot-pink">20% off</strong>.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onShopNowClick}
              className="px-10 py-4 bg-[#2D142C] text-[#FFF0F5] hover:bg-hot-pink hover:text-white transition-all rounded-full font-medium tracking-wider text-xs uppercase flex items-center gap-2 group shadow-lg shadow-pink-900/10"
            >
              Shop Sale Collection
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onShopNowClick}
              className="px-10 py-4 border border-[#2D142C] text-zinc-800 hover:bg-[#2D142C] hover:text-white transition-all rounded-full font-medium tracking-wider text-xs uppercase"
            >
              Explore Rituals
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === 0 ? 'bg-hot-pink w-6' : 'bg-hot-pink/30'}`}></div>
        ))}
      </div>
    </section>
  );
}

function OfferBanners({ onShopNowClick }: { onShopNowClick: () => void }) {
  const offers = [
    {
      title: "Glow & Serums",
      subtitle: "Upto 20% Off",
      desc: "Rose quartz & essential active oils for glowing hydration.",
      image: "https://images.unsplash.com/photo-1570172619380-4197bfd1445b?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Luxury Lip Velvet",
      subtitle: "Flat 15% Off",
      desc: "Vegan matte cushion lipsticks with weightless feel.",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <section className="py-12 bg-[#FFF5F6]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {offers.map((offer, idx) => (
          <div 
            key={idx}
            className="rounded-3xl overflow-hidden relative min-h-[220px] flex items-center group shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-pink-100"
          >
            <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
              <img 
                src={offer.image} 
                alt={offer.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="p-8 w-7/12 relative z-10 space-y-3">
              <span className="text-xs font-bold text-hot-pink tracking-widest uppercase bg-pink-100/80 px-2.5 py-1 rounded-full">{offer.subtitle}</span>
              <h3 className="text-2xl font-serif font-bold text-zinc-950">{offer.title}</h3>
              <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">{offer.desc}</p>
              <button 
                onClick={onShopNowClick}
                className="text-xs font-bold text-zinc-800 hover:text-hot-pink flex items-center gap-1.5 pt-2"
              >
                Claim Offer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategorySection({ onCategorySelect }: { onCategorySelect: (cat: 'Skincare' | 'Makeup' | 'Body Care') => void }) {
  const categories = [
    { name: 'Skincare', image: 'https://images.unsplash.com/photo-1570172619380-4197bfd1445b?auto=format&fit=crop&q=80&w=800', color: 'bg-[#FFF0F5]' },
    { name: 'Makeup', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800', color: 'bg-[#FFF5F6]' },
    { name: 'Body Care', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800', color: 'bg-pink-50' }
  ] as const;

  return (
    <section className="py-24 bg-white rounded-t-[50px] border-t border-pink-100 shadow-inner">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
          <div>
            <span className="text-hot-pink font-semibold tracking-widest uppercase text-xs mb-3 block">GORGEOUS VANITY</span>
            <h2 className="text-4xl font-serif text-zinc-950">Shop by Category</h2>
            <div className="w-16 h-1 bg-brand-pink mt-3"></div>
          </div>
          <p className="text-zinc-500 text-xs max-w-md">
            Sparkle products are designed to cover your full beauty ritual. Explore tailored organic items.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              id={cat.name.toLowerCase().replace(' ', '-')}
              whileHover={{ y: -8 }}
              onClick={() => onCategorySelect(cat.name)}
              className={`relative aspect-[4/5] overflow-hidden rounded-[30px] group cursor-pointer shadow-sm border border-pink-100/50 ${cat.color}`}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D142C]/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 space-y-2">
                <h3 className="text-2xl md:text-3xl font-serif text-white">{cat.name}</h3>
                <span className="text-[#FFF0F5]/90 text-xs tracking-widest uppercase flex items-center gap-1.5">
                  Explore Collection <ChevronRight className="w-4 h-4 text-brand-pink" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  const benefits = [
    { title: "Cruelty Free & Vegan", icon: Sparkles, desc: "Never tested on animals. PETA-certified formulas only." },
    { title: "Sustainably Sourced", icon: Truck, desc: "Recycled blush quartz and sustainable zero-waste harvest." },
    { title: "30-Day Happiness Guarantee", icon: RotateCcw, desc: "Return opened products if you aren't completely in love." }
  ];

  return (
    <section className="py-24 bg-[#2D142C] text-[#FFF0F5] overflow-hidden rounded-[50px] my-12 mx-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-[30px] overflow-hidden border border-pink-300/20 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800" 
                alt="Brand Story" 
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-hot-pink rounded-3xl -z-10 opacity-20 hidden md:block"></div>
          </div>
          <div className="space-y-8">
            <div>
              <span className="text-hot-pink font-semibold tracking-widest uppercase text-xs mb-3 block">Sparkle Philosophy</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">Beauty that Sparkles from Within</h2>
              <div className="w-12 h-1 bg-hot-pink mt-4"></div>
            </div>
            <p className="text-[#FFF0F5]/70 text-sm leading-relaxed">
              We founded Sparkle on the simple standard that luxury cosmetics should be clean, vegan, and incredibly glowing. We combine active natural flowers with modern scientific peptide complexes to balance your skin's natural pH and seal in water.
            </p>
            
            <div className="space-y-4">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="p-3 bg-pink-100/10 rounded-2xl flex items-center justify-center">
                    <b.icon className="w-5 h-5 text-hot-pink" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{b.title}</h4>
                    <p className="text-xs text-[#FFF0F5]/50 mt-1">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="px-10 py-4 bg-[#FFD1DC] text-zinc-950 hover:bg-white transition-all rounded-full font-semibold tracking-wider text-xs uppercase shadow-xl">
              Our Full Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSuccess(true);
      setEmail('');
    }
  };

  return (
    <section className="py-24 bg-gradient-to-r from-pink-100 via-[#FFF0F5] to-pink-100">
      <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
        <span className="text-hot-pink font-bold tracking-widest uppercase text-xs">SPARKLE MEMBERSHIP</span>
        <h2 className="text-3xl md:text-5xl font-serif text-[#2D142C]">Join the Sparkle Club</h2>
        <p className="text-zinc-600 text-sm max-w-lg mx-auto">
          Get customized beauty insights, early product drops, and exclusive secret discounts. Sign up today and save <strong className="text-hot-pink">15% on your first ritual</strong>.
        </p>
        
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-white rounded-2xl max-w-md mx-auto border border-pink-200 text-sm font-medium text-[#2D142C]"
          >
            🎉 Welcome to the Family! Check your inbox for your 15% discount code.
          </motion.div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              required
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-full bg-white border border-pink-200 focus:outline-none focus:ring-2 focus:ring-hot-pink text-sm shadow-inner"
            />
            <button className="px-8 py-3.5 bg-[#2D142C] text-[#FFF0F5] hover:bg-hot-pink hover:text-white transition-all rounded-full font-semibold tracking-wider text-xs uppercase shadow-md">
              Subscribe
            </button>
          </form>
        )}
        <p className="text-[10px] text-zinc-400">
          We respect your privacy. Unsubscribe easily at any time.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-[#2D142C] tracking-widest">SPARKLE</h2>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
              Formulated to nurture, hydrate, and brighten your vanity space with clean botanical rituals.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 bg-pink-50 rounded-full hover:bg-brand-pink transition-colors"><Instagram className="w-4 h-4 text-zinc-600" /></a>
              <a href="#" className="p-2.5 bg-pink-50 rounded-full hover:bg-brand-pink transition-colors"><Facebook className="w-4 h-4 text-zinc-600" /></a>
              <a href="#" className="p-2.5 bg-pink-50 rounded-full hover:bg-brand-pink transition-colors"><Twitter className="w-4 h-4 text-zinc-600" /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold uppercase tracking-widest text-xs text-zinc-400 mb-6">Our Collections</h3>
            <ul className="space-y-3 text-xs text-zinc-500 font-medium">
              <li><a href="#skincare" className="hover:text-hot-pink transition-colors">Skincare Elixirs</a></li>
              <li><a href="#makeup" className="hover:text-hot-pink transition-colors">Velvet Makeup</a></li>
              <li><a href="#body-care" className="hover:text-hot-pink transition-colors">Rich Body Care</a></li>
              <li><a href="#featured" className="hover:text-hot-pink transition-colors">All Products</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-widest text-xs text-zinc-400 mb-6">Customer Care</h3>
            <ul className="space-y-3 text-xs text-zinc-500 font-medium">
              <li><a href="#" className="hover:text-hot-pink transition-colors">Support Helpline</a></li>
              <li><a href="#" className="hover:text-hot-pink transition-colors">Shipping & Returns policy</a></li>
              <li><a href="#" className="hover:text-hot-pink transition-colors">Frequently Asked FAQs</a></li>
              <li><a href="#" className="hover:text-hot-pink transition-colors">Find a Boutique Store</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-widest text-xs text-zinc-400 mb-6">Secured Checkout</h3>
            <div className="space-y-4">
              <p className="text-xs text-zinc-500 leading-relaxed">
                Accepted: Visa, MasterCard, Paypal, Apple Pay, Google Pay, NetBanking/UPI.
              </p>
              <div className="flex flex-wrap gap-2.5 items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-70" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-70" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-70" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-pink-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-400">
          <p>© 2026 SPARKLE Luxury Cosmetics. Designed for modern organic rituals.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-600">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function StepIndicator({ step, active, completed, label }: { step: number; active: boolean; completed: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
        completed 
        ? 'bg-green-600 text-white' 
        : active 
        ? 'bg-[#2D142C] text-[#FFF0F5] scale-110 shadow-md ring-2 ring-pink-200' 
        : 'bg-pink-100 text-zinc-500'
      }`}>
        {completed ? <Check className="w-4 h-4" /> : step}
      </div>
      <span className={`text-xs font-semibold ${active ? 'text-[#2D142C]' : 'text-zinc-400'}`}>{label}</span>
    </div>
  );
}

function TrackerStep({ active, completed, title, desc }: { active: boolean; completed: boolean; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-3.5 h-3.5 rounded-full border-2 ${
          completed 
          ? 'bg-green-600 border-green-600' 
          : active 
          ? 'bg-hot-pink border-hot-pink animate-pulse' 
          : 'bg-zinc-200 border-zinc-200'
        }`} />
        <div className="w-0.5 h-8 bg-zinc-200" />
      </div>
      <div>
        <h5 className={`text-xs font-semibold ${active ? 'text-zinc-800' : 'text-zinc-400'}`}>{title}</h5>
        <p className="text-[10px] text-zinc-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
