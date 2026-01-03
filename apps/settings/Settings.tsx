import React, { useState, useMemo, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Monitor,
  Smartphone,
  Moon,
  Sun,
  Volume2,
  Wifi,
  Bluetooth,
  Battery,
  User,
  Users,
  Shield,
  Globe,
  Info,
  ChevronRight,
  Check,
  UserPlus,
  Lock,
  LogOut,
  Edit3,
  ArrowLeft,
  PieChart,
  Activity,
  Save,
  X,
  MoreHorizontal,
  Trash2,
  Calendar,
  Building2,
  Mail,
  LayoutGrid,
  Palette,
  Image as ImageIcon,
  Key,
  ShieldAlert,
  Fingerprint,
  Crown,
  ExternalLink,
  Filter,
  Search,
} from "lucide-react";
import { useOSStore } from "../../store/osStore";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../components/Window";
import { useUserStore } from "../../store/userStore";
import { useI18nStore, Language } from "../../store/i18nStore";
import { useSphereStore } from "../../store/sphereStore";
import { useWindowStore } from "../../store/windowStore";
import {
  DesktopLayout,
  Theme,
  UserRole,
  Organization,
  User as UserType,
} from "../../types";

const WALLPAPERS = [
  "https://i.imgur.com/zJ4iCUp.jpeg",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000",
];

const ACCENTS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#6366F1",
  "#EC4899",
  "#8B5CF6",
];

