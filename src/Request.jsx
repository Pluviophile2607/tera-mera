import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { apiUrl } from './lib/api';

const Request = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Tools',
    condition: 'Good as New',
    type: 'Request',
    location: user?.area || 'Palava',
    description: '',
    urgency: 'This Week',
    budget: 'Free / Gift',
    radius: 5,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=mera');
    }
  }, [isAuthenticated, navigate]);

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
          images: [], 
          urgency: formData.urgency,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          title: '',
          category: 'Tools',
          condition: 'Good as New',
          type: 'Request',
          location: user?.area || 'Palava',
          description: '',
          urgency: 'This Week',
          budget: 'Free / Gift',
          radius: 5,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to broadcast request.');
      }
    } catch (err) {
      setError(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f1f1] text-on-surface font-body selection:bg-secondary-container min-h-screen">
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
          
          {/* Left Column: Form */}
          <section>
            <header className="mb-12 relative">
               <div className="absolute -top-4 -left-4 w-32 h-12 bg-[#FACC15] -z-0"></div>
               <h1 className="text-7xl font-headline font-black uppercase leading-[0.9] tracking-tighter relative z-10">
                  BROADCAST <br/> YOUR NEED
               </h1>
            </header>

            {success && (
              <div className="bg-emerald-500 text-white p-6 mb-8 border-4 border-black shadow-[6px_6px_0px_#000] flex items-center justify-between animate-in fade-in zoom-in">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-4xl font-black">check_circle</span>
                  <div>
                    <p className="font-headline font-black uppercase text-xl">WISH BROADCASTED!</p>
                    <p className="font-bold opacity-90 text-sm">Neighbors are looking for you now.</p>
                  </div>
                </div>
                <button onClick={() => setSuccess(false)} className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}

            {error && (
              <div className="bg-rose-500 text-white p-6 mb-8 border-4 border-black shadow-[6px_6px_0px_#000]">
                <p className="font-black uppercase tracking-tight text-lg">Wait a minute!</p>
                <p className="font-bold opacity-90">{error}</p>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* What do you need? */}
              <div className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_#000] relative">
                 <label className="block text-xl font-headline font-black uppercase mb-4 tracking-tight">WHAT DO YOU NEED?</label>
                 <input 
                    className="w-full bg-[#E5E7EB] border-[3px] border-[#9CA3AF] p-6 font-bold text-2xl focus:border-black outline-none transition-all placeholder:text-gray-400" 
                    placeholder="e.g. Lawn Mower, Folding Chairs, Heavy Duty Drill" 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                 />
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div>
                       <label className="block text-xs font-black uppercase mb-2 tracking-widest text-gray-500">CATEGORY</label>
                       <div className="relative">
                          <select 
                             className="w-full bg-[#E5E7EB] border-[3px] border-[#9CA3AF] p-4 font-bold appearance-none outline-none focus:border-black"
                             value={formData.category}
                             onChange={(e) => setFormData({...formData, category: e.target.value})}
                          >
                             <option>Tools</option>
                             <option>Home & Decor</option>
                             <option>Garden</option>
                             <option>Kitchen</option>
                             <option>Electronics</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                       </div>
                    </div>
                    <div>
                       <label className="block text-xs font-black uppercase mb-2 tracking-widest text-gray-500">URGENCY</label>
                       <div className="flex border-[3px] border-[#9CA3AF]">
                          {['Today', 'This Week', 'Anytime'].map((u) => (
                             <button
                                key={u}
                                type="button"
                                onClick={() => setFormData({...formData, urgency: u})}
                                className={`flex-1 p-4 font-bold text-sm transition-all ${formData.urgency === u ? 'bg-[#0E676F] text-white' : 'bg-white hover:bg-gray-100'}`}
                             >
                                {u}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Budget & Range */}
              <div className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_#000]">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                       <label className="block text-xl font-headline font-black uppercase mb-6 tracking-tight">BUDGET PREFERENCE</label>
                       <div className="space-y-4">
                          {[
                             { id: 'free', label: 'Free / Gift' },
                             { id: 'borrow', label: 'Borrow (Temporary)' },
                             { id: 'budget', label: 'Set Budget (Negotiable)' }
                          ].map((opt) => (
                             <label key={opt.id} className="flex items-center gap-4 cursor-pointer group">
                                <input 
                                   type="radio" 
                                   name="budget" 
                                   className="hidden"
                                   checked={formData.budget === opt.label}
                                   onChange={() => setFormData({...formData, budget: opt.label})}
                                />
                                <div className={`w-8 h-8 rounded-full border-[3px] border-black flex items-center justify-center transition-all ${formData.budget === opt.label ? 'bg-[#0E676F]' : 'bg-white'}`}>
                                   {formData.budget === opt.label && <div className="w-3 h-3 rounded-full bg-white"></div>}
                                </div>
                                <span className="font-bold text-lg group-hover:underline">{opt.label}</span>
                             </label>
                          ))}
                       </div>
                    </div>
                    <div>
                       <label className="block text-xl font-headline font-black uppercase mb-2 tracking-tight">BROADCAST RANGE</label>
                       <div className="pt-10 pb-8 relative">
                          <input 
                             type="range" 
                             min="1" 
                             max="15" 
                             step="1"
                             className="w-full h-1 bg-black appearance-none cursor-pointer accent-[#0E676F]"
                             value={formData.radius}
                             onChange={(e) => setFormData({...formData, radius: parseInt(e.target.value)})}
                          />
                          <div className="flex justify-between mt-4 font-black text-[#0E676F] text-sm">
                             <span>1km</span>
                             <span>15km</span>
                          </div>
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#FACC15] border-2 border-black p-2 font-black text-xl shadow-[4px_4px_0px_#000]">
                             {formData.radius}km
                          </div>
                          <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">REACHING APPROXIMATELY 450 NEIGHBORS IN YOUR AREA.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Details & Photo */}
              <div className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_#000] relative">
                 <div className="absolute -top-4 -left-4 bg-white border-2 border-black px-3 py-1 font-black text-xs uppercase tracking-widest italic opacity-40">Circular</div>
                 <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8">
                    <div>
                       <label className="block text-xl font-headline font-black uppercase mb-4 tracking-tight">ADD DETAILS</label>
                       <textarea 
                          className="w-full bg-[#E5E7EB] border-[3px] border-[#9CA3AF] p-6 font-bold outline-none min-h-[160px] focus:border-black transition-all"
                          placeholder="Mention why you need it or any specifics (e.g. 'Needed for a weekend garage project', 'Must be cordless')."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-xl font-headline font-black uppercase mb-4 tracking-tight text-center">PHOTO</label>
                       <div className="aspect-square border-[4px] border-dashed border-[#9CA3AF] flex flex-col items-center justify-center text-center p-4 group hover:border-black cursor-pointer transition-colors bg-gray-50">
                          <span className="material-symbols-outlined text-4xl mb-2 transition-transform group-hover:scale-110">add_a_photo</span>
                          <span className="text-[10px] font-black uppercase tracking-tighter leading-tight opacity-60">REFERENCE IMAGE</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Submit */}
              <button 
                className="w-full bg-[#FACC15] text-black border-[4px] border-black py-10 font-headline font-black text-4xl uppercase shadow-[10px_10px_0px_#000] hover:-translate-y-1 hover:shadow-[14px_14px_0px_#000] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-6 disabled:opacity-50" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'BROADCASTING...' : 'BROADCAST WISH TO NEIGHBORHOOD'}
              </button>
            </form>
          </section>

          {/* Right Column: Sidebar */}
          <aside className="space-y-12 pt-12">
             <section className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_#000]">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-3 h-3 bg-rose-500"></div>
                   <h2 className="text-xl font-headline font-black uppercase tracking-tight">ACTIVE NEIGHBOR WISHES</h2>
                </div>
                
                <div className="space-y-6">
                   {[
                      { title: 'HAMMER DRILL', distance: '300m away', category: 'Tool', tag: 'BORROW', tagColor: '#0E676F', time: 'TODAY' },
                      { title: 'EXTRA CHAIRS (10)', distance: '1.2km away', category: 'Event', tag: 'FREE', tagColor: '#FACC15', time: 'WED' },
                      { title: 'LAWN EDGER', distance: '0.8km away', category: 'Garden', tag: '$20 BUDGET', tagColor: 'transparent', borderColor: '#E11D48', time: 'FRI' },
                   ].map((wish, i) => (
                      <div key={i} className="bg-gray-100 border-[2px] border-[#9CA3AF] p-4 relative flex items-center gap-4 transition-transform hover:scale-[1.02] cursor-pointer">
                         <div className="absolute -top-2 -right-2 bg-gray-400 text-white px-2 py-0.5 text-[8px] font-black">{wish.time}</div>
                         <div className="w-16 h-16 bg-white border-2 border-gray-300 flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl opacity-40">
                               {wish.category === 'Tool' ? 'construction' : wish.category === 'Event' ? 'event_seat' : 'grass'}
                            </span>
                         </div>
                         <div className="flex-1">
                            <h4 className="font-black text-sm uppercase leading-tight">{wish.title}</h4>
                            <p className="text-[10px] font-bold text-gray-500 uppercase">{wish.distance} • {wish.category}</p>
                            <div className="mt-2 inline-block px-3 py-0.5 text-[9px] font-black uppercase border-2" style={{ backgroundColor: wish.tagColor === 'transparent' ? 'white' : wish.tagColor, color: wish.tagColor === '#FACC15' ? 'black' : wish.tagColor === '#0E676F' ? 'white' : wish.borderColor, borderColor: wish.borderColor || 'transparent' }}>
                               {wish.tag}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             <section className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_#000]">
                <div className="flex justify-between items-end mb-4">
                   <h2 className="text-4xl font-headline font-black leading-none text-[#0E676F]">84%</h2>
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-tighter leading-tight">WISHES FULFILLED</p>
                      <p className="text-[9px] font-black uppercase tracking-tighter leading-tight">THIS MONTH</p>
                   </div>
                </div>
                <div className="h-4 bg-gray-200 border-2 border-black relative overflow-hidden">
                   <div className="absolute inset-0 bg-[#0E676F]" style={{ width: '84%' }}></div>
                </div>
             </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Request;
