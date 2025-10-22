import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
}
