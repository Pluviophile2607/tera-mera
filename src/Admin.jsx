import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { apiUrl } from './lib/api';

const navItems = [
  { name: 'Dashboard', icon: 'grid_view' },
  { name: 'Users', icon: 'people' },
  { name: 'History', icon: 'history' },
  { name: 'Listings', icon: 'inventory_2' },
  { name: 'Transfer Desk', icon: 'approval_delegation' },
  { name: 'Matchmaking', icon: 'handshake' },
  { name: 'Reports', icon: 'flag' },
  { name: 'Analytics', icon: 'bar_chart' },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statsData, setStatsData] = useState(null);

  const stats = [
    {
      label: 'Total Citizens',
      value: statsData?.users || '0',
      meta: '+14% vs LW',
      type: 'trend',
      bgColor: 'bg-white',
      textColor: 'text-gray-500',
      accentColor: 'text-emerald-600',
    },
    {
      label: 'Total Loop Cards',
      value: statsData?.totalCards || '0',
      meta: 'Life-to-date',
      type: 'trend',
      bgColor: 'bg-white',
      textColor: 'text-gray-500',
      accentColor: 'text-teal-600',
    },
    {
      label: 'Active Flags',
      value: statsData?.activeFlags || '0',
      icon: 'flag',
      type: 'icon',
      bgColor: 'bg-white',
      textColor: 'text-gray-500',
      iconColor: 'text-rose-600',
    },
    {
      label: 'System Health',
      value: 'Optimal',
      icon: 'verified',
      type: 'alert',
      bgColor: 'bg-white',
      textColor: 'text-gray-500',
      iconColor: 'text-amber-500',
    },
  ];
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);
  const [historyListings, setHistoryListings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [matchData, setMatchData] = useState({ items: [], requests: [] });
  const [claimRequests, setClaimRequests] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inspectedItem, setInspectedItem] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [allActivities, setAllActivities] = useState([]);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditData, setAuditData] = useState({ impact: null, listings: [], claims: [] });
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  const { logout } = useAuth();

  const fetchActivities = async (limit = 10) => {
    try {
      const res = await fetch(apiUrl(`/admin/activities?limit=${limit}`));
      const data = await res.json();
      if (limit > 10) {
        setAllActivities(data);
      } else {
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [statsRes, flagsRes, listingsRes, historyRes, matchRes, usersRes, analyticsRes, claimsRes] = await Promise.all([
        fetch(apiUrl('/admin/stats')),
        fetch(apiUrl('/admin/flags')),
        fetch(apiUrl('/admin/listings/pending')),
        fetch(apiUrl('/admin/listings')),
        fetch(apiUrl('/admin/matchmaking')),
        fetch(apiUrl('/admin/users')),
        fetch(apiUrl('/admin/analytics')),
        fetch(apiUrl('/admin/claim-requests'))
      ]);

      const [statsRaw, flagsRaw, listingsRaw, historyRaw, matchRaw, usersRaw, analyticsRaw, claimsRaw] = await Promise.all([
        statsRes.json(),
        flagsRes.json(),
        listingsRes.json(),
        historyRes.json(),
        matchRes.json(),
        usersRes.json(),
        analyticsRes.json(),
        claimsRes.json()
      ]);

      setStatsData(statsRaw);
      setFlaggedItems(flagsRaw);
      setPendingListings(listingsRaw);
      setHistoryListings(historyRaw);
      setMatchData(matchRaw);
      setUsers(usersRaw);
      setAnalytics(analyticsRaw);
      setClaimRequests(claimsRaw);
      
      // Separate fetch for activities
      fetchActivities();

      if (usersRaw.length > 0 && !selectedUser) {
        setSelectedUser(usersRaw.find(u => u.isBanned) || usersRaw[0]);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast('Connection failed. Please check your backend connection.', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchActivities();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResolveFlag = async (id, action) => {
    try {
      await fetch(apiUrl(`/admin/flags/${id}/resolve`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error resolving flag:', error);
    }
  };

  const handleApproveListing = async (id) => {
    try {
      await fetch(apiUrl(`/admin/listings/${id}/approve`), { method: 'POST' });
      fetchData();
      showToast('Item approved and published to the loop!');
    } catch (_err) {
      showToast('Failed to approve item.', 'error');
    }
  };

  const handleRejectListing = async (id) => {
    try {
      await fetch(apiUrl(`/admin/listings/${id}/reject`), { method: 'POST' });
      fetchData();
      showToast('Item rejected and removed from queue.', 'error');
    } catch (_err) {
      showToast('Failed to reject listing.', 'error');
    }
  };

  const handleApproveClaim = async (id) => {
    try {
      await fetch(apiUrl(`/admin/claim-requests/${id}/approve`), { method: 'POST' });
      fetchData();
      showToast('Transfer authorized successfully!');
    } catch (_err) {
      showToast('Failed to authorize transfer.', 'error');
    }
  };

  const handleRejectClaim = async (id) => {
    try {
      await fetch(apiUrl(`/admin/claim-requests/${id}/reject`), { method: 'POST' });
      fetchData();
      showToast('Claim request Declined.');
    } catch (_err) {
      showToast('Failed to decline request.', 'error');
    }
  };

  const handleMatch = async () => {
    if (!selectedItem || !selectedRequest) return;
    try {
      await fetch(apiUrl('/admin/match'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: selectedItem, requestId: selectedRequest })
      });
      setSelectedItem(null);
      setSelectedRequest(null);
      fetchData();
    } catch (error) {
      console.error('Error matching items:', error);
    }
  };

  const handleBanUser = async (id) => {
    try {
      await fetch(apiUrl(`/admin/users/${id}/ban`), { method: 'POST' });
      fetchData();
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleUnbanUser = async (id) => {
    try {
      await fetch(apiUrl(`/admin/users/${id}/unban`), { method: 'POST' });
      fetchData();
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const handleAuditInfo = async () => {
    if (!selectedUser) return;
    setIsAuditLoading(true);
    try {
      const [impactRes, listingsRes, claimsRes] = await Promise.all([
        fetch(apiUrl(`/users/${selectedUser._id}/impact`)),
        fetch(apiUrl(`/users/${selectedUser._id}/listings`)),
        fetch(apiUrl(`/users/${selectedUser._id}/claim-requests`))
      ]);
      
      const [impact, listings, claims] = await Promise.all([
        impactRes.json(),
        listingsRes.json(),
        claimsRes.json()
      ]);
      
      setAuditData({ impact, listings, claims });
      setIsAuditModalOpen(true);
    } catch (error) {
      console.error('Audit failed:', error);
      showToast('Detailed audit failed to load.', 'error');
    } finally {
      setIsAuditLoading(false);
    }
  };

  const handleBroadcast = async () => {
    const message = prompt('Enter the broadcast message for all citizens:');
    if (!message) return;

    try {
      const res = await fetch(apiUrl('/admin/broadcast'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        showToast('System broadcast sent successfully!');
        fetchData();
      } else {
        showToast('Failed to send broadcast.', 'error');
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      showToast('Error sending broadcast.', 'error');
    }
  };

  const renderMatchmaking = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-teal-600 rounded-full" />
          Fulfillment: Match Tera to Mera
        </h2>
        <button 
          disabled={!selectedItem || !selectedRequest}
          onClick={handleMatch}
          className={`py-3 px-8 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${
            selectedItem && selectedRequest 
            ? 'bg-teal-600 text-white hover:bg-teal-500 shadow-teal-900/10' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          Match & Close Loop
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Available Shares (Tera) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Available Shares (Tera)</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {matchData.items.map(item => (
              <div 
                key={item._id} 
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedItem === item._id ? 'border-teal-600 bg-teal-50 shadow-md' : 'border-gray-50 hover:border-gray-200'}`}
                onClick={() => setSelectedItem(item._id)}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[10px] uppercase font-bold text-teal-600">{item.category}</p>
                    <p className="text-xs text-gray-400 mt-1 italic">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Requests (Mera) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Active Requests (Mera)</h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {matchData.requests.map(req => (
              <div 
                key={req._id} 
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedRequest === req._id ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-gray-50 hover:border-gray-200'}`}
                onClick={() => setSelectedRequest(req._id)}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-amber-600">campaign</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{req.title}</h4>
                    <p className="text-[10px] uppercase font-bold text-amber-600">{req.category}</p>
                    <p className="text-xs text-gray-400 mt-1 italic">{req.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderItemsQueue = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-teal-600 rounded-full" />
          Pending Moderation: Items
        </h2>
        <div className="flex items-center gap-4">
          <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-black uppercase">{pendingListings.length} Awaiting Review</span>
          <button 
            onClick={fetchData} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all border border-indigo-100"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            SYNC NOW
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingListings.length > 0 ? pendingListings.map((listing) => (
          <div key={listing._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="aspect-[16/10] relative overflow-hidden bg-gray-50 border-b border-gray-100">
              {listing.images && listing.images[0] ? (
                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                  <span className="material-symbols-outlined text-4xl">inventory_2</span>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">No Image Provided</p>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/20">
                {listing.category}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate" title={listing.title}>{listing.title}</p>
                    <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-tighter">
                      Listed by: {listing.userId?.fullName || 'Unknown Citizen'}
                    </p>
                  </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{listing.type}</p>
                  {listing.type === 'Sell' && <p className="text-teal-600 font-bold text-lg">${listing.price}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button 
                  onClick={() => handleRejectListing(listing._id)}
                  className="flex-1 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  Reject
                </button>
                <button 
                  onClick={() => setInspectedItem(listing)}
                  className="flex-1 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  View
                </button>
                <button 
                  onClick={() => handleApproveListing(listing._id)}
                  className="flex-1 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  Approve
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-2 py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
             <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">inventory_2</span>
             <p className="text-gray-400 font-bold uppercase tracking-widest">No listings pending review</p>
          </div>
        )}
      </div>
    </>
  );

  const renderHistory = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-600 rounded-full" />
          Loop Archive: Platform History
        </h2>
        <div className="flex items-center gap-4">
          <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200">
            {historyListings.length} Total Cards
          </span>
          <button 
            onClick={fetchData} 
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-100 uppercase tracking-widest shadow-sm shadow-indigo-600/5"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            Refresh Archive
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/50 overflow-hidden overflow-x-auto text-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Card Identity</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Giver Profile</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Loop Attributes</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Ecosystem Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {historyListings.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4 grayscale opacity-40">
                    <span className="material-symbols-outlined text-6xl">inventory_2</span>
                    <p className="font-bold uppercase tracking-[0.2em] text-xs text-slate-700">The loop is currently empty</p>
                  </div>
                </td>
              </tr>
            ) : historyListings.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 shadow-inner group-hover:scale-105 transition-transform duration-500">
                      <img src={item.images?.[0] || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm tracking-tight line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Founding: {new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700 tracking-tight">{item.userId?.fullName || 'Anonymous Citizen'}</span>
                    <span className="text-[10px] text-gray-400 font-bold tracking-tight opacity-70">{item.userId?.email || 'N/A'}</span>
                  </div>
                </td>
                <td className="p-6">
                   <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{item.category}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border inline-block w-fit shadow-sm ${
                        item.type === 'Give' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-teal-50 text-teal-600 border-teal-100'
                      }`}>
                        {item.type}
                      </span>
                   </div>
                </td>
                <td className="p-6">
                   <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] rounded-xl border-2 ${
                     item.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20' :
                     item.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-500/20' :
                     item.status === 'claimed' ? 'bg-indigo-50 text-indigo-600 border-indigo-500/20' :
                     item.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-500/20' :
                     'bg-slate-50 text-slate-500 border-slate-200'
                   }`}>
                     {item.status}
                   </span>
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => setInspectedItem(item)}
                    className="w-10 h-10 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white hover:rotate-6 transition-all shadow-sm flex items-center justify-center shrink-0 ml-auto"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReportsQueue = () => (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-rose-600 rounded-full" />
          Flags & Moderation: Reports
        </h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">Filter</button>
          <button className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors whitespace-nowrap">Urgent Action (12)</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
        {/* Desktop Table View (lg and above) */}
        <div className="hidden lg:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Item Details</th>
                <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Reporter</th>
                <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Violation</th>
                <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Priority</th>
                <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {flaggedItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-100" />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate max-w-[150px]" title={item.title}>{item.title}</div>
                        <div className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-tighter">UID: {item._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm font-semibold text-slate-700">{item.reporter}</div>
                    <div className="text-[10px] font-bold text-teal-600 mt-0.5">K: {item.karma}</div>
                  </td>
                  <td className="p-5">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${item.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-gray-50 text-slate-600 border-gray-100'}`}>
                      {item.violation}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.priority === 'High' ? 'bg-rose-500 animate-pulse' : item.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                      <span className="text-xs font-bold text-slate-600">{item.priority}</span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <button onClick={() => handleResolveFlag(item._id, 'take_down')} title="Take Down" className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">gavel</span></button>
                      <button onClick={() => handleResolveFlag(item._id, 'clear')} title="Clear" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">done_all</span></button>
                      <button title="Details" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><span className="material-symbols-outlined text-xl">visibility</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View (below lg) */}
        <div className="lg:hidden divide-y divide-gray-50">
          {flaggedItems.map((item) => (
            <article key={item._id} className="p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-100" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{item.title}</div>
                    <div className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-tighter">UID: {item._id}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reporter</p>
                  <div className="text-xs font-semibold text-slate-700">{item.reporter} (K: {item.karma})</div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Violation</p>
                  <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-lg border bg-gray-50 text-slate-600 border-gray-100 uppercase">
                    {item.violation}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleResolveFlag(item._id, 'take_down')} className="flex-1 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">gavel</span> Take Down
                </button>
                <button onClick={() => handleResolveFlag(item._id, 'clear')} className="flex-1 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">done_all</span> Clear
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center sm:px-10 lg:px-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Queue: {flaggedItems.length} items remaining</p>
          <div className="flex gap-2">
            <button className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all"><span className="material-symbols-outlined">chevron_left</span></button>
            <button className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
      </div>
    </>
  );

  const renderTransferDesk = () => (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
       <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-headline font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary-custom">approval_delegation</span>
          Transfer Desk
        </h2>
        <p className="text-slate-500 font-medium font-body flex items-center gap-2">
          Mediate community trades and authorize item allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {(claimRequests && claimRequests.length > 0) ? (
          claimRequests.map((req) => (
            <div key={req._id} className="bg-white border-[3px] border-outline-custom shadow-[8px_8px_0px_0px_#000] p-6 flex flex-col md:flex-row gap-6 relative group overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-primary-custom"></div>
               
               <div className="w-full md:w-48 h-32 border-2 border-outline-custom overflow-hidden shrink-0 bg-slate-100 shadow-inner">
                  {req.listingId?.images?.[0] ? (
                    <img src={req.listingId.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20"><span className="material-symbols-outlined">image</span></div>
                  )}
               </div>

               <div className="flex-1 flex flex-col justify-between">
                  <div className="pr-12 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-primary-container text-primary-custom border border-primary-custom">Item Request</span>
                       <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-300">Pending Authorization</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 truncate">{req.listingId?.title}</h3>
                    <p className="text-xs font-bold text-slate-500 italic uppercase mt-1">Requested by: <span className="text-primary-custom underline">{req.userId?.fullName}</span> ({req.userId?.email})</p>
                    {req.message && (
                      <div className="mt-4 p-3 bg-slate-50 border-l-[3px] border-slate-300 italic text-sm text-slate-600">
                        "{req.message}"
                      </div>
                    )}
                  </div>
               </div>

               <div className="flex flex-col gap-3 justify-center">
                  <button 
                    onClick={() => handleApproveClaim(req._id)}
                    className="px-6 py-3 bg-emerald-500 text-white font-black uppercase text-xs border-[3px] border-outline-custom shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">check_circle</span> Authorize
                  </button>
                  <button 
                    onClick={() => handleRejectClaim(req._id)}
                    className="px-6 py-3 bg-white text-rose-600 font-black uppercase text-xs border-[3px] border-outline-custom shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">cancel</span> Decline
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="p-20 border-[4px] border-dashed border-outline-custom text-center bg-white rounded-[2rem]">
             <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 font-light">mark_chat_read</span>
             <h3 className="text-2xl font-black uppercase text-slate-400 italic">Clear Skies</h3>
             <p className="text-slate-400 font-bold uppercase text-sm mt-2">No pending claim requests at this time.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-600 rounded-full" />
          Citizen Directory: User Management
        </h2>
        <div className="flex gap-3">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-black uppercase">{users.length} Total Registered</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Details</th>
              <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Area</th>
              <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
              <th className="p-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user._id} onClick={() => setSelectedUser(user)} className={`hover:bg-gray-50/50 transition-colors cursor-pointer group ${selectedUser?._id === user._id ? 'bg-indigo-50/30' : ''}`}>
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{user.fullName}</div>
                      <div className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="text-xs font-bold text-slate-600">{user.area}</span>
                </td>
                <td className="p-5">
                  <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-full border ${user.isBanned ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {user.isBanned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="p-5">
                  <div className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="p-5 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      user.isBanned ? handleUnbanUser(user._id) : handleBanUser(user._id);
                    }}
                    className={`p-2 rounded-lg transition-all ${user.isBanned ? 'text-emerald-600 hover:bg-emerald-50' : 'text-rose-600 hover:bg-rose-50'}`}
                  >
                    <span className="material-symbols-outlined text-xl">{user.isBanned ? 'undo' : 'person_off'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-teal-600 rounded-full" />
          Deep Insights: Platform Health
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Category Distribution</h3>
          <div className="space-y-4">
            {analytics?.categoryDistribution && Object.entries(analytics.categoryDistribution).map(([cat, count]) => (
              <div key={cat} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{cat}</span>
                  <span className="text-teal-600">{count}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 rounded-full" 
                    style={{ width: `${(count / analytics.totalListings) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Activity Split</h3>
          <div className="flex items-center justify-around py-10">
            <div className="text-center">
              <p className="text-4xl font-black text-slate-900">{analytics?.typeDistribution?.['Request'] || 0}</p>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-2">Mera (Requests)</p>
            </div>
            <div className="w-px h-16 bg-gray-100" />
            <div className="text-center">
              <p className="text-4xl font-black text-slate-900">{(analytics?.totalListings || 0) - (analytics?.typeDistribution?.['Request'] || 0)}</p>
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-2">Tera (Shares)</p>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400">Overall Fulfillment Rate</span>
            <span className="text-xl font-black text-teal-600">{analytics?.fulfillmentRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-slate-900 rounded-full" />
          Audit Logs: System Activity
        </h2>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {activities.map((log, index) => (
            <div key={index} className="p-6 flex items-start gap-6 hover:bg-gray-50/50 transition-all">
              <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                log.type === 'alert' ? 'bg-rose-50 text-rose-600' : log.type === 'update' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <span className="material-symbols-outlined text-xl">
                  {log.type === 'alert' ? 'warning' : log.type === 'update' ? 'sync' : 'verified'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-bold text-slate-900">{log.message}</p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{log.time}</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase text-teal-600 tracking-widest">{log.user}</span>
                   <span className="w-1 h-1 bg-gray-200 rounded-full" />
                   <span className="text-[10px] text-gray-400">{new Date(log.createdAt || Date.now()).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-900 font-body subpixel-antialiased">
      {/* Navigation Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar (Modal View) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto custom-scrollbar ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <Link to="/" className="text-2xl font-black italic tracking-tight text-teal-400">TERAMERA</Link>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 mt-1">Admin Panel</p>
          </div>
          <button onClick={toggleSidebar} className="text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.name === activeTab;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-teal-600/10 text-teal-400 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl transition-colors ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`}>{item.icon}</span>
                <span className="text-sm tracking-wide">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-6">
          <button 
            onClick={handleBroadcast}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-lg shadow-teal-900/20 active:scale-[0.98]"
          >
            New Broadcast
          </button>
          <div className="space-y-4">
            <button className="flex w-full items-center gap-4 text-slate-400 hover:text-white transition-colors group">
              <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">help</span>
              <span className="text-xs font-medium">Support Center</span>
            </button>
            <button onClick={handleLogout} className="flex w-full items-center gap-4 text-slate-400 hover:text-rose-400 transition-colors group">
              <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">logout</span>
              <span className="text-xs font-medium uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 flex justify-between items-center w-full px-6 py-4 sticky top-0 z-30 md:px-10">
          <div className="flex items-center gap-6">
            <button onClick={toggleSidebar} className="p-2 -ml-2 text-slate-600 transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">{activeTab}</h1>
            <div className="hidden lg:flex items-center gap-8 ml-6">
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-teal-600 transition-colors">Audit Logs</a>
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-teal-600 transition-colors">Security</a>
              <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-teal-600 transition-colors">Automation</a>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden md:block">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">search</span>
              <input 
                className="bg-gray-100 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-teal-600/5 rounded-xl pl-11 pr-4 py-2.5 outline-none w-64 lg:w-80 text-sm transition-all" 
                placeholder="Search resources, users..." 
                type="text"
              />
            </div>
            <button className="material-symbols-outlined p-2 text-slate-600 hover:bg-gray-100 rounded-xl transition-all relative">
              notifications
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden xl:block">
                <p className="text-sm font-bold text-slate-900">Admin Central</p>
                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Super Admin</p>
              </div>
              <img 
                className="w-10 h-10 rounded-xl border border-gray-200 shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHvZUjWwsAfGF2Zyef9c4M2Xm8-EEOxDpwCA1gDXcFDywvakI9N2CdzTfJt7qd5HGRiffKbr_6OUyJnKv0O97iFZqwVenacpV-QmilWNH7f0XNCq0WtuSStRQO7ptt96PRYVf4on79uXKYk8YruUXBdcuumbTztu9627-7zeDhZh-RNi9smcXC1hKceJpKP2U2jD1Que5Ztq-7hNuHcFGHXLDrtmQ_kyEXrI_uVVauUXNrPqkc-YPW4CmNZ3psxqVblD5innnt7w"
                alt="Profile"
              />
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 space-y-10 max-w-[1600px] mx-auto w-full">
          {/* Stats Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                 <span className="w-1 h-6 bg-teal-600 rounded-full" />
                 Ecosystem Overview
              </h2>
              <button className="text-xs font-bold text-teal-600 hover:text-teal-700 underline decoration-2 underline-offset-4">Advanced Analytics</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const liveValue = statsData ? (
                  stat.label === 'Total Citizens' ? statsData.users :
                  stat.label === 'Total Loop Cards' ? statsData.totalCards :
                  stat.label === 'Active Flags' ? statsData.activeFlags :
                  stat.label === 'Trust Index' ? `${statsData.trustScore}%` :
                  statsData.systemHealth
                ) : stat.value;

                return (
                  <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                      <div className={`p-2 rounded-lg ${stat.type === 'trend' ? 'bg-emerald-50' : stat.iconColor?.replace('text-', 'bg-').replace('600', '50') || 'bg-gray-50'}`}>
                        <span className={`material-symbols-outlined text-lg ${stat.accentColor || stat.iconColor || 'text-gray-400'} group-hover:scale-110 transition-transform`}>
                          {stat.icon || (stat.type === 'trend' ? 'trending_up' : 'info')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{liveValue}</h3>
                      {stat.suffix && <span className="text-sm font-bold text-gray-400 mb-1">{stat.suffix}</span>}
                      {stat.type === 'trend' && (
                         <span className="text-xs font-bold text-emerald-600 mb-1 ml-auto bg-emerald-50 px-2 py-0.5 rounded-full">{stat.meta}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
            {/* Dynamic Tab Content */}
            <section className="xl:col-span-8 space-y-12">
              {activeTab === 'Dashboard' && (
                <>
                  {renderItemsQueue()}
                  <div className="pt-4 border-t border-gray-100" />
                  {renderReportsQueue()}
                </>
              )}
              {activeTab === 'Listings' && renderItemsQueue()}
              {activeTab === 'History' && renderHistory()}
              {activeTab === 'Transfer Desk' && renderTransferDesk()}
              {activeTab === 'Matchmaking' && renderMatchmaking()}
              {activeTab === 'Reports' && renderReportsQueue()}
              
              {activeTab === 'Analytics' && renderAnalytics()}
              {activeTab === 'Audit Logs' && renderAuditLogs()}
              {activeTab === 'Users' && renderUsers()}
              
              {/* Fallback for other tabs not yet implemented */}
              {!['Dashboard', 'Listings', 'Reports', 'Matchmaking', 'Users', 'Analytics', 'Audit Logs', 'History', 'Transfer Desk'].includes(activeTab) && (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                   <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">construction</span>
                   <p className="text-gray-400 font-bold uppercase tracking-widest">{activeTab} View Coming Soon</p>
                </div>
              )}
            </section>

            {/* Right Pane */}
            <aside className="xl:col-span-4 space-y-10">
              {/* Profile Card */}
              <div className={`bg-slate-900 text-white rounded-3xl p-8 shadow-xl shadow-slate-200 relative overflow-hidden group transition-all duration-500 ${selectedUser?.isBanned ? 'ring-4 ring-rose-500/30' : ''}`}>
                <div className="absolute top-0 right-0 p-8">
                   <div className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-lg ${selectedUser?.isBanned ? 'bg-rose-500 shadow-rose-900/40' : 'bg-emerald-500 shadow-emerald-900/40'}`}>
                     {selectedUser?.isBanned ? 'BANNED' : 'ACTIVE'}
                   </div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-4xl font-black text-teal-400 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                      {selectedUser?.fullName?.charAt(0) || '?'}
                    </div>
                    {selectedUser?.isBanned && (
                      <div className="absolute -bottom-2 -right-2 bg-rose-500 p-2 rounded-xl shadow-lg">
                        <span className="material-symbols-outlined text-sm">warning</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{selectedUser?.fullName || 'Select a User'}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                    {selectedUser ? `ID: ${selectedUser._id.slice(-8)}` : 'No selection'}
                  </p>
                  
                  <div className="w-full mt-10 space-y-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Neighborhood</span>
                      <span className="text-sm font-black text-teal-400">{selectedUser?.area || 'N/A'}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full shadow-lg transition-all duration-1000 ${selectedUser?.isBanned ? 'bg-rose-500' : 'bg-teal-500'}`} style={{ width: selectedUser ? (selectedUser.isBanned ? '100%' : '100%') : '0%' }} />
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleAuditInfo}
                    disabled={!selectedUser || isAuditLoading}
                    className={`bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl text-xs font-bold transition-colors border border-slate-700 ${isAuditLoading ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {isAuditLoading ? 'Loading...' : 'Audit Info'}
                  </button>
                  <button 
                    onClick={() => selectedUser?.isBanned ? handleUnbanUser(selectedUser._id) : handleBanUser(selectedUser._id)}
                    className={`py-4 rounded-2xl text-xs font-bold transition-all shadow-lg ${selectedUser?.isBanned ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20'}`}
                  >
                    {selectedUser?.isBanned ? 'Unban User' : 'Ban User'}
                  </button>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Global Activity</h3>
                  <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Live</span>
                  </div>
                </div>
                
                <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                  {activities.map((log, index) => (
                    <div key={index} className="flex gap-6 relative">
                      <div className={`mt-1.5 w-6 h-6 rounded-lg flex items-center justify-center relative z-10 shrink-0 shadow-sm ${
                        log.type === 'alert' ? 'bg-rose-500 text-white' : log.type === 'update' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}>
                        <span className="material-symbols-outlined text-xs">
                          {log.type === 'alert' ? 'warning' : log.type === 'update' ? 'sync' : 'verified'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-800">{log.message}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <span>{log.time}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full" />
                          <span className="text-teal-600">{log.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    fetchActivities(50);
                    setIsActivityModalOpen(true);
                  }}
                  className="w-full mt-10 py-3 text-xs font-bold text-slate-400 hover:text-teal-600 hover:bg-gray-50 rounded-xl border border-dashed border-gray-200 transition-all"
                >
                  Show All Activities
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Activities History Modal */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col h-auto max-h-[85vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">Audit Trail</h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Global activity history logs</p>
              </div>
              <button 
                onClick={() => setIsActivityModalOpen(false)}
                className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              {allActivities.length > 0 ? allActivities.map((log, index) => (
                <div key={index} className="flex gap-4 border-l-2 border-gray-100 pl-4 py-1">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    log.type === 'alert' ? 'bg-rose-500' : log.type === 'update' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <p className="text-sm font-bold text-slate-700 leading-tight mb-1">{log.message}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       <span className="w-1 h-1 bg-gray-200 rounded-full" />
                       <span className="text-teal-600">{log.user || 'System'}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center">
                   <p className="text-gray-400 font-bold uppercase tracking-widest">No activities found</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100">
               <button 
                 onClick={() => setIsActivityModalOpen(false)}
                 className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-slate-500 hover:bg-gray-100 transition-all uppercase tracking-widest"
               >
                 Close Archive
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Footer Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-4 z-40">
        {navItems.slice(0, 4).map((item) => (
          <button 
            key={item.name} 
            className={`flex flex-col items-center gap-1 ${item.name === activeTab ? 'text-teal-600' : 'text-gray-400'}`}
            onClick={() => setActiveTab(item.name)}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.name.slice(0, 4)}</span>
          </button>
        ))}
      </nav>

      {/* Inspection Modal */}
      {inspectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300 flex flex-col lg:flex-row h-auto max-h-[90vh]">
            <div className="relative lg:w-1/2 bg-gray-100 border-r border-gray-100">
              <img 
                src={inspectedItem.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop'} 
                alt={inspectedItem.title} 
                className="w-full h-64 lg:h-full object-cover"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-4 py-2 bg-white/90 backdrop-blur text-indigo-600 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg border border-white">
                  {inspectedItem.category}
                </span>
              </div>
            </div>
            
            <div className="lg:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">{inspectedItem.title}</h2>
                  <p className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                    <span className="material-symbols-outlined text-sm">person</span>
                    By {inspectedItem.userId?.fullName || 'Anonymous'} ({inspectedItem.userId?.email})
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setInspectedItem(null)}
                    className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all text-slate-800 shrink-0"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Condition</p>
                  <p className="font-bold text-slate-700">{inspectedItem.condition}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pricing / Mode</p>
                  <p className="font-bold text-teal-600">{inspectedItem.type === 'Sell' ? `$${inspectedItem.price}` : inspectedItem.type}</p>
                </div>
              </div>

              <div className="mb-10 flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Item Narrative</p>
                <div className="text-slate-600 font-medium leading-relaxed bg-indigo-50/30 p-6 rounded-3xl border border-indigo-50/50 italic">
                  "{inspectedItem.description || `This citizen is sharing a ${inspectedItem.title.toLowerCase()} with the community. Everything is better when shared.`}"
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button 
                  onClick={() => { handleRejectListing(inspectedItem._id); setInspectedItem(null); }}
                  className="flex-1 py-5 bg-white border-2 border-rose-100 text-rose-600 font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-[0.98]"
                >
                  Reject Item
                </button>
                <button 
                  onClick={() => { handleApproveListing(inspectedItem._id); setInspectedItem(null); }}
                  className="flex-3 py-5 bg-teal-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-teal-900/20 hover:bg-teal-500 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
                >
                  Approve and Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {isAuditModalOpen && auditData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col h-auto max-h-[90vh]">
            <div className="p-10 border-b border-gray-100 flex justify-between items-start bg-slate-50/50">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Citizen Audit: {selectedUser.fullName}</h2>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedUser.isBanned ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                     {selectedUser.isBanned ? 'Banned' : 'Active'}
                   </span>
                 </div>
                 <p className="text-xs text-gray-500 font-medium">Comprehensive behavior analysis & ecosystem contribution report</p>
              </div>
              <button 
                onClick={() => setIsAuditModalOpen(false)}
                className="w-12 h-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all text-slate-800 shadow-sm"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Karma Score</p>
                     <h4 className="text-4xl font-black text-slate-900">{auditData.impact?.karmaScore || 0}</h4>
                     <p className="text-[10px] text-teal-600 font-bold mt-2 uppercase">Verified Citizen</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Carbon Saved</p>
                     <h4 className="text-4xl font-black text-emerald-600">{auditData.impact?.carbonSaved || 0}kg</h4>
                     <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Eco Impact</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Neighbors Helped</p>
                     <h4 className="text-4xl font-black text-indigo-600">{auditData.impact?.neighborsHelped || 0}</h4>
                     <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Circle Closure</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <section className="space-y-6">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                        Tera History (Shared)
                     </h3>
                     <div className="space-y-3">
                        {auditData.listings.length > 0 ? auditData.listings.slice(0, 5).map(item => (
                           <div key={item._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                              <div>
                                 <p className="text-sm font-bold text-slate-800">{item.title}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase">{item.category} • {item.type}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${item.status === 'claimed' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                 {item.status}
                              </span>
                           </div>
                        )) : (
                           <p className="text-xs text-gray-400 italic">No community contributions yet.</p>
                        )}
                     </div>
                  </section>

                  <section className="space-y-6">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        Mera History (Interests)
                     </h3>
                     <div className="space-y-3">
                        {auditData.claims.length > 0 ? auditData.claims.slice(0, 5).map(req => (
                           <div key={req._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                              <div>
                                 <p className="text-sm font-bold text-slate-800">{req.listingId?.title || 'Unknown Item'}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                 {req.status}
                              </span>
                           </div>
                        )) : (
                           <p className="text-xs text-gray-400 italic">No community requests yet.</p>
                        )}
                     </div>
                  </section>
               </div>
            </div>
            
            <div className="p-10 bg-slate-900 flex items-center justify-between">
               <div className="flex gap-4">
                 <button 
                   onClick={() => { selectedUser?.isBanned ? handleUnbanUser(selectedUser._id) : handleBanUser(selectedUser._id); setIsAuditModalOpen(false); }}
                   className={`px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedUser.isBanned ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'} text-white`}
                 >
                   {selectedUser.isBanned ? 'Lift Ban' : 'Restrict User'}
                 </button>
                 <button className="px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all">Download Audit PDF</button>
               </div>
               <button 
                 onClick={() => setIsAuditModalOpen(false)}
                 className="text-white text-xs font-black uppercase tracking-[0.2em] hover:text-teal-400 transition-colors"
               >
                 Close Report
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      <div 
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] transition-all duration-500 transform ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <div className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 ${
          toast.type === 'error' ? 'bg-rose-600 border-rose-500' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className="material-symbols-outlined text-white">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <p className="text-white font-bold text-sm uppercase tracking-widest">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
