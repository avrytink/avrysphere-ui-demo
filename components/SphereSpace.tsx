
import React, { useMemo } from 'react';
import { useSphereStore } from '../store/sphereStore';
import { DesktopLayout } from './layouts/desktop/DesktopLayout';
import { MobileLayout } from './layouts/mobile/MobileLayout';
import { TabletLayout } from './layouts/tablet/TabletLayout';
import { TVLayout } from './layouts/tv/TVLayout';
import { GamingLayout } from './layouts/gaming/GamingLayout';
import { OSMode } from '../types';

export const SphereSpace: React.FC = () => {
  const mode = useSphereStore(state => state.mode);

  const Layout = useMemo(() => {
    switch (mode) {
      case OSMode.GAMING: return GamingLayout;
      case OSMode.TV: return TVLayout;
      case OSMode.MOBILE: return MobileLayout;
      case OSMode.TABLET: return TabletLayout;
      default: return DesktopLayout;
    }
  }, [mode]);

  return (
    <div key={mode} className="h-screen w-screen overflow-hidden animate-in fade-in zoom-in-105 duration-1000">
      <Layout />
    </div>
  );
};
