"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, Bell, Heart } from "lucide-react";
import { Logo } from "@/components/logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/soup", label: "Soup" },
  { href: "/custom-order", label: "Custom Orders" },
  { href: "/my-orders", label: "My Orders" },
  { href: "/wishlist", label: "Wishlist" },
];

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

export function Header() {
  const isMobile = useIsMobile();
  // TODO: Replace with actual auth state
  const isAuthenticated = false;

  const desktopNav = (
    <nav className="hidden md:flex items-center gap-6">
      {navLinks.map((link) => (
        <Button key={link.href} variant="link" asChild>
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </nav>
  );

  const mobileNav = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
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
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" className="justify-start" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  const authButtons = isAuthenticated ? (
    <div className="flex items-center gap-2">
      <NotificationBell />
      <Button variant="ghost" size="icon" asChild>
        <Link href="/cart">
          <ShoppingCart />
          <span className="sr-only">Cart</span>
        </Link>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <Link href="/admin/dashboard">
          <User />
          <span className="sr-only">My Account</span>
        </Link>
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
       <Button variant="ghost" size="icon" asChild>
        <Link href="/cart">
          <ShoppingCart />
          <span className="sr-only">Cart</span>
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {isMobile ? mobileNav : <Logo />}
          {!isMobile && desktopNav}
        </div>
        {isMobile && <Logo />}
        {authButtons}
      </div>
    </header>
  );
}
