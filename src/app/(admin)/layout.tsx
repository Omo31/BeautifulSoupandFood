
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
import { LogOut, Search } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminNavItems } from '@/lib/admin-nav';
import { mainNavLinks } from '@/lib/nav-links';
import { useToast } from '@/hooks/use-toast.tsx';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

function SearchBar() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        name="search"
        placeholder="Search for products..."
        className="w-full bg-background pl-9"
      />
    </form>
  )
}

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
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between gap-4">
                <div className="hidden md:flex items-center gap-6">
                    <Logo />
                    <nav className="flex items-center gap-2">
                        {mainNavLinks.map((link) => (
                            <Button key={link.href} variant="link" asChild>
                                <Link href={link.href}>{link.label}</Link>
                            </Button>
                        ))}
                    </nav>
                </div>
                <div className="hidden md:block">
                  <SearchBar />
                </div>
                 <div className="flex items-center gap-1">
                    {/* Placeholder for Cart, Bell, Profile icons */}
                </div>
            </div>
        </header>
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
          <main className="flex-1 p-6 bg-muted/30">
              {children}
          </main>
        </div>
        <footer className="border-t">
          <div className="container py-4 text-center text-sm text-muted-foreground">
             &copy; {new Date().getFullYear()} BeautifulSoup&Food. All rights reserved.
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
}
