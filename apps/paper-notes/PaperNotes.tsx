
import React from 'react';
import { Plus, StickyNote, MoreVertical } from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const PaperNotes: React.FC = () => {
  const { theme } = useOSStore();
  const isDark = theme === 'dark';

  const notes = [
    { title: 'Project X', content: 'Finalize the kernel logic before Friday.', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600' },
    { title: 'Groceries', content: 'Coffee, Milk, Dark Matter, Bread.', color: 'bg-blue-500/10 border-blue-500/30 text-blue-600' },
    { title: 'Ideas', content: 'Implement a spatial file system.', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' },
    { title: 'Legacy', content: 'Cleanup old Unity-10 assets.', color: 'bg-rose-500/10 border-rose-500/30 text-rose-600' },
  ];

  return (
    <div className={`h-full p-6 md:p-8 overflow-y-auto ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className="flex items-center justify-between mb-10">
        <h1 className={`text-3xl font-light uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Paper Notes</h1>
        <button className={`w-12 h-12 border flex items-center justify-center transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-900 shadow-sm'}`}>
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((n, i) => (
          <div key={i} className={`p-6 border flex flex-col min-h-[180px] group transition-all hover:scale-[1.02] ${n.color} ${isDark ? '' : 'bg-opacity-20 border-opacity-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <StickyNote size={16} className="opacity-50" />
              <MoreVertical size={16} className="opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3">{n.title}</h3>
            <p className={`text-[11px] leading-relaxed flex-1 ${isDark ? 'text-gray-400' : 'text-zinc-700'}`}>{n.content}</p>
            <div className="text-[8px] uppercase tracking-widest text-gray-500 mt-4">Modified 2h ago</div>
          </div>
        ))}
      </div>
    </div>
  );
};
