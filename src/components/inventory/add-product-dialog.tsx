
'use client';

import { useState } from 'react';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast.tsx';
import { Upload } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(2, 'Product name is required.'),
  description: z.string().min(10, 'Description is required.'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
  category: z.enum(['Shop', 'Soup']),
  lowStockThreshold: z.coerce.number().int().min(0).optional(),
  image: z.any().optional(), // In a real app, you would have stricter validation
});

type AddProductDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAddProduct: (product: z.infer<typeof formSchema>) => void;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function AddProductDialog({ isOpen, setIsOpen, onAddProduct }: AddProductDialogProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'Shop',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File Too Large',
          description: 'The selected image exceeds the 2MB size limit. Please choose a smaller file.',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would upload the image to a service like Firebase Storage
    // and then save the product with the image URL.
    const newProduct = {
      ...values,
      image: {
        imageUrl: imagePreview || "https://picsum.photos/seed/new-product/400/300",
        imageHint: values.name.toLowerCase(),
      }
    };
    onAddProduct(newProduct);
    toast({
      title: 'Product Added',
      description: `${values.name} has been added to the inventory.`,
    });
    form.reset();
    setImagePreview(null);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md grid-rows-[auto_1fr_auto] max-h-[90svh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full">
            <div className="px-6">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <FormControl>
                            <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                                {imagePreview ? (
                                <img src={imagePreview} alt="Image preview" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 2MB)</p>
                                </div>
                                )}
                                <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/png, image/jpeg" />
                            </label>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="name"
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe the product..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                            <Input type="number" step="0.01" placeholder="9.99" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="50" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Shop">Shop</SelectItem>
                                <SelectItem value="Soup">Soup</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lowStockThreshold"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Low Stock Alert</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="5 (Optional)" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                                Notify when stock reaches this level.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                </form>
                </Form>
            </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-0">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Add Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
