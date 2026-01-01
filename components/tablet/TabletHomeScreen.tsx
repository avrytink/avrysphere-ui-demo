
import React, { useState, useRef } from 'react';
import { useTopBarStore } from '../../store/topBarStore';
import { useWindowStore } from '../../store/windowStore';
import { format } from 'date-fns';
import { APP_REGISTRY } from '../../registry/AppRegistry';
import { Sun, Calendar } from 'lucide-react';
import { AppId } from '../../types';

const APPS_PER_PAGE = 20;

export const TabletHomeScreen: React.FC = () => {
  const { dateTime } = useTopBarStore();
  const { openWindow } = useWindowStore();
  const [currentPage, setCurrentPage] = useState(0);
  
  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const apps = Object.values(APP_REGISTRY);
  const totalPages = Math.ceil(apps.length / APPS_PER_PAGE);

  const handleStart = (clientX: number) => {
    startX.current = clientX;
    isDragging.current = false;
  };

  const handleMove = (clientX: number) => {
    if (startX.current === null) return;
    const diff = Math.abs(startX.current - clientX);
    if (diff > 10) {
      isDragging.current = true;
    }
  };

  const handleEnd = (clientX: number) => {
    if (startX.current === null) return;
    const diff = startX.current - clientX;
    
    // Swipe Threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPage < totalPages - 1) {
        setCurrentPage(prev => prev + 1);
      } else if (diff < 0 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    }
    startX.current = null;
    // Reset drag state after click event potential window
    setTimeout(() => {
        isDragging.current = false;
    }, 100);
  };

  const handleAppClick = (appId: AppId) => {
    if (isDragging.current) return;
    openWindow(appId);
  };

  return (
    <div 
        className="absolute inset-0 flex flex-col pt-24 pb-32 animate-in fade-in duration-700 overflow-hidden z-10"
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
        onMouseUp={(e) => handleEnd(e.clientX)}
        onMouseLeave={() => { startX.current = null; }}
    >
      
      {/* Tablet Widget Area - Fades out on swipe */}
      <div className={`flex justify-between items-end mb-12 px-16 transition-opacity duration-500 ${currentPage === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col">
          <div className="text-8xl font-thin tracking-tighter text-white drop-shadow-xl select-none">
            {format(dateTime, 'HH:mm')}
          </div>
          <div className="text-2xl font-medium text-white/80 drop-shadow-md select-none">
            {format(dateTime, 'EEEE, MMMM d')}
          </div>
        </div>
        
        <div className="flex gap-6">
           <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 shadow-2xl select-none">
              <Sun size={32} className="text-yellow-400" />
              <div className="flex flex-col">
                 <span className="text-xl font-bold text-white">72°F</span>
                 <span className="text-xs uppercase font-bold text-zinc-300 tracking-widest">Sunny</span>
              </div>
           </div>
           <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 shadow-2xl select-none">
              <Calendar size={32} className="text-red-500" />
              <div className="flex flex-col">
                 <span className="text-xl font-bold text-white">14:00</span>
                 <span className="text-xs uppercase font-bold text-zinc-300 tracking-widest">Team Sync</span>
              </div>
           </div>
        </div>
      </div>

      {/* Swipeable App Grid */}
      <div className="flex-1 relative">
        <div 
            className="absolute inset-0 flex transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="w-full h-full flex-shrink-0 grid grid-cols-5 grid-rows-4 gap-y-10 gap-x-8 px-16 content-start">
                    {apps.slice(pageIndex * APPS_PER_PAGE, (pageIndex + 1) * APPS_PER_PAGE).map(app => (
                        <button 
                          key={app.id}
                          onClick={() => handleAppClick(app.id)}
                          className="flex flex-col items-center gap-3 group active:scale-95 transition-transform duration-200"
                        >
                          <div className={`w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-2xl ring-1 ring-white/10 group-hover:scale-110 transition-all duration-300 overflow-hidden ${app.iconImage ? 'bg-black' : `bg-gradient-to-br ${app.gradient}`}`}>
                            {app.iconImage ? (
                              <img src={app.iconImage} className="w-full h-full object-cover" alt={app.title} draggable={false} />
                            ) : (
                              <app.icon size={34} className="text-white drop-shadow-md" />
                            )}
                          </div>
                          <span className="text-xs font-medium text-white/90 drop-shadow-md group-hover:text-white transition-colors select-none">{app.title}</span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-36 left-0 right-0 flex justify-center gap-3 pointer-events-none">
        {Array.from({ length: totalPages }).map((_, i) => (
            <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-white scale-125' : 'bg-white/30'}`} 
            />
        ))}
      </div>
    </div>
  );
};
