
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast.tsx';
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    // In a real app, we'd validate this token against Firebase
    const token = searchParams.get('token');
    const isTokenExpired = token === 'expired'; // Simulate an expired token for demonstration

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({
                title: 'Passwords do not match',
                description: 'Please ensure both passwords are the same.',
                variant: 'destructive',
            });
            return;
        }

        // TODO: Implement Firebase password reset confirmation
        console.log('Resetting password...');
        toast({
            title: 'Password Reset Successfully',
            description: 'Your password has been changed. You can now log in with your new password.',
        });
        router.push('/auth/login');
    };

     if (isTokenExpired) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
                 <Card className="w-full max-w-sm text-center">
                     <CardHeader>
                         <CardTitle className="font-headline text-2xl">Link Expired</CardTitle>
                         <CardDescription>
                            This password reset link has expired. Please request a new one.
                         </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/auth/forgot-password">
                                Request a New Link
                            </Link>
                        </Button>
                     </CardContent>
                 </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Reset Password</CardTitle>
                    <CardDescription>Enter your new password below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                                <Input 
                                    id="new-password" 
                                    type={showPassword ? "text" : "password"} 
                                    required 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
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
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <div className="relative">
                                <Input 
                                    id="confirm-password" 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute inset-y-0 right-0 h-full px-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                >
                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                </Button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Set New Password</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
