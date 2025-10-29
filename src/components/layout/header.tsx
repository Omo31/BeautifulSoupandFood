
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, Bell, Search, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { mainNavLinks, mobileNavLinks, accountNavItems } from "@/lib/nav-links";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast.tsx";
import { Skeleton } from "../ui/skeleton";

const mockNotifications = [
    { id: 1, title: "Your order has shipped!", description: "Order #12345 is on its way.", time: "5m ago" },
    { id: 2, title: "New product available", description: "Fresh truffles are now in stock.", time: "1h ago" },
    { id: 3, title: "Welcome to BeautifulSoup&Food!", description: "Thanks for signing up.", time: "1d ago" },
];

function NotificationBell() {
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
                        <h4 className="font-medium leading-none">Notifications</h4>
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

function CartButton() {
  const { cartCount } = useCart();
  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/cart">
        <div className="relative">
          <ShoppingCart />
          {cartCount > 0 && (
            <Badge 
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {cartCount}
            </Badge>
          )}
        </div>
        <span className="sr-only">Cart</span>
      </Link>
    </Button>
  )
}

function UserMenu() {
    const { toast } = useToast();
    const router = useRouter();

    const handleLogout = () => {
        toast({
            title: 'Logged Out (Simulated)',
            description: "You have been successfully logged out.",
        });
        // In a real app, you'd clear auth state here.
        router.push('/auth/login');
    };
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <User />
                    <span className="sr-only">My Account</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 mr-4">
                <div className="flex items-center gap-3 p-2">
                    <Avatar className='h-9 w-9'>
                        <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">User</p>
                        <p className="text-xs text-muted-foreground">user@example.com</p>
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col p-1">
                     {accountNavItems.map((item) => (
                        <Button
                            key={item.href}
                            variant="ghost"
                            className="justify-start gap-2"
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        </Button>
                    ))}
                </div>
                <Separator />
                <Button variant="ghost" className="w-full justify-start gap-2 p-1" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </PopoverContent>
        </Popover>
    )
}

function AuthButtons() {
    const [isClient, setIsClient] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsClient(true);
        // This is a simulation. In a real app, you'd check a real auth state (e.g., from a cookie or context).
        setIsAuthenticated(pathname.startsWith('/account') || pathname.startsWith('/admin') || pathname.startsWith('/dashboard'));
    }, [pathname]);

    if (!isClient) {
        // Render a skeleton or placeholder on the server and during initial client render
        return (
            <div className="flex items-center gap-2">
                <CartButton />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <CartButton />
            {isAuthenticated ? (
                <>
                    <NotificationBell />
                    <UserMenu />
                </>
            ) : (
                <>
                    <Button variant="ghost" asChild>
                        <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                </>
            )}
        </div>
    );
}

export function Header() {
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
            <Logo />
            <nav className="flex items-center gap-2">
                {mainNavLinks.map((link) => (
                    <Button key={link.href} variant="link" asChild>
                        <Link href={link.href}>{link.label}</Link>
                    </Button>
                ))}
            </nav>
            <SearchBar />
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-2 md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open navigation menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left">
                <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 pt-8">
                    <Logo />
                    <nav className="flex flex-col gap-4">
                    {mobileNavLinks.map((link) => (
                        <Button key={link.href} variant="ghost" className="justify-start" asChild>
                        <Link href={link.href}>{link.label}</Link>
                        </Button>
                    ))}
                    </nav>
                </div>
                </SheetContent>
            </Sheet>
            <Logo />
        </div>

        <div className="flex items-center">
            <AuthButtons />
        </div>
      </div>
    </header>
  );
}
