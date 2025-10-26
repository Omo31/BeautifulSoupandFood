
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  date: z.date({ required_error: 'A date is required.' }),
  description: z.string().min(2, 'Description is required.'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0.'),
  category: z.string().min(1, 'Category is required.'),
  otherCategory: z.string().optional(),
  type: z.literal('expense'),
}).refine(data => {
    if (data.category === 'Other') {
        return !!data.otherCategory && data.otherCategory.length > 0;
    }
    return true;
}, {
    message: 'Please specify the category.',
    path: ['otherCategory'],
});

export type Transaction = z.infer<typeof formSchema> & { id: string };

type AddTransactionDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
};

const expenseCategories = [
    'Cost of Goods Sold',
    'Marketing',
    'Supplies',
    'Rent',
    'Salaries',
    'Utilities',
    'Other'
];

export function AddTransactionDialog({ isOpen, setIsOpen, onAddTransaction }: AddTransactionDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      description: '',
      amount: 0,
      category: '',
      type: 'expense',
      otherCategory: '',
    },
  });

  const selectedCategory = form.watch('category');
  
  useEffect(() => {
    if (isOpen) {
        form.reset({
            date: new Date(),
            description: '',
            amount: 0,
            category: '',
            type: 'expense',
            otherCategory: '',
        });
    }
  }, [isOpen, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalValues = { ...values };
    if (finalValues.category === 'Other') {
        finalValues.category = finalValues.otherCategory || 'Other';
    }
    
    onAddTransaction(finalValues);
    toast({
      title: 'Expense Added',
      description: `The expense for "${values.description}" has been recorded.`,
    });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md grid-rows-[auto_1fr_auto] max-h-[90svh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Record a new business expense.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full">
         <div className="px-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Transaction Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., Weekly produce supply" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground text-sm">₦</span>
                            <Input type="number" step="0.01" placeholder="50000.00" {...field} className="pl-6"/>
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select an expense category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {expenseCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {selectedCategory === 'Other' && (
                     <FormField
                        control={form.control}
                        name="otherCategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Specify Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Bank Charges" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </form>
            </Form>
         </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
