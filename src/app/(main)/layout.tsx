
'use client';

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { FloatingChatWidget } from "@/components/shared/floating-chat-widget";
import { usePathname } from "next/navigation";
import { accountNavItems } from "@/lib/nav-links";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAccountPage = accountNavItems.some(item => pathname.startsWith(item.href));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {isAccountPage ? (
          <div className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="md:col-span-1">
                    <Card className="p-4">
                        <nav className="flex flex-col gap-1">
                            {accountNavItems.map(item => (
                                <Button
                                    key={item.href}
                                    variant={pathname === item.href ? "default" : "ghost"}
                                    className="justify-start gap-2"
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </Card>
                </aside>
                <main className="md:col-span-3">
                    {children}
                </main>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
      <CookieConsentBanner />
      <FloatingChatWidget />
    </div>
  );
}
