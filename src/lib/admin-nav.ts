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
