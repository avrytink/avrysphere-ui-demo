
import React from 'react';
import { useOSStore } from '../../store/osStore';
import { useAuthStore } from '../../store/authStore';
import { useWindowStore } from '../../store/windowStore';
import { useDockStore } from '../../store/dockStore';
import { AppId } from '../../types';
import { APP_REGISTRY } from '../../registry/AppRegistry';
import { TopBar } from '../topBar/TopBar';
import { Window } from '../Window';
import { WindowSwitcher } from '../WindowSwitcher';
import { MobileNavBar } from '../mobile/MobileNavBar';
import { MobileHomeScreen } from '../mobile/MobileHomeScreen';
import { MobileLauncher } from '../mobile/MobileLauncher';

export const MobileLayout: React.FC = () => {
  const { brightness, switcherOpen } = useOSStore();
  const { currentUser } = useAuthStore();
  const { windows, activeWorkspaceId, workspaces, blurWindows } = useWindowStore();
  const { launcherOpen } = useDockStore();

  const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);
  const desktopBackground = activeWorkspace?.background || currentUser?.background || 'https://i.imgur.com/zJ4iCUp.jpeg';
  const activeWorkspaceWindows = windows.filter(w => w.workspaceId === activeWorkspaceId);

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      blurWindows();
    }
  };

  const renderAppContent = (appId: AppId) => {
    const appDef = APP_REGISTRY[appId];
    if (!appDef) {
      return (
        <div className="p-20 text-center flex flex-col items-center justify-center h-full gap-4">
          <div className="text-red-600 text-4xl font-black uppercase tracking-widest opacity-20">System Error</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-[1em]">Missing Modality: {appId}</div>
        </div>
      );
    }
    const AppComponent = appDef.component;
    return <AppComponent />;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative animate-in fade-in duration-1000">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 cursor-default"
        style={{ backgroundImage: `url('${desktopBackground}')` }}
        onClick={handleDesktopClick}
      />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-[2000] opacity-10" />
      
      {/* Hardware Brightness Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-[9990] bg-black transition-opacity duration-300"
        style={{ opacity: (100 - brightness) / 100 * 0.95 }}
      />

      <TopBar />
      
      {/* Mobile Home Screen Layer */}
      {!launcherOpen && <MobileHomeScreen />}

      {/* Dock / Launchers */}
      {launcherOpen && <MobileLauncher />}
      
      <MobileNavBar />
      
      <WindowSwitcher />

      <main 
        className="fixed top-0 bottom-0 left-0 right-0 z-[50] overflow-hidden transition-all duration-700"
        onClick={handleDesktopClick}
        style={{ pointerEvents: switcherOpen ? 'none' : 'none' }} 
      >
        {activeWorkspaceWindows.map((win) => (
          <Window key={win.instanceId} window={win}>
            {renderAppContent(win.appId)}
          </Window>
        ))}
      </main>
    </div>
  );
};
