
import React from 'react';
import { 
  MessageSquare, Terminal as TerminalIcon, Globe, Settings, Folder, Phone, 
  Calendar as CalendarIcon, Type, Users, StickyNote, Calculator as CalculatorIcon, 
  Mail as MailIcon, HelpCircle, Activity, Code, Layers, Users2, BarChart3, 
  FileEdit, Monitor, ShoppingBag, Tv, Megaphone, Sparkles, Cpu, Music as MusicIcon,
  Tablet, Gamepad2, PlaySquare
} from 'lucide-react';
import { AppId } from '../types';

// App Components imported from their dedicated feature subfolders
import { AvryAI } from '../apps/avry-ai/AvryAI';
import { Terminal } from '../apps/terminal/Terminal';
import { Files } from '../apps/files/Files';
import { Calculator } from '../apps/calculator/Calculator';
import { Analytics } from '../apps/analytics/Analytics';
import { Messages } from '../apps/messages/Messages';
import { Mail } from '../apps/mail/Mail';
import { Feeling } from '../apps/feeling/Feeling';
import { Campaign } from '../apps/campaign/Campaign';
import { Shopper } from '../apps/shopper/Shopper';
import { Call } from '../apps/call/Call';
import { Calendar } from '../apps/calendar/Calendar';
import { TextEditor } from '../apps/text-editor/TextEditor';
import { Contacts } from '../apps/contacts/Contacts';
import { PaperNotes } from '../apps/paper-notes/PaperNotes';
import { Help } from '../apps/help/Help';
import { Settings as SettingsApp } from '../apps/settings/Settings';
import { CodeStudio } from '../apps/code-studio/CodeStudio';
import { DevCenter } from '../apps/dev-center/DevCenter';
import { Teams } from '../apps/teams/Teams';
import { PaperWriter } from '../apps/paper-writer/PaperWriter';
import { WebStudio } from '../apps/web-studio/WebStudio';
import { WebTV } from '../apps/web-tv/WebTV';
import { Browser } from '../apps/browser/Browser';
import { ProcessManager } from '../apps/process-manager/ProcessManager';
import { Music } from '../apps/music/Music';
import { VideoPlayer } from '../apps/video-player/VideoPlayer';
import { SwitchToTablet, SwitchToDesktop, SwitchToTV, SwitchToGaming } from '../apps/system/ModeSwitch';
import { GameRunner } from '../apps/games/GameRunner';

// Storage Provisioner Demonstration
import { StorageProvisioner } from '../apps/files/StorageProvisioner';

/**
 * Storage wrapper for child window demonstration
 */
const StorageWindowWrapper: React.FC = () => {
  return <StorageProvisioner onComplete={() => {}} />;
};

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: any;
  gradient: string;
  component: React.ComponentType;
  headless?: boolean; // If true, app runs without a visible window frame
  iconImage?: string; // Optional real image to replace the icon/gradient
}

/**
 * Global application registry.
 * Maps App IDs to their component implementation and visual metadata.
 */
