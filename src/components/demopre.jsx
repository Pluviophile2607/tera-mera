import React, { useState, useEffect } from 'react';
import './PixelPreloader.css';

const PixelPreloader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pixelMatrix, setPixelMatrix] = useState([]);

  // Create pixel matrix for the animated grid
  useEffect(() => {
    const generatePixelMatrix = () => {
      const rows = 8;
      const cols = 12;
      const matrix = [];
      
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          // Random initial state for some pixels
          row.push({
            active: Math.random() > 0.7,
            delay: (i * cols + j) * 0.02,
          });
        }
        matrix.push(row);
      }
      return matrix;
    };
    
    setPixelMatrix(generatePixelMatrix());
  }, []);

  // Simulate loading progress
  useEffect(() => {
    const duration = 2000; // 2 seconds loading time
    const interval = 30;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, (currentStep / steps) * 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoaded(true);
          setTimeout(() => {
            if (onLoadingComplete) onLoadingComplete();
          }, 600);
        }, 200);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  // Animate pixels based on progress
  useEffect(() => {
    if (pixelMatrix.length === 0) return;
    
    const activeCount = Math.floor((progress / 100) * (8 * 12));
    
    const newMatrix = pixelMatrix.map((row, i) =>
      row.map((pixel, j) => ({
        ...pixel,
        active: (i * 12 + j) < activeCount,
      }))
    );
    
    setPixelMatrix(newMatrix);
  }, [progress, pixelMatrix.length]);

  if (isLoaded) {
    return null;
  }

  return (
    <div className="pixel-preloader">
      <div className="preloader-container">
        {/* Pixel Grid Animation */}
        <div className="pixel-grid">
          {pixelMatrix.map((row, i) => (
            <div key={i} className="pixel-row">
              {row.map((pixel, j) => (
                <div
                  key={j}
                  className={`pixel ${pixel.active ? 'active' : ''}`}
                  style={{
                    animationDelay: `${pixel.delay}s`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <span className="pixel-text">LOADING</span>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            >
              <div className="progress-glint"></div>
            </div>
          </div>
          <div className="percentage">
            <span className="pixel-number">{Math.floor(progress)}</span>
            <span className="pixel-percent">%</span>
          </div>
        </div>

        {/* Decorative Pixel Particles */}
        <div className="pixel-particles">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PixelPreloader;
