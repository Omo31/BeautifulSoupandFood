'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast.tsx';
import { Minus, Plus, Home } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ShippingAddressDialog } from '../shared/shipping-address-dialog';
import type { Address } from '../shared/shipping-address-dialog';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  itemName: z.string().min(2, 'Item name is required.'),
  quantity: z.number().min(1, 'Quantity must be at least 1.'),
  customMeasure: z.string().min(1, 'Please select a measurement unit.'),
  otherMeasure: z.string().optional(),
  shippingMethod: z.string().min(1, 'Please select a shipping method.'),
  services: z.array(z.string()).optional(),
  notes: z.string().optional(),
}).refine(data => {
    if (data.customMeasure === 'Other') {
        return !!data.otherMeasure && data.otherMeasure.length > 0;
    }
    return true;
}, {
    message: 'Please specify the unit of measure.',
    path: ['otherMeasure'],
});

// Mock data, in a real app this would come from admin settings.
const customMeasures = ['Grams', 'Kilograms', 'Pieces', 'Bunches', 'Litres', 'Other'];
const additionalServices = [
  { id: 'gift-wrapping', label: 'Gift Wrapping' },
  { id: 'special-packaging', label: 'Special Packaging' },
  { id: 'rush-delivery', label: 'Rush Delivery' },
];

export function CustomOrderForm() {
  const { toast } = useToast();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: '',
      quantity: 1,
      services: [],
      notes: '',
    },
  });

  const { setValue, watch } = form;
  const quantity = watch('quantity');
  const selectedServices = watch('services') || [];
  const shippingMethod = watch('shippingMethod');
  const selectedMeasure = watch('customMeasure');
  
  const handleSaveAddress = (address: Address) => {
    setShippingAddress(address);
    setIsAddressDialogOpen(false);
     toast({
      title: 'Address Saved',
      description: 'Your shipping address has been successfully saved.',
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.shippingMethod === 'set-shipping-fee' && !shippingAddress) {
       toast({
        title: 'Missing Address',
        description: 'Please add a shipping address for your custom order.',
        variant: 'destructive',
      });
      return;
    }
    
    console.log({ ...values, shippingAddress });
    toast({
      title: 'Request Submitted!',
      description: "We've received your custom order request and will get back to you shortly.",
    });
    form.reset();
    setShippingAddress(null);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="itemName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Fresh Truffles" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setValue('quantity', Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <FormControl>
                      <Input
                        type="number"
                        className="text-center"
                        {...field}
                        onChange={event => {
                            const value = event.target.valueAsNumber;
                            field.onChange(isNaN(value) ? 1 : value);
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => setValue('quantity', quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customMeasure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measure</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customMeasures.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

           {selectedMeasure === 'Other' && (
            <FormField
                control={form.control}
                name="otherMeasure"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Specify Unit</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Pallet, Crate" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
           )}
          
          <FormField
            control={form.control}
            name="services"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Additional Services</FormLabel>
                  <FormDescription>
                    Select any additional services you require.
                  </FormDescription>
                </div>
                {additionalServices.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="services"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
              control={form.control}
              name="shippingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a shipping method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="set-shipping-fee">Set Shipping Fee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

          {shippingMethod === 'set-shipping-fee' && (
             <div className="space-y-2">
                <FormLabel>Shipping Address</FormLabel>
                 {shippingAddress ? (
                     <div className="p-3 border rounded-md bg-muted/50 text-sm">
                         <p className="font-semibold text-foreground">Ship to:</p>
                         <p className="text-muted-foreground">{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                         <Button variant="link" className="p-0 h-auto text-xs mt-1" onClick={() => setIsAddressDialogOpen(true)}>
                             Edit or change address
                         </Button>
                     </div>
                 ) : (
                    <Button type="button" variant="outline" className="w-full" onClick={() => setIsAddressDialogOpen(true)}>
                        <Home className="mr-2 h-4 w-4" />
                        Add Shipping Address
                    </Button>
                 )}
             </div>
          )}

          {selectedServices.length > 0 && (
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide more details about your selected services..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide any extra details related to the services you've selected.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <div className="flex justify-end">
              <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Form>
      <ShippingAddressDialog
        isOpen={isAddressDialogOpen}
        setIsOpen={setIsAddressDialogOpen}
        onSave={handleSaveAddress}
        currentAddress={shippingAddress}
      />
    </>
  );
}
