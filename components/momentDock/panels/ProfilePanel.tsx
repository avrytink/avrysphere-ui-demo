import React from "react";
import {
  User as UserIcon,
  LogOut,
  Shield,
  Settings,
  X,
  ChevronRight,
  Bell,
  CreditCard,
} from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import { useUserStore } from "../../../store/userStore";
import { useOSStore } from "../../../store/osStore";
import { useDockStore } from "../../../store/dockStore";
import { useSphereStore } from "../../../store/sphereStore";
import { DesktopLayout } from "../../../types";

export const ProfilePanel: React.FC = () => {
  const { logout } = useAuthStore();
  const { currentUser } = useUserStore();
  const { theme } = useOSStore();
  const { layout } = useSphereStore();
  const { toggleProfile } = useDockStore();

  const isDark = theme === "dark";
  const isUnity = layout === DesktopLayout.UNITY;

  if (!currentUser) return null;

  // Drawer Theme Styles
  const panelBg = isDark
    ? "bg-zinc-950/75 border-white/10"
    : "bg-white/75 border-zinc-200";
  const textPrimary = isDark ? "text-white" : "text-zinc-900";
  const textSecondary = isDark ? "text-zinc-400" : "text-zinc-600";
  const itemBg = isDark
    ? "bg-white/5 border-white/5 hover:bg-white/10"
    : "bg-black/5 border-black/5 hover:bg-black/10";
  const borderColor = isDark ? "border-white/10" : "border-black/10";

  return (
    <div
      className={`
        fixed w-[420px] gap-4 rounded-[1.5rem] backdrop-blur-3xl border-l z-[5000] p-6 flex flex-col shadow-2xl animate-in duration-300
        ${panelBg}
          
        ${
          isUnity
            ? "left-[calc(80px+1rem)] top-4 bottom-4 slide-in-from-left"
            : "right-[calc(1rem)] top-16 bottom-4 slide-in-from-right"
        }
      `}
    >
      {/* Header */}
      <div
        className={`h-20 px-8 flex items-center justify-between border-b ${borderColor}`}
      >
        <h2
          className={`text-xs font-black uppercase tracking-[0.3em] ${textSecondary}`}
        >
          Identity Profile
        </h2>
        <button
          onClick={toggleProfile}
          className={`p-2 rounded-full transition-colors ${itemBg}`}
        >
          <X size={16} className={textSecondary} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-6">
            <div
              className={`w-28 h-28 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-500 ${
                isDark ? "border-zinc-800" : "border-white"
              }`}
            >
              <img
                src={currentUser.avatar}
                className="w-full h-full object-cover"
                alt={currentUser.name}
              />
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-zinc-950 shadow-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          <h2 className={`text-2xl font-black tracking-tighter ${textPrimary}`}>
            {currentUser.name}
          </h2>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${textSecondary}`}
          >
            {currentUser.email}
          </p>

          <div
            className={`flex items-center gap-2 mt-6 px-4 py-1.5 rounded-full border ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-black/5 border-black/5"
            }`}
          >
            <Shield size={12} className="text-blue-500" />
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}
            >
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3
              className={`text-[9px] font-black uppercase tracking-[0.3em] ml-2 mb-3 ${textSecondary}`}
            >
              Identity Hub
            </h3>
            {[
              {
                icon: UserIcon,
                label: "Personal Info",
                color: "text-blue-500",
              },
              { icon: Settings, label: "Preferences", color: "text-zinc-500" },
              { icon: Bell, label: "Signals", color: "text-orange-500" },
              {
                icon: CreditCard,
                label: "Subscriptions",
                color: "text-purple-500",
              },
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center justify-between p-4 border rounded-2xl transition-all group ${itemBg}`}
              >
                <div className="flex items-center gap-4">
                  <item.icon
                    size={16}
                    className={`${item.color} group-hover:scale-110 transition-transform`}
                  />
                  <span
                    className={`text-xs font-bold ${textSecondary} group-hover:${textPrimary}`}
                  >
                    {item.label}
                  </span>
                </div>
                <ChevronRight size={14} className="opacity-20" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-8 border-t ${borderColor} bg-black/5`}>
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-3 py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <LogOut size={14} />
          Decommission Session
        </button>
      </div>
    </div>
  );
};
