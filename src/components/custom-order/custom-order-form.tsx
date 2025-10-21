'use client';

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
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  itemName: z.string().min(2, 'Item name is required.'),
  quantity: z.number().min(1, 'Quantity must be at least 1.'),
  customMeasure: z.string().min(1, 'Please select a measurement unit.'),
  shippingMethod: z.string().min(1, 'Please select a shipping method.'),
  services: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Mock data, in a real app this would come from admin settings.
const customMeasures = ['Grams', 'Kilograms', 'Pieces', 'Bunches', 'Litres'];
const additionalServices = [
  { id: 'gift-wrapping', label: 'Gift Wrapping' },
  { id: 'special-packaging', label: 'Special Packaging' },
  { id: 'rush-delivery', label: 'Rush Delivery' },
];

export function CustomOrderForm() {
  const { toast } = useToast();
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Request Submitted!',
      description: "We've received your custom order request and will get back to you shortly.",
    });
    form.reset();
  }

  return (
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
                      onChange={event => field.onChange(event.target.valueAsNumber)}
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
  );
}
