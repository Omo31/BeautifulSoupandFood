
'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { useToast } from '@/hooks/use-toast.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import type { PurchaseOrder } from './po-table';

const poItemSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    productName: z.string().min(1, 'Product name is required'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    cost: z.coerce.number().min(0, 'Cost cannot be negative'),
});

const formSchema = z.object({
  date: z.date({ required_error: 'A date is required.' }),
  supplier: z.string().min(2, 'Supplier name is required.'),
  items: z.array(poItemSchema).min(1, 'At least one item is required.'),
  status: z.enum(['Pending', 'Completed', 'Cancelled', 'Draft']).default('Pending'),
});

type AddPurchaseOrderDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAddPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>, status: 'Draft' | 'Pending') => void;
  editingPO?: Omit<PurchaseOrder, 'id'> | null;
};

export function AddPurchaseOrderDialog({ isOpen, setIsOpen, onAddPurchaseOrder, editingPO }: AddPurchaseOrderDialogProps) {
  const { toast } = useToast();
  const isEditing = !!editingPO;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      supplier: '',
      items: [{ productId: '', productName: '', quantity: 1, cost: 0 }],
      status: 'Pending',
    },
  });

  const { control, watch, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const total = watchedItems.reduce((sum, item) => sum + (item.cost || 0) * (item.quantity || 0), 0);
  const itemCount = watchedItems.reduce((sum, item) => sum + (item.quantity || 0), 0);


  useEffect(() => {
    if (isOpen) {
        if (isEditing && editingPO) {
            reset({
                ...editingPO,
                date: new Date(editingPO.date),
            });
        } else {
            reset({
                date: new Date(),
                supplier: '',
                items: [{ productId: '', productName: '', quantity: 1, cost: 0 }],
                status: 'Pending',
            });
        }
    }
  }, [isOpen, isEditing, editingPO, reset]);

  function handleSave(status: 'Draft' | 'Pending') {
    form.handleSubmit((values) => {
        const poData = { ...values, total, itemCount };
        onAddPurchaseOrder(poData, status);
        setIsOpen(false);
    })();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl grid-rows-[auto_1fr_auto] max-h-[90svh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{isEditing ? 'Edit Purchase Order' : 'Create New Purchase Order'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details of this draft PO.' : 'Record a new order made to a supplier to restock your inventory.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full">
         <div className="px-6">
            <Form {...form}>
            <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="supplier"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Supplier Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Global Foods Inc." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Order Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                    >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                
                <Separator />

                <div className="space-y-4">
                    <FormLabel>Items</FormLabel>
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-muted/30">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-7 w-7 text-muted-foreground"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Remove Item</span>
                            </Button>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <FormField
                                    control={form.control}
                                    name={`items.${index}.productName`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                        <Input placeholder="e.g., Artisan Sourdough" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.productId`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product ID</FormLabel>
                                        <FormControl>
                                        <Input placeholder="From inventory" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.quantity`}
                                    render={({ field }) => (
                                    <FormItem className="sm:col-span-2">
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                        <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.cost`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cost / Unit</FormLabel>
                                        <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="flex flex-col items-end">
                                    <FormLabel>Line Total</FormLabel>
                                    <p className="font-semibold h-10 flex items-center">
                                      ₦{((watchedItems?.[index]?.cost || 0) * (watchedItems?.[index]?.quantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ productId: '', productName: '', quantity: 1, cost: 0 })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                    {form.formState.errors.items && <p className="text-sm font-medium text-destructive">{form.formState.errors.items.message || form.formState.errors.items.root?.message}</p>}
                </div>
            </form>
            </Form>
         </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-4 border-t flex-col sm:flex-row sm:justify-between items-center bg-muted/50">
            <div className="font-semibold text-lg">
                Total: ₦{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => handleSave('Draft')}>{isEditing ? 'Save Changes' : 'Save as Draft'}</Button>
                <Button type="submit" onClick={() => handleSave('Pending')}>{isEditing ? 'Save and Finalize' : 'Create PO'}</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
