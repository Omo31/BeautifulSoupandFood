'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Minus, Plus, Home, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ShippingAddressDialog } from '../shared/shipping-address-dialog';
import type { Address } from '../shared/shipping-address-dialog';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const itemSchema = z.object({
    name: z.string().min(2, 'Item name is required.'),
    quantity: z.number().min(1, 'Quantity must be at least 1.'),
    measure: z.string().min(1, 'Please select a measurement unit.'),
    otherMeasure: z.string().optional(),
}).refine(data => {
    if (data.measure === 'Other') {
        return !!data.otherMeasure && data.otherMeasure.length > 0;
    }
    return true;
}, {
    message: 'Please specify the unit of measure.',
    path: ['otherMeasure'],
});

const formSchema = z.object({
  items: z.array(itemSchema).min(1, 'Please add at least one item.'),
  shippingMethod: z.string().min(1, 'Please select a shipping method.'),
  services: z.array(z.string()).optional(),
  notes: z.string().optional(),
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
      items: [{ name: '', quantity: 1, measure: '' }],
      services: [],
      notes: '',
    },
  });

  const { control, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const selectedServices = watch('services') || [];
  const shippingMethod = watch('shippingMethod');
  
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
          
          <div className="space-y-4">
             <FormLabel>Requested Items</FormLabel>
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                    {fields.length > 1 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 text-muted-foreground"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove Item</span>
                        </Button>
                    )}
                    <FormField
                        control={control}
                        name={`items.${index}.name`}
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
                        control={control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <div className="flex items-center gap-2">
                                <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => form.setValue(`items.${index}.quantity`, Math.max(1, (field.value || 1) - 1))}
                                >
                                <Minus className="h-4 w-4" />
                                </Button>
                                <FormControl>
                                <Input
                                    type="number"
                                    className="text-center"
                                    {...field}
                                    onChange={event => field.onChange(event.target.value === '' ? 1 : +event.target.value)}
                                />
                                </FormControl>
                                <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => form.setValue(`items.${index}.quantity`, (field.value || 0) + 1)}
                                >
                                <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={control}
                        name={`items.${index}.measure`}
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
                     {watch(`items.${index}.measure`) === 'Other' && (
                        <FormField
                            control={control}
                            name={`items.${index}.otherMeasure`}
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
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', quantity: 1, measure: '' })}
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Item
            </Button>
             {form.formState.errors.items && <p className="text-sm font-medium text-destructive">{form.formState.errors.items.message}</p>}
          </div>

          <Separator />
          
          <FormField
            control={control}
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
                    control={control}
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
          
           {selectedServices.length > 0 && (
            <FormField
              control={control}
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

          <Separator />

          <FormField
              control={control}
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
