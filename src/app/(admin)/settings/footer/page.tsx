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
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { footerSettings } from '@/lib/settings';

const footerSettingsSchema = z.object({
  facebookUrl: z.string().url().or(z.literal('')).optional(),
  instagramUrl: z.string().url().or(z.literal('')).optional(),
  youtubeUrl: z.string().url().or(z.literal('')).optional(),
  openingHours: z.string().optional(),
  termsUrl: z.string().url().or(z.literal('')).optional(),
  privacyUrl: z.string().url().or(z.literal('')).optional(),
  cookiePolicyUrl: z.string().default('/cookie-policy'),
});

export default function AdminFooterSettingsPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof footerSettingsSchema>>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: footerSettings,
  });

  function onSubmit(values: z.infer<typeof footerSettingsSchema>) {
    // TODO: Implement saving these settings to Firestore.
    console.log('Saving footer settings:', values);
    toast({
      title: 'Settings Saved!',
      description: 'Your footer settings have been successfully updated.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Settings</CardTitle>
        <CardDescription>
          Manage your social media links, opening hours, and legal pages.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h3 className="text-lg font-medium">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="facebookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/your-page" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/your-profile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/your-channel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-medium">Business Information</h3>
             <FormField
                control={form.control}
                name="openingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Hours</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Mon - Fri: 9am - 5pm" {...field} />
                    </FormControl>
                    <FormDescription>
                      This text will appear in the footer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <h3 className="text-lg font-medium">Legal Pages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="termsUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms of Service URL</FormLabel>
                      <FormControl>
                        <Input placeholder="/terms-of-service" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="privacyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Privacy Policy URL</FormLabel>
                      <FormControl>
                        <Input placeholder="/privacy-policy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cookiePolicyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cookie Policy URL</FormLabel>
                      <FormControl>
                        <Input placeholder="/cookie-policy" {...field} value={field.value ?? ''} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
