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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateVideoAd } from '@/ai/flows/generate-video-ad';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast.tsx';
import { Loader2 } from 'lucide-react';
import { Slider } from '../ui/slider';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const GenerateVideoAdInputSchema = z.object({
  topic: z.string().min(10, 'Please provide a more detailed topic for the ad.'),
  durationSeconds: z.number().min(5).max(24).default(8),
  aspectRatio: z.enum(['16:9', '9:16']).default('16:9'),
});

type VideoFormProps = {
  setResult: (result: any) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setProgress: (progress: number) => void;
};

export function VideoGeneratorForm({ setResult, setLoading, loading, setProgress }: VideoFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof GenerateVideoAdInputSchema>>({
    resolver: zodResolver(GenerateVideoAdInputSchema),
    defaultValues: {
      topic: '',
      durationSeconds: 8,
      aspectRatio: '16:9',
    },
  });

  const duration = form.watch('durationSeconds');

  async function onSubmit(values: z.infer<typeof GenerateVideoAdInputSchema>) {
    setLoading(true);
    setResult(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 95) {
                clearInterval(progressInterval);
                return 95;
            }
            return prev + 5;
        });
    }, (values.durationSeconds * 1000) / 20);

    try {
      const result = await generateVideoAd(values);
      setResult(result);
      setProgress(100);
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate video. Please try again.',
        variant: 'destructive',
      });
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  }

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
                    <Textarea placeholder="e.g., A cinematic video about the freshness of our organic farm-to-table ingredients." {...field} rows={3} />
                  </FormControl>
                  <FormDescription>
                    Describe the theme or message of your video ad. Be descriptive!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="durationSeconds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration: {duration} seconds</FormLabel>
                    <FormControl>
                        <Slider 
                            min={5} 
                            max={24} 
                            step={1}
                            value={[field.value]} 
                            onValueChange={(vals) => field.onChange(vals[0])}
                        />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aspectRatio"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Aspect Ratio</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="16:9" />
                          </FormControl>
                          <FormLabel className="font-normal">16:9 (Landscape)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="9:16" />
                          </FormControl>
                          <FormLabel className="font-normal">9:16 (Portrait)</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
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