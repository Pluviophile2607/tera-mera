import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { apiUrl } from './lib/api';

const CategoryItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 p-3 w-full text-left transition-all font-bold uppercase tracking-tight text-sm ${
      active 
      ? 'bg-secondary-container text-on-secondary-container border-2 border-outline-custom shadow-[4px_4px_0px_0px_#000]' 
      : 'text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1'
    }`}
  >
    <span className="material-symbols-outlined text-xl">{icon}</span>
    {label}
  </button>
);

const ListingCard = ({ listing, onClaim, isRequested }) => {
  const isRequest = listing.type === 'Request';
  const tagColor = isRequest ? 'bg-secondary-container' : listing.type === 'Trade' ? 'bg-tertiary-container text-white' : 'bg-primary-container';
  const tagLabel = isRequest ? 'WANTED' : listing.type === 'Sell' ? 'TRADE' : 'GIFT';

  const buttonLabel = isRequested ? 'REQUEST SENT' : isRequest ? 'I HAVE THIS' : 'CLAIM ITEM';
  const buttonColor = isRequested 
    ? 'bg-surface-variant text-on-surface-variant opacity-60 cursor-not-allowed shadow-none' 
    : isRequest ? 'bg-primary-custom text-white' : 'bg-secondary-container text-black';

  return (
    <div className="group bg-white border-4 border-outline-custom shadow-[8px_8px_0px_0px_#000] p-4 flex flex-col h-full transform transition-all hover:-translate-y-1">
      <div className="relative overflow-hidden border-2 border-outline-custom mb-4 aspect-square bg-surface-container">
        {listing.images && listing.images.length > 0 ? (
          <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
            <span className="material-symbols-outlined text-6xl">image_not_supported</span>
          </div>
        )}
        <div className={`absolute top-2 left-2 ${tagColor} border-2 border-outline-custom px-3 py-1 font-black text-[10px] uppercase tracking-widest`}>
          {tagLabel}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-headline font-black uppercase mb-1 tracking-tight leading-none truncate">{listing.title}</h3>
        <div className="flex items-center justify-between mb-4">
           <div className="text-xs font-bold text-on-surface-variant uppercase italic flex items-center gap-1">
            <span className="material-symbols-outlined text-base">location_on</span> {listing.location}
          </div>
          {isRequested && (
            <div className="flex items-center gap-1 text-[10px] font-black text-primary-custom uppercase animate-pulse">
               <span className="material-symbols-outlined text-sm">schedule</span> Pending Admin
            </div>
          )}
        </div>
        
        <div className="mt-auto flex items-center gap-3 p-3 bg-surface-container-low border-2 border-outline-custom mb-6">
          <div className="w-10 h-10 bg-primary-container border-2 border-outline-custom flex items-center justify-center font-black">
            {(typeof listing.userId === 'string' ? listing.userId : listing.userId?._id || '').slice(-1).toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-60 leading-none">Shared by</p>
            <p className="font-bold text-xs uppercase underline decoration-primary-custom decoration-2 underline-offset-2">
              {listing.userId?.fullName || 'Neighbor'}
            </p>
          </div>
        </div>
      </div>

      <button 
        disabled={isRequested}
        onClick={() => onClaim(listing._id)}
        className={`w-full py-4 font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all border-2 border-outline-custom ${buttonColor}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

