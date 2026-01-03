import React, { useState, useMemo } from 'react';
import { 
  Cloud, Sun, CloudRain, CloudLightning, Wind, Droplets, 
  Thermometer, Sunrise, Sunset, Eye, Gauge, MapPin, 
  Search, Menu, MoreHorizontal, ChevronRight, Calendar,
  CloudSnow, CloudFog, Clock, Navigation, Compass,
  Info
} from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

// --- Types & Mock Data ---

interface HourlyData {
  time: string;
  temp: number;
  condition: string;
  icon: any;
}

interface DailyData {
  day: string;
  low: number;
  high: number;
  condition: string;
  icon: any;
}

const MOCK_HOURLY: HourlyData[] = [
  { time: 'Now', temp: 21, condition: 'Sunny', icon: Sun },
  { time: '1 PM', temp: 22, condition: 'Sunny', icon: Sun },
  { time: '2 PM', temp: 23, condition: 'Sunny', icon: Sun },
  { time: '3 PM', temp: 23, condition: 'Partly Cloudy', icon: Cloud },
  { time: '4 PM', temp: 22, condition: 'Partly Cloudy', icon: Cloud },
  { time: '5 PM', temp: 21, condition: 'Rain', icon: CloudRain },
  { time: '6 PM', temp: 19, condition: 'Rain', icon: CloudRain },
  { time: '7 PM', temp: 18, condition: 'Rain', icon: CloudRain },
  { time: '8 PM', temp: 17, condition: 'Cloudy', icon: Cloud },
  { time: '9 PM', temp: 16, condition: 'Cloudy', icon: Cloud },
  { time: '10 PM', temp: 15, condition: 'Cloudy', icon: Cloud },
  { time: '11 PM', temp: 14, condition: 'Clear', icon: Sun },
  { time: '12 AM', temp: 13, condition: 'Clear', icon: Sun },
];

const MOCK_DAILY: DailyData[] = [
  { day: 'Today', low: 14, high: 23, condition: 'Sunny', icon: Sun },
  { day: 'Tue', low: 15, high: 24, condition: 'Sunny', icon: Sun },
  { day: 'Wed', low: 16, high: 22, condition: 'Cloudy', icon: Cloud },
  { day: 'Thu', low: 12, high: 18, condition: 'Rain', icon: CloudRain },
  { day: 'Fri', low: 10, high: 16, condition: 'Rain', icon: CloudRain },
  { day: 'Sat', low: 11, high: 19, condition: 'Sunny', icon: Sun },
  { day: 'Sun', low: 13, high: 21, condition: 'Sunny', icon: Sun },
  { day: 'Mon', low: 14, high: 22, condition: 'Sunny', icon: Sun },
  { day: 'Tue', low: 15, high: 23, condition: 'Sunny', icon: Sun },
  { day: 'Wed', low: 14, high: 22, condition: 'Partly Cloudy', icon: Cloud },
];

// --- Sub-components ---

const BentoWidget: React.FC<{ 
  title: string; 
  icon: any; 
  children: React.ReactNode; 
  footer?: string;
  className?: string;
}> = ({ title, icon: Icon, children, footer, className = "" }) => (
  <div className={`p-4 backdrop-blur-xl bg-white/10 border border-white/10 rounded-[16px] flex flex-col h-full ${className}`}>
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">
      <Icon size={12} />
      <span>{title}</span>
    </div>
    <div className="flex-1">
      {children}
    </div>
    {footer && (
      <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-white/60">
        {footer}
      </div>
    )}
  </div>
);

