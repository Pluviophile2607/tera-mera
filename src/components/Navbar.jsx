import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoSvg from '../assets/tera-mera logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b-[3px] border-outline-custom bg-white px-4 md:px-12 py-4 md:py-5 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/" className="cursor-pointer transition-transform hover:scale-105 select-none inline-block">
          <img src={logoSvg} alt="TeraMera" className="h-8 md:h-10 w-auto" />
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8 font-body font-bold uppercase text-xs tracking-widest text-[#757777]">
        <Link 
          to="/vision" 
          className={`transition-all hover:text-black ${location.pathname === '/vision' ? 'text-primary-custom border-b-2 border-primary-custom pb-1' : ''}`}
        >
          THE VISION
        </Link>
        <Link 
          to="/philosophy" 
          className={`transition-all hover:text-black ${location.pathname === '/philosophy' ? 'text-primary-custom border-b-2 border-primary-custom pb-1' : ''}`}
        >
          PHILOSOPHY
        </Link>
        {isAuthenticated && (
          <Link 
            to="/dashboard" 
            className={`transition-all hover:text-black flex items-center gap-1 ${location.pathname === '/dashboard' ? 'text-primary-custom border-b-2 border-primary-custom pb-1' : ''}`}
          >
            DASHBOARD
            {user?.isVerified && (
              <span className="material-symbols-outlined text-[14px] text-primary-custom" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            )}
          </Link>
        )}
        {isAuthenticated && (
          <Link 
            to="/mera" 
            className={`transition-all hover:text-black ${location.pathname === '/mera' ? 'text-primary-custom border-b-2 border-primary-custom pb-1' : ''}`}
          >
            Mera
          </Link>
        )}
        {isAuthenticated && (
          <Link 
            to="/tera" 
            className={`transition-all hover:text-black ${location.pathname === '/tera' ? 'text-primary-custom border-b-2 border-primary-custom pb-1' : ''}`}
          >
            TERA
          </Link>
        )}
        
        {isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className="text-xs font-black uppercase tracking-widest text-[#757777] hover:text-black transition-all"
          >
            LOGOUT
          </button>
        ) : (
          <div className="flex items-center gap-6">
            <Link 
              to="/login" 
              className="text-xs font-black uppercase tracking-widest text-[#757777] hover:text-black transition-all"
            >
              LOGIN
            </Link>
            <Link 
              to="/signup" 
              className="bg-primary-custom text-on-primary font-black px-6 py-2.5 border-[2px] border-outline-custom shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-y-0 active:shadow-none transition-all text-xs"
            >
              JOIN THE LOOP
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMenu}
        className="md:hidden w-10 h-10 border-[2px] border-black flex items-center justify-center bg-white shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-y-[2px] transition-all"
      >
        <span className="material-symbols-outlined text-2xl font-black">menu</span>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-[#f0f1f1] flex flex-col animate-in fade-in slide-in-from-top duration-300">
          <div className="border-b-[3px] border-outline-custom bg-white px-4 py-4 flex justify-between items-center">
            <Link to="/" onClick={toggleMenu} className="cursor-pointer inline-block">
              <img src={logoSvg} alt="TeraMera" className="h-6 md:h-8 w-auto" />
            </Link>
            <button 
              onClick={toggleMenu}
              className="w-10 h-10 border-[2px] border-black flex items-center justify-center bg-white shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-y-[2px] transition-all"
            >
              <span className="material-symbols-outlined text-2xl font-black">close</span>
            </button>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center gap-12 p-8 text-center">
            <Link 
              to="/vision" 
              onClick={toggleMenu}
              className="text-4xl sm:text-5xl font-black uppercase tracking-tighter relative group"
            >
              <span className="relative z-10 group-hover:text-primary-custom transition-colors">THE VISION</span>
              <span className="absolute left-0 -bottom-2 w-full h-4 bg-primary-container -z-0 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all"></span>
            </Link>

            <Link 
              to="/philosophy" 
              onClick={toggleMenu}
              className="text-4xl sm:text-5xl font-black uppercase tracking-tighter relative group"
            >
              <span className="relative z-10 group-hover:text-tertiary-container transition-colors">PHILOSOPHY</span>
              <span className="absolute left-0 -bottom-2 w-full h-4 bg-tertiary-container -z-0 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all"></span>
            </Link>

            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                onClick={toggleMenu}
                className="text-4xl sm:text-5xl font-black uppercase tracking-tighter relative group"
              >
                <span className="relative z-10 group-hover:text-primary-custom transition-colors">DASHBOARD</span>
                <span className="absolute left-0 -bottom-2 w-full h-4 bg-primary-container -z-0 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all"></span>
              </Link>
            )}

            {isAuthenticated && (
              <Link 
                to="/mera" 
                onClick={toggleMenu}
                className="text-4xl sm:text-5xl font-black uppercase tracking-tighter relative group"
              >
                <span className="relative z-10 group-hover:text-primary-custom transition-colors">MERA</span>
                <span className="absolute left-0 -bottom-2 w-full h-4 bg-primary-container -z-0 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all"></span>
              </Link>
            )}

            {isAuthenticated && (
              <Link 
                to="/tera" 
                onClick={toggleMenu}
                className="text-4xl sm:text-5xl font-black uppercase tracking-tighter relative group"
              >
                <span className="relative z-10 group-hover:text-primary-custom transition-colors">TERA</span>
                <span className="absolute left-0 -bottom-2 w-full h-4 bg-primary-container -z-0 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all"></span>
              </Link>
            )}

            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  onClick={toggleMenu}
                  className="text-4xl sm:text-5xl font-black uppercase tracking-tighter relative group"
                >
                  <span className="relative z-10 group-hover:text-primary-custom transition-colors">LOGIN</span>
                  <span className="absolute left-0 -bottom-2 w-full h-4 bg-primary-container -z-0 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all"></span>
                </Link>
                <Link 
                  to="/signup" 
                  onClick={toggleMenu}
                  className="text-4xl sm:text-5xl font-black uppercase tracking-tighter relative group"
                >
                  <span className="relative z-10 group-hover:text-secondary-container transition-colors">JOIN THE LOOP</span>
                  <span className="absolute left-0 -bottom-2 w-full h-4 bg-secondary-container -z-0 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all"></span>
                </Link>
              </>
            ) : (
              <button 
                onClick={() => { toggleMenu(); handleLogout(); }}
                className="text-4xl sm:text-5xl font-black uppercase tracking-tighter relative group"
              >
                <span className="relative z-10 group-hover:text-error-dim transition-colors">LOGOUT</span>
                <span className="absolute left-0 -bottom-2 w-full h-4 bg-error-container -z-0 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all"></span>
              </button>
            )}

            <button 
              onClick={() => { toggleMenu(); window.location.href = isAuthenticated ? '/mera' : '/signup'; }}
              className="mt-8 w-full max-w-sm py-6 bg-primary-custom text-on-primary text-2xl font-black uppercase border-[4px] border-black shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#000] active:translate-y-0 active:shadow-none transition-all"
            >
              {isAuthenticated ? 'GO TO MERA' : 'JOIN THE LOOP'}
            </button>
          </div>

          <div className="p-12 border-t-[3px] border-outline-custom bg-white text-center">
            <p className="text-xs font-black text-[#757777] uppercase tracking-widest italic">© 2026 TeraMera. Built for the Neighborhood.</p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
