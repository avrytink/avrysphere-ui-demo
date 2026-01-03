import React, { useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { useAuthUIStore } from "../store/authUIStore";
import {
  ChevronRight,
  Lock,
  Power,
  Mail,
  Loader2,
  Sparkles,
  Plus,
  ShieldCheck,
  Building2,
} from "lucide-react";

// Hook for mouse drag scrolling
const useDragScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    isDragging.current = false;
    if (ref.current) {
      startX.current = e.pageX - ref.current.offsetLeft;
      scrollLeft.current = ref.current.scrollLeft;
    }
  };

  const onMouseLeave = () => {
    isDown.current = false;
    isDragging.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
    // Delay reset so click handlers can check flag
    setTimeout(() => {
      isDragging.current = false;
    }, 10);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Speed
    if (Math.abs(x - startX.current) > 5) {
      isDragging.current = true;
    }
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  const onClick = (cb: () => void) => (e: React.MouseEvent) => {
    if (!isDragging.current) cb();
  };

  return {
    ref,
    events: { onMouseDown, onMouseLeave, onMouseUp, onMouseMove },
    onClick,
  };
};

export const AuthScreen: React.FC = () => {
  const { mockUsers, getUserOrganizations } = useUserStore();
  const {
    isAuthenticated,
    isLocked,
    unlockSession,
    currentUser,
    loggedInUsers,
    powerDown,
    login,
  } = useAuthStore();

  const {
    selectedUser,
    setSelectedUser,
    selectedOrgId,
    setSelectedOrgId,
    emailInput,
    setEmailInput,
    passwordInput,
    setPasswordInput,
    isAddingAccount,
    setIsAddingAccount,
    isEntering,
    completeEntrance,
    isSendingLink,
    linkSent,
    requestMagicLink,
    error,
    triggerError,
  } = useAuthUIStore();

  const userDock = useDragScroll();
  const orgSlider = useDragScroll();

  useEffect(() => {
    const entranceTimer = setTimeout(() => completeEntrance(), 600);

    // Automatically determine starting state if not set
    if (!selectedUser && !isAddingAccount) {
      if (isAuthenticated && currentUser) {
        setSelectedUser(currentUser);
        setSelectedOrgId(useAuthStore.getState().activeOrgId);
      } else if (loggedInUsers.length > 0) {
        const lastUser = loggedInUsers[0];
        setSelectedUser(lastUser);
        setSelectedOrgId(
          lastUser.lastActiveOrgId || lastUser.organizationIds[0]
        );
      } else {
        setIsAddingAccount(true);
      }
    }

    return () => clearTimeout(entranceTimer);
  }, [
    isAuthenticated,
    currentUser,
    loggedInUsers,
    mockUsers,
    selectedUser,
    setSelectedUser,
    setIsAddingAccount,
    completeEntrance,
    isAddingAccount,
    setSelectedOrgId,
  ]);

  // Compute organizations for the selected user
  const userOrgs = useMemo(() => {
    if (!selectedUser) return [];
    return getUserOrganizations(selectedUser.id);
  }, [selectedUser, getUserOrganizations]);

  // Fallback: If user has only 1 org and we haven't selected one yet, select it automatically
  useEffect(() => {
    if (
      selectedUser &&
      userOrgs.length === 1 &&
      !selectedOrgId &&
      !isAddingAccount
    ) {
      setSelectedOrgId(userOrgs[0].id);
    }
  }, [
    selectedUser,
    userOrgs,
    selectedOrgId,
    isAddingAccount,
    setSelectedOrgId,
  ]);

  const handleMagicLinkRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSendingLink) return;

    const foundUser = mockUsers.find(
      (u) => u.email.toLowerCase() === emailInput.trim().toLowerCase()
    );
    if (!foundUser) {
      triggerError();
      return;
    }
    requestMagicLink(foundUser);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && passwordInput === selectedUser.password) {
      if (isAuthenticated && isLocked) {
        unlockSession();
      } else if (selectedOrgId) {
        login(selectedUser, selectedOrgId);
      } else {
        triggerError();
      }
    } else {
      triggerError();
      setPasswordInput("");
    }
  };

  const isLoginMode = isAddingAccount;
  const showUserDock = !isLoginMode;
  const backgroundUrl =
    selectedUser?.background || "https://i.imgur.com/zJ4iCUp.jpeg";
  const showPasswordInput = selectedUser && !isLoginMode;

  return (
    <div className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-black overflow-hidden font-sans select-none">
      {/* Neural Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 blur-xl scale-110 pointer-events-none opacity-40 grayscale-[0.2]"
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black pointer-events-none z-[1]" />

      <div
        className={`relative z-10 w-full flex flex-col items-center transition-all duration-1000 ease-out ${
          isEntering ? "opacity-0 translate-y-12" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Header */}
        {!selectedUser && (
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
            avryOS
          </h1>
        )}

        {/* User Dock - Slider System */}
        {showUserDock && (
          <div className="w-full max-w-6xl px-8 mb-0">
            <div
              ref={userDock.ref}
              {...userDock.events}
              className="flex items-end justify-center gap-8 overflow-x-auto no-scrollbar pt-12 pb-2 px-4 snap-x min-h-[160px] cursor-grab active:cursor-grabbing"
            >
              {loggedInUsers.map((user) => {
                const isSelected = selectedUser?.id === user.id;

                // Name processing logic: First word only, truncate if > 8 chars
                const firstName = user.name.split(" ")[0];
                const displayName =
                  firstName.length > 8
                    ? `${firstName.slice(0, 8)}...`
                    : firstName;

                return (
                  <div
                    key={user.id}
                    onClick={userDock.onClick(() => {
                      setSelectedUser(user);
                      setSelectedOrgId(
                        user.lastActiveOrgId || user.organizationIds[0]
                      );
                    })}
                    className={`relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col items-center group snap-center shrink-0 ${
                      isSelected
                        ? "scale-100 z-10 opacity-100"
                        : "scale-90 opacity-50 hover:opacity-100"
                    }`}
                  >
                    {/* Name - Updated Typography & Logic */}
                    <div
                      className={`absolute -top-8 text-[12px] font-normal text-white tracking-wide whitespace-nowrap transition-all duration-500 ${
                        isSelected
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                      }`}
                    >
                      {displayName}
                    </div>

                    <div
                      className={`w-24 h-24 rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 shadow-2xl ${
                        isSelected
                          ? "border-white ring-4 ring-white/10 shadow-white/10"
                          : "border-white/10 group-hover:border-white/30"
                      }`}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </div>
                  </div>
                );
              })}

              <button
                onClick={userDock.onClick(() => setIsAddingAccount(true))}
                className="w-24 h-24 rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-white/40 hover:bg-white/5 border-white/10 snap-center shrink-0 group active:scale-95 scale-90 opacity-50 hover:opacity-100"
              >
                <Plus size={24} className="mb-1" />
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100">
                  Add
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Organization Slider (Contextual below selected user) - Modernized & Aligned */}
        {selectedUser && !isLoginMode && userOrgs.length > 0 && (
          <div className="w-full max-w-6xl px-8 mt-2 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div
              ref={orgSlider.ref}
              {...orgSlider.events}
              className="flex items-start justify-center gap-4 overflow-x-auto no-scrollbar px-4 py-2 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
            >
              {userOrgs.map((org) => {
                const isActive = selectedOrgId === org.id;
                const owner = mockUsers.find((u) => u.id === org.ownerId);
                const bgImage =
                  owner?.background || "https://i.imgur.com/zJ4iCUp.jpeg";

                return (
                  <button
                    key={org.id}
                    onClick={orgSlider.onClick(() => setSelectedOrgId(org.id))}
                    className={`
                                    relative flex flex-col items-center gap-2 group transition-all duration-500 ease-out snap-start shrink-0
                                    ${
                                      isActive
                                        ? "opacity-100 scale-100"
                                        : "opacity-50 scale-90 hover:opacity-100 hover:scale-95"
                                    }
                                `}
                  >
                    <div
                      className={`
                                    relative w-14 h-14 rounded-2xl overflow-hidden border transition-all duration-500 shadow-xl
                                    ${
                                      isActive
                                        ? "border-white ring-2 ring-white/20 ring-offset-2 ring-offset-black/50"
                                        : "border-white/10 group-hover:border-white/30"
                                    }
                                `}
                    >
                      {/* Image Layer */}
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${bgImage}')` }}
                      />

                      {/* Glass Overlay */}
                      <div
                        className={`absolute inset-0 transition-colors duration-500 ${
                          isActive
                            ? "bg-black/20"
                            : "bg-black/50 group-hover:bg-black/30"
                        }`}
                      />

                      {/* Icon Layer */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2
                          size={20}
                          className={`drop-shadow-md transition-all duration-500 ${
                            isActive
                              ? "text-white scale-110"
                              : "text-white/70 group-hover:text-white group-hover:scale-105"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Label - Modern Typography */}
                    <span
                      className={`
                                    text-[9px] font-bold uppercase tracking-widest max-w-[5rem] truncate transition-all duration-500
                                    ${
                                      isActive
                                        ? "text-white translate-y-0 opacity-100"
                                        : "text-zinc-500 -translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
                                    }
                                `}
                    >
                      {org.name}
                    </span>

                    {/* Active Indicator Dot */}
                    {isActive && (
                      <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="w-full max-w-md flex flex-col items-center px-8 text-center">
          <div className="w-full relative min-h-[80px]">
            {/* Link Sent State */}
            {linkSent && (
              <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={28} />
                </div>
                <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em]">
                  Synthesis Successful
                </span>
              </div>
            )}

            {/* Password / Email Input */}
            {(showPasswordInput || isLoginMode) && !linkSent && (
              <form
                onSubmit={isLoginMode ? handleMagicLinkRequest : handleUnlock}
                className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div
                  className={`relative group transition-all ${
                    error ? "animate-shake" : ""
                  }`}
                >
                  <div className="relative flex items-center bg-white/[0.08] border border-white/10 rounded-[1.5rem] backdrop-blur-3xl overflow-hidden transition-all focus-within:border-white/40 focus-within:bg-white/[0.12] shadow-2xl">
                    <div className="ml-5 text-zinc-500 group-focus-within:text-white transition-colors">
                      {isLoginMode ? <Mail size={18} /> : <Lock size={18} />}
                    </div>

                    <input
                      autoFocus
                      type={isLoginMode ? "email" : "password"}
                      placeholder={
                        isLoginMode ? "Domain Email" : "Identity Passcode"
                      }
                      value={isLoginMode ? emailInput : passwordInput}
                      onChange={(e) =>
                        isLoginMode
                          ? setEmailInput(e.target.value)
                          : setPasswordInput(e.target.value)
                      }
                      className="w-full bg-transparent py-6 pl-4 pr-16 text-xs font-bold outline-none text-white placeholder:text-zinc-600"
                    />

                    <button
                      type="submit"
                      disabled={
                        isLoginMode
                          ? !emailInput.includes("@") || isSendingLink
                          : !passwordInput || isSendingLink
                      }
                      className={`
                        absolute right-2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all
                        ${
                          (isLoginMode
                            ? emailInput.includes("@")
                            : passwordInput) && !isSendingLink
                            ? "bg-white text-black shadow-xl scale-100 opacity-100 hover:bg-zinc-200 active:scale-95"
                            : "bg-white/10 text-zinc-700 scale-90 opacity-0 pointer-events-none"
                        }
                      `}
                    >
                      <ChevronRight size={24} strokeWidth={3} />
                    </button>

                    {isSendingLink && (
                      <div className="absolute right-4">
                        <Loader2
                          size={20}
                          className="animate-spin text-white opacity-40"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>

          {isLoginMode && !linkSent && !isSendingLink && (
            <p className="mt-8 text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
              New identity synthesis requires <br /> domain-level verification.
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
        <div
          className="flex flex-col items-center gap-4 group cursor-pointer"
          onClick={() => powerDown()}
        >
          <div className="w-14 h-14 rounded-[2rem] bg-white/[0.05] border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-blue-500 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all active:scale-90 shadow-2xl backdrop-blur-xl">
            <Power size={22} />
          </div>
          <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em] group-hover:text-zinc-400 transition-colors">
            Power Down
          </span>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
