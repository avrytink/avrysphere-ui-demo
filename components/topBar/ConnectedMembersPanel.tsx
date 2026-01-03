import React from "react";
import { useOSStore } from "../../store/osStore";
import { useAuthStore } from "../../store/authStore";
import { useUserStore } from "../../store/userStore";
import { useSphereStore } from "../../store/sphereStore";
import { DesktopLayout } from "../../types";
import { Building2, X } from "lucide-react";

export const ConnectedMembersPanel: React.FC = () => {
  const { membersPanelOpen, theme, toggleMembersPanel } = useOSStore();
  const { activeOrgId, loggedInUsers, currentUser } = useAuthStore();
  const { organizations } = useUserStore();
  const { layout, setLayout } = useSphereStore();

  const isDark = theme === "dark";
  const isUnity = layout === DesktopLayout.UNITY;

  if (!membersPanelOpen || !activeOrgId) return null;

  const currentOrg = organizations.find((o) => o.id === activeOrgId);
  const activeMembers = loggedInUsers.filter(
    (u) => currentOrg?.members.includes(u.id) && u.id !== currentUser?.id
  );

  // Styles
  const panelBg = isDark
    ? "bg-zinc-900/95 border-white/10"
    : "bg-white/95 border-white/40";
  const textPrimary = isDark ? "text-white" : "text-zinc-900";
  const textSecondary = isDark ? "text-zinc-400" : "text-zinc-600";
  const cardBg = isDark
    ? "bg-white/5 border-white/5"
    : "bg-white/40 border-white/40";

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
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Building2 size={16} className={textSecondary} />
          <span
            className={`text-xs font-bold uppercase tracking-widest ${textPrimary}`}
          >
            {currentOrg?.name}
          </span>
        </div>
        <button
          onClick={toggleMembersPanel}
          className={`p-1 rounded-full hover:bg-white/10 ${textSecondary}`}
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
        <div
          className={`text-[10px] font-bold uppercase tracking-[0.2em] ${textSecondary}`}
        >
          Online Members
        </div>
        {activeMembers.length === 0 && (
          <div className={`text-[10px] italic py-2 px-2 ${textSecondary}`}>
            No other members online
          </div>
        )}
        {activeMembers.map((member) => (
          <div
            key={member.id}
            className={`flex items-center gap-3 p-3 rounded-2xl border ${cardBg}`}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={member.avatar}
                  className="w-full h-full object-cover"
                  alt={member.name}
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-bold ${textPrimary}`}>
                {member.name}
              </span>
              <span
                className={`text-[9px] font-medium uppercase ${textSecondary}`}
              >
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
