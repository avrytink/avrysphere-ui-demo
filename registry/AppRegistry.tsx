import React from "react";
import {
  MessageSquare,
  Terminal as TerminalIcon,
  Globe,
  Settings,
  Folder,
  Phone,
  Calendar as CalendarIcon,
  Type,
  Users,
  StickyNote,
  Calculator as CalculatorIcon,
  Mail as MailIcon,
  HelpCircle,
  Activity,
  Code,
  Layers,
  Users2,
  BarChart3,
  FileEdit,
  Monitor,
  ShoppingBag,
  Tv,
  Megaphone,
  Sparkles,
  Cpu,
  Music as MusicIcon,
  Tablet,
  Gamepad2,
  PlaySquare,
  MapPin,
  Camera as CameraIcon,
  Cloud as CloudIcon,
} from "lucide-react";
import { AppId } from "../types";

// App Components imported from their dedicated feature subfolders
import { AvryAI } from "../apps/avry-ai/AvryAI";
import { Terminal } from "../apps/terminal/Terminal";
import { Files } from "../apps/files/Files";
import { FilesWindowHeader } from "../apps/files/FilesWindowHeader";
import { Calculator } from "../apps/calculator/Calculator";
import { Analytics } from "../apps/analytics/Analytics";
import { Messages } from "../apps/messages/Messages";
import { Mail } from "../apps/mail/Mail";
import { Map } from "../apps/map/Map";
import { Feeling } from "../apps/feeling/Feeling";
import { Camera } from "../apps/camera/Camera";
import { Campaign } from "../apps/campaign/Campaign";
import { Shopper } from "../apps/shopper/Shopper";
import { Call } from "../apps/call/Call";
import { Calendar } from "../apps/calendar/Calendar";
import { TextEditor } from "../apps/text-editor/TextEditor";
import { Contacts } from "../apps/contacts/Contacts";
import { PaperNotes } from "../apps/paper-notes/PaperNotes";
import { Help } from "../apps/help/Help";
import { Settings as SettingsApp } from "../apps/settings/Settings";
import { CodeStudio } from "../apps/code-studio/CodeStudio";
import { DevCenter } from "../apps/dev-center/DevCenter";
import { Teams } from "../apps/teams/Teams";
import { PaperWriter } from "../apps/paper-writer/PaperWriter";
import { WebStudio } from "../apps/web-studio/WebStudio";
import { WebTV } from "../apps/web-tv/WebTV";
import { Browser } from "../apps/browser/Browser";
import { BrowserWindowHeader } from "../apps/browser/BrowserWindowHeader";
import { Music } from "../apps/music/Music";
import { VideoPlayer } from "../apps/video-player/VideoPlayer";
import { Weather } from "../apps/weather/Weather";
import {
  SwitchToTablet,
  SwitchToDesktop,
  SwitchToTV,
  SwitchToGaming,
} from "../apps/system/ModeSwitch";
import { GameRunner } from "../apps/games/GameRunner";

// Import local icons for apps
import terminalIcon from "../apps/terminal/icon.png";
import filesIcon from "../apps/files/icon.png";
import browserIcon from "../apps/browser/icon.png";
import callIcon from "../apps/call/icon.png";
import messagesIcon from "../apps/messages/icon.png";
import calendarIcon from "../apps/calendar/icon.png";
import textEditorIcon from "../apps/text-editor/icon.png";
import contactsIcon from "../apps/contacts/icon.png";
import paperNotesIcon from "../apps/paper-notes/icon.png";
import calculatorIcon from "../apps/calculator/icon.png";
import mailIcon from "../apps/mail/icon.png";
import helpIcon from "../apps/help/icon.png";
import mapIcon from "../apps/map/icon.png";
import settingsIcon from "../apps/settings/icon.png";
import feelingIcon from "../apps/feeling/icon.png";
import cameraIcon from "../apps/camera/icon.png";
import codeStudioIcon from "../apps/code-studio/icon.png";
import devCenterIcon from "../apps/dev-center/icon.png";
import teamsIcon from "../apps/teams/icon.png";
import analyticsIcon from "../apps/analytics/icon.png";
import paperWriterIcon from "../apps/paper-writer/icon.png";
import webStudioIcon from "../apps/web-studio/icon.png";
import shopperIcon from "../apps/shopper/icon.png";
import webTVIcon from "../apps/web-tv/icon.png";
import campaignIcon from "../apps/campaign/icon.png";
import musicIconImg from "../apps/music/icon.png";
import videoPlayerIcon from "../apps/video-player/icon.png";
import weatherIcon from "../apps/weather/icon.png";

