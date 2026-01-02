
export enum AppId {
  AVRY_AI = 'avry-ai',
  TERMINAL = 'terminal',
  SETTINGS = 'settings',
  BROWSER = 'browser',
  FILES = 'files',
  CALL = 'call',
  MESSAGES = 'messages',
  CALENDAR = 'calendar',
  TEXT_EDITOR = 'text-editor',
  CONTACTS = 'contacts',
  PAPER_NOTES = 'paper-notes',
  CALCULATOR = 'calculator',
  MAIL = 'mail',
  HELP = 'help',
  MAP = 'map',
  FEELING = 'feeling',
  CAMERA = 'camera',
  CODE_STUDIO = 'code-studio',
  DEV_CENTER = 'dev-center',
  TEAMS = 'teams',
  ANALYTICS = 'analytics',
  PAPER_WRITER = 'paper-writer',
  WEB_STUDIO = 'web-studio',
  SHOPPER = 'shopper',
  WEB_TV = 'web-tv',
  CAMPAIGN = 'campaign',
  MUSIC = 'music',
  VIDEO_PLAYER = 'video-player',
  WEATHER = 'weather',
  
  // Games
  CYBERPUNK = 'game-cyberpunk',
  ELDEN_RING = 'game-elden-ring',
  GOW_RAGNAROK = 'game-gow',
  SPIDERMAN_2 = 'game-spiderman',
  COD_MW3 = 'game-cod',
  BALDURS_GATE = 'game-bg3',
  STARFIELD = 'game-starfield',
  FF_XVI = 'game-ff16',
  GTA_V = 'game-gta5',
  FORTNITE = 'game-fortnite',

  // Modes
  TABLET_MODE = 'tablet-mode',
  DESKTOP_MODE = 'desktop-mode',
  TV_MODE = 'tv-mode',
  GAME_MODE = 'game-mode'
}

export enum DesktopLayout {
  UNITY = 'unity',
  AVRY = 'avry'
}

export type Theme = 'light' | 'dark';

export type UserRole = 'superadmin' | 'admin' | 'member' | 'invited' | string;

export enum Permission {
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  ROLE_CONFIGURATION = 'ROLE_CONFIGURATION',
  TERMINAL_ACCESS = 'TERMINAL_ACCESS',
  SYSTEM_SETTINGS = 'SYSTEM_SETTINGS',
  WORKSPACE_MODIFICATION = 'WORKSPACE_MODIFICATION'
}

export enum SnapType {
  NONE = 'none',
  FULL = 'full',
  LEFT = 'left',
  RIGHT = 'right',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  // Advanced Patterns
  LEFT_TWO_THIRDS = 'left-2-3',
  RIGHT_ONE_THIRD = 'right-1-3',
  THIRD_LEFT = 'third-left',
  THIRD_CENTER = 'third-center',
  THIRD_RIGHT = 'third-right',
  COL3_L25 = 'col3-l25',
  COL3_C50 = 'col3-c50',
  COL3_R25 = 'col3-r25',
  RIGHT_TOP_QUARTER = 'right-t-q',
  RIGHT_BOTTOM_QUARTER = 'right-b-q'
}

export interface RoleConfig {
  role: UserRole;
  permissions: Permission[];
  description: string;
  isSystem?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  members: string[]; // User IDs
  logo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  background: string;
  role: UserRole;
  password?: string;
  organizationIds: string[]; // IDs of orgs this user belongs to
  lastActiveOrgId?: string; // Persist the last used organization
  settings?: {
    accentColor: string;
    brightness: number;
    volume: number;
    dockCollapsed: boolean;
    layout: DesktopLayout;
    theme: Theme;
  };
}

export interface Workspace {
  id: string;
  name: string;
  background?: string;
}

export interface WindowState {
  instanceId: string;
  appId: AppId;
  parentId?: string; // ID of the parent window
  isModal?: boolean;
  workspaceId: string;
  title: string;
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  scale: number;
  preview?: string;
  prevX?: number;
  prevY?: number;
  prevWidth?: number | string;
  prevHeight?: number | string;
  launchArgs?: Record<string, any>;
}

