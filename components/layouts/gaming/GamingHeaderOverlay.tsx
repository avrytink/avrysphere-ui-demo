import React, { useState, useEffect } from "react";
import { X, Maximize2, Gamepad2, ChevronDown } from "lucide-react";
import { WindowState } from "../../../types";

interface GamingHeaderOverlayProps {
  activeWindow: WindowState;
  onClose: () => void;
  onRestore: () => void;
}

export const GamingHeaderOverlay: React.FC<GamingHeaderOverlayProps> = ({ 
  activeWindow,
  onClose,
  onRestore
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousedown", handleActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > 5000 && !isMinimized) {
        setIsMinimized(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      clearInterval(interval);
    };
  }, [lastActivity, isMinimized]);

  return (
    <div 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isMinimized 
          ? "top-0 w-[120px] h-1.5 bg-white/20 hover:h-8 hover:bg-white/10 backdrop-blur-3xl rounded-b-full cursor-pointer overflow-hidden" 
          : "w-auto min-w-[320px] h-14 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl flex items-center px-4 gap-4"
      }`}
      onMouseEnter={() => isMinimized && setIsMinimized(false)}
      onClick={() => isMinimized && setIsMinimized(false)}
    >
      {isMinimized ? (
        <div className="w-full h-full flex items-center justify-center">
           <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" />
        </div>
      ) : (
        <>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00AEEF] to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
             <Gamepad2 size={16} className="text-white" />
          </div>
          
          <div className="flex flex-col flex-1">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00AEEF]">Active Session</span>
             <span className="text-xs font-bold text-white truncate max-w-[150px]">{activeWindow.title}</span>
          </div>

          <div className="w-px h-6 bg-white/10" />

          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRestore();
              }}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
            >
              <Maximize2 size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-red-500/30"
            >
              <X size={14} /> Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};
