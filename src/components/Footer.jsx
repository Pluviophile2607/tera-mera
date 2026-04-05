import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-surface-container-high border-t-[3px] border-outline-custom px-6 md:px-12 py-10 md:py-12 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12">
    <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left group w-full md:w-auto">
      <Link to="/" className="text-2xl md:text-3xl font-black uppercase tracking-tighter hover:text-primary-custom transition-colors cursor-pointer">
        TeraMera
      </Link>
      <span className="text-[10px] md:text-sm font-bold text-on-surface-variant uppercase tracking-tight italic bg-surface-container-highest px-3 py-1 border-[1px] border-outline-custom/50 inline-block">
        © 2026 TeraMera. Built for the Neighborhood.
      </span>
    </div>
    <div className="flex flex-wrap justify-center gap-4 md:gap-10 font-bold text-[10px] md:text-sm uppercase text-on-surface-variant">
      {['Vision', 'Philosophy', 'Waitlist', 'Privacy', 'Contact'].map(link => (
        <Link 
          key={link} 
          to={`/${link.toLowerCase()}`} 
          className="hover:text-primary-custom hover:bg-primary-container/20 px-2 py-0.5 border-b-[2px] border-transparent hover:border-primary-custom transition-all"
        >
          {link}
        </Link>
      ))}
    </div>
    {/* <div className="flex gap-6">
      <span className="material-symbols-outlined text-outline-custom cursor-pointer hover:text-primary-custom hover:scale-125 transition-all p-3 border-[2px] border-outline-custom/30 rounded-none bg-surface-container-high shadow-[2px_2px_0px_0px_#757777] active:shadow-none active:translate-y-1">public</span>
      <span className="material-symbols-outlined text-outline-custom cursor-pointer hover:text-secondary hover:scale-125 transition-all p-3 border-[2px] border-outline-custom/30 rounded-none bg-surface-container-high shadow-[2px_2px_0px_0px_#757777] active:shadow-none active:translate-y-1">share</span>
    </div> */}
  </footer>
);

export default Footer;
