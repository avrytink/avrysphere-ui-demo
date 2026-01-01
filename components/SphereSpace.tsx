
import React from 'react';
import { useSphereStore } from '../store/sphereStore';
import { DesktopLayout } from './layouts/DesktopLayout';
import { MobileLayout } from './layouts/MobileLayout';
import { TabletLayout } from './tablet/TabletLayout';
import { TVLayout } from './tv/TVLayout';
import { GamingLayout } from './gaming/GamingLayout';

export const SphereSpace: React.FC = () => {
  const { isMobile, isTablet, isTV, isGaming } = useSphereStore();

  if (isGaming) return <GamingLayout />;
  if (isTV) return <TVLayout />;
  if (isMobile) return <MobileLayout />;
  if (isTablet) return <TabletLayout />;
  
  return <DesktopLayout />;
};
