
import React, { useState, useEffect } from 'react';
import { Gamepad2, Play, Trophy, Users, Star } from 'lucide-react';
import { useWindow } from '../../components/Window';
import { APP_REGISTRY } from '../../registry/AppRegistry';

export const GameRunner: React.FC = () => {
  const windowContext = useWindow();
  const [loading, setLoading] = useState(true);
  
  const appDef = windowContext ? APP_REGISTRY[windowContext.appId] : null;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!appDef) return null;

  if (loading) {
    return (
      <div className="h-full bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent z-10" />
        <div 
            className="absolute inset-0 bg-cover bg-center blur-md opacity-40 scale-110" 
            style={{ backgroundImage: appDef.iconImage ? `url(${appDef.iconImage})` : `linear-gradient(to bottom right, #333, #000)` }}
        />
        
        <div className="z-20 flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-700">
           {/* Game Logo Placeholder */}
           <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${appDef.gradient} flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.2)]`}>
              <Gamepad2 size={64} className="text-white drop-shadow-xl" />
           </div>
           
           <div className="flex flex-col items-center gap-2">
             <h1 className="text-4xl font-black uppercase tracking-widest text-white drop-shadow-lg">{appDef.title}</h1>
             <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.5em] animate-pulse">Loading Assets...</p>
           </div>
        </div>
        
        <div className="absolute bottom-12 right-12 z-20 flex items-center gap-2 text-zinc-500">
           <div className="w-4 h-4 border-2 border-zinc-600 rounded-full animate-spin border-t-white" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Initializing Engine</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black flex flex-col relative text-white">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
         <div className={`absolute inset-0 bg-gradient-to-br ${appDef.gradient} opacity-20`} />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
         <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#000_90%)]" />
      </div>

      {/* Main Menu UI */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-24 pb-20 items-start">
         <h1 className="text-8xl font-black italic uppercase tracking-tighter drop-shadow-2xl mb-2">{appDef.title}</h1>
         <div className="flex items-center gap-4 mb-12">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded border border-white/10 text-[10px] font-bold uppercase tracking-widest">Ver 1.04</span>
            <div className="flex items-center gap-1 text-yellow-400">
               <Star size={12} fill="currentColor" />
               <Star size={12} fill="currentColor" />
               <Star size={12} fill="currentColor" />
               <Star size={12} fill="currentColor" />
               <Star size={12} fill="currentColor" />
            </div>
         </div>

         <div className="space-y-4 w-96">
            <button className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-lg rounded hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.4)]">
               <Play size={24} fill="currentColor" /> Continue
            </button>
            <button className="w-full py-5 bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase tracking-[0.2em] text-sm rounded transition-all backdrop-blur-sm text-zinc-300 hover:text-white">
               New Game
            </button>
            <button className="w-full py-5 bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase tracking-[0.2em] text-sm rounded transition-all backdrop-blur-sm text-zinc-300 hover:text-white">
               Options
            </button>
         </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 h-20 border-t border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-between px-12">
         <div className="flex gap-8">
            <div className="flex items-center gap-3 text-zinc-400">
               <Trophy size={18} className="text-yellow-500" />
               <span className="text-xs font-bold uppercase tracking-widest">32/50 Trophies</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
               <Users size={18} className="text-blue-500" />
               <span className="text-xs font-bold uppercase tracking-widest">4 Friends Online</span>
            </div>
         </div>
         <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
            Press Any Key
         </div>
      </div>
    </div>
  );
};
