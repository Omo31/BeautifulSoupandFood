"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Logo } from "@/components/logo";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/custom-order", label: "Custom Orders" },
  { href: "/my-orders", label: "My Orders" },
];

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
