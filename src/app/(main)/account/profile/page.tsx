
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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export default function AccountProfilePage() {
  const { toast } = useToast();

  // In a real app, these values would be fetched from the logged-in user's data.
  const currentUser = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '8012345678',
    address: '123 Gourmet Lane, Foodie City, FC 12345',
    avatarUrl: 'https://picsum.photos/seed/jane-doe/100/100',
  };

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: currentUser,
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    // TODO: Implement updating user profile in Firestore.
    console.log('Updating profile:', values);
    toast({
      title: 'Profile Updated!',
      description: 'Your personal information has been successfully saved.',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>
          Manage your personal information and account settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={currentUser.avatarUrl} alt="User Avatar" />
                        <AvatarFallback>{currentUser.firstName?.[0]}{currentUser.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8">
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change Photo</span>
                    </Button>
                </div>
                <div>
                    <h3 className="text-xl font-bold">{currentUser.firstName} {currentUser.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                     <div className="flex items-center">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-background text-sm text-muted-foreground h-10">+234</span>
                        <FormControl>
                            <Input type="tel" placeholder="8012345678" {...field} className="rounded-l-none" />
                        </FormControl>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Enter your full address" {...field} />
                    </FormControl>
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
