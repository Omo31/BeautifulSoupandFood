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
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/conversations', label: 'Conversations', icon: MessageSquare },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/flyer-generator', label: 'Flyer Generator', icon: Megaphone },
  { href: '/analytics', label: 'Analytics', icon: BarChart },
  { href: '/accounting', label: 'Accounting', icon: Book },
  { href: '/settings/homepage', label: 'Settings', icon: Settings },
];

export const adminSettingsNavItems = [
    { href: '/settings/homepage', label: 'Homepage' },
    { href: '/settings/footer', label: 'Footer' },
    { href: '/settings/roles', label: 'Roles' },
    { href: '/settings/custom-orders', label: 'Custom Orders'},
];

export const accountNavItems = [
    { href: '/account/profile', label: 'My Profile', icon: UserIcon },
    { href: '/account/orders', label: 'My Orders', icon: ShoppingCart },
]
