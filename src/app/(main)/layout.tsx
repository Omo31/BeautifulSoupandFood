
'use client';

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { FloatingChatWidget } from "@/components/shared/floating-chat-widget";
import { usePathname } from "next/navigation";
import AccountLayout from "../account/layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if the current path is under /account
  const isAccountPage = pathname.startsWith('/account');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {isAccountPage ? <AccountLayout>{children}</AccountLayout> : children}
      </main>
      <Footer />
      <CookieConsentBanner />
      <FloatingChatWidget />
    </div>
  );
}
