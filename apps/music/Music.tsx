
import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  Search, 
  Home, 
  Grid, 
  Radio, 
  Music as MusicIcon, 
  Mic2, 
  ListMusic, 
  Share, 
  MoreHorizontal,
  ChevronRight, 
  Heart,
  Key,
  LogOut,
  Loader2,
  AlertCircle,
  Signal
} from 'lucide-react';
import { useMediaStore, MOCK_TRACKS } from '../../store/mediaStore';
import { useOSStore } from '../../store/osStore';

const GENRES = ['Pop', 'News', 'Jazz', 'Classical', 'Rock', 'Electronic', 'Hip Hop', 'Ambient'];

export const Music: React.FC = () => {
  const { theme } = useOSStore();
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    volume, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    setTrack, 
    setVolume,
    spotifyToken,
    setSpotifyToken,
    searchSpotify,
    searchResults,
    radioStations,
    fetchRadio,
    isSearching,
    clearSearch
  } = useMediaStore();
  
  const [activeTab, setActiveTab] = useState('LISTEN_NOW');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Initial load for Radio tab
  useEffect(() => {
    if (activeTab === 'RADIO' && radioStations.length === 0) {
      fetchRadio();
    }
  }, [activeTab]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery) {
        clearSearch();
        if (activeTab === 'RADIO') fetchRadio(undefined, activeGenre || undefined);
        return;
      }

      if (activeTab === 'RADIO') {
        fetchRadio(searchQuery);
      } else if (spotifyToken) {
        searchSpotify(searchQuery);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, spotifyToken, activeTab, activeGenre]);

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      setSpotifyToken(tokenInput.trim());
      setShowTokenModal(false);
      setTokenInput('');
    }
  };

  const handleGenreClick = (genre: string) => {
    const newGenre = activeGenre === genre ? null : genre;
    setActiveGenre(newGenre);
    setSearchQuery(''); // Clear search when picking genre
    fetchRadio(undefined, newGenre || undefined);
  };

  // Determine which list to show
  let displayList = MOCK_TRACKS;
  if (activeTab === 'RADIO') {
    displayList = radioStations;
  } else if (searchQuery && searchResults.length > 0) {
    displayList = searchResults;
  }

  const isUsingSpotify = !!spotifyToken;

  return (
    <div className={`h-full flex flex-col font-sans select-none relative ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      
      {/* Token Modal */}
      {showTokenModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-200">
          <div className={`w-full max-w-md border rounded-3xl p-8 shadow-2xl space-y-6 ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-green-500/20">
                <MusicIcon size={24} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Connect Spotify</h3>
                <p className="text-xs text-zinc-500 font-medium">Enter your Access Token to enable live search.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Access Token</label>
              <input 
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="BQ..."
                className={`w-full border p-4 rounded-xl text-xs font-mono outline-none focus:border-green-500 transition-colors ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`}
              />
              <p className="text-[9px] text-zinc-600 leading-relaxed px-1">
                Note: You can generate a temporary token from the Spotify Developer Console (Web API > Console > Get Token).
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowTokenModal(false)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveToken}
                className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl text-xs font-bold transition-colors"
              >
                Link Account
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation - Hidden on Mobile */}
        <aside className={`hidden md:flex w-56 border-r p-6 flex-col gap-8 shrink-0 ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <MusicIcon size={18} className="text-white" />
            </div>
            <span className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-zinc-900'}`}>Music</span>
          </div>

          <div className="space-y-6 flex-1">
            <div className="space-y-1">
              <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest px-2 mb-2">Discovery</h4>
              {[
                { id: 'LISTEN_NOW', label: 'Listen Now', icon: Play },
                { id: 'BROWSE', label: 'Browse', icon: Grid },
                { id: 'RADIO', label: 'Radio', icon: Radio },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSearchQuery(''); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : (isDark ? 'text-zinc-400 hover:bg-white/5 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black')}`}
                >
                  <item.icon size={16} />
                  <span className="text-xs font-bold uppercase tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest px-2 mb-2">Library</h4>
              {[
                { label: 'Recently Added', icon: Mic2 },
                { label: 'Artists', icon: Home },
                { label: 'Albums', icon: Grid },
                { label: 'Songs', icon: MusicIcon },
              ].map(item => (
                <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-500 transition-all ${isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-zinc-100 hover:text-black'}`}>
                  <item.icon size={16} />
                  <span className="text-xs font-bold uppercase tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Spotify Connection Status */}
          <div className={`p-3 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-2 h-2 rounded-full ${isUsingSpotify ? 'bg-green-500 animate-pulse' : 'bg-zinc-400'}`} />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                {isUsingSpotify ? 'Spotify Linked' : 'Offline Mode'}
              </span>
            </div>
            {isUsingSpotify ? (
              <button 
                onClick={() => setSpotifyToken(null)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition-all text-[9px] font-bold uppercase"
              >
                <LogOut size={12} /> Disconnect
              </button>
            ) : (
              <button 
                onClick={() => setShowTokenModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-all text-[9px] font-bold uppercase"
              >
                <Key size={12} /> Connect
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar ${isDark ? 'bg-gradient-to-b from-zinc-900/50 to-black' : 'bg-slate-50'}`}>
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h1 className={`text-3xl md:text-4xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {activeTab === 'RADIO' ? 'Global Radio' : searchQuery ? 'Search Results' : 'Listen Now'}
            </h1>
            <div className="relative group w-full md:w-auto">
              <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-black'}`} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'RADIO' ? "Find station..." : isUsingSpotify ? "Search Spotify..." : "Search (Offline Mode)..."}
                className={`border rounded-full py-2.5 pl-10 pr-4 text-xs outline-none transition-all w-full md:w-72 ${isDark ? 'bg-white/5 border-white/10 focus:border-red-600 focus:bg-white/10 text-zinc-300 placeholder:text-zinc-600' : 'bg-white border-zinc-200 focus:border-red-600 text-zinc-900 placeholder:text-zinc-400 shadow-sm'}`}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={14} className="animate-spin text-red-500" />
                </div>
              )}
            </div>
          </header>

          {activeTab === 'RADIO' && (
            <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
              {GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${activeGenre === genre ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black') : (isDark ? 'bg-black border-white/10 text-zinc-500 hover:border-white/30 hover:text-white' : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-black')}`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}

          {!isUsingSpotify && searchQuery && activeTab !== 'RADIO' && (
            <div className="mb-8 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-center gap-3">
              <AlertCircle size={16} className="text-yellow-600" />
              <span className="text-xs text-yellow-600/80 font-medium">
                Connect your Spotify account to enable real-time search. Showing offline tracks.
              </span>
            </div>
          )}

          <section className="space-y-8 mb-16">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {searchQuery ? `Results (${displayList.length})` : activeTab === 'RADIO' ? 'Live Stations' : 'Top Recommendations'}
              </h2>
              <ChevronRight size={20} className={`cursor-pointer ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`} />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {displayList.map(track => (
                <div 
                  key={track.id}
                  onClick={() => setTrack(track)}
                  className="group flex flex-col gap-4 cursor-pointer"
                >
                  <div className={`aspect-square rounded-2xl overflow-hidden relative shadow-2xl border ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-100'}`}>
                    {track.cover ? (
                      <img src={track.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={track.title} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop'; }} />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                        <MusicIcon size={32} className="text-zinc-400" />
                      </div>
                    )}
                    
                    {track.isLive && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest rounded-md shadow-lg flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}

                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${currentTrack.id === track.id && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition-transform">
                        {currentTrack.id === track.id && isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
                      </div>
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className={`text-xs font-black uppercase tracking-tight truncate ${currentTrack.id === track.id ? 'text-red-500' : (isDark ? 'text-white' : 'text-zinc-900')}`}>{track.title}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 truncate">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {!searchQuery && activeTab !== 'RADIO' && (
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Recent Sessions</h2>
              </div>
              <div className="space-y-2">
                {MOCK_TRACKS.slice(0, 3).map(track => (
                  <div 
                    key={track.id}
                    onClick={() => setTrack(track)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all group ${currentTrack.id === track.id ? (isDark ? 'bg-white/10' : 'bg-zinc-100') : (isDark ? 'hover:bg-white/5' : 'hover:bg-white border border-transparent hover:border-zinc-100 hover:shadow-sm')}`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={track.cover} className="w-12 h-12 rounded-xl object-cover shadow-lg" alt="" />
                      <div>
                        <h4 className={`text-[11px] font-black uppercase tracking-tight ${currentTrack.id === track.id ? 'text-red-500' : (isDark ? 'text-white' : 'text-zinc-900')}`}>{track.title}</h4>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-zinc-500">
                      <Heart size={14} className="hover:text-red-500 cursor-pointer hidden md:block" />
                      <span className="text-[10px] font-mono hidden md:block">{track.duration}</span>
                      <MoreHorizontal size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Player Console */}
      <footer className={`h-auto md:h-24 backdrop-blur-3xl border-t flex flex-col md:flex-row items-center px-6 md:px-8 gap-4 md:gap-10 py-4 md:py-0 ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/90 border-zinc-200'}`}>
        <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[240px]">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl shadow-2xl overflow-hidden flex-shrink-0 relative ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
            {currentTrack.cover && (
              <img src={currentTrack.cover} className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-95 grayscale'}`} alt="" />
            )}
            {currentTrack.isLive && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Signal size={16} className="text-white animate-pulse" />
               </div>
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`text-xs font-black uppercase tracking-tight truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>{currentTrack.title}</span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1 truncate">{currentTrack.artist}</span>
          </div>
          {/* Mobile Play Controls Inline */}
          <div className="flex md:hidden items-center gap-4">
             <button 
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all shadow-xl ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
          </div>
        </div>

        <div className="hidden md:flex flex-1 flex-col items-center gap-3">
          <div className="flex items-center gap-8">
            <button className={`transition-colors ${isDark ? 'text-zinc-600 hover:text-white' : 'text-zinc-400 hover:text-black'}`}><Shuffle size={16} /></button>
            <button onClick={prevTrack} className={`transition-colors hover:text-red-500 ${isDark ? 'text-white' : 'text-black'}`}><SkipBack size={20} fill="currentColor" /></button>
            <button 
              onClick={togglePlay}
              className={`w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={nextTrack} className={`transition-colors hover:text-red-500 ${isDark ? 'text-white' : 'text-black'}`}><SkipForward size={20} fill="currentColor" /></button>
            <button className={`transition-colors ${isDark ? 'text-zinc-600 hover:text-white' : 'text-zinc-400 hover:text-black'}`}><Repeat size={16} /></button>
          </div>
          
          <div className="w-full max-w-xl flex items-center gap-3">
            <span className="text-[8px] font-mono text-zinc-500 w-8 text-right">
              {currentTrack.isLive ? 'LIVE' : 
               `${Math.floor((progress / 100) * (parseInt(currentTrack.duration.split(':')[0]) * 60 + parseInt(currentTrack.duration.split(':')[1])) / 60)}:
               ${(Math.floor((progress / 100) * (parseInt(currentTrack.duration.split(':')[0]) * 60 + parseInt(currentTrack.duration.split(':')[1])) % 60)).toString().padStart(2, '0')}`
              }
            </span>
            <div className={`flex-1 h-1 rounded-full overflow-hidden relative group cursor-pointer ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>
              <div 
                className={`absolute inset-y-0 left-0 transition-all duration-300 ${currentTrack.isLive ? 'bg-red-500 animate-pulse' : (isDark ? 'bg-white group-hover:bg-red-500' : 'bg-black group-hover:bg-red-500')}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[8px] font-mono text-zinc-500 w-8">{currentTrack.duration}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 min-w-[240px] justify-end">
          <button className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}><Mic2 size={16} /></button>
          <button className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}><ListMusic size={16} /></button>
          <div className="flex items-center gap-3 w-32">
            <Volume2 size={16} className="text-zinc-500" />
            <div className={`flex-1 h-1 rounded-full overflow-hidden relative ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`}>
              <div 
                className="absolute inset-y-0 left-0 bg-zinc-500 transition-all"
                style={{ width: `${volume}%` }}
              />
              <input 
                type="range" 
                value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <button className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}><Share size={16} /></button>
        </div>
      </footer>
    </div>
  );
};
