
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [redirectPath, setRedirectPath] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && redirectPath) {
        router.push(redirectPath);
    }
  }, [isLoggedIn, redirectPath, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Firebase email/password login
    console.log('Logging in...');
    toast({
      title: 'Login Successful (Simulated)',
      description: 'Redirecting you to your dashboard...',
    });
    
    if (email === 'admin@gourmet.com') {
      setRedirectPath('/admin/dashboard');
    } else {
      setRedirectPath('/account/profile');
    }
    setIsLoggedIn(true);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Firebase Google login
    console.log('Logging in with Google...');
    toast({
      title: 'Login with Google (Simulated)',
      description: 'Redirecting you to your account...',
    });
    // For simplicity, Google login will go to the user dashboard
    setRedirectPath('/account/profile');
    setIsLoggedIn(true);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
       <Button variant="ghost" className="absolute top-8 left-8" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Link>
        </Button>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} required />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>Login with Google</Button>
        </CardContent>
        <CardFooter className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline ml-1">
                Sign up
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
