import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/hooks/use-cart';
import { ToastProvider } from '@/hooks/use-toast.tsx';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'BeautifulSoup&Food - Gourmet Foods & Fresh Produce',
    template: '%s | BeautifulSoup&Food',
  },
  description: 'Discover and order from a curated selection of gourmet produce, artisan goods, pantry essentials, and delicious soups, delivered fresh to your door.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ToastProvider>
          <CartProvider>
            {children}
          </CartProvider>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
