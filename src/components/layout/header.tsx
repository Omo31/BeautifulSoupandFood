"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, Bell, Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/soup", label: "Soup" },
  { href: "/custom-order", label: "Custom Orders" },
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

function SearchBar() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md hidden md:block">
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

export function Header() {
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // TODO: Replace with actual auth state
  const isAuthenticated = false;

  const mobileNavLinks = [
      ...navLinks,
      { href: "/my-orders", label: "My Orders" },
      { href: "/wishlist", label: "Wishlist" },
  ];

  const desktopNav = (
    <nav className="hidden md:flex items-center gap-2">
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
            {mobileNavLinks.map((link) => (
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
    <>
      <NotificationBell />
      <Button variant="ghost" size="icon" asChild>
        <Link href="/account/profile">
          <User />
          <span className="sr-only">My Account</span>
        </Link>
      </Button>
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
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {isClient && isMobile ? mobileNav : <Logo />}
          {isClient && !isMobile && desktopNav}
        </div>
        
        {isClient && (isMobile ? <Logo /> : <SearchBar />)}
        
        <div className="flex items-center gap-1">
          {isClient && (
            <>
              <CartButton />
              {authButtons}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
