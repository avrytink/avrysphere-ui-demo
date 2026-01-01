
import React, { useEffect, useRef } from 'react';
import { useSphereStore } from '../../store/sphereStore';
import { useOSStore } from '../../store/osStore';
import { useWindowStore } from '../../store/windowStore';
import { useWindow } from '../../components/Window';

export const SwitchToTablet: React.FC = () => {
  const { setIsTablet, setIsMobile, setIsTV, setIsGaming } = useSphereStore();
  const { closeWindow } = useWindowStore();
  const windowContext = useWindow();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    setIsTablet(true);
    setIsMobile(false);
    setIsTV(false);
    setIsGaming(false);
    if (windowContext) {
      setTimeout(() => closeWindow(windowContext.instanceId), 100);
    }
  }, [setIsTablet, setIsMobile, setIsTV, setIsGaming, closeWindow, windowContext]);

  return null;
};

export const SwitchToDesktop: React.FC = () => {
  const { setIsTablet, setIsMobile, setIsTV, setIsGaming } = useSphereStore();
  const { closeWindow } = useWindowStore();
  const windowContext = useWindow();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    setIsTablet(false);
    setIsMobile(false);
    setIsTV(false);
    setIsGaming(false);
    if (windowContext) {
      setTimeout(() => closeWindow(windowContext.instanceId), 100);
    }
  }, [setIsTablet, setIsMobile, setIsTV, setIsGaming, closeWindow, windowContext]);

  return null;
};

export const SwitchToTV: React.FC = () => {
  const { setIsTablet, setIsMobile, setIsTV, setIsGaming } = useSphereStore();
  const { closeEverything } = useOSStore();
  const { closeWindow, minimizeAll } = useWindowStore();
  const windowContext = useWindow();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    closeEverything();
    minimizeAll();
    setIsTV(true);
    setIsTablet(false);
    setIsMobile(false);
    setIsGaming(false);
    if (windowContext) {
      setTimeout(() => closeWindow(windowContext.instanceId), 100);
    }
  }, [setIsTablet, setIsMobile, setIsTV, setIsGaming, closeEverything, minimizeAll, closeWindow, windowContext]);

  return null;
};

export const SwitchToGaming: React.FC = () => {
  const { setIsTablet, setIsMobile, setIsTV, setIsGaming } = useSphereStore();
  const { closeEverything } = useOSStore();
  const { closeWindow, minimizeAll } = useWindowStore();
  const windowContext = useWindow();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    closeEverything();
    minimizeAll();
    setIsGaming(true);
    setIsTV(false);
    setIsTablet(false);
    setIsMobile(false);
    if (windowContext) {
      setTimeout(() => closeWindow(windowContext.instanceId), 100);
    }
  }, [setIsTablet, setIsMobile, setIsTV, setIsGaming, closeEverything, minimizeAll, closeWindow, windowContext]);

  return null;
};
