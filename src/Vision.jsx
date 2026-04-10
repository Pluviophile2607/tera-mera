import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import visionHero from './assets/house_loop.png';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 md:pt-24 pb-20 md:pb-40 px-6 md:px-8 overflow-hidden bg-white border-b-[3px] border-outline-custom">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-[3.5rem] sm:text-6xl md:text-[6rem] lg:text-[7rem] font-black leading-[0.85] uppercase mb-10 tracking-tight text-balance">
            Tera Mera.<br/>
            <span className="bg-secondary-container px-3 inline-block transform -rotate-1 mt-4 border-[3px] border-outline-custom">Mera Tera</span>
          </h1>
          <p className="text-lg md:text-xl font-bold font-body max-w-md mb-12 text-[#757777] leading-tight mx-auto md:mx-0">
            Closing the loop on neighborhood waste and building a future where your excess is another's abundance.
          </p>
          <button 
            onClick={() => navigate('/waitlist')}
            className="w-full sm:w-auto bg-primary-custom text-on-primary text-lg md:text-xl font-black uppercase px-12 py-5 border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all"
          >
            Explore the Loop
          </button>
        </div>
        <div className="flex-1 w-full max-w-sm md:max-w-md mx-auto relative">
          <div className="relative w-full aspect-square bg-white border-[4px] border-black shadow-[15px_15px_0px_0px_#757777] flex items-center justify-center p-12 overflow-hidden animate-float">
             <img src={visionHero} alt="Vision Illustration" className="w-full h-full object-contain relative z-10 scale-125" />
          </div>
          <div className="absolute -top-10 -right-10 w-24 h-24 border-[2px] border-outline-custom/20 -z-0 rotate-12 hidden lg:block"></div>
        </div>
      </div>
    </section>
  );
};

