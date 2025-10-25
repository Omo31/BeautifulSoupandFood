'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast.tsx';
import { Textarea } from '@/components/ui/textarea';

const homepageSettingsSchema = z.object({
  heroTitle: z.string().min(1, 'Hero title is required.'),
  heroSubtitle: z.string().min(1, 'Hero subtitle is required.'),
  youtubeVideoId: z.string().optional(),
  youtubeVideoTitle: z.string().optional(),
  youtubeVideoDescription: z.string().optional(),
});

export default function AdminHomepageSettingsPage() {
  const { toast } = useToast();

  // In a real app, these values would be fetched from Firestore.
  const currentSettings = {
    heroTitle: 'Exceptional Quality, Delivered Fresh',
    heroSubtitle: 'Discover the finest selection of gourmet produce, artisan goods, and pantry essentials from local and global sources.',
    youtubeVideoId: 'dQw4w9WgXcQ', // Default example video
    youtubeVideoTitle: 'Our Commitment to Quality',
    youtubeVideoDescription: 'Watch how we source the freshest ingredients and prepare our products with love and care. From our family to yours, we are committed to delivering nothing but the best.',
  };

  const form = useForm<z.infer<typeof homepageSettingsSchema>>({
    resolver: zodResolver(homepageSettingsSchema),
    defaultValues: currentSettings,
  });

  function onSubmit(values: z.infer<typeof homepageSettingsSchema>) {
    // TODO: Implement saving these settings to Firestore.
    console.log('Saving homepage settings:', values);
    toast({
      title: 'Settings Saved!',
      description: 'Your homepage settings have been successfully updated.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homepage Settings</CardTitle>
        <CardDescription>
          Manage hero section content and the featured YouTube video.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="heroTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Section Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fresh & Gourmet" {...field} />
                  </FormControl>
                  <FormDescription>
                    The main headline displayed in the hero section.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Section Subtitle</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short, catchy description..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The supporting text below the main headline.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="youtubeVideoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Video ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., dQw4w9WgXcQ" {...field} />
                  </FormControl>
                  <FormDescription>
                    Paste the ID of the YouTube video you want to feature (e.g., the part after 'v=' in the URL). Leave blank to hide the video section.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="youtubeVideoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Our Story" {...field} />
                  </FormControl>
                  <FormDescription>
                    The title to display next to the video.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtubeVideoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what your video is about..." {...field} />
                  </FormControl>
                  <FormDescription>
                    A short description to show next to the video.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
