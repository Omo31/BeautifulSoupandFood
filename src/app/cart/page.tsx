'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { SavedItem } from "@/components/cart/saved-item";

export default function CartPage() {
  const router = useRouter();
  const { cart, savedItems } = useCart();
  const cartIsEmpty = cart.length === 0;
  const savedItemsIsEmpty = savedItems.length === 0;

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

      {!savedItemsIsEmpty && (
        <div className="mt-12">
            <h2 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2">
                <Bookmark className="h-6 w-6" />
                Saved for Later ({savedItems.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {savedItems.map((item) => (
                    <SavedItem key={item.id} item={item} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
