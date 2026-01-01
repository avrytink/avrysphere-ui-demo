
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Monitor, Smartphone, Moon, Sun, 
  Volume2, Wifi, Bluetooth, Battery, User, Users, Shield, 
  Globe, Info, ChevronRight, Check, UserPlus, Lock, LogOut,
  Edit3, ArrowLeft, PieChart, Activity, Save, X, MoreHorizontal,
  Trash2, Calendar, Building2, Mail, LayoutGrid, Palette, Image as ImageIcon
} from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useI18nStore, Language } from '../../store/i18nStore';
import { useSphereStore } from '../../store/sphereStore';
import { useWindowStore } from '../../store/windowStore';
import { DesktopLayout, Theme, UserRole } from '../../types';

const WALLPAPERS = [
  'https://i.imgur.com/zJ4iCUp.jpeg',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000'
];

const ACCENTS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'];

export const Settings: React.FC = () => {
  const { theme, setTheme, accentColor, setSettings, brightness } = useOSStore();
  const { currentUser, logout, updateUser } = useAuthStore();
  const { workspaces, activeWorkspaceId, updateWorkspaceBackground } = useWindowStore();
  const { t, language, setLanguage } = useI18nStore();
  const { layout, setLayout } = useSphereStore();

  const [activeTab, setActiveTab] = useState('personalization');
  const [profileForm, setProfileForm] = useState({ name: '', email: '', avatar: '', background: '' });

  const isDark = theme === 'dark';
  const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
        background: currentUser.background
      });
    }
  }, [currentUser]);

  const bgMain = isDark ? 'bg-black' : 'bg-slate-50';
  const sidebarBg = isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-zinc-200';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-500' : 'text-zinc-500';
  const cardBg = isDark ? 'bg-white/5 border-white/5' : 'bg-white border-zinc-200 shadow-sm';
  const activeItem = isDark ? 'bg-white/10 text-white' : 'bg-zinc-200 text-black';
  const hoverItem = isDark ? 'hover:bg-white/5' : 'hover:bg-zinc-100';

  const tabs = [
    { id: 'personalization', label: t('personalization'), icon: Palette },
    { id: 'system', label: t('system'), icon: SettingsIcon },
    { id: 'accounts', label: t('accounts'), icon: Users },
    { id: 'language', label: t('language'), icon: Globe },
  ];

  return (
    <div className={`h-full flex flex-col md:flex-row font-sans overflow-hidden relative ${bgMain}`}>
      <div className={`w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r p-4 z-10 ${sidebarBg}`}>
        <div className="flex items-center gap-3 px-4 mb-8 pt-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <SettingsIcon size={18} className="text-white" />
          </div>
          <span className={`text-sm font-bold uppercase tracking-widest ${textPrimary}`}>Settings</span>
        </div>
        
        <div className="space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? activeItem : `${textSecondary} ${hoverItem}`}`}
            >
              <tab.icon size={18} />
              <span className="text-xs font-bold uppercase tracking-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 relative no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10 pb-24">
          
          {activeTab === 'personalization' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className={`text-2xl font-light uppercase tracking-tighter ${textPrimary}`}>{t('personalization')}</h2>
              
              <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
                <div className="flex items-center gap-2 mb-6">
                  <ImageIcon size={16} className="text-blue-500" />
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Desktop Background</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {WALLPAPERS.map(url => (
                    <button 
                      key={url}
                      onClick={() => activeWorkspaceId && updateWorkspaceBackground(activeWorkspaceId, url)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${activeWorkspace?.background === url ? 'border-blue-500 scale-95 shadow-lg' : 'border-transparent hover:border-white/20'}`}
                    >
                      <img src={url} className="w-full h-full object-cover" alt="wallpaper" />
                      {activeWorkspace?.background === url && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <Check size={24} className="text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
                <div className="flex items-center gap-2 mb-6">
                  <Palette size={16} className="text-red-500" />
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Accent Color</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {ACCENTS.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSettings({ accentColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-10 h-10 rounded-full transition-all flex items-center justify-center border-4 ${accentColor === color ? 'border-white ring-2 ring-zinc-500' : 'border-transparent hover:scale-110'}`}
                    >
                      {accentColor === color && <Check size={16} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-6 ${textSecondary}`}>{t('system_theme')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setTheme('light')} className={`p-4 rounded-2xl border flex flex-col items-center gap-4 transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20' : (isDark ? 'border-white/10 hover:bg-white/5' : 'border-zinc-200 hover:bg-zinc-50')}`}>
                    <Sun size={24} className={theme === 'light' ? 'text-blue-500' : textSecondary} />
                    <span className={`text-xs font-bold ${theme === 'light' ? 'text-blue-500' : textSecondary}`}>{t('light_mode')}</span>
                  </button>
                  <button onClick={() => setTheme('dark')} className={`p-4 rounded-2xl border flex flex-col items-center gap-4 transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20' : (isDark ? 'border-white/10 hover:bg-white/5' : 'border-zinc-200 hover:bg-zinc-50')}`}>
                    <Moon size={24} className={theme === 'dark' ? 'text-blue-500' : textSecondary} />
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-blue-500' : textSecondary}`}>{t('dark_mode')}</span>
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
                <div className="flex items-center gap-2 mb-6">
                  <LayoutGrid size={16} className="text-purple-500" />
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>{t('interface_behavior')}</h3>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setLayout(DesktopLayout.AVRY)} className={`flex-1 p-4 rounded-2xl border text-left transition-all ${layout === DesktopLayout.AVRY ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20' : (isDark ? 'border-white/10' : 'border-zinc-200')}`}>
                      <div className={`text-sm font-bold mb-1 ${layout === DesktopLayout.AVRY ? 'text-blue-500' : textPrimary}`}>{t('floating_exp')}</div>
                      <div className="text-[10px] text-zinc-500">Modern dock with floating windows</div>
                   </button>
                   <button onClick={() => setLayout(DesktopLayout.UNITY)} className={`flex-1 p-4 rounded-2xl border text-left transition-all ${layout === DesktopLayout.UNITY ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20' : (isDark ? 'border-white/10' : 'border-zinc-200')}`}>
                      <div className={`text-sm font-bold mb-1 ${layout === DesktopLayout.UNITY ? 'text-blue-500' : textPrimary}`}>{t('sidebar_exp')}</div>
                      <div className="text-[10px] text-zinc-500">Classic sidebar navigation</div>
                   </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'system' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className={`text-2xl font-light uppercase tracking-tighter ${textPrimary}`}>{t('system')}</h2>
              <div className={`p-6 rounded-[2rem] border ${cardBg}`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-6 ${textSecondary}`}>{t('display_brightness')}</h3>
                <div className="flex items-center gap-4">
                  <Sun size={20} className={textSecondary} />
                  <input type="range" min="0" max="100" value={brightness} onChange={(e) => setSettings({ brightness: Number(e.target.value) })} className="flex-1 h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
                  <span className={`w-12 text-right font-mono text-sm ${textPrimary}`}>{brightness}%</span>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'language' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className={`text-2xl font-light uppercase tracking-tighter ${textPrimary}`}>{t('language_region')}</h2>
              <div className={`p-8 rounded-[2.5rem] border space-y-8 ${cardBg}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold uppercase tracking-widest ${textPrimary}`}>{t('select_language')}</h3>
                    <p className={`text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-wider`}>{t('language_desc')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'en', label: 'English', sub: 'United States' },
                    { id: 'fr', label: 'Français', sub: 'France' },
                    { id: 'zh', label: '中文', sub: '中国' },
                  ].map(lang => (
                    <button 
                      key={lang.id}
                      onClick={() => setLanguage(lang.id as Language)}
                      className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${language === lang.id ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20' : (isDark ? 'border-white/10 hover:bg-white/5' : 'border-zinc-200 hover:bg-zinc-50')}`}
                    >
                      <div className={`text-sm font-black uppercase tracking-widest ${language === lang.id ? 'text-blue-500' : textPrimary}`}>{lang.label}</div>
                      <div className={`text-[10px] font-bold text-zinc-500 uppercase tracking-widest`}>{lang.sub}</div>
                      {language === lang.id && <div className="mt-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]" />}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
