'use client';

import { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { GenerateVideoAdInput, generateVideoAd } from '@/ai/flows/generate-video-ad';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast.tsx';
import { Loader2 } from 'lucide-react';
import { Slider } from '../ui/slider';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  topic: z.string().min(10, "Please provide a more detailed topic for the ad."),
  durationSeconds: z.number().min(5).max(8).default(5),
  aspectRatio: z.enum(['16:9', '9:16']).default('16:9'),
});

type VideoGeneratorFormProps = {
  setResult: (result: any) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setLoadingProgress: (progress: number) => void;
};

// Estimated time for video generation in seconds
const ESTIMATED_GENERATION_TIME = 60; 

export function VideoGeneratorForm({ setResult, setLoading, loading, setLoadingProgress }: VideoGeneratorFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      durationSeconds: 8,
      aspectRatio: '16:9',
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingProgress(0);
      let progress = 0;
      interval = setInterval(() => {
        progress += 100 / ESTIMATED_GENERATION_TIME;
        if (progress > 95) { // Don't let it reach 100% on its own
            clearInterval(interval);
        } else {
            setLoadingProgress(progress);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading, setLoadingProgress]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const result = await generateVideoAd(values as GenerateVideoAdInput);
      setResult(result);
      setLoadingProgress(100);
    } catch (error: any) {
      console.error('Error generating video:', error);
      toast({
        title: 'Error Generating Video',
        description: error.message || 'Failed to generate video ad. Please try again.',
        variant: 'destructive',
      });
      setLoadingProgress(0);
    } finally {
      setLoading(false);
    }
  }
  
  const durationValue = form.watch('durationSeconds');

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Topic</FormLabel>
                   <FormControl>
                    <Textarea 
                      placeholder="e.g., An ad about our weekly special on organic vegetable boxes, highlighting freshness and local sourcing."
                      {...field}
                    />
                   </FormControl>
                  <FormDescription>
                    Describe the feature, product, or concept you want to create a promotional video for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="aspectRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aspect Ratio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an aspect ratio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="16:9">16:9 (YouTube Ad Size)</SelectItem>
                        <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Standard size for video ads.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationSeconds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration: {durationValue}s</FormLabel>
                    <FormControl>
                        <Slider 
                            min={5} max={8} step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                        />
                    </FormControl>
                    <FormDescription>
                        Set the video length in seconds (5-8s).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Video...
                </>
              ) : (
                'Generate Video Ad'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
