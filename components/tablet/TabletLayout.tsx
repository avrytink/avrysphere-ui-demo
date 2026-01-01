
import React, { useRef } from 'react';
import { useOSStore } from '../../store/osStore';
import { useAuthStore } from '../../store/authStore';
import { useWindowStore } from '../../store/windowStore';
import { useDockStore } from '../../store/dockStore';
import { AppId, DesktopLayout as DesktopLayoutType } from '../../types';
import { APP_REGISTRY } from '../../registry/AppRegistry';
import { TopBar } from '../topBar/TopBar';
import { TabletDock } from './TabletDock'; 
import { Window } from '../Window';
import { Spotlight } from '../topBar/Spotlight';
import { ControlCenter } from '../topBar/ControlCenter';
import { CalendarOverlay } from '../topBar/CalendarOverlay';
import { AccountSwitcher } from '../topBar/AccountSwitcher';
import { WindowSwitcher } from '../WindowSwitcher';
import { WorkspaceSwitcher } from '../WorkspaceSwitcher';
import { TabletHomeScreen } from './TabletHomeScreen';
import { LauncherPanel } from '../momentDock/LauncherPanel';
import { MobileNavBar } from '../mobile/MobileNavBar';

export const TabletLayout: React.FC = () => {
  const { brightness, switcherOpen, closeEverything } = useOSStore();
  const { currentUser } = useAuthStore();
  const { windows, activeWorkspaceId, workspaces, blurWindows, minimizeAll } = useWindowStore();
  const { launcherOpen, setWorkspacePanelOpen } = useDockStore();

  const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);
  const desktopBackground = activeWorkspace?.background || currentUser?.background || 'https://i.imgur.com/zJ4iCUp.jpeg';
  const activeWorkspaceWindows = windows.filter(w => w.workspaceId === activeWorkspaceId);
  
  // Show Home Screen if no windows are open, or if windows are open but minimized
  const showHomeScreen = activeWorkspaceWindows.length === 0 || activeWorkspaceWindows.every(w => w.isMinimized);

  const touchStartY = useRef<number | null>(null);

  // Background Swipe Handlers (e.g. 2-finger swipe on wallpaper)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY; // Positive is Swipe Up

      // Threshold for swipe up on background (Workspace Overview)
      if (diff > 80) {
        setWorkspacePanelOpen(true);
      }
      touchStartY.current = null;
    }
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      blurWindows();
      closeEverything();
    }
  };

  const renderAppContent = (appId: AppId) => {
    const appDef = APP_REGISTRY[appId];
    if (!appDef) return null;
    const AppComponent = appDef.component;
    return <AppComponent />;
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-black relative animate-in fade-in duration-1000 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 cursor-default"
        style={{ backgroundImage: `url('${desktopBackground}')` }}
        onClick={handleDesktopClick}
      />
      
      {/* Tablet Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] z-[1]" />

      {/* Hardware Brightness */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9990] bg-black transition-opacity duration-300"
        style={{ opacity: (100 - brightness) / 100 * 0.95 }}
      />

      <TopBar />
      
      {/* Tablet Home Screen Layer - Only visible when "at home" */}
      {showHomeScreen && !launcherOpen && <TabletHomeScreen />}

      {/* Tablet Dock - Handles its own visibility based on window state, but we only render it here */}
      <TabletDock />
      
      {/* Centered Launcher for Tablet */}
      {launcherOpen && (
        <div className="fixed inset-x-0 bottom-32 z-[2000] flex justify-center">
           <LauncherPanel />
        </div>
      )}
      
      <Spotlight />
      <ControlCenter />
      <CalendarOverlay />
      <AccountSwitcher />
      <WorkspaceSwitcher />
      <WindowSwitcher />

      {/* Window Layer - Positioned to start at top (under translucent bar). 
          Bottom varies: 32 (above dock) when at home, 0 (full height) when app is open (dock hides). 
      */}
      <main 
        className={`fixed inset-0 top-0 overflow-hidden transition-all duration-700 ${showHomeScreen ? 'bottom-32' : 'bottom-0'}`}
        onClick={handleDesktopClick}
        style={{ 
          pointerEvents: switcherOpen ? 'none' : 'auto',
          // When windows are open, backdrop is darker to focus on content
          backgroundColor: !showHomeScreen ? 'rgba(0,0,0,0.2)' : 'transparent',
          backdropFilter: !showHomeScreen ? 'blur(10px)' : 'none'
        }}
      >
        {activeWorkspaceWindows.map((win) => (
          <Window key={win.instanceId} window={win}>
            {renderAppContent(win.appId)}
          </Window>
        ))}
      </main>

      {/* Unified Gesture Bar */}
      <MobileNavBar />
    </div>
  );
};
