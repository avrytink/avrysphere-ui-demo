
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
// Fixed: Removed startOfMonth and subMonths from date-fns import as they were reported as missing. 
// Replaced subMonths functionality with addMonths(date, -1).
import { format, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths } from 'date-fns';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const Calendar: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === 'dark';
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = eachDayOfInterval({
    // Fixed: used local getStartOfMonth
    start: getStartOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  // Fixed: used addMonths with negative value instead of subMonths to resolve missing export error.
  const prevMonth = () => setCurrentDate(addMonths(currentDate, -1));

  return (
    <div className={`h-full flex flex-col font-sans select-none ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className={`p-6 md:p-8 border-b flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-100 bg-zinc-50/50'}`}>
        <div className="text-center md:text-left">
          <h1 className={`text-3xl md:text-4xl font-light uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>Calendar</h1>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {format(currentDate, 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex border rounded-xl overflow-hidden ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
            <button onClick={prevMonth} className={`p-2 transition-colors border-r ${isDark ? 'hover:bg-white/5 border-white/10 text-zinc-400 hover:text-white' : 'hover:bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-700'}`}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} className={`p-2 transition-colors ${isDark ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700'}`}>
              <ChevronRight size={20} />
            </button>
          </div>
          <button className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-600/20">
            <Plus size={14} /> <span className="hidden sm:inline">New Event</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className={`text-[10px] font-black uppercase tracking-widest text-center ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {/* Fixed: used local getStartOfMonth */}
          {Array.from({ length: getStartOfMonth(currentDate).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square opacity-0" />
          ))}
          {days.map((day, i) => (
            <div 
              key={i} 
              className={`
                aspect-square border rounded-xl md:rounded-2xl p-2 md:p-4 flex flex-col justify-between transition-all group cursor-pointer
                ${isDark ? 'border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]' : 'border-zinc-100 bg-white shadow-sm hover:border-zinc-300 hover:shadow-md'}
                ${isToday(day) ? 'border-red-600/50 bg-red-600/5 ring-1 ring-red-600/20' : ''}
              `}
            >
              <span className={`text-xs md:text-sm font-bold ${isToday(day) ? 'text-red-500' : (isDark ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-600 group-hover:text-black')}`}>
                {format(day, 'd')}
              </span>
              {isToday(day) && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-[7px] font-black text-red-500 uppercase tracking-widest hidden md:inline">Today</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 border-t flex items-center justify-between shrink-0 ${isDark ? 'border-white/5 bg-zinc-950/50' : 'border-zinc-200 bg-zinc-50/80'}`}>
         <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 border rounded-full ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className={`text-[8px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Sync Stable</span>
            </div>
         </div>
         <span className={`text-[8px] font-black uppercase tracking-widest hidden sm:inline ${isDark ? 'text-zinc-800' : 'text-zinc-300'}`}>Temporal Modality v1.0</span>
      </div>
    </div>
  );
};