export const Weather: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Background based on first forecast item (simulated state)
  const bgGradient = useMemo(() => {
    return "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600";
  }, []);

  return (
    <div className={`h-full w-full relative overflow-hidden font-sans text-white select-none ${bgGradient}`}>
      
      {/* Dynamic Animated Background Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/30 blur-[120px] rounded-full" />
      </div>

      {/* App Content */}
      <div className="relative z-10 h-full flex flex-col overflow-y-auto no-scrollbar pt-4 px-6 pb-12">
        
        {/* Header Navigation */}
        <header className="flex items-center justify-between py-4 mb-4">
          <div className="flex items-center gap-2">
            <Menu size={20} className="opacity-60 cursor-pointer" />
            <h1 className="text-xl font-semibold flex items-center gap-2">
              New York <Navigation size={14} fill="white" />
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="text" 
                placeholder="Search city" 
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs outline-none w-32 focus:w-64 transition-all focus:bg-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <MoreHorizontal size={20} className="opacity-60 cursor-pointer" />
          </div>
        </header>

        {/* Main Bento Layout */}
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* 1. Main Panel (Large Display) */}
          <section className="lg:col-span-12 flex flex-col items-center justify-center py-12 text-center">
            <h2 className="text-3xl font-medium mb-1 drop-shadow-md">New York</h2>
            <div className="text-9xl font-thin tracking-tighter mb-2 drop-shadow-lg">21°</div>
            <p className="text-xl font-medium opacity-90 mb-1">Mostly Sunny</p>
            <div className="flex gap-2 text-lg font-medium opacity-70">
              <span>H:23°</span>
              <span>L:14°</span>
            </div>
          </section>

          {/* 2. Hourly Forecast (Horizontal Bento) */}
          <section className="lg:col-span-12">
            <div className="p-5 backdrop-blur-xl bg-white/10 border border-white/10 rounded-[16px]">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 mb-6">
                <Clock size={12} />
                <span>Hourly Forecast</span>
              </div>
              <div className="flex gap-10 overflow-x-auto no-scrollbar pb-2">
                {MOCK_HOURLY.map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-4 min-w-[45px]">
                    <span className="text-xs font-bold whitespace-nowrap opacity-80">{h.time}</span>
                    <h.icon size={22} className={h.temp > 20 ? 'text-amber-400' : 'text-blue-300'} />
                    <span className="text-lg font-bold">{h.temp}°</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. 10-Day Forecast (Vertical Bento) */}
          <section className="lg:col-span-4 h-full">
            <div className="p-5 backdrop-blur-xl bg-white/10 border border-white/10 rounded-[16px] h-full">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 mb-6">
                <Calendar size={12} />
                <span>10-Day Forecast</span>
              </div>
              <div className="space-y-5">
                {MOCK_DAILY.map((d, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-default">
                    <span className="text-sm font-bold w-12">{d.day}</span>
                    <d.icon size={20} className={d.high > 20 ? 'text-amber-400' : 'text-blue-300'} />
                    <div className="flex items-center gap-3 flex-1 max-w-[120px] ml-4">
                      <span className="text-sm font-bold opacity-40 w-6 text-right">{d.low}°</span>
                      {/* Range Bar */}
                      <div className="flex-1 h-1.5 bg-black/20 rounded-full relative overflow-hidden">
                        <div 
                          className="absolute h-full bg-gradient-to-r from-blue-400 via-amber-400 to-orange-500 rounded-full"
                          style={{ left: '20%', right: '15%' }}
                        />
                      </div>
                      <span className="text-sm font-bold w-6">{d.high}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Bento Widgets Grid */}
          <section className="lg:col-span-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            
            {/* Air Quality Index */}
            <BentoWidget title="Air Quality" icon={Gauge} className="col-span-2">
              <div className="text-2xl font-bold mb-1">32 - Good</div>
              <p className="text-[13px] font-medium leading-snug text-white/80 mb-4">Air quality is satisfactory, and air pollution poses little risk.</p>
              <div className="h-1.5 w-full bg-black/20 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-purple-500" />
                <div className="absolute top-0 w-1.5 h-full bg-white ring-2 ring-black/20 rounded-full" style={{ left: '15%' }} />
              </div>
            </BentoWidget>

            {/* UV Index */}
            <BentoWidget title="UV Index" icon={Sun}>
              <div className="text-3xl font-bold mt-2">4</div>
              <div className="text-lg font-bold">Moderate</div>
              <div className="mt-4 h-1.5 w-full bg-black/20 rounded-full relative overflow-hidden">
                <div className="absolute h-full bg-gradient-to-r from-green-400 to-red-500 w-[40%]" />
              </div>
              <p className="text-[11px] text-white/50 mt-4 leading-tight">Use sun protection until 4 PM.</p>
            </BentoWidget>

            {/* Humidity */}
            <BentoWidget title="Humidity" icon={Droplets}>
              <div className="text-3xl font-bold mt-2">64%</div>
              <p className="text-[11px] text-white/50 mt-12 leading-tight">The dew point is 14° right now.</p>
            </BentoWidget>

            {/* Wind */}
            <BentoWidget title="Wind" icon={Wind}>
              <div className="relative flex items-center justify-center py-4">
                <Compass size={80} className="opacity-20" />
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-bold">12</span>
                  <span className="text-[10px] uppercase font-black">km/h</span>
                </div>
                <Navigation size={20} className="absolute rotate-45 text-blue-400" />
              </div>
            </BentoWidget>

            {/* Visibility */}
            <BentoWidget title="Visibility" icon={Eye}>
              <div className="text-3xl font-bold mt-2">16 km</div>
              <p className="text-[11px] text-white/50 mt-12 leading-tight">It's perfectly clear right now.</p>
            </BentoWidget>

            {/* Pressure */}
            <BentoWidget title="Pressure" icon={Gauge}>
              <div className="relative flex items-center justify-center py-4">
                <div className="w-20 h-20 border-4 border-white/10 rounded-full flex flex-col items-center justify-center">
                   <span className="text-sm font-bold">1014</span>
                   <span className="text-[8px] opacity-50 uppercase">hPa</span>
                </div>
                <div className="absolute w-1 h-8 bg-blue-400 rounded-full bottom-1/2 origin-bottom -rotate-12" />
              </div>
            </BentoWidget>

            {/* Feels Like */}
            <BentoWidget title="Feels Like" icon={Thermometer}>
              <div className="text-3xl font-bold mt-2">22°</div>
              <p className="text-[11px] text-white/50 mt-12 leading-tight">Wind is making it feel cooler.</p>
            </BentoWidget>

          </section>

        </div>

        {/* Footer Attribution */}
        <footer className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <Info size={12} />
            Data provided by AvryWeather Core • Updated 2m ago
          </div>
        </footer>

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};