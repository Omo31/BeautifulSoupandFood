import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Megaphone,
  BarChart,
  Book,
  Settings,
  MessageSquare,
  User as UserIcon,
} from 'lucide-react';

export const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/conversations', label: 'Conversations', icon: MessageSquare },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
  { href: '/admin/flyer-generator', label: 'Flyer Generator', icon: Megaphone },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
  { href: '/admin/accounting', label: 'Accounting', icon: Book },
  { href: '/admin/settings/homepage', label: 'Settings', icon: Settings },
];

export const adminSettingsNavItems = [
    { href: '/admin/settings/homepage', label: 'Homepage' },
    { href: '/admin/settings/footer', label: 'Footer' },
    { href: '/admin/settings/roles', label: 'Roles' },
];

export const accountNavItems = [
    { href: '/account/profile', label: 'My Profile', icon: UserIcon },
    { href: '/account/orders', label: 'My Orders', icon: ShoppingCart },
]
