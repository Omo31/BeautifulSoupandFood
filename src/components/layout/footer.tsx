'use client';

import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '../ui/button';
import { footerSettings } from '@/lib/settings';
import { useToast } from '@/hooks/use-toast';

export function Footer() {
  const { facebookUrl, instagramUrl, youtubeUrl, openingHours, termsUrl, privacyUrl, cookiePolicyUrl } = footerSettings;
  const hasSocials = facebookUrl || instagramUrl || youtubeUrl;
  const { toast } = useToast();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    const href = e.currentTarget.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      toast({
        title: 'Coming Soon!',
        description: `The ${label} page is under construction.`,
      });
    }
  };


  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm">
              Delivering fresh, high-quality produce and gourmet products right to your door.
            </p>
             {openingHours && (
                <div>
                    <h4 className="font-semibold text-card-foreground">Opening Hours</h4>
                    <p className="text-sm whitespace-pre-line">{openingHours}</p>
                </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-card-foreground">Shop</h4>
            <Link href="/shop" className="text-sm hover:text-primary">
              All Products
            </Link>
            <Link href="/custom-order" className="text-sm hover:text-primary">
              Custom Orders
            </Link>
            <a href="#" className="text-sm hover:text-primary" onClick={(e) => handleLinkClick(e, 'Featured Products')}>
              Featured
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-card-foreground">Support</h4>
            <a href="#" className="text-sm hover:text-primary" onClick={(e) => handleLinkClick(e, 'Contact Us')}>
              Contact Us
            </a>
            <a href="#" className="text-sm hover:text-primary" onClick={(e) => handleLinkClick(e, 'FAQ')}>
              FAQ
            </a>
            <a href="#" className="text-sm hover:text-primary" onClick={(e) => handleLinkClick(e, 'Shipping & Returns')}>
              Shipping & Returns
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-card-foreground">Legal</h4>
            {termsUrl && (
              <Link href={termsUrl} className="text-sm hover:text-primary">
                Terms of Service
              </Link>
            )}
            {privacyUrl && (
              <Link href={privacyUrl} className="text-sm hover:text-primary">
                Privacy Policy
              </Link>
            )}
            {cookiePolicyUrl && (
              <Link href={cookiePolicyUrl} className="text-sm hover:text-primary">
                Cookie Policy
              </Link>
            )}
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-sm">
          <p>&copy; {new Date().getFullYear()} BeautifulSoup&Food. All rights reserved.</p>
          {hasSocials && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Follow us on</span>
              {facebookUrl && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </a>
                </Button>
              )}
              {instagramUrl && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </a>
                </Button>
              )}
              {youtubeUrl && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Youtube className="h-5 w-5" />
                    <span className="sr-only">YouTube</span>
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