const ConceptSection = () => (
  <section className="py-24 md:py-32 px-6 md:px-8 bg-white border-y-[3px] border-outline-custom relative overflow-hidden">
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="inline-block bg-[#ff7d58] text-white text-[10px] md:text-xs font-black uppercase px-3 py-1 mb-8 border-[2px] border-black shadow-[2px_2px_0px_0px_#000] -rotate-2">
        THE CORE CONCEPT
      </div>
      <h2 className="text-4xl md:text-7xl font-black uppercase mb-16 md:mb-20 leading-[0.9] tracking-tighter text-balance">
        The Balance of Giving & Receiving
      </h2>
      <div className="grid lg:grid-cols-2 gap-0 border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-black overflow-hidden relative">
        <div className="bg-[#76efef] p-10 md:p-14 xl:p-20 flex flex-col h-full border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black group">
          <h3 className="text-7xl md:text-[8rem] font-black uppercase mb-4 opacity-20 tracking-tighter">TERA</h3>
          <p className="text-2xl md:text-3xl font-black uppercase mb-6 text-on-surface">The Giver</p>
          <p className="text-lg md:text-xl font-bold leading-relaxed text-[#006666]">
            Tera represents the act of release. It's the surplus harvest, the outgrown bicycle, or the professional tool that sits idle. By giving, you clear space and catalyze growth in your own backyard.
          </p>
        </div>
        <div className="bg-[#ffd709] p-10 md:p-14 xl:p-20 flex flex-col h-full group border-t-[4px] lg:border-t-0 lg:border-l-[4px] border-black">
          <h3 className="text-7xl md:text-[8rem] font-black uppercase mb-4 opacity-20 tracking-tighter text-on-secondary-container">MERA</h3>
          <p className="text-2xl md:text-3xl font-black uppercase mb-6 text-on-secondary-container">The Receiver</p>
          <p className="text-lg md:text-xl font-bold leading-relaxed text-[#6c5a00]">
            Mera represents the humble acknowledgment of need. It's about accessing high-quality resources without the burden of ownership. Receiver today, Giver tomorrow—the loop remains unbroken.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const RippleEffectSection = () => (
  <section className="py-24 lg:py-48 px-6 md:px-8 bg-[#d2d5d5] border-y-[3px] border-outline-custom relative overflow-hidden">
    {/* Background Ripple Decor */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-black/5 rounded-full animate-ripple"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-black/5 rounded-full animate-ripple delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1600px] border border-black/5 rounded-full animate-ripple delay-2000"></div>

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="mb-20 md:mb-32 text-center lg:text-left">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
          <span className="relative inline-block">
            THE
            <span className="absolute left-0 -bottom-2 w-full h-[6px] md:h-[10px] bg-[#006666]"></span>
          </span> RIPPLE EFFECT
        </h2>
      </div>

      <div className="relative flex flex-col items-center gap-12 lg:block lg:h-[1000px]">
        {/* Stage 1 */}
        <div className="w-full max-w-lg bg-[#006666] p-8 md:p-12 border-[4px] border-black shadow-[12px_12px_0px_0px_#000] lg:absolute lg:top-0 lg:left-0 z-20 transition-transform hover:-translate-y-2">
          <div className="bg-white text-black text-[10px] font-black px-3 py-1 mb-6 uppercase inline-block border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
            STAGE ONE
          </div>
          <h3 className="text-3xl md:text-4xl font-headline font-black text-[#76efef] uppercase mb-6 leading-tight">
            THE SINGLE EXCHANGE
          </h3>
          <p className="text-white text-lg md:text-xl font-bold opacity-90 leading-tight">
            A simple swap of a kitchen mixer between Apt 4B and Apt 2A. A small act with immense potential energy.
          </p>
        </div>

        {/* Arrow 1 */}
        <div className="z-30 lg:absolute lg:top-[160px] lg:left-[480px] transform hover:scale-110 transition-transform">
          <div className="bg-white p-4 md:p-6 border-[3px] border-black shadow-[6px_6px_0px_0px_#000] lg:rotate-[15deg]">
            <span className="material-symbols-outlined text-4xl md:text-5xl font-black text-black block transform lg:rotate-[-15deg]">
               <span className="lg:hidden">south</span>
               <span className="hidden lg:inline-block">subdirectory_arrow_right</span>
            </span>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="w-full max-w-lg bg-[#ffd709] p-8 md:p-12 border-[4px] border-black shadow-[12px_12px_0px_0px_#000] lg:absolute lg:top-[340px] lg:left-[35%] z-10 transition-transform hover:-translate-y-2">
          <div className="bg-white text-black text-[10px] font-black px-3 py-1 mb-6 uppercase inline-block border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
            STAGE TWO
          </div>
          <h3 className="text-3xl md:text-4xl font-headline font-black text-black uppercase mb-6 leading-tight">
            THE LOCAL NETWORK
          </h3>
          <p className="text-black text-lg md:text-xl font-bold opacity-80 leading-tight">
            Increased familiarity leads to shared childcare, tool libraries, and local resilience. The circle widens.
          </p>
        </div>

        {/* Arrow 2 */}
        <div className="z-30 lg:absolute lg:top-[500px] lg:left-[75%] transform hover:scale-110 transition-transform">
          <div className="bg-white p-4 md:p-6 border-[3px] border-black shadow-[6px_6px_0px_0px_#000] lg:rotate-[-10deg]">
            <span className="material-symbols-outlined text-4xl md:text-5xl font-black text-black block transform lg:rotate-[10deg]">
               <span className="lg:hidden">south</span>
               <span className="hidden lg:inline-block">subdirectory_arrow_right</span>
            </span>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="w-full max-w-lg bg-[#ff9476] p-8 md:p-12 border-[4px] border-black shadow-[12px_12px_0px_0px_#000] lg:absolute lg:bottom-0 lg:right-0 z-0 transition-transform hover:-translate-y-2">
          <div className="bg-white text-black text-[10px] font-black px-3 py-1 mb-6 uppercase inline-block border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
            STAGE THREE
          </div>
          <h3 className="text-3xl md:text-4xl font-headline font-black text-black uppercase mb-6 leading-tight">
            THE THRIVING ECOSYSTEM
          </h3>
          <p className="text-black text-lg md:text-xl font-bold opacity-80 leading-tight">
            A neighborhood that produces zero waste and supports every member's needs. Abundance reclaimed.
          </p>
        </div>
      </div>
    </div>
  </section>
);


const ValuesSection = () => (
  <section className="py-24 md:py-32 px-6 md:px-8 bg-white border-b-[3px] border-outline-custom">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
        <div className="max-w-2xl text-center md:text-left">
          <h2 className="text-[2.5rem] md:text-5xl font-black uppercase mb-4 leading-tight tracking-tight">Values that Drive the Movement</h2>
          <p className="text-sm md:text-base font-bold text-[#757777] leading-tight italic">We aren't just an app; we are a systemic shift in how urban communities interact with material goods.</p>
        </div>
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center md:ml-auto">
          <span className="material-symbols-outlined text-4xl md:text-5xl font-black text-primary-custom" style={{ fontVariationSettings: "'wght' 700" }}>recycling</span>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8 md:gap-10">
        {[
          { title: "ZERO WASTE", icon: "delete", color: "bg-[#006666]", desc: "Preventing perfectly functional items from hitting landfills by redirecting them to homes where they are valued." },
          { title: "LOCAL TRUST", icon: "pixel_9", color: "bg-[#ffd709]", desc: "Strengthening local social fabric by facilitating trust-based exchanges between neighbors living within blocks of each other." },
          { title: "AFFORDABLE ACCESS", icon: "account_balance_wallet", color: "bg-[#ff9476]", desc: "Democratizing access to high-quality goods for all neighborhood members, regardless of their financial standing." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border-[3px] border-black p-8 md:p-10 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform relative group">
            <div className={`w-14 h-14 ${item.color} ${item.title === "LOCAL TRUST" ? 'text-black' : 'text-white'} flex items-center justify-center border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              {item.title === "ZERO WASTE" && <span className="material-symbols-outlined text-3xl">delete_forever</span>}
              {item.title === "LOCAL TRUST" && <span className="material-symbols-outlined text-3xl">groups</span>}
              {item.title === "AFFORDABLE ACCESS" && <span className="material-symbols-outlined text-3xl">payments</span>}
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase mb-4 tracking-tight">{item.title}</h3>
              <p className="text-base md:text-lg font-bold text-[#757777] leading-tight">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FoundationSection = () => (
  <section className="py-24 md:py-32 px-6 md:px-8 bg-white border-t-[3px] border-outline-custom">
    <div className="max-w-4xl mx-auto border-[4px] border-black p-12 md:p-20 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden bg-white group">
        <div className="mb-10 inline-block">
          <img 
            src="https://cdn.designfast.io/image/2026-04-10/48fe01f1-0696-453c-94e6-921be9f1ab54.png" 
            alt="ZED Foundation Logo" 
            className="h-16 md:h-20 w-auto object-contain"
          />
        </div>
        <h2 className="text-3xl md:text-5xl font-black uppercase mb-8 leading-tight">Powered by the ZED Foundation</h2>
        <p className="text-lg md:text-xl font-bold text-[#757777] mb-12 leading-relaxed">
          TeraMera is a flagship project of the ZED Foundation, a non-profit dedicated to engineering zero waste systems at the municipal level. Our commitment is to data privacy, local sovereignty, and long-term environmental restoration.
        </p>
        <div className="mb-8"></div>
    </div>
  </section>
);

const FinalCTA = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="py-24 md:py-32 px-6 md:px-8 bg-[#ffd709] border-t-[3px] border-outline-custom relative overflow-hidden">
      {/* Background Scrolling Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none pointer-events-none overflow-hidden">
        <div className="text-[15rem] md:text-[25rem] font-black uppercase tracking-tighter whitespace-nowrap leading-none">
          THE LOOP. THE LOOP. THE LOOP.
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h2 className="text-[4rem] md:text-[8rem] font-black uppercase leading-[0.85] mb-8 tracking-tighter">
          BECOME <br/>THE LOOP.
        </h2>
        <p className="text-lg md:text-xl font-bold uppercase mb-12 text-black/80">
          Join the waitlist to launch TeraMera in your neighborhood.
        </p>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-0 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white group focus-within:-translate-y-1 transition-all">
          <input 
             className="flex-1 p-6 text-xl font-bold placeholder:text-[#dbdddd] focus:outline-none bg-transparent" 
             placeholder="Enter your email" 
             type="email" 
             required 
             value={email}
             onChange={(e) => setEmail(e.target.value)}
          />
          <button className="bg-[#006666] text-white text-xl font-black uppercase px-12 py-5 md:border-l-[3px] border-black hover:bg-black transition-colors" type="submit">
            SECURE MY SPOT
          </button>
        </form>
        <div className="mt-8 flex items-center justify-center gap-2 font-bold text-black uppercase text-xs">
           <span className="material-symbols-outlined text-sm">location_on</span>
           Currently Screening: Palava, Dombivli, Thane
        </div>
      </div>
    </section>
  );
};

const Vision = () => (
  <div className="min-h-screen font-body bg-surface-custom text-on-surface">
    <Navbar />
    <Hero />
    <ConceptSection />
    <ValuesSection />
    <RippleEffectSection />
    <FoundationSection />
    <FinalCTA />
    <Footer />
  </div>
);

export default Vision;
