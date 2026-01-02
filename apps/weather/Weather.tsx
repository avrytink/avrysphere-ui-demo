import React, { useState } from 'react';
import { 
  Cloud, Sun, CloudRain, CloudLightning, Wind, Droplets, 
  Thermometer, Sunrise, Sunset, Eye, Gauge, MapPin, 
  Search, Menu, MoreHorizontal, ChevronRight, Calendar,
  CloudSnow, CloudFog
} from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const Weather: React.FC = () => {
  const { theme } = useOSStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const isDark = theme === 'dark';

  const hourlyForecast = [
    { time: 'Now', temp: 21, icon: Sun },
    { time: '1 PM', temp: 22, icon: Sun },
    { time: '2 PM', temp: 23, icon: Sun },
    { time: '3 PM', temp: 23, icon: Cloud },
    { time: '4 PM', temp: 22, icon: Cloud },
    { time: '5 PM', temp: 21, icon: CloudRain },
    { time: '6 PM', temp: 19, icon: CloudRain },
    { time: '7 PM', temp: 18, icon: CloudRain },
    { time: '8 PM', temp: 17, icon: Cloud },
    { time: '9 PM', temp: 16, icon: Cloud },
    { time: '10 PM', temp: 15, icon: Cloud },
  ];

  const dailyForecast = [
    { day: 'Today', low: 14, high: 23, icon: Sun },
    { day: 'Tue', low: 15, high: 24, icon: Sun },
    { day: 'Wed', low: 16, high: 22, icon: Cloud },
    { day: 'Thu', low: 12, high: 18, icon: CloudRain },
    { day: 'Fri', low: 10, high: 16, icon: CloudRain },
    { day: 'Sat', low: 11, high: 19, icon: Sun },
    { day: 'Sun', low: 13, high: 21, icon: Sun },
    { day: 'Mon', low: 14, high: 22, icon: Sun },
    { day: 'Tue', low: 15, high: 23, icon: Sun },
    { day: 'Wed', low: 14, high: 22, icon: Sun },
  ];

  const vitals = [
    { label: 'UV Index', value: '4', desc: 'Moderate', icon: Sun },
    { label: 'Sunrise', value: '6:12 AM', desc: 'Sunset: 8:42 PM', icon: Sunrise },
    { label: 'Wind', value: '12 km/h', desc: 'From North', icon: Wind },
    { label: 'Rainfall', value: '1.2 mm', desc: 'In last 24h', icon: Droplets },
    { label: 'Feels Like', value: '22°', desc: 'Similar to actual', icon: Thermometer },
    { label: 'Humidity', value: '64%', desc: 'Dew point is 14°', icon: Droplets },
    { label: 'Visibility', value: '16 km', desc: 'Clear view', icon: Eye },
    { label: 'Pressure', value: '1014 hPa', desc: 'Steady', icon: Gauge },
  ];

  return (
    <div className={`h-full flex flex-col overflow-y-auto no-scrollbar ${isDark ? 'bg-[#1c1c1c] text-white' : 'bg-[#f0f9ff] text-zinc-900'}`}>
      {/* Dynamic Background Effect (Simulated) */}
      <div className={`fixed inset-0 pointer-events-none opacity-40 blur-3xl ${isDark ? 'bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-zinc-900' : 'bg-gradient-to-br from-blue-400/30 via-sky-300/30 to-white'}`} />

      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between p-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Menu size={20} className="cursor-pointer opacity-60 hover:opacity-100" />
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              New York <MapPin size={14} className="opacity-60" />
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
            <Search size={14} className="opacity-40" />
            <input 
              type="text" 
              placeholder="Search city" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-24 focus:w-48 transition-all"
            />
          </div>
          <MoreHorizontal size={20} className="cursor-pointer opacity-60" />
        </div>
      </div>

      <div className="flex-1 px-6 pb-12 space-y-8 max-w-5xl mx-auto w-full relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center py-8 text-center">
          <span className="text-8xl font-thin tracking-tighter mb-2">21°</span>
          <span className="text-xl font-medium opacity-80">Mostly Sunny</span>
          <div className="flex gap-2 mt-2 font-medium opacity-60">
            <span>H:23°</span>
            <span>L:14°</span>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className={`p-5 rounded-3xl backdrop-blur-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-white/40 shadow-sm'}`}>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 mb-5">
            <Clock size={12} />
            <span>Hourly Forecast</span>
          </div>
          <div className="flex gap-8 overflow-x-auto pb-2 no-scrollbar">
            {hourlyForecast.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-3 min-w-[40px]">
                <span className="text-xs font-medium opacity-60 whitespace-nowrap">{h.time}</span>
                <h.icon size={20} className={h.temp > 20 ? 'text-amber-500' : 'text-blue-500'} />
                <span className="text-lg font-medium">{h.temp}°</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 10-Day Forecast */}
          <div className={`lg:col-span-1 p-5 rounded-3xl backdrop-blur-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-white/40 shadow-sm'}`}>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40 mb-5">
              <Calendar size={12} />
              <span>10-Day Forecast</span>
            </div>
            <div className="space-y-4">
              {dailyForecast.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-white/5 last:border-none">
                  <span className="text-sm font-medium w-12">{d.day}</span>
                  <d.icon size={18} className={d.high > 20 ? 'text-amber-500' : 'text-blue-500'} />
                  <div className="flex items-center gap-3 w-32">
                    <span className="text-xs opacity-40 w-6 text-right">{d.low}°</span>
                    <div className="flex-1 h-1 bg-black/10 rounded-full relative overflow-hidden">
                      <div 
                        className="absolute h-full bg-gradient-to-r from-blue-400 to-amber-400 rounded-full"
                        style={{ left: '20%', right: '15%' }}
                      />
                    </div>
                    <span className="text-sm font-medium w-6">{d.high}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {vitals.map((v, i) => (
              <div key={i} className={`p-5 rounded-3xl backdrop-blur-2xl border transition-all hover:scale-[1.02] ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-white/40 shadow-sm'}`}>
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest opacity-40 mb-3">
                  <v.icon size={12} />
                  <span>{v.label}</span>
                </div>
                <div className="text-2xl font-light mb-1">{v.value}</div>
                <div className="text-[11px] font-medium opacity-60 leading-tight">{v.desc}</div>
                {v.label === 'UV Index' && (
                  <div className="mt-4 h-1 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-[40%]" />
                  </div>
                )}
                {v.label === 'Humidity' && (
                  <div className="mt-4 h-1 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[64%]" />
                  </div>
                )}
              </div>
            ))}

            {/* Air Quality (Special Large Tile) */}
            <div className={`col-span-2 p-5 rounded-3xl backdrop-blur-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white/60 border-white/40 shadow-sm'}`}>
               <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest opacity-40 mb-3">
                  <Gauge size={12} />
                  <span>Air Quality</span>
                </div>
                <div className="text-lg font-medium mb-1">32 - Good</div>
                <p className="text-[11px] opacity-60 mb-4">Air quality is considered satisfactory, and air pollution poses little or no risk.</p>
                <div className="h-1.5 bg-black/10 rounded-full relative overflow-hidden">
                  <div className="absolute h-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 via-red-400 to-purple-400 w-full" />
                  <div className="absolute h-3 w-3 bg-white border-2 border-zinc-900 rounded-full -top-[3px]" style={{ left: '15%' }} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
