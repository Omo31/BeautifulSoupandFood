
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Cookie } from 'lucide-react';

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
  };
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out",
      showBanner ? "translate-y-0" : "translate-y-full"
    )}>
        <div className="container p-0">
            <div className="bg-secondary text-secondary-foreground shadow-lg rounded-t-lg p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <Cookie className="h-6 w-6 mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                        <h3 className="font-semibold">Cookie Consent</h3>
                        <p className="text-sm">
                            We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept," you consent to our use of cookies. Read our{' '}
                            <Link href="/cookie-policy" className="underline hover:text-primary">
                            Cookie Policy
                            </Link>.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <Button onClick={handleAccept} size="sm">Accept</Button>
                    <Button onClick={handleDecline} variant="outline" size="sm">Decline</Button>
                </div>
            </div>
        </div>
    </div>
  );
}
