'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [shippingMethod, setShippingMethod] = useState<string>('');

  const cartIsEmpty = true; // Placeholder for cart state

  const handleSubmit = () => {
    if (shippingMethod === 'pickup') {
      // In a real app, this would redirect to a payment gateway
      toast({
        title: 'Proceeding to Payment',
        description: 'You will now be redirected to complete your payment.',
      });
    } else if (shippingMethod === 'set-shipping-fee') {
      // In a real app, this would submit the order to the backend for admin review
      toast({
        title: 'Order Submitted for Review',
        description: "Your order has been submitted. We'll notify you once the shipping fee is set.",
      });
      router.push('/my-orders');
    }
  };
  
  const getButtonText = () => {
    if (shippingMethod === 'pickup') return 'Proceed to Payment';
    if (shippingMethod === 'set-shipping-fee') return 'Submit for Shipping Quote';
    return 'Proceed to Checkout';
  };

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
            <div className="text-center text-muted-foreground py-12">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div>
              {/* Cart items would be listed here */}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-6 bg-muted/50 p-6">
           <div className="grid gap-2">
            <Label htmlFor="shipping-method">Shipping Method</Label>
            <Select onValueChange={setShippingMethod} value={shippingMethod} required>
              <SelectTrigger id="shipping-method">
                <SelectValue placeholder="Select a shipping method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="set-shipping-fee">Set Shipping Fee</SelectItem>
              </SelectContent>
            </Select>
            {shippingMethod === 'pickup' && (
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertTitle>Pickup Information</AlertTitle>
                <AlertDescription>
                  You will be notified when your order is ready. Please collect it from our store at 123 Gourmet Lane, Foodie City.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex justify-between w-full max-w-sm">
              <span>Subtotal</span>
              <span>$0.00</span>
            </div>
             <div className="flex justify-between w-full max-w-sm text-sm text-muted-foreground">
              <span>Service Charge (6%)</span>
              <span>$0.00</span>
            </div>
             <div className="flex justify-between w-full max-w-sm text-sm text-muted-foreground">
              <span>Shipping Fee</span>
              <span>{shippingMethod === 'pickup' ? 'N/A' : 'To be determined'}</span>
            </div>
            <Separator className="my-2 max-w-sm" />
            <div className="flex justify-between w-full max-w-sm font-bold text-lg">
              <span>Total</span>
              <span>$0.00</span>
            </div>
            <Button size="lg" disabled={cartIsEmpty || !shippingMethod} className="mt-4" onClick={handleSubmit}>
              {getButtonText()}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
