
import React from 'react';
import { useOSStore } from '../../store/osStore';

export const Browser: React.FC = () => {
  const { theme } = useOSStore();
  const isDark = theme === 'dark';

  return (
    <div className={`w-full h-full flex flex-col ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className={`h-10 border-b flex items-center px-4 gap-4 shrink-0 ${isDark ? 'bg-[#111] border-[#262626]' : 'bg-zinc-100 border-zinc-200'}`}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-500/20" />
        </div>
        <div className={`flex-1 border h-6 flex items-center px-3 text-[10px] rounded-2xl ${isDark ? 'bg-black border-[#262626] text-gray-500' : 'bg-white border-zinc-200 text-zinc-500 shadow-sm'}`}>
          https://www.avryos.io
        </div>
      </div>
      <iframe 
        src="https://www.bing.com" 
        className={`flex-1 w-full border-none ${isDark ? 'grayscale invert contrast-125 brightness-75' : ''}`}
        title="Browser"
      />
    </div>
  );
};
