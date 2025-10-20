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
import { GenerateMarketingFlyerInput, generateMarketingFlyer } from '@/ai/flows/generate-marketing-flyers';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  productName: z.string().min(2, 'Product name is required.'),
  productDescription: z.string().min(10, 'Description must be at least 10 characters.'),
  storeName: z.string().default('GourmetBasket'),
  storeSlogan: z.string().default('Exceptional Quality, Delivered Fresh'),
  primaryColor: z.string().default('#3D9951'),
  accentColor: z.string().default('#26BFA8'),
  headlineFont: z.string().default('Playfair'),
  bodyFont: z.string().default('PT Sans'),
  callToAction: z.string().min(2, 'Call to action is required.'),
  flyerType: z.enum(['digital', 'print']),
  imagePrompt: z.string().optional(),
});

type FlyerFormProps = {
  setResult: (result: any) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
};

export function FlyerForm({ setResult, setLoading, loading }: FlyerFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      productDescription: '',
      storeName: 'GourmetBasket',
      storeSlogan: 'Exceptional Quality, Delivered Fresh',
      primaryColor: '#3D9951',
      accentColor: '#26BFA8',
      headlineFont: 'Playfair',
      bodyFont: 'PT Sans',
      callToAction: 'Visit us today!',
      flyerType: 'digital',
      imagePrompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const result = await generateMarketingFlyer(values as GenerateMarketingFlyerInput);
      setResult(result);
    } catch (error) {
      console.error('Error generating flyer:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate flyer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Organic Avocado Box" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="callToAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call to Action</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Get 20% Off!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the product's key features and benefits." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imagePrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Image Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the image you want. e.g., 'A vibrant flat lay of fresh vegetables on a rustic wooden table, top-down view.'" {...field} />
                  </FormControl>
                  <FormDescription>
                    If left blank, a default image will be generated based on the product details.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="flyerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flyer Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a flyer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="print">Print</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Flyer'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
