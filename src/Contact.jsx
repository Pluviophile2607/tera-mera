import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Failed to send message.');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen font-body bg-surface-custom text-on-surface">
      <Navbar />
      <main className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">REACH <br/><span className="text-primary-custom italic">OUT.</span></h1>
            <p className="text-xl md:text-2xl font-bold font-body max-w-md text-on-surface-variant italic leading-tight">
              Whether you're looking to launch a hub in your city or need support with your local loop, we're here.
            </p>
            
            <div className="space-y-8">
              <div className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                <span className="text-xs font-black uppercase text-primary-custom tracking-widest mb-2 block">SUPPORT HUB</span>
                <p className="text-xl font-black">zedinfo@zed.org</p>
              </div>
              <div className="bg-[#ffd709] border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1">
                <span className="material-symbols-outlined text-3xl mb-2 font-black">location_on</span>
                <p className="text-lg font-black uppercase">Palava City, Maharashtra</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low border-[4px] border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
            {error && (
              <div className="bg-rose-500 text-white p-4 border-[3px] border-black mb-8 font-bold animate-in slide-in-from-top-2">
                {error}
              </div>
            )}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#757777]">YOUR NAME</label>
                  <input 
                    type="text" 
                    name="name"
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full p-5 border-[3px] border-black bg-white focus:outline-none focus:bg-primary-container font-bold text-lg transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#757777]">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    name="email"
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full p-5 border-[3px] border-black bg-white focus:outline-none focus:bg-secondary-container font-bold text-lg transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#757777]">MOBILE NUMBER</label>
                  <input 
                    type="tel" 
                    name="mobile"
                    required 
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full p-5 border-[3px] border-black bg-white focus:outline-none focus:bg-amber-100 font-bold text-lg transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#757777]">MESSAGE</label>
                  <textarea 
                    name="message"
                    rows="5" 
                    required 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What's on your mind?"
                    className="w-full p-5 border-[3px] border-black bg-white focus:outline-none focus:bg-tertiary-container font-bold text-lg transition-colors"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-primary-custom text-on-primary text-xl font-black uppercase border-[3px] border-black shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'SENDING...' : 'SEND MESSAGE'}
                  <span className="material-symbols-outlined font-black">send</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-20 bg-white border-[3px] border-black animate-in fade-in zoom-in duration-500">
                <span className="material-symbols-outlined text-7xl text-primary-custom mb-6 font-black" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <h3 className="text-3xl font-black uppercase mb-4">Message Sent!</h3>
                <p className="text-lg font-bold text-on-surface-variant max-w-xs mx-auto italic uppercase">A real human from the TeraMera loop will get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-10 underline font-black uppercase hover:text-primary-custom transition-all"
                >
                  Send another?
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
