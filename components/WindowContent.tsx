import React, { memo } from "react";
import { WindowState } from "../types";
import { WindowContext } from "./Window";

export const WindowContent = memo(({ children, win, isFloating }: { children: React.ReactNode, win: WindowState, isFloating?: boolean }) => {
  return (
    <div className={`flex-1 overflow-hidden relative z-[10] ${
      win.isMaximized ? "rounded-none" : isFloating ? "rounded-[1.25rem]" : "rounded-b-[1.25rem]"
    }`}>
      <WindowContext.Provider value={win}>
        {children}
      </WindowContext.Provider>
    </div>
  );
});