const WishModal = ({ listing, onClose, onConfirm, loading }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white border-[4px] border-outline-custom shadow-[16px_16px_0px_0px_#000] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in slide-in-from-bottom-12 duration-500">
        {/* Compact Physical Header */}
        <div className="flex justify-between items-center bg-[#FFE600] p-7 border-b-[4px] border-outline-custom relative overflow-hidden shrink-0">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="inline-block bg-black text-[#FFE600] px-2 py-0.5 font-black text-[9px] uppercase tracking-tighter mb-2 -rotate-1 border border-black">
              LIVE NEIGHBORHOOD WISH
            </div>
            <h2 className="text-4xl font-headline font-black uppercase leading-[0.9] tracking-tighter italic drop-shadow-[1px_1px_0px_#fff]">
              I HAVE <span className="text-primary-custom italic">THIS ITEM</span>
            </h2>
          </div>
          <button 
             onClick={onClose} 
             className="w-12 h-12 border-[3px] border-black flex items-center justify-center bg-white hover:bg-red-500 hover:text-white transition-all shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <span className="material-symbols-outlined font-black text-2xl">close</span>
          </button>
        </div>
        
        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex-1">
           {/* Wish Overview - Balanced */}
           <div className="relative bg-white border-2 border-outline-custom p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
              <h3 className="text-2xl font-headline font-black uppercase mb-3 leading-none italic">{listing.title}</h3>
              <div className="flex flex-wrap gap-3">
                 <span className="px-3 py-1 bg-secondary-container border border-outline-custom text-[10px] font-black uppercase">URGENCY: {listing.urgency || 'ANYTIME'}</span>
                 <span className="px-3 py-1 bg-primary-container border border-outline-custom text-[10px] font-black uppercase">{listing.category}</span>
              </div>
           </div>

           {/* Sticky Note Description - Balanced */}
           <div className="bg-[#FFF9C4] p-6 border-[3px] border-outline-custom shadow-[8px_8px_0px_0px_#000] -rotate-1 relative group">
              <div className="absolute top-1 right-1 opacity-10">
                 <span className="material-symbols-outlined text-3xl">push_pin</span>
              </div>
              <p className="text-base font-bold italic text-black/80 leading-snug font-body">
                 "{listing.description || 'No additional details provided by the neighbor.'}"
              </p>
           </div>

           {/* Neighbor & Location Pulse - Compact Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-outline-custom p-4 bg-tertiary-container/5">
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Broadcaster</p>
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-black text-white flex items-center justify-center text-xs font-black border-2 border-white italic">
                       {listing.userId?.fullName?.charAt(0) || 'N'}
                    </div>
                    <p className="font-black text-sm uppercase underline decoration-[#FFE600] decoration-2 underline-offset-2 tracking-tighter truncate">
                       {listing.userId?.fullName || 'Neighbor'}
                    </p>
                 </div>
              </div>
              <div className="border-2 border-outline-custom p-4 bg-primary-container/5 text-right">
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Interaction Hub</p>
                 <div className="text-xs font-black uppercase italic flex items-center gap-1 justify-end">
                    <span className="material-symbols-outlined text-lg text-primary-custom">location_on</span> 
                    {listing.location} 
                 </div>
              </div>
           </div>

           {/* Action Message - Physical Input */}
           <div>
              <div className="flex items-center gap-2 mb-3">
                 <span className="material-symbols-outlined text-primary-custom text-xl">edit_note</span>
                 <label className="text-[10px] font-black uppercase tracking-tighter">Your offer message</label>
              </div>
              <textarea 
                className="w-full bg-white border-[3px] border-black p-4 font-bold text-base focus:bg-[#E0F2F1] outline-none transition-all shadow-[8px_8px_0px_0px_#000] focus:shadow-none focus:translate-x-0.5 focus:translate-y-0.5 min-h-[100px] placeholder:opacity-30"
                placeholder="I can bring it by this evening!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
           </div>
        </div>

        {/* Action Footer - Balanced */}
        <div className="p-6 bg-surface-container-highest border-t-[4px] border-outline-custom shrink-0">
           <button 
              disabled={loading}
              onClick={() => onConfirm(listing._id, message)}
              className="w-full bg-[#FFE600] text-black border-[3px] border-black py-6 font-black uppercase shadow-[10px_10px_0px_0px_#000] hover:bg-black hover:text-[#FFE600] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
           >
              <span className="text-xl tracking-tighter relative z-10 italic">
                 {loading ? 'TRANSMITTING...' : 'CONFIRM I HAVE THIS'}
              </span>
              <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform relative z-10">send</span>
           </button>
        </div>
      </div>
    </div>
  );
};

