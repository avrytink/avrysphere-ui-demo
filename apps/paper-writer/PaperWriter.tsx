
import React from 'react';
import { FileEdit, Eye, Trash2, Search, Plus, Calendar } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const PaperWriter: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === 'dark';

  const articles = [
    { title: 'The Future of avryOS 2.0', date: 'Oct 24, 2024', status: 'Published', views: '24.1K' },
    { title: 'Designing for Minimalism', date: 'Oct 20, 2024', status: 'Draft', views: '-' },
    { title: 'AI-Native OS Architectures', date: 'Oct 18, 2024', status: 'Published', views: '12.4K' },
    { title: 'Ubuntu Unity Redux', date: 'Oct 15, 2024', status: 'Archived', views: '4.2K' },
  ];

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className={`p-6 md:p-10 border-b ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white'}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl md:text-4xl font-light uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Paper Writer</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Content Management System</p>
          </div>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-white">
            <Plus size={14} /> <span className="hidden md:inline">New Post</span>
          </button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input className={`w-full border py-2 pl-9 text-[10px] uppercase font-bold tracking-widest outline-none focus:border-red-600 ${isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-zinc-200 text-black'}`} placeholder="Filter articles..." />
          </div>
          <select className={`border text-[10px] p-2 outline-none uppercase font-bold tracking-widest hidden md:block ${isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-zinc-200 text-black'}`}>
            <option>All Status</option>
            <option>Published</option>
            <option>Drafts</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className={`text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
              <tr>
                <th className="pb-4 px-4 font-bold">Article Title</th>
                <th className="pb-4 px-4 font-bold">Date</th>
                <th className="pb-4 px-4 font-bold">Status</th>
                <th className="pb-4 px-4 font-bold">Views</th>
                <th className="pb-4 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs uppercase font-bold tracking-tight">
              {articles.map((a, i) => (
                <tr key={i} className={`border-b transition-colors group ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-zinc-100 hover:bg-white shadow-sm'}`}>
                  <td className={`py-6 px-4 group-hover:text-red-500 ${isDark ? 'text-white' : 'text-zinc-800'}`}>{a.title}</td>
                  <td className="py-6 px-4 text-gray-600 flex items-center gap-2">
                    <Calendar size={12} /> {a.date}
                  </td>
                  <td className="py-6 px-4">
                    <span className={`px-2 py-0.5 text-[8px] font-bold ${a.status === 'Published' ? 'bg-emerald-600/20 text-emerald-500' : a.status === 'Draft' ? 'bg-amber-600/20 text-amber-500' : 'bg-gray-800 text-gray-400'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-gray-600">{a.views}</td>
                  <td className="py-6 px-4 text-right">
                    <div className="flex justify-end gap-4 text-gray-600">
                      <button className={`hover:text-${isDark ? 'white' : 'black'}`}><Eye size={14} /></button>
                      <button className={`hover:text-${isDark ? 'white' : 'black'}`}><FileEdit size={14} /></button>
                      <button className="hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
