import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 md:pt-24 pb-16 md:pb-32 px-6 md:px-8 overflow-hidden bg-white border-b-[3px] border-outline-custom">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-block bg-tertiary-fixed text-on-tertiary-fixed text-[10px] md:text-xs font-black uppercase px-3 py-1 mb-8 border-[2px] border-black shadow-[3px_3px_0px_0px_#000] rotate-1">
          HOW WE THINK
        </div>
        <h1 className="text-5xl md:text-8xl lg:text-[9rem] font-black leading-[0.8] uppercase mb-10 tracking-tighter text-balance">
          THE PHILOSOPHY <br/>OF THE <span className="text-primary-custom italic">LOOP.</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold font-body max-w-2xl mb-12 text-[#757777] leading-tight mx-auto italic">
          "Tera bhi Mera. Mera bhi Tera." — Transforming urban waste into collective abundance through radical sharing.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button 
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto bg-primary-custom text-on-primary text-xl font-black uppercase px-12 py-5 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all"
          >
            Join the Movement
          </button>
        </div>
      </div>
    </section>
  );
};

const CorePrinciple = () => (
  <section className="py-24 md:py-32 px-6 md:px-8 bg-surface-container-low border-b-[3px] border-outline-custom overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-container translate-x-4 translate-y-4 border-[3px] border-black"></div>
          <div className="relative bg-white border-[4px] border-black p-8 md:p-16 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 leading-[0.9]">The Abundance of Surplus</h2>
            <p className="text-lg md:text-xl font-bold leading-relaxed mb-8 text-on-surface-variant italic">
              Our neighborhoods are overflowing with 'dormant value'—tools that gather dust, produce that goes uneaten, and skills that remain untapped. TeraMera isn't just about sharing; it's about reclaiming this dormant value.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { title: "Circular Living", icon: "refresh" },
                { title: "Local Sovereignty", icon: "location_home" },
                { title: "Radical Trust", icon: "handshake" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-surface-container p-4 border-[2px] border-black shadow-[4px_4px_0px_0px_#000]">
                  <span className="material-symbols-outlined text-3xl text-primary-custom font-black">{item.icon}</span>
                  <span className="text-lg font-black uppercase">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-12">
            <div>
                <h3 className="text-2xl md:text-4xl font-black uppercase mb-4 text-primary-custom">Step 1: Release</h3>
                <p className="text-base md:text-lg font-bold text-on-surface-variant">Learn to let go of what you don't need. Every item you release into the loop becomes a catalyst for local cooperation.</p>
            </div>
            <div>
                <h3 className="text-2xl md:text-4xl font-black uppercase mb-4 text-secondary-dim">Step 2: Access</h3>
                <p className="text-base md:text-lg font-bold text-on-surface-variant">Request what you need. From drill sets to a cup of sugar, find everything you need within a 15-minute walk.</p>
            </div>
            <div>
                <h3 className="text-3xl md:text-[3.5rem] font-black uppercase leading-none border-l-8 border-primary-custom pl-6 py-2">The Loop <br/>Closes.</h3>
            </div>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="py-24 md:py-32 px-6 md:px-8 bg-white border-b-[3px] border-outline-custom">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-5xl md:text-8xl font-black uppercase mb-16 md:mb-24 text-center tracking-tighter">THE MECHANICS</h2>
      <div className="grid md:grid-cols-3 gap-10">
        {[
          { 
            step: "01", 
            title: "List in Seconds", 
            desc: "Snap a photo of your 'Tera' (Surplus). Our AI categorizes it instantly for your neighborhood.", 
            color: "bg-[#76efef]" 
          },
          { 
            step: "02", 
            title: "Request Nearby", 
            desc: "Browse your local 'Mera' feed. Find what you need without the price tag or the friction.", 
            color: "bg-[#ffd709]" 
          },
          { 
            step: "03", 
            title: "Karma Exchange", 
            desc: "Complete the swap. Neighbors gain Karma points that unlock status and local rewards.", 
            color: "bg-[#ff9476]" 
          }
        ].map((item, idx) => (
          <div key={idx} className="relative group">
            <div className={`absolute inset-0 ${item.color} translate-x-2 translate-y-2 border-[3px] border-black group-hover:translate-x-4 group-hover:translate-y-4 transition-transform`}></div>
            <div className="relative bg-white border-[3px] border-black p-10 h-full flex flex-col">
              <span className="text-4xl font-black mb-6 opacity-30">{item.step}</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase mb-6 leading-tight">{item.title}</h3>
              <p className="text-base md:text-lg font-bold text-[#757777] leading-relaxed italic uppercase">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const MissionState = () => (
    <section className="py-24 md:py-40 px-6 md:px-8 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-custom/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-[4rem] md:text-[8rem] font-black uppercase leading-[0.8] mb-12 tracking-tighter">OUR MISSION</h2>
            <p className="text-2xl md:text-4xl font-black uppercase mb-16 opacity-80 leading-tight">
                To eliminate household waste at the source by engineering a hyper-local sharing infrastructure that makes ownership obsolete.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { val: "ZERO", label: "COMMISSION" },
                    { val: "100%", label: "PRIVATE" },
                    { val: "HYPER", label: "LOCAL" },
                    { val: "BORN IN", label: "Palava" }
                ].map((item, idx) => (
                    <div key={idx} className="border-t-[2px] border-white/20 pt-6">
                        <div className="text-2xl font-black text-primary-container">{item.val}</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-white/50">{item.label}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Philosophy = () => (
  <div className="min-h-screen font-body bg-surface-custom text-on-surface">
    <Navbar />
    <Hero />
    <CorePrinciple />
    <HowItWorks />
    <MissionState />
    <Footer />
  </div>
);

export default Philosophy;