import swittchToTVIcon from "../assets/modes/icons/tv.png";
import swittchToGameIcon from "../assets/modes/icons/game.png";
import swittchToDesktopIcon from "../assets/modes/icons/desktop.png";
import swittchToTabletIcon from "../assets/modes/icons/tablet.png";
import swittchToMobileIcon from "../assets/modes/icons/mobile.png";

// Storage Provisioner Demonstration
import { StorageProvisioner } from "../apps/files/StorageProvisioner";

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
  floatingHeader?: boolean; // If true, window header floats over content
  hideFloatingTitle?: boolean; // If true, hide icon and title when floating
  headerComponent?: React.ComponentType<{ win: any }>; // Custom elements in header
  iconImage?: string; // Optional real image to replace the icon/gradient
}

/**
 * Global application registry.
 * Maps App IDs to their component implementation and visual metadata.
 */
export const APP_REGISTRY: Record<AppId, AppDefinition> = {
  [AppId.AVRY_AI]: {
    id: AppId.AVRY_AI,
    component: AvryAI,
    icon: Sparkles,
    gradient: "from-blue-600 to-indigo-700",
    title: "Avry AI",
  },
  [AppId.FILES]: {
    id: AppId.FILES,
    component: Files,
    icon: Folder,
    gradient: "from-amber-400 to-orange-500",
    title: "File Explorer",
    iconImage: filesIcon,
    headerComponent: FilesWindowHeader,
  },
  [AppId.TERMINAL]: {
    id: AppId.TERMINAL,
    component: Terminal,
    icon: TerminalIcon,
    gradient: "from-zinc-700 to-zinc-900",
    title: "Terminal",
    iconImage: terminalIcon,
  },
  [AppId.BROWSER]: {
    id: AppId.BROWSER,
    component: Browser,
    icon: Globe,
    gradient: "from-cyan-500 to-blue-600",
    title: "Browser",
    iconImage: browserIcon,
    headerComponent: BrowserWindowHeader,
  },
  [AppId.CALL]: {
    id: AppId.CALL,
    component: Call,
    icon: Phone,
    gradient: "from-emerald-500 to-green-600",
    title: "Phone",
    iconImage: callIcon,
  },
  [AppId.MESSAGES]: {
    id: AppId.MESSAGES,
    component: Messages,
    icon: MessageSquare,
    gradient: "from-indigo-500 to-purple-600",
    title: "Messages",
    iconImage: messagesIcon,
  },
  [AppId.CALENDAR]: {
    id: AppId.CALENDAR,
    component: Calendar,
    icon: CalendarIcon,
    gradient: "from-rose-500 to-red-600",
    title: "Calendar",
    iconImage: calendarIcon,
  },
  [AppId.TEXT_EDITOR]: {
    id: AppId.TEXT_EDITOR,
    component: TextEditor,
    icon: Type,
    gradient: "from-slate-500 to-slate-700",
    title: "Editor",
    iconImage: textEditorIcon,
  },
  [AppId.CONTACTS]: {
    id: AppId.CONTACTS,
    component: Contacts,
    icon: Users,
    gradient: "from-orange-400 to-red-500",
    title: "Contacts",
    iconImage: contactsIcon,
  },
  [AppId.PAPER_NOTES]: {
    id: AppId.PAPER_NOTES,
    component: PaperNotes,
    icon: StickyNote,
    gradient: "from-yellow-300 to-amber-500",
    title: "Notes",
    iconImage: paperNotesIcon,
  },
  [AppId.CALCULATOR]: {
    id: AppId.CALCULATOR,
    component: Calculator,
    icon: CalculatorIcon,
    gradient: "from-gray-600 to-gray-800",
    title: "Calculator",
    iconImage: calculatorIcon,
  },
  [AppId.MAIL]: {
    id: AppId.MAIL,
    component: Mail,
    icon: MailIcon,
    gradient: "from-sky-500 to-indigo-600",
    title: "Mail",
    iconImage: mailIcon,
  },
  [AppId.HELP]: {
    id: AppId.HELP,
    component: Help,
    icon: HelpCircle,
    gradient: "from-blue-400 to-blue-600",
    title: "Help",
    iconImage: helpIcon,
  },
  [AppId.MAP]: {
    id: AppId.MAP,
    component: Map,
    icon: MapPin,
    gradient: "from-emerald-500 to-teal-600",
    title: "Maps",
    iconImage: mapIcon,
  },
  [AppId.SETTINGS]: {
    id: AppId.SETTINGS,
    component: SettingsApp,
    icon: Settings,
    gradient: "from-zinc-500 to-zinc-700",
    title: "Settings",
    iconImage: settingsIcon,
  },
  [AppId.FEELING]: {
    id: AppId.FEELING,
    component: Feeling,
    icon: Activity,
    gradient: "from-pink-500 to-rose-600",
    title: "Feeling",
    iconImage: feelingIcon,
  },
  [AppId.CAMERA]: {
    id: AppId.CAMERA,
    component: Camera,
    icon: CameraIcon,
    gradient: "from-zinc-400 to-zinc-600",
    title: "Camera",
    iconImage: cameraIcon,
  },
  [AppId.CODE_STUDIO]: {
    id: AppId.CODE_STUDIO,
    component: CodeStudio,
    icon: Code,
    gradient: "from-blue-700 to-slate-900",
    title: "Code",
    iconImage: codeStudioIcon,
  },
  [AppId.DEV_CENTER]: {
    id: AppId.DEV_CENTER,
    component: StorageWindowWrapper,
    icon: Layers,
    gradient: "from-emerald-400 to-teal-600",
    title: "Storage Manager",
    iconImage: devCenterIcon,
  },
  [AppId.TEAMS]: {
    id: AppId.TEAMS,
    component: Teams,
    icon: Users2,
    gradient: "from-indigo-600 to-violet-800",
    title: "Teams",
    iconImage: teamsIcon,
  },
  [AppId.ANALYTICS]: {
    id: AppId.ANALYTICS,
    component: Analytics,
    icon: BarChart3,
    gradient: "from-violet-500 to-fuchsia-700",
    title: "Analytics",
    iconImage: analyticsIcon,
  },
  [AppId.PAPER_WRITER]: {
    id: AppId.PAPER_WRITER,
    component: PaperWriter,
    icon: FileEdit,
    gradient: "from-orange-500 to-rose-700",
    title: "Writer",
    iconImage: paperWriterIcon,
  },
  [AppId.WEB_STUDIO]: {
    id: AppId.WEB_STUDIO,
    component: WebStudio,
    icon: Monitor,
    gradient: "from-cyan-600 to-blue-800",
    title: "Web Studio",
    iconImage: webStudioIcon,
  },
  [AppId.SHOPPER]: {
    id: AppId.SHOPPER,
    component: Shopper,
    icon: ShoppingBag,
    gradient: "from-pink-400 to-rose-500",
    title: "Shopper",
    iconImage: shopperIcon,
  },
  [AppId.WEB_TV]: {
    id: AppId.WEB_TV,
    component: WebTV,
    icon: Tv,
    gradient: "from-purple-600 to-blue-700",
    title: "WebTV+",
    iconImage: webTVIcon,
  },
  [AppId.CAMPAIGN]: {
    id: AppId.CAMPAIGN,
    component: Campaign,
    icon: Megaphone,
    gradient: "from-amber-500 to-red-600",
    title: "Campaign",
    iconImage: campaignIcon,
  },
  [AppId.MUSIC]: {
    id: AppId.MUSIC,
    component: Music,
    icon: MusicIcon,
    gradient: "from-rose-500 to-pink-600",
    title: "Music",
    iconImage: musicIconImg,
  },
  [AppId.VIDEO_PLAYER]: {
    id: AppId.VIDEO_PLAYER,
    component: VideoPlayer,
    icon: PlaySquare,
    gradient: "from-red-600 to-orange-600",
    title: "Video Player",
    iconImage: videoPlayerIcon,
    floatingHeader: true,
    hideFloatingTitle: true,
  },
  [AppId.WEATHER]: {
    id: AppId.WEATHER,
    component: Weather,
    icon: CloudIcon,
    gradient: "from-blue-400 to-sky-500",
    title: "Weather",
    iconImage: weatherIcon,
  },

  // Games with Steam/Official Artwork
  [AppId.CYBERPUNK]: {
    id: AppId.CYBERPUNK,
    component: GameRunner,
    icon: Gamepad2,
    gradient: "from-yellow-400 to-yellow-600",
    title: "Cyberpunk 2077",
    iconImage:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
  },
  [AppId.ELDEN_RING]: {
    id: AppId.ELDEN_RING,
    component: GameRunner,
    icon: Gamepad2,
    gradient: "from-amber-700 to-yellow-900",
    title: "Elden Ring",
    iconImage:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
  },
  [AppId.GOW_RAGNAROK]: {
    id: AppId.GOW_RAGNAROK,
    component: GameRunner,
    icon: Gamepad2,
    gradient: "from-blue-800 to-cyan-900",
    title: "God of War",
    iconImage:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg",
  },
  [AppId.SPIDERMAN_2]: {
    id: AppId.SPIDERMAN_2,
    component: GameRunner,
    icon: Gamepad2,
    gradient: "from-red-600 to-blue-700",
    title: "Spider-Man Remastered",
    iconImage:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg",
  },
  [AppId.COD_MW3]: {
    id: AppId.COD_MW3,
    component: GameRunner,
    icon: Gamepad2,
    gradient: "from-emerald-700 to-zinc-900",
    title: "Call of Duty: HQ",
    iconImage:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1938090/header.jpg",
  },
  [AppId.BALDURS_GATE]: {
    id: AppId.BALDURS_GATE,
    component: GameRunner,
    icon: Gamepad2,
    gradient: "from-red-800 to-orange-900",
    title: "Baldur's Gate 3",
    iconImage:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg",
  },
  [AppId.STARFIELD]: {
    id: AppId.STARFIELD,
    component: GameRunner,
    icon: Gamepad2,
    gradient: "from-orange-500 to-yellow-600",
    title: "Starfield",
    iconImage:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg",
  },
  [AppId.FF_XVI]: {
    id: AppId.FF_XVI,
    component: GameRunner,
    icon: Gamepad2,
    gradient: "from-purple-900 to-indigo-950",
    title: "Final Fantasy XVI",
    iconImage:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2515020/header.jpg",
  },
  [AppId.GTA_V]: {
    id: AppId.GTA_V,
    component: GameRunner,
    icon: Gamepad2,
    gradient: "from-green-600 to-emerald-800",
    title: "Grand Theft Auto V",
    iconImage:
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
  },
  [AppId.FORTNITE]: {
    id: AppId.FORTNITE,
    component: GameRunner,
    icon: Gamepad2,
    gradient: "from-blue-400 to-purple-500",
    title: "Fortnite",
    iconImage:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop", // High fidelity gaming setup
  },

  // Mode Switchers (Headless)
  [AppId.TABLET_MODE]: {
    id: AppId.TABLET_MODE,
    component: SwitchToTablet,
    icon: Tablet,
    iconImage: swittchToTabletIcon,
    gradient: "from-teal-500 to-emerald-600",
    title: "Switch to Tablet",
    headless: true,
  },
  [AppId.DESKTOP_MODE]: {
    id: AppId.DESKTOP_MODE,
    component: SwitchToDesktop,
    icon: Monitor,
    iconImage: swittchToDesktopIcon,
    gradient: "from-blue-500 to-cyan-600",
    title: "Switch to Desktop",
    headless: true,
  },
  [AppId.TV_MODE]: {
    id: AppId.TV_MODE,
    component: SwitchToTV,
    icon: Tv,
    iconImage: swittchToTVIcon,
    gradient: "from-purple-600 to-violet-700",
    title: "Switch to TV",
    headless: true,
  },
  [AppId.GAME_MODE]: {
    id: AppId.GAME_MODE,
    component: SwitchToGaming,
    icon: Gamepad2,
    iconImage: swittchToGameIcon,
    gradient: "from-indigo-600 to-blue-700",
    title: "Switch to Gaming",
    headless: true,
  },
};
