'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const addressSchema = z.object({
  address: z.string().min(5, 'Street address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State / Province is required.'),
  zip: z.string().min(3, 'Postal / ZIP code is required.'),
  country: z.string().min(2, 'Country is required.'),
});

export type Address = z.infer<typeof addressSchema>;

type ShippingAddressDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (address: Address) => void;
  currentAddress?: Address | null;
};

export function ShippingAddressDialog({ isOpen, setIsOpen, onSave, currentAddress }: ShippingAddressDialogProps) {
  const form = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
    },
  });

  useEffect(() => {
    if (currentAddress) {
      form.reset(currentAddress);
    } else {
        form.reset({
            address: '',
            city: '',
            state: '',
            zip: '',
            country: 'USA',
        });
    }
  }, [currentAddress, form, isOpen]);

  function onSubmit(values: Address) {
    onSave(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shipping Address</DialogTitle>
          <DialogDescription>
            Please enter the address where you'd like to receive your order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                            <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ZIP / Postal Code</FormLabel>
                        <FormControl>
                            <Input placeholder="90210" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                            <Input placeholder="USA" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Address</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
