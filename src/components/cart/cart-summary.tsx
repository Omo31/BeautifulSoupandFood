'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Home } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { ShippingAddressDialog } from '../shared/shipping-address-dialog';
import type { Address } from '../shared/shipping-address-dialog';

export function CartSummary() {
  const router = useRouter();
  const { toast } = useToast();
  const { cart, cartTotal } = useCart();
  const [shippingMethod, setShippingMethod] = useState<string>('');
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

  const cartIsEmpty = cart.length === 0;
  const serviceCharge = cartTotal * 0.06;
  const total = cartTotal + serviceCharge;
  
  const handleSaveAddress = (address: Address) => {
    setShippingAddress(address);
    setIsAddressDialogOpen(false);
     toast({
      title: 'Address Saved',
      description: 'Your shipping address has been successfully saved.',
    });
  };

  const handleSubmit = () => {
    if (shippingMethod === 'set-shipping-fee' && !shippingAddress) {
      toast({
        title: 'Missing Address',
        description: 'Please add a shipping address before submitting for a quote.',
        variant: 'destructive',
      });
      return;
    }
    
    if (shippingMethod === 'pickup') {
      // In a real app, this would redirect to a payment gateway
      toast({
        title: 'Proceeding to Payment',
        description: 'You will now be redirected to complete your payment.',
      });
    } else if (shippingMethod === 'set-shipping-fee') {
      // In a real app, this would submit the order to the backend for admin review
      console.log('Submitting order with shipping address:', shippingAddress);
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
    <>
      <div className="flex flex-col items-stretch gap-6 bg-muted/50 p-6">
        <div className="grid gap-2">
          <Label htmlFor="shipping-method">Shipping Method</Label>
          <Select onValueChange={setShippingMethod} value={shippingMethod} required disabled={cartIsEmpty}>
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
          {shippingMethod === 'set-shipping-fee' && (
             <div className="mt-2">
                {shippingAddress ? (
                     <div className="p-3 border rounded-md bg-background text-sm">
                         <p className="font-semibold">Shipping to:</p>
                         <p className="text-muted-foreground whitespace-pre-wrap">{shippingAddress.address}</p>
                         <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setIsAddressDialogOpen(true)}>
                             Edit or change address
                         </Button>
                     </div>
                ) : (
                    <Button variant="outline" className="w-full" onClick={() => setIsAddressDialogOpen(true)}>
                        <Home className="mr-2 h-4 w-4" />
                        Add Shipping Address
                    </Button>
                )}
             </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex justify-between w-full max-w-sm">
            <span>Subtotal</span>
            <span>₦{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full max-w-sm text-sm text-muted-foreground">
            <span>Service Charge (6%)</span>
            <span>₦{serviceCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-full max-w-sm text-sm text-muted-foreground">
            <span>Shipping Fee</span>
            <span>
              {shippingMethod === 'pickup' ? 'N/A' : 'To be determined'}
            </span>
          </div>
          <Separator className="my-2 max-w-sm" />
          <div className="flex justify-between w-full max-w-sm font-bold text-lg">
            <span>Total</span>
            <span>₦{total.toFixed(2)}</span>
          </div>
          <Button
            size="lg"
            disabled={cartIsEmpty || !shippingMethod}
            className="mt-4"
            onClick={handleSubmit}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
      <ShippingAddressDialog
        isOpen={isAddressDialogOpen}
        setIsOpen={setIsAddressDialogOpen}
        onSave={handleSaveAddress}
        currentAddress={shippingAddress}
      />
    </>
  );
}
