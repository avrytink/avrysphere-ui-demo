
import React from 'react';
import { useOSStore } from '../../store/osStore';
import { useTopBarStore } from '../../store/topBarStore';
import { useI18nStore } from '../../store/i18nStore';
import { format, endOfMonth, eachDayOfInterval, isSameMonth, isToday, endOfWeek } from 'date-fns';

const startOfMonth = (date: Date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); 
  const diff = d.getDate() - day;
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
};

export const CalendarOverlay: React.FC = () => {
  const { calendarOverlayOpen, theme } = useOSStore();
  const { dateTime } = useTopBarStore();
  const { getDateLocale } = useI18nStore();

  const isDark = theme === 'dark';

  // Enhanced Contrast Styles
  const panelBg = isDark ? 'bg-zinc-900/90 border-white/10' : 'bg-white/90 border-white/40';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-600';
  const textMuted = isDark ? 'text-zinc-600' : 'text-zinc-400';
  const cardBg = isDark ? 'bg-white/5 border-white/5' : 'bg-white/60 border-white/40';

  if (!calendarOverlayOpen) return null;

  const locale = getDateLocale();
  const monthStart = startOfMonth(dateTime);
  const monthEnd = endOfMonth(dateTime);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`fixed right-4 top-12 w-80 backdrop-blur-3xl border z-[3000] p-6 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-top-4 duration-300 ${panelBg}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-xl font-bold capitalize ${textPrimary}`}>
            {format(dateTime, 'MMMM', { locale })}
          </h2>
          <p className={`text-xs font-medium mt-1 ${textSecondary}`}>
            {format(dateTime, 'yyyy', { locale })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-light text-red-600 tabular-nums leading-none">
            {format(dateTime, 'HH:mm', { locale })}
          </div>
          <div className={`text-xs font-medium mt-2 ${textSecondary}`}>
            System synchronized
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(d => (
          <div key={d} className={`h-8 flex items-center justify-center text-[10px] font-bold ${textSecondary}`}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isSelected = isToday(day);

          return (
            <div 
              key={i} 
              className={`
                h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                ${!isCurrentMonth ? textMuted : textPrimary}
                ${isSelected 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                  : (isDark ? 'hover:bg-white/5' : 'hover:bg-black/5')}
              `}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        <h3 className={`text-xs font-bold px-2 ${textSecondary}`}>Scheduled Events</h3>
        <div className="space-y-2">
          <div className={`p-3 rounded-2xl border flex items-center justify-between ${cardBg}`}>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className={`text-xs font-bold ${textSecondary}`}>Sync Kernel Alpha</span>
            </div>
            <span className={`text-xs font-mono ${textSecondary}`}>14:00</span>
          </div>
          <div className="p-3 bg-red-600/10 rounded-2xl border border-red-600/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span className="text-xs font-bold text-red-500">System Deployment</span>
            </div>
            <span className="text-xs text-red-600/50 font-mono">All Day</span>
          </div>
        </div>
      </div>
    </div>
  );
};
