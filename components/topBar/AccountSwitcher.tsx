import React, { useMemo } from "react";
import { useAuthStore } from "../../store/authStore";
import { useUserStore } from "../../store/userStore";
import { useOSStore } from "../../store/osStore";
import { useSphereStore } from "../../store/sphereStore";
import { useAuthUIStore } from "../../store/authUIStore";
import { DesktopLayout } from "../../types";
import {
  Plus,
  RefreshCcw,
  LogOut,
  CheckCircle2,
  UserPlus,
  Fingerprint,
  Activity,
  Check,
} from "lucide-react";

export const AccountSwitcher: React.FC = () => {
  const { accountSwitcherOpen, toggleAccountSwitcher, closeEverything, theme } =
    useOSStore();
  const {
    currentUser,
    loggedInUsers,
    switchAccount,
    switchOrganization,
    activeOrgId,
    logout,
    lockSession,
  } = useAuthStore();
  const { setIsAddingAccount, setSelectedUser } = useAuthUIStore();
  const { getUserOrganizations, mockUsers } = useUserStore();
  const { layout } = useSphereStore();

  const isDark = theme === "dark";
  const isUnity = layout === DesktopLayout.UNITY;

  // Enhanced Contrast Styles
  const panelBg = isDark
    ? "bg-zinc-900/75 border-white/10"
    : "bg-white/75 border-white/40";
  const cardBg = isDark
    ? "bg-white/5 border-white/5 hover:border-white/20"
    : "bg-white/60 border-white/40 hover:bg-white/80 hover:border-white/60";
  const textPrimary = isDark ? "text-white" : "text-zinc-900";
  const textSecondary = isDark ? "text-zinc-400" : "text-zinc-600";
  const iconColor = isDark ? "text-zinc-500" : "text-zinc-500";

  const userOrgs = useMemo(
    () => (currentUser ? getUserOrganizations(currentUser.id) : []),
    [currentUser, getUserOrganizations]
  );

  if (!accountSwitcherOpen) return null;

  const handleProvisionNew = () => {
    lockSession();
    setIsAddingAccount(true);
    setSelectedUser(null as any);
    closeEverything();
  };

  const handleSwitch = (userId: string) => {
    const targetUser = loggedInUsers.find((u) => u.id === userId);
    if (targetUser) {
      switchAccount(userId, targetUser.organizationIds[0]);
      toggleAccountSwitcher();
    }
  };

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
      <div className="flex flex-col gap-8 flex-1 overflow-y-auto no-scrollbar">
        {/* Account Slider */}
        <div className="px-1 pt-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xs font-bold ${textSecondary}`}>
              Identity Hub
            </h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500">
                Secure
              </span>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 items-start">
            {loggedInUsers.map((user) => {
              const isActive = user.id === currentUser?.id;
              return (
                <button
                  key={user.id}
                  onClick={() => !isActive && handleSwitch(user.id)}
                  className={`flex flex-col items-center gap-2 group flex-shrink-0 transition-all ${
                    !isActive ? "opacity-60 hover:opacity-100" : ""
                  }`}
                >
                  <div
                    className={`relative w-16 h-16 rounded-[1.2rem] p-0.5 transition-all duration-300 ${
                      isActive
                        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-black"
                        : "hover:scale-105"
                    }`}
                  >
                    <div className="w-full h-full rounded-[1rem] overflow-hidden border border-white/10">
                      <img
                        src={user.avatar}
                        className="w-full h-full object-cover"
                        alt={user.name}
                      />
                    </div>
                    {isActive && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 border-2 border-zinc-950 shadow-xl">
                        <CheckCircle2 size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center w-20">
                    <span
                      className={`text-[10px] font-bold truncate w-full text-center ${
                        isActive ? textPrimary : textSecondary
                      }`}
                    >
                      {user.name}
                    </span>
                    <span
                      className={`text-[8px] font-medium uppercase tracking-wider truncate w-full text-center ${textSecondary}`}
                    >
                      {user.role}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Add Account Button */}
            <button
              onClick={handleProvisionNew}
              className="flex flex-col items-center gap-2 group flex-shrink-0"
            >
              <div
                className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center border-2 border-dashed transition-all ${
                  isDark
                    ? "border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800"
                    : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100"
                }`}
              >
                <Plus size={24} className={textSecondary} />
              </div>
              <div className="flex flex-col items-center w-20">
                <span className={`text-[10px] font-bold ${textSecondary}`}>
                  Add
                </span>
                <span
                  className={`text-[8px] font-medium uppercase tracking-wider opacity-0 ${textSecondary}`}
                >
                  New
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Organization List (Vertical) */}
        {userOrgs.length > 0 && (
          <div className="px-1 flex-1">
            <h2 className={`text-xs font-bold mb-4 ${textSecondary}`}>
              Organizations
            </h2>
            <div className="flex flex-col gap-3">
              {userOrgs.map((org) => {
                const owner = mockUsers.find((u) => u.id === org.ownerId);
                const bgImage =
                  owner?.background || "https://i.imgur.com/zJ4iCUp.jpeg";
                const isActive = activeOrgId === org.id;

                return (
                  <button
                    key={org.id}
                    onClick={() => switchOrganization(org.id)}
                    className={`
                      relative w-full h-20 rounded-2xl overflow-hidden shrink-0 border transition-all group
                      ${
                        isActive
                          ? "border-blue-600 ring-1 ring-blue-600/30 shadow-lg"
                          : isDark
                          ? "border-white/10 hover:border-white/30"
                          : "border-zinc-200 hover:border-zinc-400"
                      }
                    `}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${bgImage}')` }}
                    />
                    <div
                      className={`absolute inset-0 transition-colors duration-300 ${
                        isActive
                          ? "bg-blue-900/80"
                          : "bg-black/60 group-hover:bg-black/50"
                      }`}
                    />

                    <div className="absolute inset-0 p-4 flex items-center justify-between">
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-bold text-white uppercase tracking-wider truncate drop-shadow-md text-left">
                          {org.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive
                                ? "bg-blue-400 animate-pulse"
                                : "bg-white/50"
                            }`}
                          />
                          <span className="text-[10px] text-white/80 font-medium">
                            {isActive ? "Active Session" : "Switch Context"}
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <div className="bg-blue-600 rounded-full p-1.5 shadow-lg">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-1 pt-4 mt-auto border-t border-white/5">
        <button
          onClick={() => {
            logout(currentUser?.id);
            toggleAccountSwitcher();
          }}
          className="w-full flex items-center justify-between px-5 py-4 bg-blue-600/5 hover:bg-blue-600/10 border border-blue-600/10 rounded-2xl transition-all group active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600/10 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <LogOut
                size={16}
                className="text-blue-500 group-hover:text-white"
              />
            </div>
            <span className="text-xs font-bold text-blue-500/80 group-hover:text-blue-500">
              Decommission Shell
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
