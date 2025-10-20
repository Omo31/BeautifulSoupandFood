'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Textarea } from '@/components/ui/textarea';

export default function SignupPage() {
  const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    event.target.value = value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Sign Up</CardTitle>
          <CardDescription>Create your BeautifulSoup&Food account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="John" required onChange={handleNameInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Doe" required onChange={handleNameInputChange} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-background text-sm text-muted-foreground">+234</span>
              <Input id="phone" type="tel" placeholder="8012345678" required className="rounded-l-none" />
            </div>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="Enter your full address" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the <Link href="#" className="underline">Terms of Service</Link>
            </label>
          </div>
          <Button type="submit" className="w-full">Create Account</Button>
          <Button variant="outline" className="w-full">Sign up with Google</Button>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline ml-1">
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
