'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import { LogOut, Bell } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminNavItems } from '@/lib/admin-nav';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast.tsx';


const mockNotifications = [
    { id: 1, title: "New order #54321", description: "A custom order has been placed by Jane Doe.", time: "2m ago" },
    { id: 2, title: "Low stock warning", description: "Artisan Sourdough has only 5 items left.", time: "30m ago" },
    { id: 3, title: "New user registered", description: "john.doe@example.com just signed up.", time: "2h ago" },
];

function AdminNotificationBell() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Bell />
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Admin Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                            You have {mockNotifications.length} unread messages.
                        </p>
                    </div>
                    <Separator />
                    <div className="grid gap-2">
                        {mockNotifications.map((notification) => (
                            <div key={notification.id} className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium">{notification.title}</p>
                                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: 'Logged Out (Simulated)',
      description: "You have been successfully logged out.",
    });
    // In a real app, you'd redirect to the login page here.
    // router.push('/auth/login');
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className='flex items-center gap-2'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src="https://picsum.photos/seed/admin-user/40/40" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className='flex flex-col text-sm'>
                  <span className='font-semibold'>Admin User</span>
                  <span className='text-muted-foreground'>admin@gourmet.com</span>
              </div>
            </div>
            <Button variant='ghost' size='icon' onClick={handleLogout}>
                <LogOut/>
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-xl">
              {adminNavItems.find(item => pathname.startsWith(item.href))?.label || 'Admin'}
            </h1>
          </div>
          <AdminNotificationBell />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
