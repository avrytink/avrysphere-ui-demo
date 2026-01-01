
import React, { useEffect, useMemo } from 'react';
import { useOSStore } from '../../store/osStore';
import { useTopBarStore } from '../../store/topBarStore';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useWindowStore } from '../../store/windowStore';
import { useI18nStore } from '../../store/i18nStore';
import { useSphereStore } from '../../store/sphereStore';
import { useDockStore } from '../../store/dockStore';
import { format } from 'date-fns';
import { DesktopLayout } from '../../types';
import { 
  Wifi, 
  BatteryCharging, 
  Bluetooth,
  Bell
} from 'lucide-react';
import { ConnectedMembersPanel } from './ConnectedMembersPanel';

export const TopBar: React.FC = () => {
  const { 
    theme,
    toggleControlCenter, 
    toggleCalendarOverlay,
    toggleAccountSwitcher,
    toggleMembersPanel,
    membersPanelOpen,
    wifiEnabled,
    bluetoothEnabled,
    batteryLevel,
    isCharging
  } = useOSStore();
  const { toggleNotifications } = useDockStore();
  const { layout, isMobile, isTablet } = useSphereStore();
  const { dateTime, updateDateTime } = useTopBarStore();
  const { currentUser, activeOrgId, loggedInUsers } = useAuthStore();
  const { organizations } = useUserStore();
  const { windows, activeWorkspaceId } = useWindowStore();
  const { getDateLocale } = useI18nStore();

  useEffect(() => {
    const timer = setInterval(() => updateDateTime(), 1000);
    return () => clearInterval(timer);
  }, [updateDateTime]);

  const activeMembers = useMemo(() => {
    if (!activeOrgId) return [];
    const org = organizations.find(o => o.id === activeOrgId);
    if (!org) return [];
    return loggedInUsers.filter(u => org.members.includes(u.id) && u.id !== currentUser?.id);
  }, [activeOrgId, organizations, loggedInUsers, currentUser]);

  const hasMaximizedWindow = useMemo(() => 
    windows.some(w => w.workspaceId === activeWorkspaceId && w.isMaximized && !w.isMinimized),
  [windows, activeWorkspaceId]);

  const isUnity = layout === DesktopLayout.UNITY;
  const isDark = theme === 'dark';
  const locale = getDateLocale();

  const divider = <div className="w-px h-1 bg-white/30 shrink-0 mx-1" />;

  const barBg = useMemo(() => {
    if (hasMaximizedWindow && !isMobile && !isTablet) {
       return 'bg-black border-b border-white/10';
    }
    return isDark 
      ? (isUnity ? 'bg-black/80 border-white/5' : 'bg-gradient-to-b from-black/60 to-transparent')
      : (isUnity ? 'bg-white/80 border-black/5 shadow-sm' : 'bg-gradient-to-b from-white/60 to-transparent');
  }, [isDark, isUnity, hasMaximizedWindow, isMobile, isTablet]);
  
  const textColor = isDark || hasMaximizedWindow ? 'text-white' : 'text-zinc-900';
  const mutedTextColor = isDark || hasMaximizedWindow ? 'text-zinc-400' : 'text-zinc-600';
  const hoverBg = isDark || hasMaximizedWindow ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const toggleColor = isDark || hasMaximizedWindow ? 'bg-zinc-400' : 'bg-zinc-600';

  const BatteryDisplay = () => {
    if (isCharging) {
      return (
        <div className="flex items-center gap-1" title={`${Math.round(batteryLevel * 100)}% Charging`}>
          <BatteryCharging size={16} className={isUnity && !isMobile && !isTablet && !hasMaximizedWindow ? mutedTextColor : 'text-white drop-shadow-md'} />
        </div>
      );
    }
    const levelPercent = batteryLevel * 100;
    const isLow = levelPercent <= 20;
    const fillColor = isLow ? 'bg-red-500' : ((isUnity && !isMobile && !isTablet && !hasMaximizedWindow) ? (isDark ? 'bg-zinc-400' : 'bg-zinc-600') : 'bg-white');
    const batBorderColor = (isUnity && !isMobile && !isTablet && !hasMaximizedWindow) ? (isDark ? 'border-zinc-500' : 'border-zinc-400') : 'border-white/80';
    return (
      <div className="flex items-center gap-2" title={`${Math.round(levelPercent)}%`}>
        <div className="relative flex items-center">
          <div className={`w-[18px] h-[9px] border rounded-[2px] p-[1.5px] ${batBorderColor}`}>
            <div className={`h-full rounded-[0.5px] transition-all duration-500 ${fillColor}`} style={{ width: `${levelPercent}%` }} />
          </div>
          <div className={`w-[2px] h-[3px] -ml-[1px] rounded-r-sm ${(isUnity && !isMobile && !isTablet && !hasMaximizedWindow) ? (isDark ? 'bg-zinc-500' : 'bg-zinc-400') : 'bg-white/80'}`} />
        </div>
      </div>
    );
  };

  if (isMobile || isTablet) {
    return (
      <div className="fixed top-0 left-0 right-0 h-8 bg-transparent z-[1000] flex items-center justify-between px-6 select-none font-bold text-white text-shadow-sm pointer-events-none">
        <div className="text-xs tracking-wide drop-shadow-md">{format(dateTime, 'HH:mm', { locale })}</div>
        <div className="flex items-center gap-2 text-white drop-shadow-md">{wifiEnabled && <Wifi size={14} />}<BatteryDisplay /></div>
      </div>
    );
  }

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 select-none transition-all duration-700 ${isUnity ? 'h-8 backdrop-blur-md border-b' : 'h-14 pt-2'} ${barBg}`}>
        <div className="flex items-center gap-1.5 h-full">
          <div className={`flex items-center gap-2 px-3 h-full cursor-pointer transition-colors rounded-lg ${hoverBg}`} onClick={toggleCalendarOverlay}>
            <span className={`text-sm font-bold transition-colors duration-500 ${isUnity && !hasMaximizedWindow ? mutedTextColor : 'text-white drop-shadow-md'}`}>
              {format(dateTime, 'HH:mm', { locale })}
            </span>
            <span className={`text-sm font-normal transition-colors duration-500 ${isUnity && !hasMaximizedWindow ? (isDark ? 'text-zinc-600' : 'text-zinc-400') : 'text-white/60 drop-shadow-md'}`}>
              {format(dateTime, 'eee dd MMM', { locale })}
            </span>
          </div>
          {divider}
          <div className={`flex items-center px-3 h-full cursor-pointer transition-colors rounded-lg relative group ${hoverBg}`} onClick={toggleNotifications}>
            <Bell size={14} className={`transition-all duration-500 -rotate-[15deg] ${isUnity && !hasMaximizedWindow ? mutedTextColor : 'text-white drop-shadow-md'}`} />
            <div className="ml-1.5 px-1.5 min-w-[1.125rem] h-[1.125rem] flex items-center justify-center bg-red-600 rounded-full text-[9px] font-black text-white shadow-lg border border-black/20">
               2
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 h-full">
          <div className={`flex items-center gap-4 px-4 h-full transition-all duration-500`}>
            {wifiEnabled && <Wifi size={14} className={`transition-colors duration-500 ${isUnity && !hasMaximizedWindow ? mutedTextColor : 'text-white drop-shadow-md'}`} />}
            {bluetoothEnabled && <Bluetooth size={14} className={`transition-colors duration-500 ${isUnity && !hasMaximizedWindow ? mutedTextColor : 'text-white drop-shadow-md'}`} />}
            <BatteryDisplay />
          </div>
          {activeMembers.length > 0 && (
            <>
              {divider}
              <div className={`flex items-center -space-x-2 px-2 py-1 rounded-full cursor-pointer transition-all hover:scale-105 ${membersPanelOpen ? (isDark ? 'bg-white/10' : 'bg-black/10') : ''}`} onClick={toggleMembersPanel}>
                {activeMembers.slice(0, 3).map(user => (
                  <div key={user.id} className={`w-6 h-6 rounded-full border-2 overflow-hidden ${isUnity ? (isDark ? 'border-black' : 'border-white') : 'border-black/20'}`}>
                    <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                  </div>
                ))}
                {activeMembers.length > 3 && (
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${isUnity ? (isDark ? 'border-black bg-zinc-800 text-white' : 'border-white bg-zinc-200 text-black') : 'border-black/20 bg-white/20 backdrop-blur-md text-white'}`}>
                    +{activeMembers.length - 3}
                  </div>
                )}
              </div>
            </>
          )}
          {currentUser && (
            <>
              {divider}
              <div className="flex items-center px-2 h-full cursor-pointer hover:opacity-80 transition-opacity" onClick={toggleAccountSwitcher}>
                <div className={`w-6 h-6 rounded-full overflow-hidden border transition-all duration-500 ${isUnity && !hasMaximizedWindow ? 'border-transparent' : 'border-white/40 shadow-lg'}`}>
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </>
          )}
          {divider}
          <div className={`flex items-center px-4 h-full cursor-pointer transition-colors rounded-lg ${hoverBg}`} onClick={toggleControlCenter}>
            <div className="flex flex-col gap-1">
              <div className={`w-4 h-0.5 rounded-full transition-colors duration-500 ${isUnity && !hasMaximizedWindow ? toggleColor : 'bg-white shadow-sm'}`} />
              <div className={`w-4 h-0.5 rounded-full transition-colors duration-500 ${isUnity && !hasMaximizedWindow ? toggleColor : 'bg-white shadow-sm'}`} />
            </div>
          </div>
        </div>
      </div>
      <ConnectedMembersPanel />
    </>
  );
};
