
import React, { useEffect, useRef, useState } from 'react';
import { useOSStore } from './store/osStore';
import { useSphereStore } from './store/sphereStore';
import { useAuthStore } from './store/authStore';
import { useMediaStore } from './store/mediaStore';
import { AuthScreen } from './components/AuthScreen';
import { BootScreen } from './components/BootScreen';
import { SphereSpace } from './components/SphereSpace';

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const { theme, accentColor, brightness, volume, setSettings, setBatteryStatus } = useOSStore();
  const { setIsMobile, setIsTablet, setIsTV, setIsGaming } = useSphereStore();
  const { isAuthenticated, isLocked, lockSession, currentUser } = useAuthStore();
  const { isPlaying, currentTrack, volume: mediaVolume, updateProgress, setPlaying } = useMediaStore();

  const inactivityTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  // Handle Battery Status
  useEffect(() => {
    let battery: any;
    const updateBattery = () => {
      if (battery) setBatteryStatus(battery.level, battery.charging);
    };
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((b: any) => {
        battery = b;
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch((err: any) => {
        console.warn("Battery status API not accessible:", err);
      });
    }
    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', updateBattery);
        battery.removeEventListener('chargingchange', updateBattery);
      }
    };
  }, [setBatteryStatus]);

  // Handle Responsive Logic
  useEffect(() => {
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const width = window.innerWidth;
        const mobile = width < 768;
        const sphereState = useSphereStore.getState();
        
        if (mobile !== sphereState.isMobile) {
          setIsMobile(mobile);
          if (mobile) {
             setIsTablet(false);
             setIsTV(false);
             setIsGaming(false);
          }
        }

        if (width >= 768 && width <= 1024 && !sphereState.isTablet && !sphereState.isTV && !sphereState.isGaming) {
           setIsTablet(true);
        }
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile, setIsTablet]); 

  // Sync user settings on login or profile change - BREAK THE LOOP
  useEffect(() => {
    if (isAuthenticated && currentUser?.settings) {
      const s = currentUser.settings;
      const os = useOSStore.getState();
      
      // Only call setSettings if the values are actually different to prevent Error #185
      const hasChanged = 
        s.theme !== os.theme || 
        s.accentColor !== os.accentColor || 
        s.brightness !== os.brightness || 
        s.volume !== os.volume;

      if (hasChanged) {
        setSettings({
          theme: s.theme,
          accentColor: s.accentColor,
          brightness: s.brightness,
          volume: s.volume
        });
      }
    }
  }, [isAuthenticated, currentUser?.id, currentUser?.settings?.theme, currentUser?.settings?.accentColor]);

  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 1500); 
    return () => clearTimeout(timer);
  }, []);

  // Media Engine
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = Math.max(0, Math.min(1, mediaVolume / 100));
    if (currentTrack.uri && currentTrack.uri !== audio.src) {
        audio.src = currentTrack.uri;
        if (isPlaying) audio.play().catch(() => setPlaying(false));
    } else if (!currentTrack.uri) {
        audio.pause();
        audio.src = '';
    }
    if (isPlaying && currentTrack.uri && audio.paused) {
        audio.play().catch(() => setPlaying(false));
    } else if (!isPlaying && !audio.paused) {
        audio.pause();
    }
    let interval: number;
    if (isPlaying && !currentTrack.uri) {
      interval = window.setInterval(() => updateProgress(), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.uri, mediaVolume, updateProgress, setPlaying]);

  // Inactivity Lock
  useEffect(() => {
    if (!isAuthenticated || isLocked || isBooting) return;
    const resetTimer = () => {
      if (inactivityTimerRef.current) window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = window.setTimeout(() => lockSession(), 10 * 60 * 1000);
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      if (inactivityTimerRef.current) window.clearTimeout(inactivityTimerRef.current);
    };
  }, [isAuthenticated, isLocked, isBooting, lockSession]);

  if (isBooting) return <BootScreen ready={appReady} onComplete={() => setIsBooting(false)} />;
  if (!isAuthenticated || isLocked) return <AuthScreen />;
  return <SphereSpace />;
};

export default App;
