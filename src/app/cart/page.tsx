'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  const router = useRouter();
  const { cart } = useCart();
  const cartIsEmpty = cart.length === 0;

  return (
    <div className="container py-12">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Shopping Cart</CardTitle>
          <CardDescription>Review your items and select a shipping method before proceeding to checkout.</CardDescription>
        </CardHeader>
        <CardContent>
          {cartIsEmpty ? (
            <div className="text-center text-muted-foreground py-24 flex flex-col items-center">
              <ShoppingCart className="h-12 w-12 mb-4 text-muted-foreground" />
              <p className="text-lg">Your cart is empty.</p>
              <Button onClick={() => router.push('/shop')} className="mt-4">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
        {!cartIsEmpty && <Separator />}
        <CardFooter className="p-0">
          <CartSummary />
        </CardFooter>
      </Card>
    </div>
  );
}
