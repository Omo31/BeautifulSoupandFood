
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement Firebase password reset logic
        console.log('Sending password reset link to:', email);
        toast({
            title: 'Password Reset Link Sent',
            description: "If an account exists for this email, you'll receive a reset link shortly. Check your spam folder if you don't see it.",
        });
        setSubmitted(true);
    };

    const handleResend = () => {
        // In a real app, this would trigger the same Firebase function as handleSubmit
        toast({
            title: 'New Reset Link Sent',
            description: "We've sent another password reset link to your email address.",
        });
    }

    return (
        <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Button variant="ghost" className="absolute top-8 left-8" asChild>
                <Link href="/auth/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                </Link>
            </Button>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        {submitted 
                            ? "A reset link has been sent. Please check your email."
                            : "Enter your email and we'll send you a link to reset your password."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                         <div className="space-y-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the email? The link may have expired (it's valid for 1 minute).
                            </p>
                            <Button onClick={handleResend} className="w-full">
                                Resend Link
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid gap-4">
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
                            <Button type="submit" className="w-full">Send Reset Link</Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
