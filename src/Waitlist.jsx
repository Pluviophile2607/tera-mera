import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Hero = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="flex flex-col items-start px-6 py-20 md:py-32 md:px-20 lg:px-32 w-full max-w-7xl mx-auto relative overflow-hidden">
      <div className="absolute top-10 right-20 bg-tertiary-fixed text-on-tertiary-fixed font-body font-bold text-xs uppercase px-3 py-1 border-[2px] border-outline-custom transform rotate-3 shadow-[3px_3px_0px_0px_#757777] hidden md:block animate-float">
        BETA V0.9
      </div>
      <h1 className="font-headline text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] font-black uppercase tracking-tight leading-[0.85] mb-12 max-w-5xl">
        Be the first to <br className="hidden md:block" />
        <span className="bg-secondary-container inline-block px-4 py-2 border-[4px] border-outline-custom shadow-[6px_6px_0px_0px_#757777] transform -rotate-1 mt-4">close the loop</span>
      </h1>
      <p className="text-xl md:text-3xl font-bold max-w-2xl mb-16 border-l-[6px] border-primary-custom pl-8 py-4 bg-surface-container-low relative">
        <span className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-8 h-8 bg-secondary-fixed border-[3px] border-outline-custom rotate-45 hidden md:block"></span>
        Spots are filling up by neighborhood. Don't let your street be last.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row w-full max-w-4xl gap-0 border-[4px] border-outline-custom shadow-[10px_10px_0px_0px_#757777] bg-surface-container-lowest focus-within:-translate-y-1 focus-within:shadow-[15px_15px_0px_0px_#757777] transition-all duration-300">
        <div className="flex-grow flex items-center bg-surface-container-highest px-6 border-b-[4px] md:border-b-0 md:border-r-[4px] border-outline-custom focus-within:bg-primary-container transition-colors">
          <span className="material-symbols-outlined text-outline-custom text-3xl mr-4 font-black">mail</span>
          <input 
            className="w-full bg-transparent border-none py-6 font-body font-bold text-xl uppercase text-on-surface placeholder:text-on-surface-variant focus:ring-0 focus:outline-none" 
            placeholder="YOUR EMAIL ADDRESS" 
            required 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="bg-primary-custom text-on-primary px-10 py-6 md:py-0 font-headline font-black text-2xl uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-3 group whitespace-nowrap" type="submit">
          Join Waitlist
          <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform font-black">arrow_forward</span>
        </button>
      </form>
    </section>
  );
};

const SocialProofBanner = () => (
  <section className="bg-secondary-container border-y-[4px] border-outline-custom py-8 px-6 overflow-hidden relative">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center animate-pulse-custom">
      <span className="material-symbols-outlined text-on-secondary-container text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
      <p className="font-headline text-3xl md:text-4xl font-black uppercase tracking-tight text-on-secondary-container leading-none">
        Join 2,400+ neighbors already in the loop.
      </p>
    </div>
  </section>
);

const FeaturesGrid = () => (
  <section className="bg-surface-custom border-b-[4px] border-outline-custom px-6 py-24 md:px-20 lg:px-32 relative">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-20 text-center md:text-left">
        <h2 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none border-b-[8px] border-primary-custom pb-4 inline-block">
          Why Join Early
        </h2>
        <div className="w-24 h-6 bg-tertiary-fixed border-[4px] border-outline-custom shadow-[4px_4px_0px_0px_#000] mb-4 hidden lg:block animate-float"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="bg-surface-container-lowest border-[4px] border-outline-custom p-10 shadow-[8px_8px_0px_0px_#757777] relative group hover:-translate-y-3 hover:-translate-x-3 hover:shadow-[16px_16px_0px_0px_#757777] transition-all duration-300">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-secondary border-[4px] border-outline-custom rounded-none flex items-center justify-center shadow-[4px_4px_0px_0px_#000] z-10 group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-on-secondary-container text-3xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
          </div>
          <div className="bg-surface-variant w-20 h-20 border-[3px] border-outline-custom flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_#757777]">
            <span className="material-symbols-outlined text-5xl text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
          </div>
          <div className="bg-surface-container-low border-y-[3px] border-outline-custom py-4 mb-6 -mx-10 px-10">
            <h3 className="font-headline text-3xl font-black uppercase leading-[0.9] text-on-surface">Exclusive Karma Badge</h3>
          </div>
          <p className="font-body font-bold text-on-surface-variant text-xl leading-snug">For founding members who join before the first v1.0 launch.</p>
        </div>

        <div className="bg-surface-container-lowest border-[4px] border-outline-custom p-10 shadow-[8px_8px_0px_0px_#757777] relative group hover:-translate-y-3 hover:-translate-x-3 hover:shadow-[16px_16px_0px_0px_#757777] transition-all duration-300 lg:mt-12">
          <div className="bg-primary-container w-20 h-20 border-[3px] border-outline-custom flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_#757777]">
            <span className="material-symbols-outlined text-5xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
          </div>
          <div className="bg-surface-container-low border-y-[3px] border-outline-custom py-4 mb-6 -mx-10 px-10">
            <h3 className="font-headline text-3xl font-black uppercase leading-[0.9] text-on-surface">Founding Hub Access</h3>
          </div>
          <p className="font-body font-bold text-on-surface-variant text-xl leading-snug">Help shape the governance rules and standards of your local neighborhood ecosystem.</p>
        </div>

        <div className="bg-surface-container-lowest border-[4px] border-outline-custom p-10 shadow-[8px_8px_0px_0px_#757777] relative group hover:-translate-y-3 hover:-translate-x-3 hover:shadow-[16px_16px_0px_0px_#757777] transition-all duration-300 lg:mt-24">
          <div className="bg-tertiary-fixed w-20 h-20 border-[3px] border-outline-custom flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_#757777]">
            <span className="material-symbols-outlined text-5xl text-on-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>money_off</span>
          </div>
          <div className="bg-surface-container-low border-y-[3px] border-outline-custom py-4 mb-6 -mx-10 px-10">
            <h3 className="font-headline text-3xl font-black uppercase leading-[0.9] text-on-surface">Zero Lifetime Fees</h3>
          </div>
          <p className="font-body font-bold text-on-surface-variant text-xl leading-snug">As an early adopter, you'll never pay transaction fees on the platform. Ever.</p>
        </div>
      </div>
    </div>
  </section>
);

const Waitlist = () => {
  return (
    <div className="min-h-screen waitlist-grid-bg bg-surface-custom text-on-surface">
      <Navbar />
      <main className="flex-grow flex flex-col pt-8">
        <Hero />
        <SocialProofBanner />
        <FeaturesGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Waitlist;
