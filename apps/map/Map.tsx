import React, { useState } from 'react';
import { 
  Search, MapPin, Navigation, Layers, Menu, 
  Coffee, Utensils, ShoppingBag, Landmark, 
  ChevronLeft, Star, Clock, Globe, Phone, 
  Share2, Bookmark, Route, X, Filter
} from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const Map: React.FC = () => {
  const { theme } = useOSStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isDark = theme === 'dark';

  const categories = [
    { label: 'Restaurants', icon: Utensils, color: 'bg-orange-500' },
    { label: 'Coffee', icon: Coffee, color: 'bg-amber-600' },
    { label: 'Shopping', icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Museums', icon: Landmark, color: 'bg-emerald-600' },
  ];

  const recentPlaces = [
    { id: 1, name: 'Central Park', address: 'New York, NY', rating: 4.8, type: 'Park' },
    { id: 2, name: 'Eiffel Tower', address: 'Champ de Mars, Paris', rating: 4.7, type: 'Landmark' },
    { id: 3, name: 'The Louvre', address: 'Rue de Rivoli, Paris', rating: 4.9, type: 'Museum' },
  ];

  // Encode search query for Google Maps embed
  const mapUrl = `https://www.google.com/maps/embed/v1/${searchQuery ? 'search' : 'place'}?key=YOUR_API_KEY&q=${encodeURIComponent(searchQuery || 'New York')}&maptype=${activeLayer === 'satellite' ? 'satellite' : 'roadmap'}`;
  
  // Note: For a real app, you'd use a proper mapping library. 
  // Using an interactive placeholder that looks like Google Maps.
  const visualMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery || 'New York')}&t=${activeLayer === 'satellite' ? 'k' : ''}&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`h-full flex overflow-hidden ${isDark ? 'bg-[#1c1c1c] text-white' : 'bg-white text-zinc-900'}`}>
      {/* Sidebar / Search Panel */}
      <div className={`relative transition-all duration-300 ease-in-out z-20 flex flex-col ${isSidebarOpen ? 'w-96' : 'w-0 overflow-hidden'} ${isDark ? 'bg-[#1c1c1c] border-r border-white/5' : 'bg-white border-r border-zinc-200'}`}>
        <div className="p-4 border-b border-transparent">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-shadow focus-within:shadow-lg ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
            <Menu size={18} className="text-zinc-500 cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
            <input 
              type="text" 
              placeholder="Search Maps" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
            <Search size={18} className="text-zinc-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Categories */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat.label}
                onClick={() => setSearchQuery(cat.label)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${isDark ? 'bg-zinc-900 border-white/5 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'}`}
              >
                <cat.icon size={14} className={cat.color.replace('bg-', 'text-')} />
                {cat.label}
              </button>
            ))}
          </div>

          {!selectedPlace ? (
            <div className="space-y-6">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 px-1">Recent</h3>
                <div className="space-y-1">
                  {recentPlaces.map(place => (
                    <div 
                      key={place.id}
                      onClick={() => setSelectedPlace(place)}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-50'}`}
                    >
                      <div className={`p-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                        <MapPin size={16} className="text-zinc-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{place.name}</div>
                        <div className="text-xs text-zinc-500 truncate">{place.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 px-1">Discover</h3>
                <div className={`rounded-2xl overflow-hidden border ${isDark ? 'border-white/5 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'}`}>
                  <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800" className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <div className="text-sm font-semibold mb-1">Explore Paris</div>
                    <p className="text-xs text-zinc-500">The city of light, culture and amazing food.</p>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setSelectedPlace(null)}
                className="flex items-center gap-1 text-xs text-blue-500 font-medium mb-4 hover:underline"
              >
                <ChevronLeft size={14} /> Back to results
              </button>
              
              <img src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=800" className="w-full h-48 rounded-2xl object-cover mb-4 shadow-sm" />
              
              <h2 className="text-2xl font-bold mb-1">{selectedPlace.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold">{selectedPlace.rating}</span>
                </div>
                <span className="text-xs text-zinc-500">• {selectedPlace.type}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { icon: Route, label: 'Directions', color: 'bg-blue-600 text-white' },
                  { icon: Bookmark, label: 'Save', color: isDark ? 'bg-zinc-800' : 'bg-zinc-100' },
                  { icon: MapPin, label: 'Nearby', color: isDark ? 'bg-zinc-800' : 'bg-zinc-100' },
                  { icon: Share2, label: 'Share', color: isDark ? 'bg-zinc-800' : 'bg-zinc-100' },
                ].map(action => (
                  <div key={action.label} className="flex flex-col items-center gap-1.5">
                    <div className={`p-3 rounded-full ${action.color} cursor-pointer hover:opacity-90 transition-opacity`}>
                      <action.icon size={18} />
                    </div>
                    <span className="text-[10px] font-medium opacity-60">{action.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t pt-4 border-white/5">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-blue-500 mt-0.5" />
                  <span className="text-xs leading-relaxed">{selectedPlace.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-blue-500 mt-0.5" />
                  <div className="text-xs">
                    <div className="text-emerald-500 font-medium">Open • Closes 10 PM</div>
                    <div className="text-zinc-500 mt-0.5">Updated by owner 2 weeks ago</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe size={16} className="text-blue-500 mt-0.5" />
                  <span className="text-xs text-blue-500 cursor-pointer hover:underline">visit-website.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-blue-500 mt-0.5" />
                  <span className="text-xs">+1 (555) 0123-4567</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Viewport */}
      <div className="flex-1 relative bg-zinc-200">
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={`absolute top-4 left-4 z-30 p-2.5 rounded-xl shadow-lg border transition-all ${isDark ? 'bg-zinc-900 border-white/10 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'}`}
          >
            <Menu size={20} />
          </button>
        )}

        <iframe
          src={visualMapUrl}
          className="w-full h-full border-none grayscale-[0.2] contrast-[1.1]"
          allowFullScreen
        />

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <div className={`p-1.5 rounded-xl shadow-lg border backdrop-blur-md flex flex-col gap-1 ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-black/10'}`}>
            <button 
              onClick={() => setActiveLayer('standard')}
              className={`p-2 rounded-lg transition-all ${activeLayer === 'standard' ? 'bg-white text-blue-600 shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
            >
              <Layers size={18} />
            </button>
            <button 
              onClick={() => setActiveLayer('satellite')}
              className={`p-2 rounded-lg transition-all ${activeLayer === 'satellite' ? 'bg-white text-blue-600 shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
            >
              <Globe size={18} />
            </button>
          </div>
          
          <button className={`p-3 rounded-xl shadow-lg border backdrop-blur-md transition-all ${isDark ? 'bg-black/40 border-white/10 text-white/80 hover:bg-black/60' : 'bg-white/40 border-black/10 text-black/80 hover:bg-white/60'}`}>
            <Navigation size={18} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-10 right-4 flex flex-col gap-1 z-10">
          <button className={`w-10 h-10 rounded-t-xl shadow-lg border-b border-white/10 backdrop-blur-md flex items-center justify-center text-xl font-light ${isDark ? 'bg-black/40 text-white/80' : 'bg-white/40 text-black/80'}`}>+</button>
          <button className={`w-10 h-10 rounded-b-xl shadow-lg backdrop-blur-md flex items-center justify-center text-xl font-light ${isDark ? 'bg-black/40 text-white/80' : 'bg-white/40 text-black/80'}`}>-</button>
        </div>

        {/* Attribution / Scale */}
        <div className="absolute bottom-2 right-4 flex items-center gap-4 text-[9px] font-medium text-zinc-500 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
          <span>500 m</span>
          <span>Terms of Use</span>
          <span>© 2024 Google</span>
        </div>
      </div>
    </div>
  );
};
