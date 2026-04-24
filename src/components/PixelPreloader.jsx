import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoSvg from '../assets/tera-mera-logo.svg';

const PixelPreloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = 'unset';
    }, 2000); 

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-white overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Soft Yellow Glow Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `radial-gradient(circle at center, #FFF991 0%, transparent 70%)`,
              opacity: 0.6,
              mixBlendMode: "multiply",
            }}
          />

          {/* Centered Logo Only */}
          <motion.div 
            className="relative z-20"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <img 
              src={logoSvg} 
              alt="Tera Mera" 
              className="h-16 md:h-32 w-auto opacity-90"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PixelPreloader;
