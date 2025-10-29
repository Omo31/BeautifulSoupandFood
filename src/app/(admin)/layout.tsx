
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
  SidebarFooter
} from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminNavItems } from '@/lib/admin-nav';
import { useToast } from '@/hooks/use-toast.tsx';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    toast({
      title: 'Logged Out (Simulated)',
      description: "You have been successfully logged out.",
    });
    router.push('/');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar>
            <SidebarHeader>
              <Logo />
            </SidebarHeader>
            <SidebarContent>
              <ScrollArea className="flex-1">
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
              </ScrollArea>
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
          <main className="flex-1 p-6">
              {children}
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
