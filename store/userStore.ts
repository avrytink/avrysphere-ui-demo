
import { create } from 'zustand';
import { UserStore, User, UserRole, Permission, RoleConfig, DesktopLayout, Organization, OSMode } from '../types';

const INITIAL_ROLES: RoleConfig[] = [
  {
    role: 'superadmin',
    description: 'Master system root with unrevokable hardware access.',
    permissions: Object.values(Permission),
    isSystem: true
  },
  {
    role: 'admin',
    description: 'Elevated system operator for identity and resource management.',
    permissions: [
      Permission.USER_MANAGEMENT,
      Permission.TERMINAL_ACCESS,
      Permission.SYSTEM_SETTINGS,
      Permission.WORKSPACE_MODIFICATION
    ],
    isSystem: true
  },
  {
    role: 'member',
    description: 'Standard utility user with basic operational capacity.',
    permissions: [
      Permission.TERMINAL_ACCESS,
      Permission.WORKSPACE_MODIFICATION
    ],
    isSystem: true
  },
  {
    role: 'invited',
    description: 'Restricted guest account with read-only access.',
    permissions: [],
    isSystem: true
  }
];

const MOCK_ORGS: Organization[] = [
  { id: 'org-avry', name: 'Avry Corp', ownerId: 'admin', members: ['admin', 'dev', 'creative', 'analyst', 'marketer', 'support'] },
  { id: 'org-unity', name: 'Unity Labs', ownerId: 'dev', members: ['dev', 'admin'] },
  { id: 'org-design', name: 'Design Studio', ownerId: 'creative', members: ['creative', 'admin'] },
  { id: 'org-data', name: 'Data Systems', ownerId: 'analyst', members: ['analyst', 'admin'] },
  { id: 'org-market', name: 'Global Marketing', ownerId: 'marketer', members: ['marketer', 'admin'] },
  { id: 'org-support', name: 'Customer Success', ownerId: 'support', members: ['support'] },
  { id: 'org-sales', name: 'Sales Force', ownerId: 'sales', members: ['sales'] },
  { id: 'org-eng', name: 'Core Engineering', ownerId: 'engineer', members: ['engineer'] },
  { id: 'org-hr', name: 'People Ops', ownerId: 'hr', members: ['hr'] },
  { id: 'org-finance', name: 'Capital Group', ownerId: 'finance', members: ['finance'] }
];

