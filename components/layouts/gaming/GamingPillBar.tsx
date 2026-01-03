import React from "react";
import { 
  Gamepad2, 
  Home, 
  Settings, 
  Trophy, 
  Clock, 
  Battery, 
  Wifi,
  MoreHorizontal
} from "lucide-react";
import { useAuthStore } from "../../../store/authStore";

interface GamingPillBarProps {
  isVisible: boolean;
  onHome: () => void;
  onSettings: () => void;
  onStats: () => void;
}

export const GamingPillBar: React.FC<GamingPillBarProps> = ({ 
  isVisible,
  onHome,
  onSettings,
  onStats
}) => {
  const { currentUser } = useAuthStore();

  return (
    <div 
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-90"
      }`}
    >
      <div className="flex items-center gap-2 p-2 bg-[#00AEEF]/10 backdrop-blur-2xl rounded-full border border-[#00AEEF]/20 shadow-[0_20px_50px_rgba(0,174,239,0.3)]">
        {/* User Profile */}
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#00AEEF]/40 shadow-lg">
          <img 
            src={currentUser?.avatar || "https://via.placeholder.com/150"} 
            className="w-full h-full object-cover"
            alt="User"
          />
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Navigation Actions */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onHome}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Home size={20} />
          </button>
          <button 
            onClick={onStats}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Trophy size={20} />
          </button>
          <button 
            onClick={onSettings}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* System Info Mini Pill */}
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
          <div className="flex items-center gap-1.5">
            <Wifi size={14} className="text-[#00AEEF]" />
            <span className="text-[10px] font-bold text-white/60">5G</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Battery size={14} className="text-emerald-400 rotate-90" />
            <span className="text-[10px] font-bold text-white/60">98%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-amber-400" />
            <span className="text-[10px] font-bold text-white/60">12:45</span>
          </div>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Launcher Button */}
        <button className="w-10 h-10 bg-[#00AEEF] text-white flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,174,239,0.5)] hover:scale-110 active:scale-95 transition-all">
          <Gamepad2 size={20} />
        </button>
      </div>
    </div>
  );
};
