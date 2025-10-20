'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  return (
    <div className="container py-12">
       <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Shopping Cart</CardTitle>
          <CardDescription>Review your items before proceeding to checkout.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            <p>Your cart is empty.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-4 bg-muted/50 p-6">
          <div className="flex justify-between w-full max-w-sm">
            <span>Subtotal</span>
            <span>$0.00</span>
          </div>
           <div className="flex justify-between w-full max-w-sm text-sm text-muted-foreground">
            <span>Service Charge (6%)</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between w-full max-w-sm font-bold text-lg">
            <span>Total</span>
            <span>$0.00</span>
          </div>
          <Button size="lg" disabled>Proceed to Checkout</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
