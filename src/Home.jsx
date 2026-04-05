import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import heroImage from './assets/hero.webp';

const Hero = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="relative overflow-hidden pt-12 md:pt-20 pb-20 md:pb-32 px-4 md:px-8 border-b-4 border-outline-custom bg-surface-custom">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 z-10 text-center lg:text-left">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-8">
            <span className="bg-secondary-container px-4 inline-block transform -rotate-1 mb-4 border-[3px] border-outline-custom shadow-[4px_4px_0px_0px_rgba(117,119,119,1)]">Tera Mere.</span><br/>
            <span className="text-primary-custom italic bg-surface-container-lowest px-2 border-[2px] border-outline-custom shadow-[4px_4px_0px_0px_rgba(117,119,119,1)]">Mera Tera.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-bold font-body uppercase tracking-wider text-on-surface-variant mb-10 md:mb-12 max-w-xl mx-auto lg:mx-0">
            The neighborhood loop is coming soon.
          </p>
          <div className="relative max-w-xl mx-auto lg:mx-0 group">
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 bg-secondary-fixed-dim border-4 border-outline-custom shadow-[4px_4px_0px_0px_rgba(117,119,119,1)] rotate-6 -z-10 opacity-60 group-hover:rotate-12 transition-transform"></div>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 relative z-10 border-[3px] md:border-[4px] border-outline-custom shadow-[6px_6px_0px_0px_#757777] md:shadow-[8px_8px_0px_0px_#757777] focus-within:-translate-y-1 focus-within:shadow-[10px_10px_0px_0px_#757777] transition-all">
              <input 
                className="flex-grow h-14 md:h-16 bg-surface-container-highest px-6 text-lg md:text-xl font-bold focus:bg-primary-container focus:outline-none transition-colors placeholder:text-on-surface-variant" 
                placeholder="YOUR LOCAL EMAIL..." 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                className="h-14 md:h-16 bg-primary-custom text-on-primary font-headline font-black text-lg md:text-xl uppercase px-8 hover:bg-primary-dim transition-all active:bg-black" 
                type="submit"
              >
                Join Waitlist
              </button>
            </form>
          </div>
          <div className="mt-8 md:mt-10 flex items-center justify-center lg:justify-start gap-4 font-bold text-xs md:text-sm uppercase text-on-surface">
            <span className="text-on-surface-variant">Already have an account?</span>
            <button 
              onClick={() => navigate('/login')}
              className="text-primary-custom hover:underline underline-offset-4 decoration-2"
            >
              Login here
            </button>
          </div>
        </div>
        <div className="flex-1 relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
          <div className="relative w-full aspect-square border-4 border-outline-custom bg-surface-container-low shadow-[8px_8px_0px_0px_rgba(0,102,102,1)] md:shadow-[12px_12px_0px_0px_rgba(0,102,102,1)] overflow-hidden">
            <img 
              alt="Local Community" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100" 
              src={heroImage}
            />
            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-tertiary-dim text-on-tertiary p-2 md:p-4 border-[2px] md:border-[3px] border-outline-custom shadow-[2px_2px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000] rotate-6 z-20 animate-pulse-custom">
              <span className="text-lg md:text-2xl font-black italic uppercase block leading-none">EARLY</span>
              <span className="text-lg md:text-2xl font-black italic uppercase block leading-none">ACCESS</span>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

