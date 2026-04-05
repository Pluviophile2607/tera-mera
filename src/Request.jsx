import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

const Request = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Tools',
    condition: 'Good as New', // For requested items, this could mean "preferred condition"
    type: 'Request',
    location: user?.area || 'Silver Lake, CA',
    description: '',
    urgency: 'Medium',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'http://127.0.0.1:5000/api';

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
      const res = await fetch(`${API_BASE}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
          // Placeholder for images if needed, but not required for requests
          images: [], 
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          title: '',
          category: 'Tools',
          condition: 'Good as New',
          type: 'Request',
          location: user?.area || 'Silver Lake, CA',
          description: '',
          urgency: 'Medium',
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
    <div className="bg-background-custom text-on-surface font-body selection:bg-secondary-container min-h-screen">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <span className="bg-secondary-container text-on-secondary-container px-3 py-1 font-bold uppercase text-sm inline-block mb-4 border-2 border-outline-custom">Mera Mode (Receiver)</span>
          <h1 className="text-5xl md:text-7xl font-headline font-black uppercase leading-[0.9] tracking-tight text-primary-custom mb-4">
            Broadcast <span className="bg-primary-container px-2">What You Need.</span>
          </h1>
          <p className="text-xl font-medium opacity-80">The neighborhood is full of surplus. Let your neighbors know what you're looking for, and close the loop together.</p>
        </header>

        {success && (
          <div className="brutalist-card bg-emerald-500 text-white p-6 mb-8 border-4 border-outline-custom flex items-center justify-between animate-in fade-in zoom-in">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl">campaign</span>
              <div className="flex flex-col">
                <p className="font-headline font-black uppercase text-2xl">Request Broadcasted!</p>
                <p className="font-bold opacity-90 text-sm">Your neighbors are now seeing your request in the loop.</p>
              </div>
            </div>
            <button onClick={() => setSuccess(false)} className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        {error && (
          <div className="brutalist-card bg-rose-500 text-white p-6 mb-8 border-4 border-outline-custom">
            <p className="font-black uppercase tracking-tight text-lg">Wait a minute!</p>
            <p className="font-bold opacity-90">{error}</p>
          </div>
        )}

        <form className="space-y-12" onSubmit={handleSubmit}>
          <section className="brutalist-card bg-surface-container-lowest p-8 relative">
            <div className="absolute -top-6 -left-4 bg-primary-custom text-on-primary px-4 py-2 font-black text-2xl border-4 border-outline-custom">!</div>
            <h2 className="text-3xl font-headline font-black uppercase mb-6 mt-2">Request Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block font-bold uppercase mb-2 text-sm">What do you need?</label>
                <input 
                  className="w-full bg-surface-container-highest border-4 border-outline-custom p-4 font-bold text-lg focus:bg-primary-container outline-none transition-colors" 
                  placeholder="e.g., A sturdy ladder for the weekend" 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold uppercase mb-2 text-sm">Category</label>
                  <select 
                    className="w-full bg-surface-container-highest border-4 border-outline-custom p-4 font-bold outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Tools</option>
                    <option>Home & Decor</option>
                    <option>Garden</option>
                    <option>Kitchen</option>
                    <option>Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-2 text-sm">Urgency</label>
                  <select 
                    className="w-full bg-surface-container-highest border-4 border-outline-custom p-4 font-bold outline-none"
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                  >
                    <option>Low (Anytime)</option>
                    <option>Medium (This week)</option>
                    <option>High (ASAP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase mb-2 text-sm">Why do you need it? (Optional)</label>
                <textarea 
                  className="w-full bg-surface-container-highest border-4 border-outline-custom p-4 font-bold outline-none min-h-[120px] focus:bg-primary-container transition-colors"
                  placeholder="Tell your neighbors how they can help..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </section>

          <div className="pt-8 flex justify-center">
            <button 
              className="w-full md:w-auto px-12 py-8 bg-primary-custom text-on-primary font-headline font-black text-4xl uppercase border-4 border-on-surface shadow-[8px_8px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 transition-all flex items-center justify-center gap-4 group disabled:opacity-50" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Broadcasting...' : 'Broadcast Request'}
              <span className="material-symbols-outlined text-4xl group-hover:scale-125 transition-transform">campaign</span>
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Request;
