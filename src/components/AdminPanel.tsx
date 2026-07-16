import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  RotateCcw, 
  Sparkles, 
  Check, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { Product } from '../constants';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetProducts: () => void;
}

// Collection of ultra-premium royalty-free cosmetics/skincare images from Unsplash
const IMAGE_PRESETS = [
  {
    name: 'Luxury Essence',
    url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800',
    category: 'Skincare'
  },
  {
    name: 'Blossom Tonic',
    url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
    category: 'Skincare'
  },
  {
    name: 'Rose Quartz Serum',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    category: 'Skincare'
  },
  {
    name: 'Cushion Lipstick',
    url: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=800',
    category: 'Makeup'
  },
  {
    name: 'Highlighter Glow',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
    category: 'Makeup'
  },
  {
    name: 'Nude Lip Gloss',
    url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
    category: 'Makeup'
  },
  {
    name: 'Botanical Oil',
    url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800',
    category: 'Body Care'
  },
  {
    name: 'Silk Body Cream',
    url: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=800',
    category: 'Body Care'
  },
  {
    name: 'Peony Bath Salts',
    url: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&q=80&w=800',
    category: 'Body Care'
  },
];

export default function AdminPanel({
  isOpen,
  onClose,
  onLogout,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Skincare' | 'Makeup' | 'Body Care'>('Skincare');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [rating, setRating] = useState('4.8');
  const [reviews, setReviews] = useState('45');

  // Image Source Option
  const [imageType, setImageType] = useState<'preset' | 'url' | 'upload'>('preset');
  const [selectedPresetUrl, setSelectedPresetUrl] = useState(IMAGE_PRESETS[0].url);
  const [customUrl, setCustomUrl] = useState('');
  const [uploadedBase64, setUploadedBase64] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Error/Success state
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Setup Form for Editing
  const startEditing = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setOriginalPrice(product.originalPrice.toString());
    setDescription(product.description);
    setIsNew(!!product.isNew);
    setIsBestSeller(!!product.isBestSeller);
    setRating(product.rating.toString());
    setReviews(product.reviews.toString());
    
    // Determine image type
    const matchingPreset = IMAGE_PRESETS.find(p => p.url === product.image);
    if (matchingPreset) {
      setImageType('preset');
      setSelectedPresetUrl(product.image);
    } else if (product.image.startsWith('data:image')) {
      setImageType('upload');
      setUploadedBase64(product.image);
    } else {
      setImageType('url');
      setCustomUrl(product.image);
    }
    
    setActiveTab('add');
    setFormError('');
    setSuccessMessage('');
  };

  // Cancel Editing
  const cancelEditing = () => {
    setEditingProduct(null);
    clearForm();
  };

  // Reset form helper
  const clearForm = () => {
    setName('');
    setCategory('Skincare');
    setPrice('');
    setOriginalPrice('');
    setDescription('');
    setIsNew(false);
    setIsBestSeller(false);
    setRating('4.8');
    setReviews('35');
    setImageType('preset');
    setSelectedPresetUrl(IMAGE_PRESETS[0].url);
    setCustomUrl('');
    setUploadedBase64('');
    setFormError('');
  };

  // Base64 file reader
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG/JPG)');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedBase64(reader.result as string);
      setFormError('');
    };
    reader.readAsDataURL(file);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!name.trim()) return setFormError('Product Name is required');
    if (!description.trim()) return setFormError('Description is required');
    
    const priceNum = parseFloat(price);
    const origPriceNum = parseFloat(originalPrice) || priceNum;

    if (isNaN(priceNum) || priceNum <= 0) {
      return setFormError('Please enter a valid price greater than 0');
    }

    let finalImageUrl = '';
    if (imageType === 'preset') {
      finalImageUrl = selectedPresetUrl;
    } else if (imageType === 'url') {
      if (!customUrl.trim()) return setFormError('Please enter a valid image URL');
      finalImageUrl = customUrl.trim();
    } else {
      if (!uploadedBase64) return setFormError('Please upload an image file');
      finalImageUrl = uploadedBase64;
    }

    const ratingNum = parseFloat(rating) || 4.8;
    const reviewsNum = parseInt(reviews) || 12;

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : (Date.now()).toString(),
      name: name.trim(),
      category,
      price: priceNum,
      originalPrice: origPriceNum,
      image: finalImageUrl,
      description: description.trim(),
      rating: ratingNum,
      reviews: reviewsNum,
      isNew: isNew ? true : undefined,
      isBestSeller: isBestSeller ? true : undefined
    };

    if (editingProduct) {
      onUpdateProduct(newProduct);
      setSuccessMessage('Product updated beautifully!');
      setEditingProduct(null);
    } else {
      onAddProduct(newProduct);
      setSuccessMessage('Product added to Sparkle catalog!');
    }

    clearForm();
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#241329]/50 backdrop-blur-sm"
          />

          {/* Side Drawer Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="relative w-screen max-w-2xl bg-white shadow-2xl flex flex-col h-full z-10 border-l border-pink-100"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-[#1A0E1D] text-[#F6E9E5] flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-hot-pink flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold tracking-wider">Sparkle Studio Admin</h2>
                  <p className="text-[10px] text-pink-200/80 tracking-widest uppercase">Luxury Catalog Portal</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-pink-100 hover:bg-pink-900/40 rounded-full transition-colors"
                  title="Log out of admin"
                >
                  Log Out
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 text-pink-100 hover:bg-pink-900/40 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-tabs selection */}
            <div className="flex border-b border-pink-100 bg-pink-50/40 p-1.5 gap-2">
              <button
                onClick={() => { setActiveTab('add'); setFormError(''); }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                  activeTab === 'add'
                  ? 'bg-[#241329] text-white shadow-sm'
                  : 'text-zinc-600 hover:bg-pink-100/40'
                }`}
              >
                {editingProduct ? '✏️ Edit Formula' : '✨ Upload Formula'}
              </button>
              <button
                onClick={() => { setActiveTab('manage'); setFormError(''); }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                  activeTab === 'manage'
                  ? 'bg-[#241329] text-white shadow-sm'
                  : 'text-zinc-600 hover:bg-pink-100/40'
                }`}
              >
                👜 Manage Catalog ({products.length})
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Messages Feedback */}
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 flex items-center gap-3 text-xs"
                >
                  <Check className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="font-medium">{successMessage}</span>
                </motion.div>
              )}

              {formError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-center gap-3 text-xs"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="font-medium">{formError}</span>
                </motion.div>
              )}

              {/* TAB 1: ADD / EDIT PRODUCT */}
              {activeTab === 'add' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Form section header */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-base text-zinc-900 font-bold">
                      {editingProduct ? `Modify Product: "${editingProduct.name}"` : 'Formulate a New Luxury Product'}
                    </h3>
                    {editingProduct && (
                      <button 
                        type="button" 
                        onClick={cancelEditing}
                        className="text-[10px] text-hot-pink hover:underline uppercase font-bold tracking-wider"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Product Name</label>
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Gilded Nectar Face Mist"
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 text-sm bg-pink-50/10 focus:outline-none focus:ring-2 focus:ring-hot-pink"
                      />
                    </div>

                    {/* Category & Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full px-4 py-3 rounded-xl border border-pink-100 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hot-pink"
                        >
                          <option value="Skincare">Skincare</option>
                          <option value="Makeup">Makeup</option>
                          <option value="Body Care">Body Care</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Price ($)</label>
                        <input 
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="65"
                          className="w-full px-4 py-3 rounded-xl border border-pink-100 text-sm bg-pink-50/10 focus:outline-none focus:ring-2 focus:ring-hot-pink"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Original Price ($)</label>
                        <input 
                          type="number"
                          min="0"
                          step="0.01"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          placeholder="80 (Leave blank for no discount)"
                          className="w-full px-4 py-3 rounded-xl border border-pink-100 text-sm bg-pink-50/10 focus:outline-none focus:ring-2 focus:ring-hot-pink"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Short Formula Description</label>
                      <textarea 
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Explain the luxurious botanical ingredients, application effects, and organic results..."
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 text-sm bg-pink-50/10 focus:outline-none focus:ring-2 focus:ring-hot-pink resize-none"
                      />
                    </div>

                    {/* Rating & Reviews Simulators */}
                    <div className="grid grid-cols-2 gap-4 bg-pink-50/20 p-4 rounded-2xl border border-pink-100/50">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Rating (1.0 - 5.0)</label>
                        <input 
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-pink-100 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-hot-pink"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Reviews Count</label>
                        <input 
                          type="number"
                          min="0"
                          value={reviews}
                          onChange={(e) => setReviews(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-pink-100 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-hot-pink"
                        />
                      </div>
                    </div>

                    {/* Highlights / Badges */}
                    <div className="flex gap-6 p-1">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={isNew}
                          onChange={(e) => setIsNew(e.target.checked)}
                          className="w-4 h-4 rounded text-hot-pink focus:ring-hot-pink border-pink-200"
                        />
                        <span className="text-xs text-zinc-700 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-hot-pink" /> Mark as "NEW"
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={isBestSeller}
                          onChange={(e) => setIsBestSeller(e.target.checked)}
                          className="w-4 h-4 rounded text-hot-pink focus:ring-hot-pink border-pink-200"
                        />
                        <span className="text-xs text-zinc-700 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Mark as "BESTSELLER"
                        </span>
                      </label>
                    </div>

                    {/* Image Selector & Uploader Section */}
                    <div className="space-y-3 pt-2">
                      <label className="block text-[10px] font-bold text-[#241329] uppercase tracking-widest">Product Representation Image</label>
                      
                      {/* Tabs for Image Input Mode */}
                      <div className="flex gap-2 bg-pink-50 p-1 rounded-xl text-xs">
                        <button
                          type="button"
                          onClick={() => setImageType('preset')}
                          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${imageType === 'preset' ? 'bg-white font-semibold text-hot-pink shadow-sm' : 'text-zinc-500'}`}
                        >
                          Choose Preset
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageType('upload')}
                          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${imageType === 'upload' ? 'bg-white font-semibold text-hot-pink shadow-sm' : 'text-zinc-500'}`}
                        >
                          Drag & Drop File
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageType('url')}
                          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${imageType === 'url' ? 'bg-white font-semibold text-hot-pink shadow-sm' : 'text-zinc-500'}`}
                        >
                          Custom URL
                        </button>
                      </div>

                      {/* 1. Preset Gallery */}
                      {imageType === 'preset' && (
                        <div className="grid grid-cols-5 gap-2 p-1 border border-pink-100 rounded-2xl bg-pink-50/10">
                          {IMAGE_PRESETS.map((preset) => (
                            <button
                              key={preset.url}
                              type="button"
                              onClick={() => setSelectedPresetUrl(preset.url)}
                              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                                selectedPresetUrl === preset.url 
                                ? 'border-hot-pink scale-95 shadow-inner' 
                                : 'border-transparent hover:border-pink-300'
                              }`}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white py-0.5 truncate text-center font-sans">
                                {preset.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* 2. Drag and Drop File Upload */}
                      {imageType === 'upload' && (
                        <div 
                          onDragEnter={onDrag}
                          onDragLeave={onDrag}
                          onDragOver={onDrag}
                          onDrop={onDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                            dragActive 
                            ? 'border-hot-pink bg-pink-50/20' 
                            : uploadedBase64 
                              ? 'border-green-400 bg-green-50/10' 
                              : 'border-pink-200 hover:border-hot-pink bg-pink-50/5'
                          }`}
                        >
                          <input 
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                            }}
                          />
                          
                          {uploadedBase64 ? (
                            <div className="flex items-center justify-center gap-4">
                              <img src={uploadedBase64} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-pink-100" />
                              <div className="text-left">
                                <p className="text-xs font-bold text-green-700">Image Uploaded Successfully</p>
                                <p className="text-[10px] text-zinc-400">Click or drag another to replace</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 text-pink-400 mx-auto" />
                              <p className="text-xs font-bold text-[#241329]">Drag & drop product photo here</p>
                              <p className="text-[10px] text-zinc-400">or click to browse your files (PNG, JPG)</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. Custom URL Text Input */}
                      {imageType === 'url' && (
                        <div className="space-y-2">
                          <input 
                            type="url"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full px-4 py-3 rounded-xl border border-pink-100 text-xs bg-pink-50/10 focus:outline-none focus:ring-2 focus:ring-hot-pink"
                          />
                          <p className="text-[10px] text-zinc-400 flex items-center gap-1 pl-1">
                            <ImageIcon className="w-3.5 h-3.5 text-hot-pink" /> Preview renders on catalog immediately upon submission.
                          </p>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Submission buttons */}
                  <div className="pt-4 border-t border-pink-100 flex gap-3">
                    <button
                      type="button"
                      onClick={clearForm}
                      className="flex-1 py-3.5 border border-pink-200 hover:bg-pink-50 text-zinc-600 rounded-full font-bold uppercase tracking-wider text-xs"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-hot-pink hover:bg-zinc-950 text-white rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-200"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      {editingProduct ? 'Save Formula Changes' : 'Upload Catalog Formula'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: MANAGE CATALOG */}
              {activeTab === 'manage' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Demo Sandbox Controls</h4>
                      <p className="text-[10px] text-zinc-500">Need to restore original preset products? Click reset below.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to restore the default catalog? This will overwrite your custom items.')) {
                          onResetProducts();
                          setSuccessMessage('Store catalog reset to defaults!');
                          setTimeout(() => setSuccessMessage(''), 3000);
                        }
                      }}
                      className="px-3 py-1.5 bg-white text-zinc-700 border border-pink-200 hover:bg-pink-50 hover:text-hot-pink rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                    </button>
                  </div>

                  {/* Products Table/List */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-base text-zinc-900 font-bold">Catalog Items ({products.length})</h3>

                    <div className="divide-y divide-pink-100 border border-pink-100 rounded-2xl overflow-hidden bg-white">
                      {products.map((p) => (
                        <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-pink-50/10 transition-colors">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-12 h-14 object-cover rounded-lg border border-pink-100 bg-pink-50" 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-hot-pink uppercase tracking-widest bg-pink-50 px-2 py-0.5 rounded-full">{p.category}</span>
                              {p.isBestSeller && <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.2 rounded">Best</span>}
                              {p.isNew && <span className="bg-pink-100 text-hot-pink text-[8px] font-bold px-1.5 py-0.2 rounded">New</span>}
                            </div>
                            <h4 className="font-serif text-xs font-bold text-zinc-950 truncate mt-1">{p.name}</h4>
                            <p className="text-[10px] text-zinc-500 mt-0.5">${p.price} <span className="line-through text-zinc-400 text-[9px]">${p.originalPrice}</span></p>
                          </div>

                          {/* Controls */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(p)}
                              title="Edit product"
                              className="p-2 text-zinc-400 hover:text-hot-pink hover:bg-pink-50 rounded-xl transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                  onDeleteProduct(p.id);
                                  setSuccessMessage(`"${p.name}" deleted from catalog`);
                                  setTimeout(() => setSuccessMessage(''), 3000);
                                }
                              }}
                              title="Delete product"
                              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Footer Status info */}
            <div className="px-6 py-4 bg-pink-50 border-t border-pink-100 flex justify-between items-center text-[10px] text-zinc-400">
              <span>All additions persist locally in your browser's Cache.</span>
              <span>🔒 SSL Encrypted Portal</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