const MOCK_USERS: User[] = [
  // 1. Root User
  {
    id: 'admin',
    name: 'Administrator',
    email: 'root@avryos.local',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    background: 'https://i.imgur.com/zJ4iCUp.jpeg',
    role: 'superadmin',
    password: '1234',
    organizationIds: ['org-avry', 'org-unity', 'org-design', 'org-data'], // Reduced to 4 orgs
    settings: {
      layout: DesktopLayout.AVRY,
      mode: OSMode.DESKTOP,
      theme: 'dark',
      accentColor: '#3B82F6',
      brightness: 100,
      volume: 80,
      dockCollapsed: false
    }
  },
  // 2. Existing User
  {
    id: 'dev',
    name: 'Sarah Dev',
    email: 'sarah.dev@avryos.local',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    background: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=2000',
    role: 'admin',
    password: '1234',
    organizationIds: ['org-unity', 'org-avry'],
    settings: {
      layout: DesktopLayout.AVRY,
      mode: OSMode.DESKTOP,
      theme: 'dark',
      accentColor: '#10B981',
      brightness: 80,
      volume: 40,
      dockCollapsed: true
    }
  },
  // 3. Existing User
  {
    id: 'creative',
    name: 'David Design',
    email: 'david.design@avryos.local',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop',
    background: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=2000',
    role: 'member',
    password: '1234',
    organizationIds: ['org-design', 'org-avry'],
    settings: {
      layout: DesktopLayout.AVRY,
      mode: OSMode.DESKTOP,
      theme: 'dark',
      accentColor: '#6366F1',
      brightness: 90,
      volume: 65,
      dockCollapsed: false
    }
  },
  // 4. New User (Invited to Avry, Root added to Data)
  {
    id: 'analyst',
    name: 'Alice Data',
    email: 'alice.data@avryos.local',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    background: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000',
    role: 'member',
    password: '1234',
    organizationIds: ['org-data', 'org-avry'],
    settings: {
      layout: DesktopLayout.AVRY,
      mode: OSMode.DESKTOP,
      theme: 'dark',
      accentColor: '#F59E0B',
      brightness: 85,
      volume: 50,
      dockCollapsed: false
    }
  },
  // 5. New User (Invited to Avry, Root added to Market)
  {
    id: 'marketer',
    name: 'Mike Market',
    email: 'mike.market@avryos.local',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    background: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000',
    role: 'member',
    password: '1234',
    organizationIds: ['org-market', 'org-avry'],
    settings: {
      layout: DesktopLayout.UNITY,
      mode: OSMode.DESKTOP,
      theme: 'light',
      accentColor: '#EC4899',
      brightness: 95,
      volume: 70,
      dockCollapsed: false
    }
  },
  // 6. New User (Invited to Avry)
  {
    id: 'support',
    name: 'Sam Support',
    email: 'sam.support@avryos.local',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop',
    background: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000',
    role: 'member',
    password: '1234',
    organizationIds: ['org-support', 'org-avry'],
    settings: {
      layout: DesktopLayout.AVRY,
      mode: OSMode.DESKTOP,
      theme: 'dark',
      accentColor: '#14B8A6',
      brightness: 70,
      volume: 30,
      dockCollapsed: true
    }
  },
  // 7. New User (Standalone)
  {
    id: 'sales',
    name: 'Sally Sales',
    email: 'sally.sales@avryos.local',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    background: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000',
    role: 'admin',
    password: '1234',
    organizationIds: ['org-sales'],
    settings: {
      layout: DesktopLayout.UNITY,
      mode: OSMode.DESKTOP,
      theme: 'light',
      accentColor: '#EF4444',
      brightness: 100,
      volume: 100,
      dockCollapsed: false
    }
  },
  // 8. New User (Standalone)
  {
    id: 'engineer',
    name: 'Evan Eng',
    email: 'evan.eng@avryos.local',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    background: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2000',
    role: 'member',
    password: '1234',
    organizationIds: ['org-eng'],
    settings: {
      layout: DesktopLayout.AVRY,
      mode: OSMode.DESKTOP,
      theme: 'dark',
      accentColor: '#6366F1',
      brightness: 60,
      volume: 20,
      dockCollapsed: true
    }
  },
  // 9. New User (Standalone)
  {
    id: 'hr',
    name: 'Holly HR',
    email: 'holly.hr@avryos.local',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    background: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000',
    role: 'admin',
    password: '1234',
    organizationIds: ['org-hr'],
    settings: {
      layout: DesktopLayout.UNITY,
      mode: OSMode.DESKTOP,
      theme: 'light',
      accentColor: '#8B5CF6',
      brightness: 90,
      volume: 60,
      dockCollapsed: false
    }
  },
  // 10. New User (Standalone)
  {
    id: 'finance',
    name: 'Frank Finance',
    email: 'frank.finance@avryos.local',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    background: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&q=80&w=2000',
    role: 'superadmin',
    password: '1234',
    organizationIds: ['org-finance'],
    settings: {
      layout: DesktopLayout.AVRY,
      mode: OSMode.DESKTOP,
      theme: 'dark',
      accentColor: '#10B981',
      brightness: 95,
      volume: 85,
      dockCollapsed: false
    }
  }
];

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: null,
  mockUsers: MOCK_USERS,
  organizations: MOCK_ORGS,
  roleConfigs: INITIAL_ROLES,
  
  setCurrentUser: (user: User | null) => set({ currentUser: user }),
  
  updateCurrentUser: (userData: Partial<User>) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...userData } : null
  })),

  addUser: (user: User) => set((state) => ({
    mockUsers: [...state.mockUsers, user]
  })),

  removeUser: (userId: string) => set((state) => ({
    mockUsers: state.mockUsers.filter(u => u.id !== userId)
  })),

  updateUser: (userId: string, userData: Partial<User>) => set((state) => ({
    mockUsers: state.mockUsers.map(u => u.id === userId ? { ...u, ...userData } : u),
    currentUser: state.currentUser?.id === userId ? { ...state.currentUser, ...userData } : state.currentUser
  })),

  updateRolePermissions: (role: UserRole, permissions: Permission[]) => set((state) => ({
    roleConfigs: state.roleConfigs.map(config => 
      config.role === role ? { ...config, permissions } : config
    )
  })),

  addRole: (config: RoleConfig) => set((state) => ({
    roleConfigs: [...state.roleConfigs, config]
  })),

  deleteRole: (role: UserRole) => set((state) => ({
    roleConfigs: state.roleConfigs.filter(c => c.role !== role)
  })),

  createOrganization: (name: string, ownerId: string) => {
    const newOrgId = `org-${Math.random().toString(36).substr(2, 6)}`;
    const newOrg: Organization = {
      id: newOrgId,
      name,
      ownerId,
      members: [ownerId]
    };

    set((state) => {
      // Update the owner to include this new org ID
      const updatedUsers = state.mockUsers.map(u => {
        if (u.id === ownerId) {
          return { ...u, organizationIds: [...u.organizationIds, newOrgId] };
        }
        return u;
      });

      // Update current user if they are the owner
      const updatedCurrentUser = state.currentUser?.id === ownerId 
        ? { ...state.currentUser, organizationIds: [...state.currentUser.organizationIds, newOrgId] }
        : state.currentUser;

      return {
        organizations: [...state.organizations, newOrg],
        mockUsers: updatedUsers,
        currentUser: updatedCurrentUser
      };
    });
  },

  getOrganization: (id: string) => get().organizations.find(o => o.id === id),

  getUserOrganizations: (userId: string) => {
    const { organizations, mockUsers } = get();
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return [];
    return organizations.filter(org => user.organizationIds.includes(org.id));
  },

  inviteUserToOrg: (orgId: string, email: string) => {
    // Mock invitation logic - in a real app this would send an email
    console.log(`Inviting ${email} to org ${orgId}`);
  }
}));
