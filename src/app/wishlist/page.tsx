'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const router = useRouter();

  return (
    <div className="container py-12">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Heart className="h-8 w-8" /> My Wishlist
          </CardTitle>
          <CardDescription>
            Your saved items for later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-24">
            <p>Your wishlist is empty.</p>
            <p className="text-sm">Start adding products you love!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
