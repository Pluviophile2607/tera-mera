import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { apiUrl } from './lib/api';

const Tera = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Tools',
    condition: 'Brand New',
    type: 'Gift',
    price: '',
    location: 'Palava',
    radius: 5,
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [impact, setImpact] = useState({
    carbonSaved: '0.0',
    neighborsHelped: '0',
    wasteDiverted: '0',
  });

  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.custom-dropdown')) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=tera');
      return;
    }

    const fetchImpact = async () => {
      try {
        const res = await fetch(apiUrl(`/users/${user.id}/impact`));
        if (res.ok) {
          const data = await res.json();
          setImpact(data);
        }
      } catch (err) {
        console.error('Error fetching impact stats:', err);
      }
    };

    fetchImpact();
  }, [isAuthenticated, navigate, user?.id]);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_DIM = 1000;
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = () => reject(new Error('Failed to load image for compression'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [...imagePreviews];
    
    if (newPreviews.length + files.length > 5) {
      setError('Maximum 5 images allowed.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      for (const file of files) {
        // Type validation
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed.');
        }
        // Size validation (5MB for original)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large (max 5MB).`);
        }

        const compressedBase64 = await compressImage(file);
        newPreviews.push(compressedBase64);
      }

      setImagePreviews(newPreviews);
      setFormData({ ...formData, images: newPreviews });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
      // Reset input value so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setFormData({ ...formData, images: newPreviews });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(apiUrl('/listings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          title: '',
          category: 'Tools',
          condition: 'Brand New',
          type: 'Gift',
          price: '',
          location: 'Palava',
          radius: 5,
          images: [],
        });
        setImagePreviews([]);
        // Re-fetch impact
        const impactRes = await fetch(apiUrl(`/users/${user.id}/impact`));
        if (impactRes.ok) {
          const impactData = await impactRes.json();
          setImpact(impactData);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Safe parsing for non-JSON errors
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setError(data.message || 'Failed to publish listing.');
        } else {
          setError(`Server Error (${res.status}): The upload might be too large. Try fewer or smaller photos.`);
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(`Connection error: ${err.message}. Please check if the server is running.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-custom text-on-surface font-body selection:bg-secondary-container">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 min-h-screen">
        {/* Main Form Column */}
        <div className="lg:col-span-8">
          <header className="mb-12">
            <span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 font-bold uppercase text-sm inline-block mb-4 border-2 border-outline-custom">Giver Mode</span>
            <h1 className="text-5xl md:text-7xl font-headline font-black uppercase leading-[0.9] tracking-tight text-primary-custom mb-4">
              Share Your Surplus, <span className="bg-secondary-container px-2">Build Your Neighborhood.</span>
            </h1>
            <p className="text-xl max-w-2xl font-medium opacity-80">List an item to keep the local loop spinning. Whether you're gifting, lending, or selling, every share strengthens the community.</p>
          </header>
          
          {success && (
            <div className="brutalist-card bg-emerald-500 text-white p-6 mb-8 border-4 border-outline-custom flex items-center justify-between animate-in fade-in zoom-in">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
                <div className="flex flex-col">
                  <p className="font-headline font-black uppercase text-2xl">Item Submitted for Review!</p>
                  <p className="font-bold opacity-90 text-sm">Our moderators will approve it shortly. It will then appear in the loop.</p>
                </div>
              </div>
              <button onClick={() => setSuccess(false)} className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}

          {error && (
            <div className="brutalist-card bg-rose-500 text-white p-6 mb-8 border-4 border-outline-custom animate-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">warning</span>
                <div>
                  <p className="font-black uppercase tracking-tight text-lg">Wait a minute!</p>
                  <p className="font-bold opacity-90">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-12" onSubmit={handleSubmit}>
            {/* Step 1: Item Details */}
            <section className="brutalist-card bg-surface-container-lowest p-8 relative">
              <div className="absolute -top-6 -left-4 bg-primary-custom text-on-primary px-4 py-2 font-black text-2xl border-4 border-outline-custom">01</div>
              <h2 className="text-3xl font-headline font-black uppercase mb-6 mt-2">Item Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block font-bold uppercase mb-2 text-sm">Item Title</label>
                  <input 
                    className="w-full bg-surface-container-highest border-4 border-outline-custom p-4 font-bold text-lg focus:bg-primary-container outline-none transition-colors" 
                    placeholder="e.g., Heavy Duty Power Drill" 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="custom-dropdown">
                  <label className="block font-bold uppercase mb-2 text-sm">Category</label>
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="w-full bg-surface-container-highest border-4 border-outline-custom p-4 font-bold outline-none flex justify-between items-center cursor-pointer hover:bg-primary-container transition-colors"
                    >
                      {formData.category}
                      <span className={`material-symbols-outlined transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 right-0 bg-surface-container-highest border-4 border-t-0 border-outline-custom z-20 shadow-[4px_4px_0px_black] max-h-[240px] overflow-y-auto animate-in fade-in slide-in-from-top-2 custom-scrollbar">
                        {['Tools', 'Home & Decor', 'Garden', 'Kitchen', 'Electronics', 'Books', 'Stationary'].map(cat => (
                          <div 
                            key={cat}
                            className={`p-4 font-bold border-b border-outline-custom/20 hover:bg-primary-custom hover:text-on-primary cursor-pointer transition-colors ${formData.category === cat ? 'bg-primary-container' : ''}`}
                            onClick={() => {
                              setFormData({...formData, category: cat});
                              setShowCategoryDropdown(false);
                            }}
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-2 text-sm">Condition</label>
                  <select 
                    className="w-full bg-surface-container-highest border-4 border-outline-custom p-4 font-bold outline-none appearance-none"
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  >
                    <option>Brand New</option>
                    <option>Good as New</option>
                    <option>Well-loved</option>
                    <option>Vintage/Relic</option>
                  </select>
                </div>
              </div>
            </section>
            
            {/* Step 2: Photo Upload */}
            <section className="brutalist-card bg-surface-container-low p-8 relative">
              <div className="absolute -top-6 -left-4 bg-primary-custom text-on-primary px-4 py-2 font-black text-2xl border-4 border-outline-custom">02</div>
              <h2 className="text-3xl font-headline font-black uppercase mb-6 mt-2">Visual Proof</h2>
              
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange}
                disabled={isProcessing}
              />

              <div 
                onClick={() => !isProcessing && fileInputRef.current.click()}
                className={`border-4 border-dashed border-outline-custom bg-surface-container p-12 flex flex-col items-center justify-center text-center group transition-colors relative overflow-hidden ${isProcessing ? 'cursor-wait opacity-60' : 'cursor-pointer hover:bg-primary-container'}`}
              >
                {isProcessing ? (
                  <>
                    <div className="absolute inset-0 bg-primary-custom/10 animate-pulse" />
                    <span className="material-symbols-outlined text-6xl mb-4 text-primary-custom animate-spin">sync</span>
                    <p className="text-xl font-black uppercase">Optimizing Pixels...</p>
                    <p className="text-sm opacity-80 mt-2 font-bold uppercase">Preparing your photos for the loop</p>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-6xl mb-4 text-primary-custom group-hover:scale-110 transition-transform">add_a_photo</span>
                    <p className="text-xl font-bold uppercase">Drag & Drop or Click to Upload</p>
                    <p className="text-sm opacity-60 mt-2 font-medium uppercase tracking-widest">Images only • Max 5MB per file • Max 5 photos</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-square bg-surface-variant border-4 border-outline-custom flex items-center justify-center relative overflow-hidden group/item">
                    {imagePreviews[i] ? (
                      <>
                        <img src={imagePreviews[i]} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(i);
                          }}
                          className="absolute top-1 right-1 bg-rose-500 text-white w-6 h-6 flex items-center justify-center rounded-none border-2 border-outline-custom opacity-0 group-hover/item:opacity-100 transition-opacity z-10"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </>
                    ) : (
                      <span className="material-symbols-outlined opacity-20 text-3xl">image</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
            
            {/* Step 3: Exchange Terms */}
            <section className="brutalist-card bg-surface-container-lowest p-8 relative">
              <div className="absolute -top-6 -left-4 bg-primary-custom text-on-primary px-4 py-2 font-black text-2xl border-4 border-outline-custom">03</div>
              <h2 className="text-3xl font-headline font-black uppercase mb-6 mt-2">Exchange Terms</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button 
                  className={`p-6 border-4 border-outline-custom font-black uppercase text-center flex flex-col items-center gap-2 transition-all ${formData.type === 'Gift' ? 'bg-primary-custom text-on-primary shadow-[4px_4px_0px_black]' : 'bg-surface-container-highest hover:bg-primary-container'}`} 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Gift'})}
                >
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: formData.type === 'Gift' ? "'FILL' 1" : "''" }}>card_giftcard</span>
                  Gift
                </button>
                <button 
                  className={`p-6 border-4 border-outline-custom font-black uppercase text-center flex flex-col items-center gap-2 transition-all ${formData.type === 'Lend' ? 'bg-primary-custom text-on-primary shadow-[4px_4px_0px_black]' : 'bg-surface-container-highest hover:bg-primary-container'}`} 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Lend'})}
                >
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: formData.type === 'Lend' ? "'FILL' 1" : "''" }}>handshake</span>
                  Lend
                </button>
                <button 
                  className={`p-6 border-4 border-outline-custom font-black uppercase text-center flex flex-col items-center gap-2 transition-all ${formData.type === 'Sell' ? 'bg-primary-custom text-on-primary shadow-[4px_4px_0px_black]' : 'bg-surface-container-highest hover:bg-primary-container'}`} 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Sell'})}
                >
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: formData.type === 'Sell' ? "'FILL' 1" : "''" }}>sell</span>
                  Sell
                </button>
              </div>
              
              {formData.type === 'Sell' && (
                <div className="bg-secondary-container border-4 border-outline-custom p-6 animate-in fade-in slide-in-from-top-4">
                  <label className="block font-bold uppercase mb-2 text-sm text-on-secondary-container">Listing Price</label>
                  <div className="flex items-center">
                    <span className="bg-outline-custom text-surface-custom px-4 py-4 font-black text-xl">₹</span>
                    <input 
                      className="flex-1 bg-surface-container-lowest border-4 border-l-0 border-outline-custom p-4 font-black text-xl outline-none" 
                      placeholder="0.00" 
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required={formData.type === 'Sell'}
                    />
                  </div>
                </div>
              )}
            </section>
            
            {/* Step 4: Location & Privacy */}
            <section className="brutalist-card bg-surface-container p-8 relative">
              <div className="absolute -top-6 -left-4 bg-primary-custom text-on-primary px-4 py-2 font-black text-2xl border-4 border-outline-custom">04</div>
              <h2 className="text-3xl font-headline font-black uppercase mb-6 mt-2">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold uppercase mb-2 text-sm">Neighborhood Area</label>
                  <select 
                    className="w-full bg-surface-container-lowest border-4 border-outline-custom p-4 font-bold outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  >
                    <option value="palava">Palava</option>
                    <option value="dombivali">Dombivali</option>
                    <option value="thane">Thane</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-2 text-sm">Visibility Radius ({formData.radius} Miles)</label>
                  <input 
                    className="w-full h-8 accent-primary-custom cursor-pointer mt-4" 
                    type="range"
                    min="1"
                    max="10"
                    value={formData.radius}
                    onChange={(e) => setFormData({...formData, radius: parseInt(e.target.value)})}
                  />
                  <div className="flex justify-between text-xs font-black uppercase mt-2">
                    <span>1 Mile</span>
                    <span>5 Miles</span>
                    <span>10 Miles</span>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Trust Verification */}
            <div className="flex items-start gap-4 p-4 border-4 border-teal-600 bg-primary-container/30">
              <input 
                className="w-8 h-8 border-4 border-outline-custom bg-surface-container-lowest text-primary-custom focus:ring-0 rounded-none cursor-pointer" 
                id="verify" 
                type="checkbox"
                required
              />
              <label className="font-bold uppercase text-lg leading-tight cursor-pointer" htmlFor="verify">
                I verify this item is <span className="text-primary-custom underline">Safe & Clean</span> and I am authorized to share it with my neighbors.
              </label>
            </div>
            
            {/* Action Area */}
            <div className="pt-8 flex justify-center">
              <button 
                className={`w-full md:w-auto px-12 py-8 bg-secondary-container text-on-secondary-container font-headline font-black text-4xl uppercase heavy-shadow border-4 border-on-surface hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed`} 
                type="submit"
                disabled={loading || isProcessing}
              >
                {loading ? 'Publishing...' : isProcessing ? 'Optimizing...' : 'Publish To The Loop'}
                <span className="material-symbols-outlined text-4xl group-hover:translate-x-2 transition-transform">rocket_launch</span>
              </button>
            </div>
          </form>
        </div>
        
        {/* Sidebar / Dashboard Preview */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="brutalist-card bg-tertiary-container p-6">
            <h3 className="text-2xl font-headline font-black uppercase mb-4 border-b-4 border-outline-custom pb-2">Your Impact</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black uppercase opacity-70">Carbon Saved</p>
                  <p className="text-4xl font-black">{impact.carbonSaved} <span className="text-sm">KG</span></p>
                </div>
                <span className="material-symbols-outlined text-4xl">eco</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black uppercase opacity-70">Neighbors Helped</p>
                  <p className="text-4xl font-black">{impact.neighborsHelped}</p>
                </div>
                <span className="material-symbols-outlined text-4xl">volunteer_activism</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black uppercase opacity-70">Waste Diverted</p>
                  <p className="text-4xl font-black">{impact.wasteDiverted} <span className="text-sm">LBS</span></p>
                </div>
                <span className="material-symbols-outlined text-4xl">delete_sweep</span>
              </div>
            </div>
          </div>
          
          <div className="brutalist-card bg-surface-container-highest p-6">
            <h3 className="text-2xl font-headline font-black uppercase mb-4">Giver Pro-Tips</h3>
            <ul className="space-y-4 font-bold text-sm uppercase">
              <li className="flex gap-3">
                <span className="text-primary-custom">●</span>
                Take photos in natural daylight for 3x faster pick-ups.
              </li>
              <li className="flex gap-3">
                <span className="text-primary-custom">●</span>
                Mention the original retail price for context.
              </li>
              <li className="flex gap-3">
                <span className="text-primary-custom">●</span>
                Respond to inquiries within 2 hours to keep your "Loop Rating" high.
              </li>
            </ul>
          </div>
        </aside>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tera;
