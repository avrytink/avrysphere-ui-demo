
import React from 'react';
import { X, Shield, Activity, Bell } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useSphereStore } from '../../store/sphereStore';
import { DesktopLayout } from '../../types';

interface NotificationsPanelProps {
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const { theme } = useOSStore();
  const { layout } = useSphereStore();
  const isUnity = layout === DesktopLayout.UNITY;
  const isDark = theme === 'dark';

  const panelBg = isDark ? 'bg-zinc-900/75 border-white/10' : 'bg-white/75 border-white/40';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const cardBg = isDark ? 'bg-white/5 border-white/10 hover:border-white/10' : 'bg-white/50 border-white/40 hover:bg-white/70';

  return (
    <div 
      className={`
        fixed backdrop-blur-3xl border-l z-[5000] p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300
        ${panelBg}
        right-0 top-0 h-full w-80
      `}
    >
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500">
            <Bell size={18} />
          </div>
          <h2 className={`text-sm font-black uppercase tracking-widest ${textPrimary}`}>Signals</h2>
        </div>
        <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-500' : 'hover:bg-black/5 text-zinc-400'}`}>
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pr-1">
        {[
          { title: 'Core Shield', desc: 'Neural link established with high entropy.', time: 'Just now', icon: Shield, color: 'text-emerald-500' },
          { title: 'System Update', desc: 'Kernel patched to revision 1.0.1.', time: '2h ago', icon: Activity, color: 'text-blue-500' },
          { title: 'Identity Link', desc: 'New domain session provisioned.', time: '4h ago', icon: Shield, color: 'text-purple-500' }
        ].map((n, i) => (
          <div key={i} className={`flex gap-4 p-4 border transition-all cursor-pointer rounded-2xl group ${cardBg}`}>
            <div className={`${n.color} shrink-0 p-2 bg-white/5 rounded-xl group-hover:scale-110 transition-transform`}><n.icon size={18} /></div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[11px] font-black uppercase tracking-tight ${textPrimary}`}>{n.title}</span>
                <span className={`text-[9px] font-bold opacity-50 ${textSecondary}`}>{n.time}</span>
              </div>
              <p className={`text-[11px] font-medium leading-relaxed ${textSecondary}`}>{n.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white' : 'bg-black/5 text-zinc-600 hover:bg-black/10 hover:text-black'}`}>
          Clear Registry
        </button>
      </div>
    </div>
  );
};