export const APP_REGISTRY: Record<AppId, AppDefinition> = {
  [AppId.AVRY_AI]: { id: AppId.AVRY_AI, component: AvryAI, icon: Sparkles, gradient: 'from-blue-600 to-indigo-700', title: 'Avry AI' },
  [AppId.FILES]: { id: AppId.FILES, component: Files, icon: Folder, gradient: 'from-amber-400 to-orange-500', title: 'File Explorer' },
  [AppId.TERMINAL]: { id: AppId.TERMINAL, component: Terminal, icon: TerminalIcon, gradient: 'from-zinc-700 to-zinc-900', title: 'Terminal' },
  [AppId.BROWSER]: { id: AppId.BROWSER, component: Browser, icon: Globe, gradient: 'from-cyan-500 to-blue-600', title: 'Browser' },
  [AppId.CALL]: { id: AppId.CALL, component: Call, icon: Phone, gradient: 'from-emerald-500 to-green-600', title: 'Phone' },
  [AppId.MESSAGES]: { id: AppId.MESSAGES, component: Messages, icon: MessageSquare, gradient: 'from-indigo-500 to-purple-600', title: 'Messages' },
  [AppId.CALENDAR]: { id: AppId.CALENDAR, component: Calendar, icon: CalendarIcon, gradient: 'from-rose-500 to-red-600', title: 'Calendar' },
  [AppId.TEXT_EDITOR]: { id: AppId.TEXT_EDITOR, component: TextEditor, icon: Type, gradient: 'from-slate-500 to-slate-700', title: 'Editor' },
  [AppId.CONTACTS]: { id: AppId.CONTACTS, component: Contacts, icon: Users, gradient: 'from-orange-400 to-red-500', title: 'Contacts' },
  [AppId.PAPER_NOTES]: { id: AppId.PAPER_NOTES, component: PaperNotes, icon: StickyNote, gradient: 'from-yellow-300 to-amber-500', title: 'Notes' },
  [AppId.CALCULATOR]: { id: AppId.CALCULATOR, component: Calculator, icon: CalculatorIcon, gradient: 'from-gray-600 to-gray-800', title: 'Calculator' },
  [AppId.MAIL]: { id: AppId.MAIL, component: Mail, icon: MailIcon, gradient: 'from-sky-500 to-indigo-600', title: 'Mail' },
  [AppId.HELP]: { id: AppId.HELP, component: Help, icon: HelpCircle, gradient: 'from-blue-400 to-blue-600', title: 'Help' },
  [AppId.SETTINGS]: { id: AppId.SETTINGS, component: SettingsApp, icon: Settings, gradient: 'from-zinc-500 to-zinc-700', title: 'Settings' },
  [AppId.FEELING]: { id: AppId.FEELING, component: Feeling, icon: Activity, gradient: 'from-pink-500 to-rose-600', title: 'Feeling' },
  [AppId.CODE_STUDIO]: { id: AppId.CODE_STUDIO, component: CodeStudio, icon: Code, gradient: 'from-blue-700 to-slate-900', title: 'Code' },
  [AppId.DEV_CENTER]: { id: AppId.DEV_CENTER, component: StorageWindowWrapper, icon: Layers, gradient: 'from-emerald-400 to-teal-600', title: 'Storage Manager' },
  [AppId.TEAMS]: { id: AppId.TEAMS, component: Teams, icon: Users2, gradient: 'from-indigo-600 to-violet-800', title: 'Teams' },
  [AppId.ANALYTICS]: { id: AppId.ANALYTICS, component: Analytics, icon: BarChart3, gradient: 'from-violet-500 to-fuchsia-700', title: 'Analytics' },
  [AppId.PAPER_WRITER]: { id: AppId.PAPER_WRITER, component: PaperWriter, icon: FileEdit, gradient: 'from-orange-500 to-rose-700', title: 'Writer' },
  [AppId.WEB_STUDIO]: { id: AppId.WEB_STUDIO, component: WebStudio, icon: Monitor, gradient: 'from-cyan-600 to-blue-800', title: 'Web Studio' },
  [AppId.SHOPPER]: { id: AppId.SHOPPER, component: Shopper, icon: ShoppingBag, gradient: 'from-pink-400 to-rose-500', title: 'Shopper' },
  [AppId.WEB_TV]: { id: AppId.WEB_TV, component: WebTV, icon: Tv, gradient: 'from-purple-600 to-blue-700', title: 'WebTV+' },
  [AppId.CAMPAIGN]: { id: AppId.CAMPAIGN, component: Campaign, icon: Megaphone, gradient: 'from-amber-500 to-red-600', title: 'Campaign' },
  [AppId.PROCESS_MANAGER]: { id: AppId.PROCESS_MANAGER, component: ProcessManager, icon: Cpu, gradient: 'from-zinc-800 to-black', title: 'System Monitor' },
  [AppId.MUSIC]: { id: AppId.MUSIC, component: Music, icon: MusicIcon, gradient: 'from-rose-500 to-pink-600', title: 'Music' },
  [AppId.VIDEO_PLAYER]: { id: AppId.VIDEO_PLAYER, component: VideoPlayer, icon: PlaySquare, gradient: 'from-red-600 to-orange-600', title: 'Video Player' },
  
  // Games with Steam/Official Artwork
  [AppId.CYBERPUNK]: { 
    id: AppId.CYBERPUNK, 
    component: GameRunner, 
    icon: Gamepad2, 
    gradient: 'from-yellow-400 to-yellow-600', 
    title: 'Cyberpunk 2077',
    iconImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg'
  },
  [AppId.ELDEN_RING]: { 
    id: AppId.ELDEN_RING, 
    component: GameRunner, 
    icon: Gamepad2, 
    gradient: 'from-amber-700 to-yellow-900', 
    title: 'Elden Ring',
    iconImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg'
  },
  [AppId.GOW_RAGNAROK]: { 
    id: AppId.GOW_RAGNAROK, 
    component: GameRunner, 
    icon: Gamepad2, 
    gradient: 'from-blue-800 to-cyan-900', 
    title: 'God of War',
    iconImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg'
  },
  [AppId.SPIDERMAN_2]: { 
    id: AppId.SPIDERMAN_2, 
    component: GameRunner, 
    icon: Gamepad2, 
    gradient: 'from-red-600 to-blue-700', 
    title: 'Spider-Man Remastered',
    iconImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg'
  },
  [AppId.COD_MW3]: { 
    id: AppId.COD_MW3, 
    component: GameRunner, 
    icon: Gamepad2, 
    gradient: 'from-emerald-700 to-zinc-900', 
    title: 'Call of Duty: HQ',
    iconImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1938090/header.jpg'
  },
  [AppId.BALDURS_GATE]: { 
    id: AppId.BALDURS_GATE, 
    component: GameRunner, 
    icon: Gamepad2, 
    gradient: 'from-red-800 to-orange-900', 
    title: 'Baldur\'s Gate 3',
    iconImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg'
  },
  [AppId.STARFIELD]: { 
    id: AppId.STARFIELD, 
    component: GameRunner, 
    icon: Gamepad2, 
    gradient: 'from-orange-500 to-yellow-600', 
    title: 'Starfield',
    iconImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg'
  },
  [AppId.FF_XVI]: { 
    id: AppId.FF_XVI, 
    component: GameRunner, 
    icon: Gamepad2, 
    gradient: 'from-purple-900 to-indigo-950', 
    title: 'Final Fantasy XVI',
    iconImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2515020/header.jpg'
  },
  [AppId.GTA_V]: { 
    id: AppId.GTA_V, 
    component: GameRunner, 
    icon: Gamepad2, 
    gradient: 'from-green-600 to-emerald-800', 
    title: 'Grand Theft Auto V',
    iconImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg'
  },
  [AppId.FORTNITE]: { 
    id: AppId.FORTNITE, 
    component: GameRunner, 
    icon: Gamepad2, 
    gradient: 'from-blue-400 to-purple-500', 
    title: 'Fortnite',
    // Using a generic reliable placeholder for non-steam
    iconImage: 'https://cdn2.unrealengine.com/fortnite-battle-royale-chapter-4-season-4-key-art-1920x1080-6060024d2c20.jpg'
  },

  // Mode Switchers (Headless)
  [AppId.TABLET_MODE]: { id: AppId.TABLET_MODE, component: SwitchToTablet, icon: Tablet, gradient: 'from-teal-500 to-emerald-600', title: 'Switch to Tablet', headless: true },
  [AppId.DESKTOP_MODE]: { id: AppId.DESKTOP_MODE, component: SwitchToDesktop, icon: Monitor, gradient: 'from-blue-500 to-cyan-600', title: 'Switch to Desktop', headless: true },
  [AppId.TV_MODE]: { id: AppId.TV_MODE, component: SwitchToTV, icon: Tv, gradient: 'from-purple-600 to-violet-700', title: 'Switch to TV', headless: true },
  [AppId.GAME_MODE]: { id: AppId.GAME_MODE, component: SwitchToGaming, icon: Gamepad2, gradient: 'from-indigo-600 to-blue-700', title: 'Switch to Gaming', headless: true },
};
