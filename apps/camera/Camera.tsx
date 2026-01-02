import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera as CameraIcon, Video, Settings, RotateCcw, Image as ImageIcon,
  ChevronDown, Grid, Timer, Sun, Mic, MicOff, Maximize2, Minimize2,
  X, FlipHorizontal, Square
} from 'lucide-react';
import { useOSStore } from '../../store/osStore';

export const Camera: React.FC = () => {
  const { theme } = useOSStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [mirror, setMirror] = useState(true);

  const isDark = theme === 'dark';

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (mirror) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.filter = `brightness(${brightness}%)`;
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImages(prev => [dataUrl, ...prev]);
        
        // Flash effect
        const flash = document.createElement('div');
        flash.className = 'fixed inset-0 bg-white z-50 animate-flash';
        videoRef.current.parentElement?.appendChild(flash);
        setTimeout(() => flash.remove(), 200);
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, we'd use MediaRecorder here
  };

  return (
    <div className={`h-full flex flex-col overflow-hidden ${isDark ? 'bg-[#1c1c1c]' : 'bg-zinc-100'}`}>
      {/* Top Bar Controls */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className={`p-2 rounded-full ${isDark ? 'bg-black/40' : 'bg-white/40'} backdrop-blur-md border border-white/10`}>
            {mode === 'photo' ? <CameraIcon size={16} /> : <Video size={16} />}
          </div>
          <span className="text-xs font-medium text-white drop-shadow-md">
            {mode === 'photo' ? 'Photo Mode' : 'Video Mode'}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {[
            { icon: Timer, active: timer > 0, onClick: () => setTimer(t => (t === 0 ? 3 : t === 3 ? 10 : 0)) },
            { icon: Grid, active: gridEnabled, onClick: () => setGridEnabled(!gridEnabled) },
            { icon: Settings, active: showSettings, onClick: () => setShowSettings(!showSettings) }
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.onClick}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                item.active 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : (isDark ? 'bg-black/40 border-white/10 text-white/80 hover:bg-black/60' : 'bg-white/40 border-black/10 text-black/80 hover:bg-white/60')
              }`}
            >
              <item.icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 bg-black flex items-center justify-center group overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover transition-transform duration-500 ${mirror ? 'scale-x-[-1]' : ''}`}
          style={{ filter: `brightness(${brightness}%)` }}
        />

        {/* Grid Overlay */}
        {gridEnabled && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white/20" />
            ))}
          </div>
        )}

        {/* Focus indicator (simulated) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-20 h-20 border border-white/40 rounded-sm scale-110 animate-pulse" />
        </div>

        {/* Side Controls (Capture) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 z-20">
          <div className={`p-1.5 rounded-full flex flex-col gap-1 backdrop-blur-md ${isDark ? 'bg-black/40' : 'bg-white/40'} border border-white/10`}>
            <button 
              onClick={() => setMode('video')}
              className={`p-3 rounded-full transition-all ${mode === 'video' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
            >
              <Video size={20} />
            </button>
            <button 
              onClick={() => setMode('photo')}
              className={`p-3 rounded-full transition-all ${mode === 'photo' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
            >
              <CameraIcon size={20} />
            </button>
          </div>

          <button 
            onClick={mode === 'photo' ? takePhoto : toggleRecording}
            className={`group relative p-1 rounded-full border-4 ${isRecording ? 'border-red-500' : 'border-white'} transition-all active:scale-90`}
          >
            <div className={`w-16 h-16 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-500 scale-75 rounded-lg' 
                : 'bg-white group-hover:scale-95'
            }`} />
            {isRecording && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 text-[10px] font-bold text-white rounded-md flex items-center gap-2 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                REC 00:04:21
              </div>
            )}
          </button>

          <div 
            className="w-14 h-14 rounded-xl border-2 border-white/40 overflow-hidden cursor-pointer hover:border-white transition-all bg-zinc-800"
            onClick={() => {/* Open Gallery */}}
          >
            {capturedImages.length > 0 ? (
              <img src={capturedImages[0]} alt="Last captured" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-40">
                <ImageIcon size={20} className="text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar Settings */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          <button 
            onClick={() => setMirror(!mirror)}
            className={`p-3 rounded-full backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-all`}
            title="Flip Camera"
          >
            <RotateCcw size={18} />
          </button>
          
          {mode === 'video' && (
            <button 
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-3 rounded-full backdrop-blur-md border border-white/10 text-white hover:bg-black/40 transition-all`}
            >
              {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}

          <div className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 bg-black/40`}>
            <Sun size={14} className="text-white/60" />
            <input 
              type="range" 
              min="50" 
              max="150" 
              value={brightness} 
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="w-24 accent-white"
            />
          </div>
        </div>
      </div>

      {/* Settings Panel (Overlay) */}
      {showSettings && (
        <div className="absolute inset-y-0 right-0 w-80 z-30 backdrop-blur-2xl border-l border-white/10 flex flex-col animate-slide-in"
          style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)' }}>
          <div className="p-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-full">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section>
              <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 mb-4">Photo Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Aspect Ratio</span>
                  <select className={`text-xs bg-transparent border rounded px-2 py-1 ${isDark ? 'border-white/20' : 'border-black/20'}`}>
                    <option>16:9</option>
                    <option>4:3</option>
                    <option>1:1</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">HDR</span>
                  <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-3 h-3 bg-white rounded-full shadow-md" />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 mb-4">Video Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quality</span>
                  <span className="text-xs opacity-60">1080p 60fps</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Video stabilization</span>
                  <div className="w-10 h-5 bg-zinc-600 rounded-full flex items-center px-1">
                    <div className="w-3 h-3 bg-white rounded-full shadow-md" />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 mb-4">Storage</h3>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Cloud Storage</span>
                  <span className="text-blue-500">Connected</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[65%]" />
                </div>
                <p className="text-[10px] opacity-40">12.4 GB of 20 GB used</p>
              </div>
            </section>
          </div>
        </div>
      )}

      <style>{`
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.2s ease-out forwards;
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};
