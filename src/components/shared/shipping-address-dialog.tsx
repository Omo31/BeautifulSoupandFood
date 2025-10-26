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
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';

const addressSchema = z.object({
  address: z.string().min(10, 'Please enter a complete address.'),
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
    },
  });

  useEffect(() => {
    if (currentAddress) {
      form.reset(currentAddress);
    } else {
        form.reset({
            address: '',
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
            Please enter the full address where you'd like to receive your order.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 123 Gourmet Lane, Victoria Island, Lagos, Nigeria" {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
