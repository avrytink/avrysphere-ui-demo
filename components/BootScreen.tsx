
import React, { useEffect, useState, useRef } from 'react';

interface BootScreenProps {
  onComplete: () => void;
  ready: boolean;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete, ready }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const progressRef = useRef(0);

  useEffect(() => {
    const interval = 30;
    const timer = setInterval(() => {
      setProgress(prev => {
        let next = prev;
        
        if (prev < 92) {
          // Normal simulated progress
          const increment = Math.random() * 1.5;
          next = Math.min(92, prev + increment);
        } else if (prev >= 92 && prev < 100) {
          if (ready) {
            // Finish fast once app reports ready
            next = Math.min(100, prev + 2);
          } else {
            // Stall at 92-95% to simulate background initialization
            const increment = Math.random() * 0.1;
            next = Math.min(96, prev + increment);
          }
        }

        progressRef.current = next;
        return next;
      });

      if (progressRef.current >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(onComplete, 800);
        }, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, ready]);

  return (
    <div className={`fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-12 scale-110 animate-in fade-in zoom-in-95 duration-1000">
        <div className="relative">
          {/* Subtle glowing halo behind the logo */}
          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 animate-pulse" />
          
          {/* Pulsing Logo Container */}
          <div className="relative w-24 h-24 flex items-center justify-center animate-pulse">
            <svg width="64" height="70" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <path d="M11 4.29912C11.5306 2.98592 10.8961 1.49125 9.58288 0.960679C8.26966 0.430111 6.77496 1.06456 6.24438 2.37776L0.960554 15.4555C0.429977 16.7687 1.06444 18.2633 2.37766 18.7939C3.69089 19.3245 5.18559 18.69 5.71617 17.3768L11 4.29912Z" fill="white"/>
              <path d="M16.6717 13.1462C16.3048 11.7781 14.8983 10.9663 13.5301 11.3331C12.1619 11.7 11.3501 13.1065 11.717 14.4746L12.3812 16.952C12.748 18.3201 14.1545 19.1319 15.5227 18.7651C16.8909 18.3982 17.7027 16.9917 17.3359 15.6235L16.6717 13.1462Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
