'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast.tsx';
import type { Order } from './order-table';
import { Separator } from '../ui/separator';

const quoteSchema = z.object({
  pricePerItem: z.coerce.number().min(0.01, 'Price must be greater than 0.'),
  shippingFee: z.coerce.number().min(0, 'Shipping fee cannot be negative.'),
});

const SERVICE_CHARGE_RATE = 0.06; // 6%

export function QuoteForm({ order }: { order: Order }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      pricePerItem: 0,
      shippingFee: 0,
    },
  });

  const { watch } = form;
  const pricePerItem = watch('pricePerItem');
  const shippingFee = watch('shippingFee');

  const subtotal = (pricePerItem || 0) * (order.customOrderDetails?.quantity || 0);
  const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
  const total = subtotal + serviceCharge + (shippingFee || 0);

  const onSubmit = (values: z.infer<typeof quoteSchema>) => {
    // In a real app, you would send this quote to the backend to update the order and notify the customer.
    console.log({
      orderId: order.id,
      ...values,
      subtotal,
      serviceCharge,
      total,
    });
    toast({
      title: 'Quote Sent!',
      description: 'The customer has been notified and can now review and accept the quote.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Quote</CardTitle>
        <CardDescription>
          Set the price for the custom item and the shipping fee. The 6% service charge will be added automatically.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pricePerItem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per {order.customOrderDetails?.measure || 'Item'}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">$</span>
                            <Input type="number" step="0.01" {...field} className="pl-7" />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Fee</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">$</span>
                            <Input type="number" step="0.01" {...field} className="pl-7" />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2 rounded-md border p-4 bg-muted/50">
              <h4 className="font-medium">Quote Summary</h4>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({order.customOrderDetails?.quantity} {order.customOrderDetails?.measure} x ${pricePerItem || 0})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Charge (6%)</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>${(shippingFee || 0).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Quote</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Send Quote to Customer</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
