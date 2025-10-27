
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
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import { LogOut, Bell, Menu } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminNavItems, mainNavLinks, accountNavItems } from '@/lib/nav-links';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast.tsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SidebarSeparator } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';


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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <ScrollArea className="flex-1">
            <SidebarContent>
            <SidebarMenu>
                <p className="text-xs text-muted-foreground px-4 py-2">Admin</p>
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
            <SidebarSeparator className='my-4' />
            <SidebarMenu>
                <p className="text-xs text-muted-foreground px-4 py-2">My Account</p>
                {accountNavItems.map((item) => (
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
            <SidebarSeparator className='my-4' />
            <SidebarMenu>
                <p className="text-xs text-muted-foreground px-4 py-2">Storefront</p>
                {mainNavLinks.map((item) => (
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
        </ScrollArea>
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
      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation menu</span>
              </Button>
              </SheetTrigger>
              <SheetContent side="left">
                  <SheetHeader>
                      <SheetTitle><Logo /></SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-4rem)]">
                    <nav className="flex flex-col gap-4 pt-4 pr-4">
                        {[...adminNavItems, ...mainNavLinks].map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname.startsWith(item.href) ? 'default': 'ghost'}
                                className="justify-start"
                                onClick={() => setIsMobileMenuOpen(false)}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className='mr-2 h-4 w-4' />
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                  </ScrollArea>
              </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <SidebarTrigger className="hidden md:flex"/>
            <div className="hidden md:block"><Logo/></div>
          </div>
          <h1 className="text-lg font-semibold md:text-xl flex-1">
            {[...adminNavItems, ...mainNavLinks].find(item => pathname.startsWith(item.href))?.label || 'Admin'}
          </h1>
          <AdminNotificationBell />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