export interface UserSession {
  windows: WindowState[];
  workspaces: Workspace[];
  activeWorkspaceId: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface TopBarStore {
  dateTime: Date;
  updateDateTime: () => void;
}

export interface DockStore {
  dockCollapsed: boolean;
  launcherOpen: boolean;
  geminiPanelOpen: boolean;
  notificationsOpen: boolean;
  profileOpen: boolean;
  workspacePanelOpen: boolean;
  launcherSearchQuery: string;
  setDockCollapsed: (collapsed: boolean) => void;
  setLauncherOpen: (open: boolean) => void;
  setGeminiPanelOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setProfileOpen: (open: boolean) => void;
  setWorkspacePanelOpen: (open: boolean) => void;
  setLauncherSearchQuery: (query: string) => void;
  toggleLauncher: () => void;
  toggleGeminiPanel: () => void;
  toggleNotifications: () => void;
  toggleProfile: () => void;
  toggleWorkspacePanel: () => void;
  closeAllDockPanels: () => void;
}

export interface SphereState {
  isMobile: boolean;
  isTablet: boolean;
  isTV: boolean;
  isGaming: boolean;
  layout: DesktopLayout;
  setIsMobile: (isMobile: boolean) => void;
  setIsTablet: (isTablet: boolean) => void;
  setIsTV: (isTV: boolean) => void;
  setIsGaming: (isGaming: boolean) => void;
  setLayout: (layout: DesktopLayout) => void;
}

export interface OSState {
  theme: Theme;
  accentColor: string;
  glassOpacity: number;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  volume: number;
  brightness: number;
  batteryLevel: number;
  isCharging: boolean;
  inactivityTimeout: number;
  spotlightOpen: boolean;
  controlCenterOpen: boolean;
  calendarOverlayOpen: boolean;
  accountSwitcherOpen: boolean;
  membersPanelOpen: boolean;
  switcherOpen: boolean;
  switcherIndex: number;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setBatteryStatus: (level: number, charging: boolean) => void;
  setSettings: (settings: Partial<Pick<OSState, 'theme' | 'accentColor' | 'glassOpacity' | 'wifiEnabled' | 'bluetoothEnabled' | 'volume' | 'brightness' | 'inactivityTimeout'>>) => void;
  setSpotlightOpen: (open: boolean) => void;
  setControlCenterOpen: (open: boolean) => void;
  setCalendarOverlayOpen: (open: boolean) => void;
  setAccountSwitcherOpen: (open: boolean) => void;
  setMembersPanelOpen: (open: boolean) => void;
  setSwitcherOpen: (open: boolean) => void;
  setSwitcherIndex: (index: number) => void;
  toggleSpotlight: () => void;
  toggleControlCenter: () => void;
  toggleCalendarOverlay: () => void;
  toggleAccountSwitcher: () => void;
  toggleMembersPanel: () => void;
  closeAllOSPanels: () => void;
  closeEverything: () => void;
  launchUrl: (url: string) => void;
}

export interface AuthStore {
  isAuthenticated: boolean;
  isLocked: boolean;
  currentUser: User | null;
  activeOrgId: string | null;
  loggedInUsers: User[];
  login: (user: User, orgId?: string) => void;
  switchAccount: (userId: string, orgId: string) => void;
  logout: (userId?: string) => void;
  lockSession: () => void;
  unlockSession: () => void;
  powerDown: () => void;
  updateUser: (updates: Partial<User>) => void;
  switchOrganization: (orgId: string) => void;
}

export interface AuthUIStore {
  selectedUser: User | null;
  selectedOrgId: string | null;
  emailInput: string;
  passwordInput: string;
  isAddingAccount: boolean;
  isEntering: boolean;
  isSendingLink: boolean;
  linkSent: boolean;
  error: boolean;
  setSelectedUser: (user: User | null) => void;
  setSelectedOrgId: (orgId: string | null) => void;
  setEmailInput: (email: string) => void;
  setPasswordInput: (pass: string) => void;
  setIsAddingAccount: (active: boolean) => void;
  completeEntrance: () => void;
  triggerError: () => void;
  requestMagicLink: (user: User) => Promise<void>;
  reset: () => void;
}

export interface UserStore {
  currentUser: User | null;
  mockUsers: User[];
  organizations: Organization[];
  roleConfigs: RoleConfig[];
  updateCurrentUser: (userData: Partial<User>) => void;
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
  updateRolePermissions: (role: UserRole, permissions: Permission[]) => void;
  addRole: (config: RoleConfig) => void;
  deleteRole: (role: UserRole) => void;
  createOrganization: (name: string, ownerId: string) => void;
  getOrganization: (id: string) => Organization | undefined;
  getUserOrganizations: (userId: string) => Organization[];
  inviteUserToOrg: (orgId: string, email: string) => void;
}

export interface WindowStore {
  windows: WindowState[];
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activeInstanceId: string | null;
  sessions: Record<string, UserSession>; // Key is "userId:orgId"
  
  openWindow: (appId: AppId, forceNew?: boolean, launchArgs?: Record<string, any>) => void;
  openChildWindow: (parentId: string, appId: AppId, config?: { title?: string, width?: number, height?: number, modal?: boolean }) => void;
  closeWindow: (instanceId: string) => void;
  minimizeWindow: (instanceId: string) => void;
  maximizeWindow: (instanceId: string) => void;
  snapWindow: (instanceId: string, snap: SnapType) => void;
  focusWindow: (instanceId: string) => void;
  blurWindows: () => void;
  minimizeAll: () => void;
  updateWindowPosition: (instanceId: string, x: number, y: number) => void;
  updateWindowSize: (instanceId: string, width: number | string, height: number | string) => void;
  updateWindowScale: (instanceId: string, scale: number) => void;
  updateWindowPreview: (instanceId: string, preview: string) => void;
  setActiveWorkspace: (workspaceId: string) => void;
  addWorkspace: () => void;
  removeWorkspace: (workspaceId: string) => void;
  renameWorkspace: (workspaceId: string, name: string) => void;
  updateWorkspaceBackground: (workspaceId: string, background: string) => void;
  
  loadSession: (userId: string, orgId: string) => void;
  clearAllSessions: () => void;
  _sync: () => void;
}
