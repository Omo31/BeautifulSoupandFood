
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast.tsx';
import type { Order } from './order-table';
import { Separator } from '../ui/separator';

const lineItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  measure: z.string(),
  price: z.coerce.number().min(0, 'Price cannot be negative.'),
});

const serviceSchema = z.object({
    id: z.string(),
    label: z.string(),
    price: z.coerce.number().min(0, 'Price cannot be negative.'),
});

const quoteSchema = z.object({
  items: z.array(lineItemSchema),
  services: z.array(serviceSchema),
  shippingFee: z.coerce.number().min(0, 'Shipping fee cannot be negative.'),
});

const SERVICE_CHARGE_RATE = 0.06; // 6%

export function QuoteForm({ order }: { order: Order }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      items: order.customOrderDetails?.items.map(item => ({ ...item, price: 0 })) || [],
      services: order.customOrderDetails?.services.map(service => ({ ...service, price: 0 })) || [],
      shippingFee: 0,
    },
  });

  const { control, watch } = form;

  const { fields: itemFields } = useFieldArray({
    control,
    name: 'items',
  });

  const { fields: serviceFields } = useFieldArray({
    control,
    name: 'services',
  });

  const watchedItems = watch('items');
  const watchedServices = watch('services');
  const shippingFee = Number(watch('shippingFee')) || 0;

  const itemsSubtotal = (watchedItems || []).reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  const servicesSubtotal = (watchedServices || []).reduce((sum, service) => sum + (Number(service.price) || 0), 0);
  const subtotal = itemsSubtotal + servicesSubtotal;
  const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
  const total = subtotal + serviceCharge + shippingFee;

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
        <CardTitle>Create Quote</CardTitle>
        <CardDescription>
          Set the price for each requested item and service. The 6% service charge will be added automatically.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">

            {itemFields.length > 0 && <div className="space-y-4">
              <h3 className="font-medium">Requested Items</h3>
              {itemFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-x-4 gap-y-2 p-3 border rounded-md items-start">
                    <div className="col-span-12 sm:col-span-5">
                        <FormLabel>Item</FormLabel>
                        <p className="font-medium">{field.name}</p>
                        <p className="text-xs text-muted-foreground">{field.quantity} x {field.measure}</p>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                         <FormField
                            control={control}
                            name={`items.${index}.price`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price / Unit</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground text-sm">₦</span>
                                    <Input type="number" step="0.01" {...field} className="pl-6" />
                                </div>
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>
                     <div className="col-span-6 sm:col-span-4 flex flex-col items-end">
                        <FormLabel>Line Total</FormLabel>
                        <p className="font-mono text-lg font-semibold h-10 flex items-center">
                            ₦{((Number(watchedItems?.[index]?.price) || 0) * (watchedItems?.[index]?.quantity || 0)).toFixed(2)}
                        </p>
                    </div>
                </div>
              ))}
            </div>}
            
            {serviceFields.length > 0 && <div className="space-y-4">
                 <h3 className="font-medium">Requested Services</h3>
                 {serviceFields.map((field, index) => (
                     <div key={field.id} className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 border rounded-md items-start">
                         <div>
                            <FormLabel>Service</FormLabel>
                            <p className="font-medium">{field.label}</p>
                         </div>
                         <FormField
                            control={control}
                            name={`services.${index}.price`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                 <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground text-sm">₦</span>
                                    <Input type="number" step="0.01" {...field} className="pl-6" />
                                 </div>
                                </FormControl>
                            </FormItem>
                            )}
                        />
                     </div>
                 ))}
            </div>}

            <FormField
                control={control}
                name="shippingFee"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Shipping Fee</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground text-sm">₦</span>
                            <Input type="number" step="0.01" {...field} className="pl-6" />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-2 rounded-md border p-4 bg-muted/50">
              <h4 className="font-medium">Quote Summary</h4>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items Total</span>
                <span>₦{itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Services Total</span>
                <span>₦{servicesSubtotal.toFixed(2)}</span>
              </div>
              <Separator className='my-1' />
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₦{subtotal.toFixed(2)}</span>
              </div>
               <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Charge (6%)</span>
                <span>₦{serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>₦{shippingFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total</span>
                <span>₦{total.toFixed(2)}</span>
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

    