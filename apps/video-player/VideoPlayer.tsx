
import React, { useEffect, useRef } from 'react';
import Plyr, { APITypes } from 'plyr-react';
import { useMediaStore } from '../../store/mediaStore';
import { useOSStore } from '../../store/osStore';

// Note: Ensure Plyr CSS is imported in index.html for correct styling.

const SAMPLE_VIDEO = {
  type: 'video',
  sources: [
    {
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
      type: 'video/mp4',
      size: 720,
    },
    {
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4',
      type: 'video/mp4',
      size: 1080,
    },
  ],
  poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
};

const METADATA = {
  id: 'video-blue-moon',
  title: 'View From A Blue Moon',
  artist: 'Brain Farm',
  album: 'Video Player',
  cover: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
  duration: '04:12', // Estimated duration for this trailer
  isLive: false,
};

export const VideoPlayer: React.FC = () => {
  const { setTrack, setPlaying, isPlaying, togglePlay } = useMediaStore();
  const playerRef = useRef<APITypes>(null);

  // Sync Global State -> Player
  useEffect(() => {
    // When the component mounts, tell the global store about this track
    setTrack(METADATA);
    
    // Cleanup on unmount (pause global media if we close window)
    return () => {
      setPlaying(false);
    };
  }, []);

  // Sync Global Play/Pause Control (Dock/TopBar) -> Player
  useEffect(() => {
    const plyr = playerRef.current?.plyr;
    if (plyr && typeof plyr.play === 'function' && typeof plyr.pause === 'function') {
      if (isPlaying && plyr.paused) {
        // Handle promise to avoid Uncaught Rejection in restricted environments
        const playPromise = plyr.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn("Video playback blocked by browser:", error);
            setPlaying(false);
          });
        }
      } else if (!isPlaying && !plyr.paused) {
        plyr.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Plyr Instance */}
      <div className="w-full h-full">
        <Plyr
          ref={playerRef}
          source={SAMPLE_VIDEO as any}
          options={{
            autoplay: true,
            controls: [
              'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'
            ],
            hideControls: true, // Auto hide
          }}
          onPlay={() => {
             // Sync Player -> Global State
             setPlaying(true);
             setTrack(METADATA); 
          }}
          onPause={() => {
             // Sync Player -> Global State
             setPlaying(false);
          }}
        />
      </div>
    </div>
  );
};
