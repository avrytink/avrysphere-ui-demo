
import React, { useState } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { AppId } from '../../types';
import { APP_REGISTRY } from '../../registry/AppRegistry';
import { Play, Star, Clock, TrendingUp } from 'lucide-react';

const FEATURED_CONTENT = [
  { id: '1', title: 'Andor', subtitle: 'Rebellion Begins', image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070', type: 'Series' },
  { id: '2', title: 'Dune: Part Two', subtitle: 'Long Live the Fighters', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1976', type: 'Movie' },
  { id: '3', title: 'Cyberpunk 2077', subtitle: 'Phantom Liberty', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070', type: 'Game' },
];

export const TVHome: React.FC = () => {
  const { openWindow } = useWindowStore();
  const [heroIndex, setHeroIndex] = useState(0);

  // Include HEADLESS apps if they are switchers, but exclude TV_MODE itself
  const apps = Object.values(APP_REGISTRY).filter(app => 
    (!app.headless || [AppId.DESKTOP_MODE, AppId.TABLET_MODE, AppId.GAME_MODE].includes(app.id)) 
    && app.id !== AppId.TV_MODE
  );
  
  const hero = FEATURED_CONTENT[heroIndex];

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] rounded-3xl overflow-hidden shadow-2xl group transition-all duration-700">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105 group-hover:scale-100"
          style={{ backgroundImage: `url('${hero.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-16 flex flex-col gap-6 max-w-2xl">
          <div className="flex items-center gap-4">
             <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
               {hero.type}
             </span>
             <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
               <Star size={12} fill="currentColor" /> 98% Match
             </span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-lg leading-none">
            {hero.title}
          </h1>
          <p className="text-xl text-zinc-300 font-medium tracking-wide">
            {hero.subtitle}
          </p>
          <div className="flex gap-4 mt-4">
            <button className="bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center gap-3">
              <Play size={16} fill="currentColor" /> Watch Now
            </button>
            <button className="bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all backdrop-blur-md">
              + Watchlist
            </button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-16 right-16 flex gap-3">
          {FEATURED_CONTENT.map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === heroIndex ? 'bg-white scale-125' : 'bg-white/30'}`}
              onMouseEnter={() => setHeroIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Your Apps Row */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white px-4 flex items-center gap-3">
          <div className="w-1 h-6 bg-blue-500 rounded-full" />
          Your Apps
        </h2>
        <div className="flex gap-6 overflow-x-auto px-4 pb-8 no-scrollbar scroll-smooth">
          {apps.map(app => (
            <button
              key={app.id}
              onClick={() => openWindow(app.id)}
              className="flex-shrink-0 group flex flex-col gap-4 items-center focus:outline-none"
            >
              <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-focus:scale-110 transition-all duration-300 border-4 border-transparent group-hover:border-white/20 group-hover:shadow-2xl ring-0 group-focus:ring-4 group-focus:ring-white/50 overflow-hidden`}>
                {app.iconImage ? (
                  <img src={app.iconImage} className="w-full h-full object-cover" alt={app.title} />
                ) : (
                  <app.icon size={53} className="text-white drop-shadow-md" />
                )}
              </div>
              <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors text-center w-36 truncate">{app.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Watching Mock */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white px-4 flex items-center gap-3">
          <Clock size={20} className="text-zinc-500" />
          Continue Watching
        </h2>
        <div className="flex gap-8 overflow-x-auto px-4 pb-4 no-scrollbar">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-shrink-0 w-80 aspect-video rounded-2xl bg-zinc-800 overflow-hidden relative group cursor-pointer border border-white/5 hover:border-white/40 transition-all hover:scale-105">
               <img src={`https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600&text=${i}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
                 <div className="h-full bg-red-600" style={{ width: `${Math.random() * 80 + 10}%` }} />
               </div>
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Play size={20} fill="white" className="text-white" />
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Mock */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white px-4 flex items-center gap-3">
          <TrendingUp size={20} className="text-red-500" />
          Trending Now
        </h2>
        <div className="flex gap-6 overflow-x-auto px-4 pb-4 no-scrollbar">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex-shrink-0 w-48 aspect-[2/3] rounded-2xl bg-zinc-800 overflow-hidden relative group cursor-pointer border border-white/5 hover:border-white/40 transition-all hover:scale-105">
               <img src={`https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=400&text=${i}`} className="w-full h-full object-cover" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
