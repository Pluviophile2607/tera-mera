import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

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

const Mera = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ items: 1240, tons: 8.4, trust: 94 });

  const API_BASE = 'http://127.0.0.1:5000/api';

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/listings`);
        if (res.ok) setListings(await res.json());
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRequests = async () => {
      if (!isAuthenticated || !user?.id) return;
      try {
        const res = await fetch(`${API_BASE}/users/${user.id}/claim-requests`);
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
  }, [API_BASE, isAuthenticated, user?.id]);

  const filteredListings = listings.filter(item => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleClaim = async (id) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=mera');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/listings/${id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, message: "Interested in this item." })
      });
      if (res.ok) {
        setUserRequests(prev => [...prev, id]);
        alert('Interest expressed! Waiting for admin approval.');
      } else {
        const error = await res.json();
        alert(`Request failed: ${error.message}`);
      }
    } catch (err) {
      console.error('Error claiming item:', err);
      alert('Network error. Unable to claim item at this time.');
    }
  };

  return (
    <div className="bg-background-custom text-on-surface font-body selection:bg-secondary-container min-h-screen">
      <Navbar />
      
      <div className="flex pt-0 min-h-[calc(100vh-80px)]">
        {/* Sidebar Categories */}
        <aside className="hidden lg:flex flex-col w-72 bg-surface-container-lowest border-r-[3px] border-outline-custom p-8 space-y-8 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-custom mb-2">Categories</p>
            <h2 className="text-3xl font-headline font-black uppercase leading-none italic">Browse<br/>Local</h2>
          </div>
          
          <nav className="flex flex-col gap-2">
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
          
          <div className="mt-auto pt-8 border-t-[3px] border-outline-custom space-y-4">
             <div className="p-4 bg-tertiary-container/10 border-2 border-dashed border-outline-custom text-center">
                <p className="text-[10px] font-black uppercase opacity-60">Need something specific?</p>
                <Link to="/request" className="text-sm font-black uppercase text-tertiary-container hover:underline italic">Broadcast a need →</Link>
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
                    <div className="inline-block bg-secondary-container px-4 py-1 border-[3px] border-outline-custom mb-6 shadow-[4px_4px_0px_0px_#000]">
                      <span className="text-xs font-black uppercase tracking-tight italic">Live Ecosystem</span>
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
                          placeholder="Search Loop..."
                          className="w-full bg-white border-[3px] border-outline-custom p-4 font-bold uppercase text-sm focus:bg-primary-container outline-none transition-all brutalist-shadow"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                       />
                       <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-2xl">search</span>
                    </div>
                    <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                       {['All', 'Tools', 'Garden', 'Home'].map(c => (
                         <button 
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-4 py-2 border-2 border-outline-custom font-black uppercase text-[10px] whitespace-nowrap ${category === c ? 'bg-secondary-container' : 'bg-white'}`}
                         >
                           {c}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           </header>

           {/* Listings Grid */}
           <section className="min-h-[50vh]">
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
                      onClaim={handleClaim} 
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
