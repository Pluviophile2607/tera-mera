import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { apiUrl } from './lib/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(apiUrl('/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      login(data.user);
      navigate(data.user?.isAdmin ? '/admin' : '/');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-custom text-on-surface flex items-center justify-center relative overflow-hidden p-4 sm:p-8 font-body selection:bg-secondary-container">
      {/* Playful Brutalist Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-tertiary-container border-4 border-outline-custom brutalist-shadow transform -rotate-12 z-0 hidden md:block"></div>
      <div className="absolute bottom-20 right-10 w-48 h-16 bg-primary-container border-4 border-outline-custom brutalist-shadow transform rotate-6 z-0 hidden md:flex items-center justify-center">
        <span className="font-black text-xl tracking-widest text-on-primary-container uppercase select-none">SYSTEM.ON</span>
      </div>
      <div className="absolute top-1/4 right-20 w-24 h-24 bg-surface-container-highest border-4 border-outline-custom brutalist-shadow transform rotate-45 z-0 hidden lg:block"></div>
      <div className="absolute bottom-10 left-20 bg-secondary-container border-4 border-outline-custom p-2 brutalist-shadow transform -rotate-6 z-0">
        <span className="font-bold text-on-secondary-container select-none">#ACCESS_KEY</span>
      </div>

      {/* Main Login Card */}
      <main className="w-full max-w-lg bg-surface-container-lowest border-4 border-outline-custom brutalist-shadow p-8 sm:p-12 relative z-10 flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-4 text-left">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group w-fit">
            <span className="material-symbols-outlined text-primary-custom text-3xl font-bold group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <span className="font-black tracking-widest uppercase italic font-headline text-primary-custom">TeraMera</span>
          </Link>
          <h1 className="font-headline text-5xl sm:text-6xl font-black leading-[0.9] tracking-tighter uppercase text-on-surface">
            Log Back<br/>
            <span className="bg-secondary-container px-2 pb-1 inline-block mt-2 border-2 border-outline-custom">Into The</span><br/>
            Loop
          </h1>
          <div className="bg-surface-variant p-4 border-l-8 border-primary-custom mt-4">
            <p className="text-on-surface font-medium text-lg leading-tight">
              Welcome back to the kinetic ecosystem. Authentic access required.
            </p>
          </div>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 relative text-left">
            <label className="font-bold uppercase tracking-widest text-sm text-on-surface flex justify-between" htmlFor="email">
              Email Address
            </label>
            <input 
              className="w-full bg-surface-container-highest border-4 border-outline-custom p-4 font-body text-lg font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:bg-primary-container focus:ring-0 brutalist-shadow-sm transition-colors" 
              id="email" 
              placeholder="ENTER.DATA@SYSTEM.COM" 
              required 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 relative text-left">
            <label className="font-bold uppercase tracking-widest text-sm text-on-surface flex justify-between items-end" htmlFor="password">
              <span>Password</span>
              <a className="text-[10px] font-black bg-surface-container-highest px-2 py-1 border-2 border-outline-custom hover:bg-primary-custom hover:text-on-primary transition-colors uppercase" href="#">
                FORGOT IT?
              </a>
            </label>
            <input 
              className="w-full bg-surface-container-highest border-4 border-outline-custom p-4 font-body text-lg font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:bg-primary-container focus:ring-0 brutalist-shadow-sm transition-colors" 
              id="password" 
              placeholder="••••••••••••" 
              required 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
            <p className="border-[2px] border-black bg-error-container text-on-error px-4 py-3 text-xs font-black uppercase tracking-wide">
              {errorMessage}
            </p>
          )}

          <button 
            disabled={isSubmitting}
            className="mt-4 w-full bg-secondary-container text-on-secondary-container border-4 border-outline-custom py-6 text-2xl font-black uppercase tracking-widest brutalist-shadow brutalist-shadow-hover brutalist-shadow-active transition-all cursor-pointer flex items-center justify-center gap-4 group" 
            type="submit"
          >
            <span>{isSubmitting ? 'INITIATING...' : 'Login Sequence'}</span>
            <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </button>
        </form>

        {/* Footer */}
        <footer className="mt-4 pt-6 border-t-4 border-outline-custom flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-on-surface-variant uppercase tracking-wider text-xs italic">STATUS: {isSubmitting ? 'AUTHENTICATING' : 'UNAUTHENTICATED'}</span>
          <Link 
            to="/signup"
            className="font-black text-primary-custom hover:bg-primary-custom hover:text-on-primary px-3 py-2 border-2 border-transparent hover:border-outline-custom transition-colors uppercase tracking-wide text-sm"
          >
            New Here? Create Account
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default Login;