export const Settings: React.FC = () => {
  const theme = useTheme();
  const { setTheme, accentColor, setSettings, brightness } =
    useOSStore();
  const {
    currentUser,
    logout,
    updateUser,
    loggedInUsers,
    activeOrgId,
    switchAccount,
  } = useAuthStore();
  const { getUserOrganizations, organizations, mockUsers, roleConfigs } =
    useUserStore();
  const { workspaces, activeWorkspaceId, updateWorkspaceBackground } =
    useWindowStore();
  const { t, language, setLanguage } = useI18nStore();
  const { layout, setLayout } = useSphereStore();

  const [activeTab, setActiveTab] = useState("personalization");

  // Accounts nested state
  const [accountSubTab, setAccountSubTab] = useState<
    "profile" | "organizations"
  >("profile");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [orgDetailView, setOrgDetailView] = useState<"overview" | "members">(
    "overview"
  );

  // Floating Panels
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingMember, setEditingMember] = useState<UserType | null>(null);

  // Forms
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    avatar: "",
    background: "",
  });

  const isDark = theme === "dark";
  const activeWorkspace = workspaces.find((ws) => ws.id === activeWorkspaceId);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
        background: currentUser.background,
      });
    }
  }, [currentUser]);

  const bgMain = isDark ? "bg-black" : "bg-slate-50";
  const sidebarBg = isDark
    ? "bg-zinc-900/50 border-white/5"
    : "bg-white border-zinc-200";
  const textPrimary = isDark ? "text-white" : "text-zinc-900";
  const textSecondary = isDark ? "text-zinc-500" : "text-zinc-500";
  const cardBg = isDark
    ? "bg-white/5 border-white/5"
    : "bg-white border-zinc-200 shadow-sm";
  const activeItem = isDark
    ? "bg-white/10 text-white"
    : "bg-zinc-200 text-black";
  const hoverItem = isDark ? "hover:bg-white/5" : "hover:bg-zinc-100";
  const glassPanel = isDark
    ? "bg-zinc-900/90 border-white/10"
    : "bg-white/95 border-zinc-200";

  const tabs = [
    { id: "personalization", label: t("personalization"), icon: Palette },
    { id: "system", label: t("system"), icon: SettingsIcon },
    { id: "accounts", label: t("accounts"), icon: Users },
    { id: "language", label: t("language"), icon: Globe },
  ];

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileForm);
    setIsEditingProfile(false);
  };

  const userOrgs = useMemo(() => {
    if (!currentUser) return [];
    return getUserOrganizations(currentUser.id);
  }, [currentUser, getUserOrganizations]);

  return (
    <div
      className={`h-full flex flex-col md:flex-row font-sans overflow-hidden relative ${bgMain}`}
    >
      {/* Primary Sidebar */}
      <div
        className={`w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r p-4 z-10 ${sidebarBg}`}
      >
        <div className="flex items-center gap-3 px-4 mb-8 pt-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <SettingsIcon size={18} className="text-white" />
          </div>
          <span
            className={`text-sm font-bold uppercase tracking-widest ${textPrimary}`}
          >
            Settings
          </span>
        </div>

        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? activeItem
                  : `${textSecondary} ${hoverItem}`
              }`}
            >
              <tab.icon size={18} />
              <span className="text-xs font-bold uppercase tracking-tight">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar relative">
          <div className="max-w-4xl mx-auto space-y-10 pb-24">
            {activeTab === "personalization" && (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2
                  className={`text-2xl font-light uppercase tracking-tighter ${textPrimary}`}
                >
                  {t("personalization")}
                </h2>

                <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
                  <div className="flex items-center gap-2 mb-6">
                    <ImageIcon size={16} className="text-blue-500" />
                    <h3
                      className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}
                    >
                      Desktop Background
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {WALLPAPERS.map((url) => (
                      <button
                        key={url}
                        onClick={() =>
                          activeWorkspaceId &&
                          updateWorkspaceBackground(activeWorkspaceId, url)
                        }
                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                          activeWorkspace?.background === url
                            ? "border-blue-500 scale-95 shadow-lg"
                            : "border-transparent hover:border-white/20"
                        }`}
                      >
                        <img
                          src={url}
                          className="w-full h-full object-cover"
                          alt="wallpaper"
                        />
                        {activeWorkspace?.background === url && (
                          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                            <Check
                              size={24}
                              className="text-white drop-shadow-md"
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
                  <div className="flex items-center gap-2 mb-6">
                    <Palette size={16} className="text-red-500" />
                    <h3
                      className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}
                    >
                      Accent Color
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {ACCENTS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSettings({ accentColor: color })}
                        style={{ backgroundColor: color }}
                        className={`w-10 h-10 rounded-full transition-all flex items-center justify-center border-4 ${
                          accentColor === color
                            ? "border-white ring-2 ring-zinc-500"
                            : "border-transparent hover:scale-110"
                        }`}
                      >
                        {accentColor === color && (
                          <Check size={16} className="text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeTab === "system" && (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2
                  className={`text-2xl font-light uppercase tracking-tighter ${textPrimary}`}
                >
                  {t("system")}
                </h2>
                <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
                  <h3
                    className={`text-xs font-bold uppercase tracking-wider mb-6 ${textSecondary}`}
                  >
                    {t("display_brightness")}
                  </h3>
                  <div className="flex items-center gap-4">
                    <Sun size={20} className={textSecondary} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brightness}
                      onChange={(e) =>
                        setSettings({ brightness: Number(e.target.value) })
                      }
                      className="flex-1 h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <span
                      className={`w-12 text-right font-mono text-sm ${textPrimary}`}
                    >
                      {brightness}%
                    </span>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "accounts" && (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-6">
                  {/* Header & Local Nav */}
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-2xl font-light uppercase tracking-tighter ${textPrimary}`}
                    >
                      {selectedOrg ? (
                        <button
                          onClick={() => setSelectedOrg(null)}
                          className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                        >
                          <ArrowLeft size={20} /> {selectedOrg.name}
                        </button>
                      ) : (
                        t("accounts")
                      )}
                    </h2>
                    {!selectedOrg && (
                      <div
                        className={`flex p-1 rounded-xl border ${
                          isDark
                            ? "bg-white/5 border-white/5"
                            : "bg-black/5 border-zinc-200"
                        }`}
                      >
                        <button
                          onClick={() => setAccountSubTab("profile")}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                            accountSubTab === "profile"
                              ? "bg-white text-black shadow-sm"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => setAccountSubTab("organizations")}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                            accountSubTab === "organizations"
                              ? "bg-white text-black shadow-sm"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          Organizations
                        </button>
                      </div>
                    )}
                  </div>

                  {/* PROFILE VIEW */}
                  {!selectedOrg && accountSubTab === "profile" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                      {/* Profile Overview Card */}
                      <div
                        className={`p-8 rounded-[2.5rem] border flex flex-col md:flex-row items-center gap-8 ${cardBg}`}
                      >
                        <div className="relative group">
                          <div
                            className={`w-40 h-40 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-500 ${
                              isDark ? "border-zinc-800" : "border-white"
                            }`}
                          >
                            <img
                              src={currentUser?.avatar}
                              className="w-full h-full object-cover"
                              alt={currentUser?.name}
                            />
                          </div>
                          <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-zinc-950 shadow-lg" />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                          <div>
                            <h3
                              className={`text-4xl font-black tracking-tighter ${textPrimary}`}
                            >
                              {currentUser?.name}
                            </h3>
                            <p
                              className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}
                            >
                              {currentUser?.email}
                            </p>
                          </div>
                          <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                isDark
                                  ? "bg-blue-600/10 border-blue-600/20 text-blue-500"
                                  : "bg-blue-50 border-blue-100 text-blue-600"
                              }`}
                            >
                              {currentUser?.role}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                isDark
                                  ? "bg-emerald-600/10 border-emerald-600/20 text-emerald-500"
                                  : "bg-emerald-50 border-emerald-100 text-emerald-600"
                              }`}
                            >
                              Synchronized
                            </span>
                          </div>
                          <button
                            onClick={() => setIsEditingProfile(true)}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 flex items-center gap-2 mx-auto md:mx-0"
                          >
                            <Edit3 size={14} /> Edit Identity Details
                          </button>
                        </div>
                      </div>

                      {/* Security Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className={`p-6 rounded-[2rem] border space-y-4 ${cardBg}`}
                        >
                          <div className="flex items-center gap-3">
                            <Fingerprint
                              size={18}
                              className="text-purple-500"
                            />
                            <h3
                              className={`text-xs font-bold uppercase tracking-widest ${textPrimary}`}
                            >
                              Biometric Auth
                            </h3>
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-relaxed uppercase">
                            Identity verification is active using high-entropy
                            neural handshake.
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-[10px] font-black text-emerald-500">
                              ACTIVE
                            </span>
                            <Shield size={14} className="text-emerald-500" />
                          </div>
                        </div>
                        <div
                          className={`p-6 rounded-[2rem] border space-y-4 ${cardBg}`}
                        >
                          <div className="flex items-center gap-3">
                            <Key size={18} className="text-orange-500" />
                            <h3
                              className={`text-xs font-bold uppercase tracking-widest ${textPrimary}`}
                            >
                              System Keys
                            </h3>
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-relaxed uppercase">
                            Manage your encryption keys and domain proxy
                            credentials.
                          </p>
                          <button
                            className={`text-[10px] font-bold text-blue-500 flex items-center gap-1 hover:underline`}
                          >
                            Rotate Keys <ExternalLink size={10} />
                          </button>
                        </div>
                      </div>

                      <div className="pt-8 text-center">
                        <button
                          onClick={() => logout()}
                          className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:text-red-400 transition-colors"
                        >
                          Terminate This Identity Session
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ORGANIZATIONS LIST VIEW */}
                  {!selectedOrg && accountSubTab === "organizations" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userOrgs.map((org) => {
                          const isOwner = org.ownerId === currentUser?.id;
                          return (
                            <button
                              key={org.id}
                              onClick={() => setSelectedOrg(org)}
                              className={`p-6 rounded-[2.5rem] border text-left flex flex-col gap-6 transition-all group ${cardBg} hover:border-blue-500/50 hover:shadow-xl`}
                            >
                              <div className="flex justify-between items-start">
                                <div
                                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border ${
                                    isDark
                                      ? "bg-zinc-800 border-white/5"
                                      : "bg-white border-zinc-100"
                                  }`}
                                >
                                  <Building2
                                    size={24}
                                    className={
                                      isOwner
                                        ? "text-blue-500"
                                        : "text-zinc-500"
                                    }
                                  />
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  {isOwner && (
                                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-md">
                                      Owner
                                    </span>
                                  )}
                                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                    {org.members.length} Members
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h3
                                  className={`text-lg font-black uppercase tracking-tight ${textPrimary}`}
                                >
                                  {org.name}
                                </h3>
                                <p className="text-[9px] font-bold text-zinc-500 mt-1 uppercase tracking-wider">
                                  Created on May 12, 2024
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                  Open Dashboard
                                </span>
                                <ChevronRight
                                  size={14}
                                  className="text-zinc-500 group-hover:text-blue-500"
                                />
                              </div>
                            </button>
                          );
                        })}

                        {/* Add New Org Mock */}
                        <button
                          className={`p-6 rounded-[2.5rem] border border-dashed flex flex-col items-center justify-center gap-4 transition-all opacity-40 hover:opacity-100 ${
                            isDark
                              ? "border-zinc-700 hover:bg-white/5"
                              : "border-zinc-300 hover:bg-black/5"
                          }`}
                        >
                          <div className="p-4 rounded-full bg-zinc-500/10">
                            <UserPlus size={24} className="text-zinc-500" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            Provision New Organization
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ORGANIZATION DETAIL VIEW */}
                  {selectedOrg && (
                    <div className="space-y-8 animate-in zoom-in-95 duration-500">
                      {/* Details Sub-nav */}
                      <div className="flex border-b border-white/5">
                        <button
                          onClick={() => setOrgDetailView("overview")}
                          className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                            orgDetailView === "overview"
                              ? "text-blue-500"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          Overview
                          {orgDetailView === "overview" && (
                            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-blue-500" />
                          )}
                        </button>
                        <button
                          onClick={() => setOrgDetailView("members")}
                          className={`px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                            orgDetailView === "members"
                              ? "text-blue-500"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          Members
                          {orgDetailView === "members" && (
                            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-blue-500" />
                          )}
                        </button>
                      </div>

                      {orgDetailView === "overview" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`p-6 rounded-3xl border ${cardBg}`}>
                              <Activity
                                size={20}
                                className="text-emerald-500 mb-4"
                              />
                              <div
                                className={`text-2xl font-mono ${textPrimary}`}
                              >
                                98.4%
                              </div>
                              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                Resource Health
                              </div>
                            </div>
                            <div className={`p-6 rounded-3xl border ${cardBg}`}>
                              <PieChart
                                size={20}
                                className="text-blue-500 mb-4"
                              />
                              <div
                                className={`text-2xl font-mono ${textPrimary}`}
                              >
                                1.2 TB
                              </div>
                              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                Storage Consumed
                              </div>
                            </div>
                            <div className={`p-6 rounded-3xl border ${cardBg}`}>
                              <ShieldAlert
                                size={20}
                                className="text-red-500 mb-4"
                              />
                              <div
                                className={`text-2xl font-mono ${textPrimary}`}
                              >
                                0
                              </div>
                              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                Security Events
                              </div>
                            </div>
                          </div>

                          <div
                            className={`p-8 rounded-[2.5rem] border ${cardBg}`}
                          >
                            <h3
                              className={`text-xs font-black uppercase tracking-widest mb-6 ${textPrimary}`}
                            >
                              Organization Metadata
                            </h3>
                            <div className="space-y-4">
                              {[
                                {
                                  label: "Domain Link",
                                  val: `${selectedOrg.name.toLowerCase()}.avryos.node`,
                                },
                                {
                                  label: "Hardware Policy",
                                  val: "Level 4 Encrypted",
                                },
                                { label: "Created By", val: "Administrator" },
                                {
                                  label: "Current Subscription",
                                  val: "Enterprise Core",
                                },
                              ].map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                                >
                                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                    {item.label}
                                  </span>
                                  <span
                                    className={`text-[10px] font-mono ${textPrimary}`}
                                  >
                                    {item.val}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {orgDetailView === "members" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                          <div className="flex items-center justify-between px-2">
                            <div className="relative w-64">
                              <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                              />
                              <input
                                className={`w-full py-2 pl-9 pr-4 rounded-full border text-[10px] uppercase font-bold outline-none focus:border-blue-500 ${
                                  isDark
                                    ? "bg-white/5 border-white/5 text-white"
                                    : "bg-black/5 border-zinc-200 text-black"
                                }`}
                                placeholder="Filter personnel..."
                              />
                            </div>
                            {selectedOrg.ownerId === currentUser?.id && (
                              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-600/20">
                                Invite Node
                              </button>
                            )}
                          </div>

                          <div
                            className={`border rounded-[2.5rem] overflow-hidden ${cardBg}`}
                          >
                            <table className="w-full text-left">
                              <thead
                                className={`text-[9px] font-black text-zinc-500 uppercase tracking-widest border-b ${
                                  isDark ? "border-white/5" : "border-zinc-100"
                                }`}
                              >
                                <tr>
                                  <th className="px-8 py-5">
                                    Personnel Identity
                                  </th>
                                  <th className="px-8 py-5">System Role</th>
                                  <th className="px-8 py-5">Status</th>
                                  <th className="px-8 py-5 text-right">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="text-[10px] font-bold uppercase tracking-tight">
                                {mockUsers
                                  .filter((u) =>
                                    selectedOrg.members.includes(u.id)
                                  )
                                  .map((user) => {
                                    const isOwner =
                                      selectedOrg.ownerId === user.id;
                                    return (
                                      <tr
                                        key={user.id}
                                        className={`border-b transition-colors ${
                                          isDark
                                            ? "border-white/5 hover:bg-white/[0.02]"
                                            : "border-zinc-100 hover:bg-zinc-50"
                                        }`}
                                      >
                                        <td className="px-8 py-4 flex items-center gap-4">
                                          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                            <img
                                              src={user.avatar}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div>
                                            <div className={textPrimary}>
                                              {user.name}
                                            </div>
                                            <div className="text-[8px] text-zinc-600 tracking-widest">
                                              {user.email}
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-8 py-4">
                                          <div className="flex items-center gap-2">
                                            {isOwner && (
                                              <Crown
                                                size={12}
                                                className="text-blue-500"
                                              />
                                            )}
                                            <span
                                              className={
                                                isOwner
                                                  ? "text-blue-500"
                                                  : textSecondary
                                              }
                                            >
                                              {user.role}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-8 py-4">
                                          <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-emerald-500 text-[8px] tracking-widest">
                                              ONLINE
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                          <button
                                            onClick={() =>
                                              setEditingMember(user)
                                            }
                                            className={`p-2 rounded-lg transition-colors ${textSecondary} ${hoverItem}`}
                                          >
                                            <MoreHorizontal size={14} />
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "language" && (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2
                  className={`text-2xl font-light uppercase tracking-tighter ${textPrimary}`}
                >
                  {t("language_region")}
                </h2>
                <div
                  className={`p-8 rounded-[2.5rem] border space-y-8 ${cardBg}`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: "en", label: "English", sub: "United States" },
                      { id: "fr", label: "Français", sub: "France" },
                      { id: "zh", label: "中文", sub: "中国" },
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setLanguage(lang.id as Language)}
                        className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${
                          language === lang.id
                            ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20"
                            : isDark
                            ? "border-white/10 hover:bg-white/5"
                            : "border-zinc-200 hover:bg-zinc-50"
                        }`}
                      >
                        <div
                          className={`text-sm font-black uppercase tracking-widest ${
                            language === lang.id ? "text-blue-500" : textPrimary
                          }`}
                        >
                          {lang.label}
                        </div>
                        <div
                          className={`text-[10px] font-bold text-zinc-500 uppercase tracking-widest`}
                        >
                          {lang.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Floating Side Panel: Profile Editor */}
        <div
          className={`absolute top-0 bottom-0 right-0 w-full md:w-[420px] backdrop-blur-3xl border-l z-[20] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isEditingProfile ? "translate-x-0" : "translate-x-full"
          } ${glassPanel}`}
        >
          <div className="h-full flex flex-col p-10">
            <div className="flex items-center justify-between mb-12">
              <h3
                className={`text-xl font-black uppercase tracking-tighter ${textPrimary}`}
              >
                Synthesis Details
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className={`p-2 rounded-full ${hoverItem} ${textSecondary}`}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateProfile}
              className="flex-1 space-y-8 overflow-y-auto no-scrollbar pb-10"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Identity Alias
                </label>
                <input
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className={`w-full p-4 rounded-2xl border text-sm font-bold outline-none transition-all focus:border-blue-500 ${
                    isDark
                      ? "bg-black/50 border-white/5 text-white"
                      : "bg-white border-zinc-200 text-black"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Domain Email
                </label>
                <input
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  className={`w-full p-4 rounded-2xl border text-sm font-bold outline-none transition-all focus:border-blue-500 ${
                    isDark
                      ? "bg-black/50 border-white/5 text-white"
                      : "bg-white border-zinc-200 text-black"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Avatar Proxy URL
                </label>
                <input
                  value={profileForm.avatar}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, avatar: e.target.value })
                  }
                  className={`w-full p-4 rounded-2xl border text-xs font-mono outline-none transition-all focus:border-blue-500 ${
                    isDark
                      ? "bg-black/50 border-white/5 text-white"
                      : "bg-white border-zinc-200 text-black"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Workspace Background
                </label>
                <input
                  value={profileForm.background}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      background: e.target.value,
                    })
                  }
                  className={`w-full p-4 rounded-2xl border text-xs font-mono outline-none transition-all focus:border-blue-500 ${
                    isDark
                      ? "bg-black/50 border-white/5 text-white"
                      : "bg-white border-zinc-200 text-black"
                  }`}
                />
              </div>

              <div className="pt-8 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                >
                  Apply Modifications
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className={`flex-1 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isDark
                      ? "border-white/10 hover:bg-white/5 text-white"
                      : "border-zinc-200 hover:bg-black/5 text-black"
                  }`}
                >
                  Abort
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Floating Side Panel: Member Management */}
        <div
          className={`absolute top-0 bottom-0 right-0 w-full md:w-[420px] backdrop-blur-3xl border-l z-[30] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            editingMember ? "translate-x-0" : "translate-x-full"
          } ${glassPanel}`}
        >
          {editingMember && (
            <div className="h-full flex flex-col p-10">
              <div className="flex items-center justify-between mb-12">
                <h3
                  className={`text-xl font-black uppercase tracking-tighter ${textPrimary}`}
                >
                  Manage Personnel
                </h3>
                <button
                  onClick={() => setEditingMember(null)}
                  className={`p-2 rounded-full ${hoverItem} ${textSecondary}`}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center mb-10 text-center gap-4">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/10 shadow-xl">
                  <img
                    src={editingMember.avatar}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4
                    className={`text-lg font-black uppercase tracking-tight ${textPrimary}`}
                  >
                    {editingMember.name}
                  </h4>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-widest">
                    {editingMember.email}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-10 overflow-y-auto no-scrollbar">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <Shield size={14} className="text-blue-500" />
                    <h5
                      className={`text-[10px] font-black uppercase tracking-widest ${textPrimary}`}
                    >
                      Permissions & Privileges
                    </h5>
                  </div>
                  <div className="space-y-2">
                    {roleConfigs
                      .find((r) => r.role === editingMember.role)
                      ?.permissions.map((perm) => (
                        <div
                          key={perm}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            isDark
                              ? "bg-white/5 border-white/5"
                              : "bg-black/5 border-zinc-200"
                          }`}
                        >
                          <span
                            className={`text-[10px] font-bold uppercase tracking-tight ${textSecondary}`}
                          >
                            {perm.replace(/_/g, " ")}
                          </span>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                      ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <Fingerprint size={14} className="text-purple-500" />
                    <h5
                      className={`text-[10px] font-black uppercase tracking-widest ${textPrimary}`}
                    >
                      Modify Authority
                    </h5>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {["member", "admin", "superadmin", "invited"].map(
                      (role) => (
                        <button
                          key={role}
                          disabled={selectedOrg?.ownerId !== currentUser?.id}
                          className={`p-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                            editingMember.role === role
                              ? "bg-blue-600 border-blue-600 text-white"
                              : `disabled:opacity-20 ${
                                  isDark
                                    ? "bg-white/5 border-white/5 text-zinc-500 hover:text-white"
                                    : "bg-black/5 border-zinc-100 text-zinc-400 hover:text-black"
                                }`
                          }`}
                        >
                          {role}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {selectedOrg?.ownerId === currentUser?.id &&
                  editingMember.id !== currentUser?.id && (
                    <div className="pt-10 border-t border-white/5 space-y-4">
                      <button className="w-full py-4 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                        <Trash2 size={14} /> Sever Identity Link
                      </button>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
