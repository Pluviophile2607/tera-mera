import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

const QuickActionCard = ({ title, description, icon, color, textColor, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 group border-[3px] border-outline-custom shadow-[8px_8px_0px_0px_#757777] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#757777] transition-all p-6 text-left relative overflow-hidden ${color}`}
  >
    <div className="relative z-10 flex flex-col gap-4">
      <span className={`material-symbols-outlined ${textColor} text-5xl font-light`}>{icon}</span>
      <div>
        <h3 className={`font-display text-3xl font-black ${textColor} uppercase tracking-tighter`}>{title}</h3>
        <p className={`font-body ${textColor} font-medium mt-1`}>{description}</p>
      </div>
    </div>
  </button>
);

const ImpactStatCard = ({ label, value, unit, icon, iconColor, bg, loading }) => (
  <div className={`border-[3px] border-outline-custom shadow-[6px_6px_0px_0px_#757777] ${bg} p-6 flex flex-col gap-2 relative group hover:-translate-y-0.5 transition-transform min-h-[140px]`}>
    {loading ? (
      <div className="animate-pulse flex flex-col gap-4">
        <div className="h-4 bg-gray-200 w-1/2"></div>
        <div className="h-10 bg-gray-200 w-3/4"></div>
      </div>
    ) : (
      <>
        <span className={`material-symbols-outlined ${iconColor} absolute top-4 right-4 text-3xl transition-transform group-hover:scale-110`}>{icon}</span>
        <p className="font-body text-on-surface-variant font-bold uppercase tracking-wider text-sm">{label}</p>
        <p className="font-display text-5xl font-black text-on-surface tracking-tighter">
          {value}{unit && <span className="text-2xl text-on-surface-variant">{unit}</span>}
        </p>
      </>
    )}
  </div>
);

const KarmaProgressBar = ({ score }) => {
  const nextMilestone = score < 1000 ? 1000 : score < 5000 ? 5000 : 10000;
  const progress = (score / nextMilestone) * 100;
  const level = score < 1000 ? 'Neighbor' : score < 5000 ? 'Pillar' : 'Sage';

  return (
    <div className="mt-8 border-[3px] border-outline-custom bg-surface-container-lowest p-6 shadow-[6px_6px_0px_0px_#757777]">
      <div className="flex justify-between items-end mb-4 font-black uppercase text-sm">
        <span>Karma Level: <span className="text-primary-custom italic">{level}</span></span>
        <span>{score} / {nextMilestone} PT</span>
      </div>
      <div className="h-6 w-full bg-surface-container border-[3px] border-outline-custom overflow-hidden relative">
        <div 
          className="h-full bg-secondary-container border-r-[3px] border-outline-custom transition-all duration-1000" 
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[10px] font-black uppercase mix-blend-difference text-white">
          Progress to {level === 'Neighbor' ? 'Pillar' : 'Sage'}
        </div>
      </div>
    </div>
  );
};

const HistoryCard = ({ item, isGiver }) => (
  <div className="bg-white border-[3px] border-outline-custom shadow-[8px_8px_0px_0px_#000] p-4 flex flex-col h-full transform transition-all hover:-translate-y-1 relative overflow-hidden group text-sm">
    {/* Decorative Success Badge */}
    <div className={`absolute -right-12 -top-12 w-24 h-24 rotate-45 flex items-end justify-center pb-2 ${isGiver ? 'bg-emerald-500' : 'bg-indigo-500'} text-white shadow-xl z-20`}>
       <span className="material-symbols-outlined text-sm font-black">{isGiver ? 'volunteer_activism' : 'auto_awesome'}</span>
    </div>

    <div className="relative overflow-hidden border-2 border-outline-custom mb-4 aspect-video bg-surface-container shadow-inner">
      {item.images && item.images.length > 0 ? (
        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
          <span className="material-symbols-outlined text-6xl">inventory_2</span>
        </div>
      )}
      <div className={`absolute top-2 left-2 px-3 py-1 border-2 border-outline-custom font-black text-[9px] uppercase tracking-widest shadow-[2px_2px_0px_0px_#000] ${isGiver ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-indigo-100 text-indigo-700 font-bold'}`}>
        {isGiver ? 'GOALS REACHED' : 'TREASURE SECURED'}
      </div>
    </div>
    
    <div className="flex-1 flex flex-col">
      <h3 className="text-xl font-display font-black uppercase mb-1 tracking-tight leading-none truncate">{item.title}</h3>
      <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-dashed border-gray-100">
         <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase opacity-40 leading-none">Loop Completed</span>
            <span className="text-xs font-bold text-slate-900 italic mt-1">{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
         </div>
         <div className="text-right">
            <span className="text-[10px] font-black uppercase opacity-40 tracking-widest block mb-1 leading-none">Role</span>
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border-2 ${isGiver ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
              {isGiver ? 'Giver' : 'Receiver'}
            </span>
         </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [impact, setImpact] = useState(null);
  const [activities, setActivities] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [collectedItems, setCollectedItems] = useState([]);
  const [claimRequests, setClaimRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://127.0.0.1:5000/api';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=dashboard');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [impactRes, activityRes, myListingsRes, statsRes, collectedRes, claimsRes] = await Promise.all([
          fetch(`${API_BASE}/users/${user.id}/impact`),
          fetch(`${API_BASE}/activities/recent`),
          fetch(`${API_BASE}/users/${user.id}/listings`),
          fetch(`${API_BASE}/stats/neighborhood/${encodeURIComponent(user.area)}`),
          fetch(`${API_BASE}/users/${user.id}/collected`),
          fetch(`${API_BASE}/users/${user.id}/claim-requests`)
        ]);

        if (impactRes.ok) setImpact(await impactRes.json());
        if (activityRes.ok) setActivities(await activityRes.json());
        if (myListingsRes.ok) setMyListings(await myListingsRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
        if (collectedRes.ok) setCollectedItems(await collectedRes.json());
        if (claimsRes.ok) setClaimRequests(await claimsRes.json());

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, user?.id, user?.area]);

  const historyItems = [
    ...(myListings?.filter(item => item.status === 'claimed') || []),
    ...(collectedItems || [])
  ].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

  return (
    <div className="min-h-screen bg-surface-custom text-on-surface font-body overflow-x-hidden waitlist-grid-bg">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 mb-20 animate-in fade-in slide-in-from-bottom duration-700">
        {/* Personalized Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-outline-custom pb-8">
          <div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-2 flex items-center flex-wrap gap-x-4">
              Hey <span className="text-primary-custom italic">{user?.fullName?.split(' ')[0]}!</span>
              {user?.isVerified && (
                <span 
                  className="material-symbols-outlined text-primary-custom text-3xl md:text-5xl animate-stamp" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  title="Verified Founder Status"
                >
                  verified
                </span>
              )}
            </h1>
            <p className="text-lg md:text-2xl font-bold uppercase text-on-surface-variant italic">
              {user?.area} is <span className="underline decoration-secondary-container decoration-4 select-none">buzzing</span> today.
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="border-[3px] border-outline-custom bg-white p-4 shadow-[4px_4px_0px_0px_#757777] flex flex-col items-center">
                <span className="text-2xl font-black">{stats?.activeNeighbors || '0'}</span>
                <span className="text-[10px] font-black uppercase text-on-surface-variant">Neighbors Online</span>
             </div>
             <div className="border-[3px] border-outline-custom bg-white p-4 shadow-[4px_4px_0px_0px_#757777] flex flex-col items-center">
                <span className="text-2xl font-black">{stats?.activeItems || '0'}</span>
                <span className="text-[10px] font-black uppercase text-on-surface-variant">Active Items</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Quick Action Hub */}
            <section className="flex flex-col sm:flex-row gap-8">
              <QuickActionCard 
                title="Post a Tera"
                description="Share surplus with neighbors"
                icon="add_box"
                color="bg-primary-custom"
                textColor="text-on-primary"
                onClick={() => navigate('/tera')}
              />
              <QuickActionCard 
                title="Broadcast Mera"
                description="Request something you need"
                icon="campaign"
                color="bg-secondary-container"
                textColor="text-on-secondary-container"
                onClick={() => navigate('/mera')}
              />
            </section>

            {/* Pending Requests Section */}
            {claimRequests.length > 0 && (
              <section className="animate-in fade-in slide-in-from-left duration-500 delay-200">
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary-custom">hourglass_empty</span>
                     Awaiting Authorization
                   </h2>
                   <span className="bg-primary-container text-primary-custom px-3 py-0.5 rounded-full text-[10px] font-black uppercase border border-primary-custom">
                     Admin Reviewing
                   </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {claimRequests.filter(req => req.status === 'pending').map((req) => (
                    <div key={req._id} className="bg-white border-[3px] border-outline-custom shadow-[4px_4px_0px_0px_#000] p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
                      <div className="w-12 h-12 bg-surface-container border-2 border-outline-custom shrink-0 overflow-hidden">
                        {req.listingId?.images?.[0] ? (
                          <img src={req.listingId.images[0]} alt="" className="w-full h-full object-cover opacity-50 grayscale" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20"><span className="material-symbols-outlined">inventory_2</span></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black uppercase text-sm truncate">{req.listingId?.title}</h4>
                        <p className="text-[10px] font-bold text-primary-custom uppercase flex items-center gap-1 animate-pulse">
                          <span className="material-symbols-outlined text-[12px]">schedule</span> Pending Transfer Desk
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* My Active Loop */}
            <section>
              <h2 className="font-display text-3xl font-black text-on-surface uppercase tracking-tight mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">sync_alt</span> My Active Loop
              </h2>
              
              <div className="border-[3px] border-outline-custom bg-surface-container-lowest shadow-[8px_8px_0px_0px_#757777] overflow-hidden">
                {myListings.length > 0 ? (
                  <div className="divide-y-2 divide-surface-variant">
                    {myListings.slice(0, 5).map((listing, idx) => (
                      <div key={idx} className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors group">
                        <div className="flex gap-4 items-center">
                          <div className={`w-12 h-12 border-2 border-outline-custom flex items-center justify-center ${listing.type === 'Request' ? 'bg-secondary-container' : 'bg-primary-custom text-white'}`}>
                            <span className="material-symbols-outlined">{listing.type === 'Request' ? 'campaign' : 'package_2'}</span>
                          </div>
                          <div>
                            <h4 className="font-black uppercase text-lg group-hover:text-primary-custom transition-colors">{listing.title}</h4>
                            <p className="text-xs font-bold uppercase text-on-surface-variant italic">{listing.category} • {listing.type}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 border-2 border-outline-custom font-black uppercase text-[10px] sm:text-xs ${
                          listing.status === 'pending' ? 'bg-amber-100' : 
                          listing.status === 'available' ? 'bg-emerald-100' : 'bg-surface-variant'
                        }`}>
                          {listing.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <p className="font-black uppercase text-on-surface-variant italic mb-4">Your loop is quiet. Start sharing!</p>
                    <button 
                      onClick={() => navigate('/tera')}
                      className="px-6 py-3 bg-primary-custom text-on-primary font-black uppercase border-[3px] border-outline-custom shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm"
                    >
                      Initialize Giver Mode
                    </button>
                  </div>
                )}
              </div>
            </section>
            
            {/* Loop History Gallery */}
            <section className="mb-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                   <h2 className="font-display text-3xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-600">history_edu</span> My Loop History
                  </h2>
                  <p className="text-xs font-bold uppercase text-on-surface-variant italic opacity-60">A permanent archive of your community success stories</p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 border-2 border-indigo-200 rounded-xl shadow-sm">
                   <p className="text-[10px] font-black uppercase text-indigo-700 tracking-widest">Total Impact</p>
                   <p className="text-xl font-black text-indigo-900">{historyItems.length || '0'} <span className="text-xs">Resolved Cards</span></p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {(historyItems && historyItems.length > 0) ? (
                  historyItems.map((item, idx) => (
                    <HistoryCard key={idx} item={item} isGiver={item.userId === user?.id || item.userId?._id === user?.id} />
                  ))
                ) : (
                  <div className="col-span-full p-20 border-[4px] border-dashed border-outline-custom text-center bg-surface-container-lowest transform transition-all hover:bg-white hover:border-indigo-100 group">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-4xl text-indigo-200">history</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-4 italic text-slate-900">Your legacy begins here</h3>
                    <p className="font-bold uppercase text-on-surface-variant opacity-60 text-sm mb-8">Your history is currently empty. Start sharing or collecting to build your loop story.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button 
                        onClick={() => navigate('/tera')}
                        className="px-8 py-4 bg-primary-custom text-on-primary font-black uppercase border-[3px] border-outline-custom shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 active:translate-y-0 transition-all text-sm"
                      >
                        Share a Tera
                      </button>
                      <button 
                        onClick={() => navigate('/mera')}
                        className="px-8 py-4 bg-secondary-container text-on-secondary-container font-black uppercase border-[3px] border-outline-custom shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 active:translate-y-0 transition-all text-sm"
                      >
                        Browse Mera
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Impact Status */}
            <section className="flex flex-col gap-6">
              <h2 className="font-display text-3xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined">stars</span> Your Personal Impact
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ImpactStatCard 
                  label="Carbon Saved"
                  value={impact?.carbonSaved || '0.0'}
                  unit="kg"
                  icon="eco"
                  iconColor="text-tertiary-fixed"
                  bg="bg-white"
                  loading={loading}
                />
                <ImpactStatCard 
                  label="Neighbors Helped"
                  value={impact?.neighborsHelped || '0'}
                  icon="group"
                  iconColor="text-primary-custom"
                  bg="bg-white"
                  loading={loading}
                />
                <div className="md:col-span-1">
                   <ImpactStatCard 
                    label="Karma Score"
                    value={impact?.karmaScore || '0'}
                    icon="bolt"
                    iconColor="text-[#453900]"
                    bg="bg-secondary-container"
                    loading={loading}
                  />
                </div>
              </div>
              
              <KarmaProgressBar score={impact?.karmaScore || 0} />
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Neighborhood Pulse Widget */}
            <section className="border-[3px] border-outline-custom bg-[#0c0f0f] text-white p-8 shadow-[8px_8px_0px_0px_#757777] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-8xl">sensors</span>
               </div>
               <h3 className="text-2xl font-black uppercase mb-6 border-b-2 border-white/20 pb-4 italic">Neighborhood Pulse</h3>
               <div className="space-y-6">
                 <div className="flex justify-between items-center bg-white/5 p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                    <span className="font-bold uppercase text-xs opacity-70">Community Trust</span>
                    <span className="font-black text-emerald-400">{stats?.communityTrust || '98'}%</span>
                 </div>
                 <div className="flex justify-between items-center bg-white/5 p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                    <span className="font-bold uppercase text-xs opacity-70">Active Neighbors</span>
                    <span className="font-black text-secondary-container">{stats?.activeNeighbors || '0'}</span>
                 </div>
                 <div className="flex justify-between items-center bg-white/5 p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                    <span className="font-bold uppercase text-xs opacity-70">Eco-Intensity</span>
                    <span className="font-black text-primary-custom uppercase tracking-widest text-xs">High</span>
                 </div>
               </div>
            </section>

            {/* Recent Loop Activity */}
            <section className="flex flex-col gap-4">
               <h3 className="text-xl font-black uppercase flex items-center gap-2">
                 <span className="material-symbols-outlined">hub</span> Global Activity
               </h3>
               <div className="border-[3px] border-outline-custom bg-surface-container-lowest p-6 shadow-[6px_6px_0px_0px_#757777]">
                 <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {loading ? (
                     <div className="animate-pulse space-y-4">
                       {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-gray-100"></div>)}
                     </div>
                   ) : activities.length > 0 ? (
                     activities.map((activity, index) => (
                       <div key={index} className="flex flex-col p-3 border-b border-surface-variant last:border-0 font-bold uppercase text-[10px]">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-on-surface-variant font-black italic">{activity.time}</span>
                            <span className="bg-surface-container-highest px-1 border border-outline-custom italic">{activity.user === user?.id ? 'YOU' : 'OTHER'}</span>
                         </div>
                         <span className="flex items-center gap-2 leading-tight">
                           <span className={`material-symbols-outlined text-sm ${activity.type === 'alert' ? 'text-rose-500' : 'text-primary-custom'}`}>
                             {activity.type === 'alert' ? 'warning' : activity.type === 'action' ? 'bolt' : 'update'}
                           </span>
                           {activity.message}
                         </span>
                       </div>
                     ))
                   ) : (
                     <div className="p-4 text-center text-on-surface-variant font-black uppercase text-[10px] italic">
                       Silence in the loop...
                     </div>
                   )}
                 </div>
               </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
