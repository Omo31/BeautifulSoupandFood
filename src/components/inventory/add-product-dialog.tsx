
'use client';

import { useState, useEffect } from 'react';
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
import { Upload, Link2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

const formSchema = z.object({
  name: z.string().min(2, 'Product name is required.'),
  description: z.string().min(10, 'Description is required.'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
  category: z.enum(['Shop', 'Soup']),
  lowStockThreshold: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().optional(),
  imageFile: z.any().optional(),
}).refine(data => data.imageUrl || data.imageFile, {
  message: 'An image is required. Please provide a URL or upload a file.',
  path: ['imageUrl'],
});

type AddProductDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAddProduct: (product: Omit<z.infer<typeof formSchema>, 'imageFile'>) => void;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function AddProductDialog({ isOpen, setIsOpen, onAddProduct }: AddProductDialogProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageTab, setImageTab] = useState('upload');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'Shop',
      imageUrl: '',
    },
  });

  const imageUrlValue = form.watch('imageUrl');

  useEffect(() => {
    if (imageTab === 'url' && imageUrlValue) {
      setImagePreview(imageUrlValue);
      form.clearErrors('imageUrl');
    } else if (imageTab === 'upload' && form.getValues('imageFile')) {
        // re-validate when switching back to upload
    } else {
       if (imageTab !== 'url') {
           setImagePreview(null);
       }
    }
  }, [imageUrlValue, imageTab, form]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        form.setValue('imageFile', file);
        form.clearErrors('imageUrl'); // Clear error as we now have a file
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would upload the image to a service like Firebase Storage if imageFile exists
    const finalImageUrl = imageTab === 'url' ? values.imageUrl : imagePreview;
    
    if (!finalImageUrl) {
        toast({
            title: 'Image Required',
            description: 'Please upload an image or provide a URL.',
            variant: 'destructive'
        });
        return;
    }
    
    const newProduct = {
      ...values,
      image: {
        imageUrl: finalImageUrl,
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
                     <FormItem>
                        <FormLabel>Product Image</FormLabel>
                            <Tabs value={imageTab} onValueChange={setImageTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4" />Upload</TabsTrigger>
                                    <TabsTrigger value="url"><Link2 className="mr-2 h-4 w-4" />URL</TabsTrigger>
                                </TabsList>
                                <TabsContent value="upload">
                                    <FormField
                                    control={form.control}
                                    name="imageFile"
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex items-center justify-center w-full">
                                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                                                    {imageTab === 'upload' && imagePreview ? (
                                                    <img src={imagePreview} alt="Image preview" className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                        <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 2MB)</p>
                                                    </div>
                                                    )}
                                                    <Input id="dropzone-file" type="file" className="hidden" onChange={handleImageFileChange} accept="image/png, image/jpeg" />
                                                </label>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                </TabsContent>
                                <TabsContent value="url">
                                     <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex flex-col items-center justify-center w-full">
                                                        {imageTab === 'url' && imagePreview ? (
                                                            <img src={imagePreview} alt="Image preview" className="w-full h-auto mb-2 object-cover rounded-lg aspect-video" />
                                                        ) : (
                                                            <div className="h-48 w-full flex items-center justify-center bg-muted rounded-lg text-muted-foreground text-sm">Image preview</div>
                                                        )}
                                                        <Input placeholder="https://example.com/image.png" {...field} />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                            </Tabs>
                        <FormMessage>{form.formState.errors.imageUrl?.message}</FormMessage>
                     </FormItem>
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
                            <Input type="number" step="0.01" placeholder="99.99" {...field} />
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

    