const TwoSides = () => (
  <section className="py-20 md:py-32 px-4 md:px-8 bg-surface-container-low overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="mb-16 md:mb-20 flex flex-col items-center md:items-start">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase mb-4 text-center md:text-left leading-none tracking-tighter">Two Sides of the Loop</h2>
        <div className="h-2 md:h-3 w-32 md:w-48 bg-primary-custom border-[2px] border-outline-custom shadow-[2px_2px_0px_0px_rgba(117,119,119,1)]"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="relative group">
          <div className="absolute inset-0 bg-outline-custom translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4"></div>
          <div className="relative bg-surface-container-lowest border-4 border-outline-custom p-6 sm:p-8 md:p-12 flex flex-col h-full hover:-translate-y-1 hover:-translate-x-1 lg:hover:-translate-y-2 lg:hover:-translate-x-2 transition-transform">
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-container border-[2px] md:border-[3px] border-outline-custom flex items-center justify-center shadow-[3px_3px_0px_0px_#757777] md:shadow-[4px_4px_0px_0px_#757777]">
                <span className="material-symbols-outlined text-3xl md:text-4xl text-primary-custom" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
              </div>
              <span className="bg-primary-custom text-on-primary font-black px-3 py-1 uppercase text-[10px] md:text-xs border-[2px] border-outline-custom shadow-[2px_2px_0px_0px_#000]">Side A</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 uppercase">Tera (Giver)</h3>
            <p className="text-base sm:text-lg md:text-xl font-bold leading-relaxed mb-6 md:mb-8 flex-grow text-on-surface-variant italic">Share your surplus, your skills, or your space. From backyard lemons to professional mentoring, turn your 'Tera' into collective value.</p>
            <ul className="space-y-3 md:space-y-4 border-t-2 md:border-t-4 border-surface-variant pt-6 md:pt-8">
              {['List Items in 30s', 'Earn Karma Points', 'Build Local Trust'].map((text) => (
                <li key={text} className="flex items-center gap-3 font-bold uppercase italic text-xs md:text-sm">
                  <span className="material-symbols-outlined text-primary-custom font-black text-lg md:text-xl">check_circle</span> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-secondary translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4 opacity-50"></div>
          <div className="relative bg-surface-container-lowest border-4 border-outline-custom p-6 sm:p-8 md:p-12 flex flex-col h-full hover:-translate-y-1 hover:-translate-x-1 lg:hover:-translate-y-2 lg:hover:-translate-x-2 transition-transform">
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary-container border-[2px] md:border-[3px] border-outline-custom flex items-center justify-center shadow-[3px_3px_0px_0px_#757777] md:shadow-[4px_4px_0px_0px_#757777]">
                <span className="material-symbols-outlined text-3xl md:text-4xl text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
              </div>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-black px-3 py-1 uppercase text-[10px] md:text-xs border-[2px] border-outline-custom shadow-[2px_2px_0px_0px_#000]">Side B</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 uppercase">Mera (Receiver)</h3>
            <p className="text-base sm:text-lg md:text-xl font-bold leading-relaxed mb-6 md:mb-8 flex-grow text-on-surface-variant italic">Discover what’s available right around the corner. Borrow tools, receive fresh produce, or find local help without the friction of commerce.</p>
            <ul className="space-y-3 md:space-y-4 border-t-2 md:border-t-4 border-surface-variant pt-6 md:pt-8">
              {['Hyper-local Discovery', 'Real-time Requests', 'ZERO Transaction Fees'].map((text) => (
                <li key={text} className="flex items-center gap-3 font-bold uppercase italic text-xs md:text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary font-black text-lg md:text-xl">check_circle</span> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

);

const WhyJoin = () => (
  <section className="py-20 md:py-32 px-4 md:px-8 border-t-4 border-outline-custom bg-surface-custom relative overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-10 md:gap-8 mb-16 md:mb-20 text-center lg:text-left">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase max-w-xl leading-none tracking-tighter">Why Join Early?</h2>
        <p className="text-base sm:text-lg md:text-xl font-bold uppercase text-on-surface-variant max-w-sm italic border-l-4 border-primary-custom pl-4 md:pl-6 py-2 bg-surface-container-low hidden lg:block">The first 5,000 members get permanent ecosystem benefits.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="md:col-span-1 lg:col-span-7 bg-primary-dim p-8 md:p-12 border-4 border-outline-custom shadow-[6px_6px_0px_0px_rgba(117,119,119,1)] md:shadow-[8px_8px_0px_0px_#757777] text-on-primary relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 md:mb-6 uppercase">Exclusive Karma Badge</h3>
            <p className="text-base md:text-lg font-bold opacity-90 mb-6 md:mb-8 max-w-md">Early adopters receive the 'Genesis' badge, granting permanent 2x Karma multipliers on all neighborly acts.</p>
            <span className="material-symbols-outlined text-[6rem] md:text-[10rem] absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          </div>
        </div>
        <div className="md:col-span-1 lg:col-span-5 bg-secondary-fixed p-8 md:p-12 border-4 border-outline-custom shadow-[6px_6px_0px_0px_rgba(117,119,119,1)] md:shadow-[8px_8px_0px_0px_#757777] flex flex-col justify-center lg:rotate-1">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-4 uppercase italic leading-tight">First Pick on Local Treasures</h3>
          <p className="text-base md:text-lg font-bold text-on-secondary-fixed">Priority notifications for high-demand items and skills in your immediate neighborhood radius.</p>
        </div>
        <div className="md:col-span-1 lg:col-span-4 bg-tertiary-fixed p-8 md:p-12 border-4 border-outline-custom shadow-[6px_6px_0px_0px_rgba(117,119,119,1)] md:shadow-[8px_8px_0px_0px_#757777] lg:-rotate-1">
          <span className="material-symbols-outlined text-5xl md:text-6xl mb-4 md:mb-6 text-on-tertiary-fixed">groups</span>
          <h3 className="text-xl md:text-2xl font-black mb-2 uppercase text-on-tertiary-fixed">Founding Hub Access</h3>
          <p className="text-xs md:text-sm font-black uppercase opacity-75 text-on-tertiary-fixed">Help shape the governance rules of your local ecosystem hub.</p>
        </div>
        <div className="md:col-span-1 lg:col-span-8 bg-surface-container-highest border-4 border-outline-custom p-8 md:p-12 shadow-[6px_6px_0px_0px_rgba(117,119,119,1)] md:shadow-[8px_8px_0px_0px_#757777] flex flex-col lg:flex-row items-center gap-8 md:gap-10 group relative transition-all duration-300">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 uppercase">Verified Founder Status</h3>
            <p className="text-base md:text-lg font-bold text-on-surface-variant mb-6 leading-snug">Skip the verification queue forever. Your profile is permanently 'Verified' at the Genesis level, granting immediate trust and priority matching in all neighborhood exchanges.</p>
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="relative text-on-surface-variant font-black italic opacity-60 slash-price inline-block px-1 text-sm md:text-base">
                SKIP-THE-QUEUE PRIORITY
              </div>
              <div className="bg-primary-custom text-on-primary text-[10px] md:text-xs font-black uppercase px-2 py-1 rotate-[-2deg] border-2 border-outline-custom shadow-[2px_2px_0px_0px_#000]">
                GENESIS VERIFIED
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="w-full sm:w-48 h-24 md:h-32 border-4 border-outline-custom bg-surface-container-lowest flex flex-col items-center justify-center rotate-3 md:rotate-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-0 transition-all duration-500 overflow-hidden group-hover:verified-hologram">
              <span className="material-symbols-outlined text-4xl md:text-5xl text-primary-custom mb-1 transition-colors group-hover:text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter opacity-70 group-hover:text-on-primary group-hover:opacity-100">STATUS: ELITE</span>
              <div className="absolute inset-0 animate-glimmer opacity-0 group-hover:opacity-100 pointer-events-none"></div>
            </div>
            {/* Stamp effect on hover */}
            <div className="absolute -top-6 -right-6 md:-top-8 md:-right-8 w-20 h-20 md:w-28 md:h-28 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:animate-stamp transition-opacity duration-300 z-20">
              <div className="w-full h-full bg-primary-container border-4 border-primary-custom flex items-center justify-center rotate-12 shadow-[4px_4px_0px_0px_#000]">
                <span className="text-primary-custom font-black text-lg md:text-xl uppercase italic leading-none text-center">TRUSTED<br/>GENESIS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

);

const FinalCTA = () => (
  <section className="py-24 md:py-32 px-4 md:px-8 text-center bg-surface-custom border-t-4 border-outline-custom relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full waitlist-grid-bg opacity-30 -z-10"></div>
    <div className="max-w-4xl mx-auto relative group">
      <div className="absolute inset-0 bg-secondary-fixed translate-x-3 translate-y-3 md:translate-x-6 md:translate-y-6 -z-10 border-4 border-outline-custom"></div>
      
      <div className="bg-surface-container-lowest border-4 md:border-8 border-outline-custom p-8 sm:p-12 md:p-20 relative z-10 transition-transform group-hover:-translate-x-2 md:group-hover:-translate-x-3 group-hover:-translate-y-2 md:group-hover:-translate-y-3 shadow-[8px_8px_0px_0px_#757777] md:shadow-[12px_12px_0px_0px_#757777]">
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase mb-6 md:mb-8 leading-none tracking-tighter">Ready to Close the Loop?</h2>
        <p className="text-lg sm:text-xl md:text-2xl font-bold uppercase mb-10 md:mb-16 italic text-on-surface-variant">Spots are filling up by neighborhood. Don't let your street be last.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8">
          <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="w-full sm:w-auto bg-primary-custom text-on-primary text-xl md:text-2xl font-black uppercase px-12 py-5 md:py-6 border-4 border-outline-custom shadow-[6px_6px_0px_0px_#000] md:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#000] active:translate-y-0 active:shadow-none transition-all"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  </section>

);

const Home = () => {
  return (
    <div className="min-h-screen bg-surface-custom text-on-surface wine-body">
      <Navbar />
      <main>
        <Hero />
        <TwoSides />
        <WhyJoin />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
