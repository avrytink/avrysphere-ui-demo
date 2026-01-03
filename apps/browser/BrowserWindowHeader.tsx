import React, { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Shield, Lock, Search } from "lucide-react";
import { useTheme } from "../../components/Window";

export const BrowserWindowHeader: React.FC<{ win: any }> = () => {
  const theme = useTheme();
  const isDark = theme === "dark";
  const [url, setUrl] = useState("https://www.leconomie.info");

  const textColor = isDark ? "text-zinc-200" : "text-zinc-800";
  const hoverBg = isDark ? "hover:bg-white/20" : "hover:bg-black/20";
  const glassBg = isDark ? "bg-white/10" : "bg-black/10";

  return (
    <div className="flex items-center gap-4 flex-1 px-4 pointer-events-auto">
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${glassBg} ${textColor} ${hoverBg} opacity-40`}
          disabled
        >
          <ArrowLeft size={14} />
        </button>
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${glassBg} ${textColor} ${hoverBg} opacity-40`}
          disabled
        >
          <ArrowRight size={14} />
        </button>
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${glassBg} ${textColor} ${hoverBg}`}
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Address Bar */}
      <div
        className={`flex-1 flex items-center h-8 px-4 rounded-full transition-all focus-within:ring-2 focus-within:ring-blue-500/20 group ${glassBg}`}
      >
        <div className="flex items-center gap-2 mr-3">
          <Lock size={10} className="text-emerald-500" />
        </div>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`flex-1 bg-transparent border-none outline-none text-[11px] font-medium ${
            isDark ? "text-zinc-300" : "text-zinc-700"
          }`}
        />
        <div className="flex items-center gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Shield
            size={12}
            className={isDark ? "text-zinc-500" : "text-zinc-400"}
          />
        </div>
      </div>

      {/* Tools */}
      <button
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${glassBg} ${textColor} ${hoverBg}`}
      >
        <Search size={14} />
      </button>
    </div>
  );
};
