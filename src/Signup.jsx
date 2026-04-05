import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Footer from './components/Footer';

const AuthHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="w-full h-20 border-b-[3px] border-black flex items-center px-6 md:px-12 bg-white sticky top-0 z-50">
      <button 
        onClick={() => navigate(-1)}
        className="w-10 h-10 border-[2px] border-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-y-[2px] mr-6"
      >
        <span className="material-symbols-outlined text-2xl font-black">arrow_back</span>
      </button>
      <Link to="/" className="text-2xl md:text-3xl font-black text-primary-custom italic font-headline cursor-pointer transition-transform hover:scale-105 select-none tracking-tighter">
        TeraMera
      </Link>
    </header>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [area, setArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!area) {
      setErrorMessage('Please select your neighborhood.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          area,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create account right now.');
      }

      setSuccessMessage(`Account created for ${data.user.email}. Welcome to the loop!`);
      login(data.user);
      setTimeout(() => {
        navigate('/');
      }, 1500);
      setFullName('');
      setPassword('');
      setArea('');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-body flex flex-col relative overflow-hidden">
      <AuthHeader />

      <main className="flex-grow flex items-center justify-center p-6 md:p-8 relative z-10 py-16 md:py-24">
        {/* Floating Decorative Squares */}
        <div className="absolute top-[10%] right-[10%] w-32 h-32 md:w-48 md:h-48 bg-[#76efef] border-[3px] border-black rotate-[15deg] shadow-[10px_10px_0px_0px_#000] -z-10 animate-float hidden md:block select-none opacity-80"></div>
        <div className="absolute bottom-[15%] left-[5%] w-24 h-24 md:w-32 md:h-32 bg-[#ff9476] border-[3px] border-black rotate-[-12deg] shadow-[8px_8px_0px_0px_#000] -z-10 animate-float-delayed hidden md:block select-none opacity-80"></div>

        {/* Mobile Decorations (Smaller) */}
        <div className="absolute top-[5%] left-[10%] w-12 h-12 bg-[#ff9476] border-[2px] border-black rotate-[-10deg] -z-10 md:hidden opacity-50"></div>
        <div className="absolute bottom-[10%] right-[5%] w-16 h-16 bg-[#76efef] border-[2px] border-black rotate-[20deg] -z-10 md:hidden opacity-50"></div>

        <div className="bg-[#f0f1f1] border-[4px] border-black p-8 md:p-14 max-w-2xl w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
              JOIN THE <br/>
              <span className="bg-[#ffd709] px-3 py-1 inline-block transform -rotate-1 border-[3px] border-black mt-2">NEIGHBORHOOD</span> <br/>
              LOOP
            </h1>
            <p className="text-sm md:text-base font-bold text-black/70 mb-8 max-w-sm mx-auto">
              Join our community to start sharing or requesting items.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black/80 ml-0.5">FULL NAME</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name" 
                className="w-full p-4 border-[2px] border-black bg-white focus:outline-none transition-all font-bold text-sm md:text-base"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black/80 ml-0.5">EMAIL ADDRESS</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@neighbor.com" 
                className="w-full p-4 border-[2px] border-black bg-white focus:outline-none transition-all font-bold text-sm md:text-base"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black/80 ml-0.5">PASSWORD</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters" 
                className="w-full p-4 border-[2px] border-black bg-white focus:outline-none transition-all font-bold text-sm md:text-base"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black/80 ml-0.5">SELECT YOUR AREA</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Palava', 'Dombivali', 'Thane'].map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => setArea(location.toLowerCase())}
                    className={`p-4 border-[2px] border-black font-black uppercase tracking-tight text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] ${
                      area === location.toLowerCase() 
                        ? 'bg-[#ffd709] translate-y-[-2px] translate-x-[-2px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white hover:bg-[#f0f1f1]'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-[#ffd709] text-black text-lg md:text-xl font-black uppercase border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all mt-8"
            >
              {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            {errorMessage ? (
              <p className="border-[2px] border-black bg-[#ff9476] px-4 py-3 text-sm font-black uppercase tracking-wide">
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <p className="border-[2px] border-black bg-[#76efef] px-4 py-3 text-sm font-black uppercase tracking-wide">
                {successMessage}
              </p>
            ) : null}

          </form>

          <div className="mt-10 text-center">
            <p className="font-bold text-black uppercase tracking-tight text-[11px] md:text-sm">
              Already a member? <Link to="/login" className="underline decoration-[2px] underline-offset-4 hover:text-primary-custom transition-all ml-1 font-black">Log in here.</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