const Mera = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState('All'); // 'All', 'Items', 'Wishes'
  const [search, setSearch] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [stats] = useState({ items: 1240, tons: 8.4, trust: 94 });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl('/listings'));
        if (res.ok) setListings(await res.json());
      } catch (err) {
        console.error('Error fetching listings:', err);
        setNotification({ message: 'Error loading listings. Please refresh.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRequests = async () => {
      if (!isAuthenticated || !user?.id) return;
      try {
        const res = await fetch(apiUrl(`/users/${user.id}/claim-requests`));
        if (res.ok) {
          const data = await res.json();
          setUserRequests(data.map(req => req.listingId._id || req.listingId));
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    fetchListings();
    fetchUserRequests();
  }, [isAuthenticated, user?.id]);

  const filteredListings = listings.filter(item => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = viewMode === 'All' || (viewMode === 'Wishes' ? item.type === 'Request' : item.type !== 'Request');
    return matchesCategory && matchesSearch && matchesType;
  });

  const neighborhoodWishes = listings.filter(item => item.type === 'Request' && (category === 'All' || item.category === category));

  const handleAction = (id) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=mera');
      return;
    }
    
    const listing = listings.find(l => l._id === id);
    if (listing?.type === 'Request') {
      setSelectedListing(listing);
    } else {
      handleClaim(id);
    }
  };

  const handleClaim = async (id, message = "Interested in this item.") => {
    setClaimLoading(true);
    setNotification(null);
    
    try {
      const res = await fetch(apiUrl(`/listings/${id}/claim`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, message })
      });
      if (res.ok) {
        setUserRequests(prev => [...prev, id]);
        setSelectedListing(null);
        setNotification({ 
          message: 'Action successful! Waiting for neighbor/admin response.', 
          type: 'success' 
        });
      } else {
        const errData = await res.json();
        setNotification({ 
          message: `Action failed: ${errData.message}`, 
          type: 'error' 
        });
      }
    } catch (err) {
      console.error('Error in claim action:', err);
      setNotification({ 
        message: 'Network error. Unable to perform action at this time.', 
        type: 'error' 
      });
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="bg-background-custom text-on-surface font-body selection:bg-secondary-container min-h-screen">
      <Navbar />
      
      {notification && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-full max-w-xl animate-in slide-in-from-top-8 duration-300`}>
          <div className={`${notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white p-4 border-[4px] border-black shadow-[8px_8px_0px_0px_#000] flex items-center justify-between gap-4 mx-4`}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined font-black">
                {notification.type === 'success' ? 'check_circle' : 'warning'}
              </span>
              <p className="font-bold text-sm uppercase tracking-tight">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="hover:rotate-90 transition-transform">
              <span className="material-symbols-outlined font-black">close</span>
            </button>
          </div>
        </div>
      )}

      {selectedListing && (
        <WishModal 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)} 
          onConfirm={handleClaim}
          loading={claimLoading}
        />
      )}

      <div className="flex pt-0 min-h-[calc(100vh-80px)]">
        {/* Sidebar Categories */}
        <aside className="hidden lg:flex flex-col w-72 bg-surface-container-lowest border-r-[3px] border-outline-custom p-8 space-y-8 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-custom mb-2">Mera Filters</p>
            <h2 className="text-3xl font-headline font-black uppercase leading-none italic">Discover<br/>Local</h2>
          </div>

          <div className="space-y-4">
             <div className="p-2 bg-white border-2 border-outline-custom shadow-[4px_4px_0px_0px_#000]">
                <div className="grid grid-cols-2 gap-1 text-[10px] font-black uppercase">
                   <button onClick={() => setViewMode('Items')} className={`py-2 px-1 ${viewMode === 'Items' ? 'bg-[#0E676F] text-white' : 'hover:bg-gray-100'}`}>Items</button>
                   <button onClick={() => setViewMode('Wishes')} className={`py-2 px-1 ${viewMode === 'Wishes' ? 'bg-[#F9BC15] text-black' : 'hover:bg-gray-100'}`}>Wishes</button>
                   <button onClick={() => setViewMode('All')} className={`py-2 px-1 col-span-2 ${viewMode === 'All' ? 'bg-black text-white' : 'hover:bg-gray-100 border-t-2 border-outline-custom'}`}>Everything</button>
                </div>
             </div>

             <nav className="flex flex-col gap-2">
               <p className="text-[10px] font-black uppercase opacity-60 mt-4 mb-1">Categories</p>
               {['All', 'Tools', 'Garden', 'Home & Decor', 'Kitchen', 'Electronics'].map(cat => (
                 <CategoryItem 
                   key={cat}
                   icon={cat === 'All' ? 'grid_view' : cat === 'Tools' ? 'construction' : cat === 'Garden' ? 'potted_plant' : cat === 'Kitchen' ? 'restaurant' : 'shopping_bag'}
                   label={cat}
                   active={category === cat}
                   onClick={() => setCategory(cat)}
                 />
               ))}
             </nav>
          </div>
          
          <div className="mt-auto pt-8 border-t-[3px] border-outline-custom space-y-4">
             <div className="p-4 bg-tertiary-container/10 border-2 border-dashed border-outline-custom text-center">
                <p className="text-[10px] font-black uppercase opacity-60">Missing something?</p>
                <Link to="/request" className="text-sm font-black uppercase text-tertiary-container hover:underline italic">Broadcast a wish →</Link>
             </div>
             <button 
                onClick={() => navigate('/tera')}
                className="w-full bg-primary-custom text-on-primary border-[3px] border-outline-custom py-4 font-black uppercase shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 active:translate-y-0 transition-all text-sm"
              >
                List an Item
              </button>
          </div>
        </aside>

        {/* Global Loop Search & Feed */}
        <main className="flex-1 p-6 md:p-12 overflow-x-hidden bg-background-custom">
           <header className="mb-16 max-w-5xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                 <div className="max-w-2xl">
                    <div className="flex gap-3 mb-6">
                       <div className="inline-block bg-secondary-container px-4 py-1 border-[3px] border-outline-custom shadow-[4px_4px_0px_0px_#000]">
                         <span className="text-xs font-black uppercase tracking-tight italic">Live Ecosystem</span>
                       </div>
                       {viewMode !== 'All' && (
                          <div className={`inline-block ${viewMode === 'Wishes' ? 'bg-[#F9BC15]' : 'bg-[#0E676F] text-white'} px-4 py-1 border-[3px] border-outline-custom shadow-[4px_4px_0px_0px_#000]`}>
                            <span className="text-xs font-black uppercase tracking-tight italic">{viewMode} Mode</span>
                          </div>
                       )}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-headline font-black leading-[0.8] -ml-2 mb-6 uppercase tracking-tighter">
                      NEIGHBORHOOD <br/> <span className="text-primary-custom italic underline decoration-secondary-container/50">TREASURES</span>
                    </h1>
                    <p className="text-xl font-bold uppercase text-on-surface-variant italic opacity-80 leading-tight">
                      Discover local resources shared by your community. Borrow, claim, or trade to keep the cycle moving.
                    </p>
                 </div>
                 
                 <div className="w-full md:w-80 space-y-4 pt-12 md:pt-0">
                    <div className="relative group">
                       <input 
                          type="text" 
                          placeholder="Search Mera..."
                          className="w-full bg-white border-[3px] border-outline-custom p-4 font-bold uppercase text-sm focus:bg-primary-container outline-none transition-all brutalist-shadow"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                       />
                       <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-2xl">search</span>
                    </div>
                    <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                       <button onClick={() => setViewMode('All')} className={`px-4 py-2 border-2 border-outline-custom font-black uppercase text-[10px] whitespace-nowrap ${viewMode === 'All' ? 'bg-black text-white' : 'bg-white'}`}>All</button>
                       <button onClick={() => setViewMode('Items')} className={`px-4 py-2 border-2 border-outline-custom font-black uppercase text-[10px] whitespace-nowrap ${viewMode === 'Items' ? 'bg-[#0E676F] text-white' : 'bg-white'}`}>Items</button>
                       <button onClick={() => setViewMode('Wishes')} className={`px-4 py-2 border-2 border-outline-custom font-black uppercase text-[10px] whitespace-nowrap ${viewMode === 'Wishes' ? 'bg-[#F9BC15]' : 'bg-white'}`}>Wishes</button>
                    </div>
                 </div>
              </div>
           </header>

           {/* Neighborhood Wishes Section (Only in 'All' or 'Wishes' mode) */}
           {(viewMode === 'All' || viewMode === 'Wishes') && neighborhoodWishes.length > 0 && (
              <section className="mb-20">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-1 bg-[#F9BC15]"></div>
                    <h2 className="text-2xl font-headline font-black uppercase tracking-tight">Active Neighborhood Wishes</h2>
                    <div className="flex-1 h-[2px] bg-outline-custom opacity-20"></div>
                 </div>
                 
                 <div className="flex overflow-x-auto pb-8 gap-6 no-scrollbar -mx-2 px-2">
                    {neighborhoodWishes.map(listing => (
                       <div key={listing._id} className="min-w-[320px] max-w-[350px]">
                          <ListingCard 
                            listing={listing} 
                            onClaim={handleAction} 
                            isRequested={userRequests.includes(listing._id)}
                          />
                       </div>
                    ))}
                 </div>
              </section>
           )}

           {/* Listings Grid */}
           <section className="min-h-[50vh]">
              {(viewMode === 'All' || viewMode === 'Items') && (
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-1 bg-[#0E676F]"></div>
                    <h2 className="text-2xl font-headline font-black uppercase tracking-tight">Available Treasures</h2>
                    <div className="flex-1 h-[2px] bg-outline-custom opacity-20"></div>
                 </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="animate-pulse bg-surface-container-highest border-4 border-outline-custom h-96"></div>
                   ))}
                </div>
              ) : filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredListings.map(listing => (
                    <ListingCard 
                      key={listing._id} 
                      listing={listing} 
                      onClaim={handleAction} 
                      isRequested={userRequests.includes(listing._id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-20 border-[4px] border-dashed border-outline-custom text-center bg-surface-container-lowest">
                   <span className="material-symbols-outlined text-8xl text-on-surface-variant/20 mb-6 font-light">inventory_2</span>
                   <h3 className="text-3xl font-headline font-black uppercase mb-4 italic">Loop Silence</h3>
                   <p className="font-bold uppercase text-on-surface-variant opacity-60">No items found matching your filters in this area.</p>
                </div>
              )}
           </section>

           {/* Impact Footer */}
           <footer className="mt-24 bg-primary-custom text-on-primary p-12 border-[4px] border-outline-custom shadow-[12px_12px_0px_0px_#000] relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 text-[200px] opacity-10 font-headline font-bold italic rotate-12 select-none group-hover:rotate-0 transition-transform duration-1000">TERAMERA</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                 <div className="text-center md:text-left space-y-2">
                    <p className="text-7xl font-headline font-black leading-none">{stats.items}</p>
                    <p className="uppercase font-black text-xs tracking-widest border-t-2 border-on-primary pt-2 italic">Items Shared This Month</p>
                 </div>
                 <div className="text-center md:text-left space-y-2">
                    <p className="text-7xl font-headline font-black leading-none">{stats.tons}<span className="text-3xl ml-1">tons</span></p>
                    <p className="uppercase font-black text-xs tracking-widest border-t-2 border-on-primary pt-2 italic">Waste Diverted Locally</p>
                 </div>
                 <div className="text-center md:text-left space-y-2">
                    <p className="text-7xl font-headline font-black leading-none">{stats.trust}%</p>
                    <p className="uppercase font-black text-xs tracking-widest border-t-2 border-on-primary pt-2 italic">Neighborhood Trust Score</p>
                 </div>
              </div>
           </footer>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Mera;
