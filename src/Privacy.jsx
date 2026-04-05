import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Privacy = () => (
  <div className="min-h-screen font-body bg-surface-custom text-on-surface">
    <Navbar />
    <main className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <div className="bg-white border-[4px] border-black p-10 md:p-20 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-5xl md:text-7xl font-black uppercase mb-12 tracking-tighter leading-none">PRIVACY <br/><span className="text-primary-custom">SOVEREIGNTY.</span></h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-black uppercase mb-4 border-b-4 border-primary-container inline-block">01. DATA MINIMALISM</h2>
            <p className="text-lg font-bold text-on-surface-variant leading-relaxed">
              We only collect what is strictly necessary to connect you with your neighbors. Your email is your ID. Your location is generalized to your neighborhood hub. We don't track your every move—just your neighborly acts.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black uppercase mb-4 border-b-4 border-secondary-container inline-block">02. NO AD-TECH</h2>
            <p className="text-lg font-bold text-on-surface-variant leading-relaxed">
              TeraMera is not an ad platform. We don't sell your data to third parties. We don't use cookies to follow you across the web. Our ecosystem is powered by local trust, not behavioral tracking.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black uppercase mb-4 border-b-4 border-tertiary-container inline-block">03. YOUR CONTROL</h2>
            <p className="text-lg font-bold text-on-surface-variant leading-relaxed">
              At any point, you can request full deletion of your neighborhood profile. Once deleted, all records of your transactions and Karma history are purged from our systems permanently.
            </p>
          </section>

          <div className="pt-8 border-t-2 border-outline-custom/20">
            <p className="text-xs font-black uppercase text-[#757777] italic tracking-widest">
              Last Updated: April 2026. <br/>
              Policy Version 0.9 (Beta)
            </p>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
