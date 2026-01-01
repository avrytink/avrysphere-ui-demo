
import React, { useState } from 'react';
import { Save, FileText, Share2 } from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const TextEditor: React.FC = () => {
  const { theme } = useOSStore();
  const [content, setContent] = useState(`# avryOS Notes\n\n- System architecture finalized\n- Ubuntu Unity layout implemented\n- Windows 11 aesthetics applied\n- Gemini AI integrated via core services\n\nBuild: 1.0.0-STABLE`);

  const isDark = theme === 'dark';

  return (
    <div className={`h-full flex flex-col font-mono ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
      <div className={`h-10 border-b flex items-center justify-between px-4 ${isDark ? 'border-white/10 bg-black' : 'border-zinc-200 bg-zinc-50'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
            <FileText size={14} className="text-blue-500" /> README.md
          </div>
          <span className="text-[10px] text-gray-700 uppercase">UTF-8</span>
        </div>
        <div className="flex gap-2">
          <button className={`p-2 transition-colors ${isDark ? 'hover:bg-white/5 text-gray-500 hover:text-white' : 'hover:bg-zinc-200 text-zinc-500 hover:text-black'}`}><Save size={14} /></button>
          <button className={`p-2 transition-colors ${isDark ? 'hover:bg-white/5 text-gray-500 hover:text-white' : 'hover:bg-zinc-200 text-zinc-500 hover:text-black'}`}><Share2 size={14} /></button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className={`w-12 border-r flex flex-col items-center py-4 text-[10px] text-gray-700 select-none ${isDark ? 'bg-black border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="h-6 leading-6">{i + 1}</div>
          ))}
        </div>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`flex-1 bg-transparent p-4 outline-none resize-none text-sm leading-6 ${isDark ? 'text-gray-300' : 'text-zinc-800'}`}
          spellCheck={false}
        />
      </div>
      <div className={`h-6 border-t flex items-center px-4 justify-between text-[9px] text-gray-600 uppercase font-bold tracking-[0.2em] ${isDark ? 'border-white/10 bg-black' : 'border-zinc-200 bg-zinc-50'}`}>
        <span>Lines: {content.split('\n').length}</span>
        <span>Col: {content.length}</span>
      </div>
    </div>
  );
};
