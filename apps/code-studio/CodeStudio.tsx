
import React, { useState } from 'react';
import { Code, Folder, Database, FileCode, Play, Save, Share2 } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const CodeStudio: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === 'dark';
  const [activeFile, setActiveFile] = useState('kernel.sys');
  const [code, setCode] = useState('// avryOS Kernel Protocol\n// Version 6.5.0-STABLE\n\nasync function bootIdentityLayer(userId: string) {\n  const auth = await sys.handshake(userId);\n  if (auth.success) {\n    return await modality.initialize(auth.token);\n  }\n  throw new Error("Handshake Failed");\n}\n\n// System entry point\nexport default bootIdentityLayer;');

  return (
    <div className={`h-full flex flex-col font-mono text-xs ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
      <div className={`h-12 border-b flex items-center justify-between px-4 md:px-6 ${isDark ? 'border-white/10 bg-black' : 'border-zinc-200 bg-zinc-50'}`}>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Code size={16} className="text-white" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:inline ${isDark ? 'text-white' : 'text-zinc-900'}`}>Code Studio</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-zinc-500 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-bold uppercase">Main.branch</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-black uppercase tracking-widest text-[9px] rounded-xl hover:bg-emerald-500 transition-colors">
            <Play size={12} /> <span className="hidden sm:inline">Run</span>
          </button>
          <button className={`p-2 transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-800'}`}>
            <Save size={16} />
          </button>
          <button className={`p-2 transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-800'}`}>
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile */}
        <aside className={`hidden md:flex w-56 border-r flex-col ${isDark ? 'border-white/5 bg-zinc-950/20' : 'border-zinc-200 bg-zinc-50/50'}`}>
          <div className="p-4 flex items-center justify-between text-zinc-600">
            <span className="text-[9px] font-black uppercase tracking-widest">Explorer</span>
            <Folder size={14} />
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {[
              { name: 'kernel.sys', icon: FileCode, active: true },
              { name: 'auth.protocol', icon: FileCode, active: false },
              { name: 'ui.modality', icon: FileCode, active: false },
              { name: 'config.json', icon: Database, active: false }
            ].map(file => (
              <div 
                key={file.name}
                onClick={() => setActiveFile(file.name)}
                className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${activeFile === file.name ? (isDark ? 'bg-white/5 text-white' : 'bg-white shadow-sm text-zinc-900') : (isDark ? 'text-zinc-600 hover:text-white hover:bg-white/5' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50')}`}
              >
                <file.icon size={14} className={activeFile === file.name ? 'text-blue-500' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-tight">{file.name}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col relative">
          <div className={`flex items-center h-10 border-b px-4 ${isDark ? 'border-white/5 bg-zinc-950/50' : 'border-zinc-200 bg-zinc-50'}`}>
             <div className={`px-4 py-2 border-t border-x rounded-t-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${isDark ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'}`}>
                <FileCode size={12} className="text-blue-500" /> {activeFile}
             </div>
          </div>
          
          <div className="flex-1 flex">
            <div className={`w-12 border-r flex flex-col items-center py-4 text-[10px] select-none ${isDark ? 'bg-black border-white/5 text-zinc-800' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="h-6 flex items-center">{i + 1}</div>
              ))}
            </div>
            <textarea 
              className={`flex-1 bg-transparent p-4 outline-none resize-none leading-6 ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}
              spellCheck={false}
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </div>
        </main>
      </div>

      <footer className={`h-8 border-t flex items-center px-6 justify-between text-[8px] font-black uppercase tracking-[0.3em] shrink-0 ${isDark ? 'border-white/5 bg-black text-zinc-600' : 'border-zinc-200 bg-zinc-50 text-zinc-400'}`}>
        <div className="flex items-center gap-6">
          <span>LF</span>
          <span>UTF-8</span>
          <span className="text-blue-500 hidden sm:inline">TypeScript</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Row 12, Col 4</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="hidden sm:inline">Deployment Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
