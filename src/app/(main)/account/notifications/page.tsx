
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
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast.tsx';
import { Separator } from '@/components/ui/separator';

const notificationsSchema = z.object({
  email: z.object({
    orderUpdates: z.boolean().default(true),
    promotions: z.boolean().default(false),
    accountActivity: z.boolean().default(true),
  }),
});

export default function AccountNotificationsPage() {
  const { toast } = useToast();

  // In a real app, these values would be fetched from the user's settings.
  const currentUserSettings = {
    email: {
        orderUpdates: true,
        promotions: true,
        accountActivity: true,
    }
  };

  const form = useForm<z.infer<typeof notificationsSchema>>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: currentUserSettings,
  });

  function onSubmit(values: z.infer<typeof notificationsSchema>) {
    // TODO: Implement updating user notification settings in Firestore.
    console.log('Updating notification settings:', values);
    toast({
      title: 'Preferences Saved',
      description: 'Your notification settings have been successfully updated.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage how you receive notifications from us.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email.orderUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Order Updates
                        </FormLabel>
                        <FormDescription>
                          Receive emails about your order status, shipping, and delivery.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email.promotions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Promotions & News
                        </FormLabel>
                        <FormDescription>
                          Receive occasional newsletters with new products and special offers.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email.accountActivity"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Account Activity
                        </FormLabel>
                        <FormDescription>
                          Receive security alerts for activities like password changes.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Placeholder for Push Notifications */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-muted-foreground">Push Notifications</h3>
              <div className="space-y-4 rounded-lg border p-4 text-center text-muted-foreground">
                 <p className="text-sm">Push notification settings will be available soon.</p>
              </div>
            </div>

            <Button type="submit">Save Preferences</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
