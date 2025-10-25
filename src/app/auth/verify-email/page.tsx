
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast.tsx";
import { MailCheck } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
    const { toast } = useToast();

    const handleResend = () => {
        // TODO: Implement Firebase email verification resend logic
        console.log('Resending verification email...');
        toast({
            title: 'Verification Link Sent',
            description: "We've sent a new verification link to your email address. Please check your inbox and spam folder.",
        });
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <MailCheck className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Verify Your Email</CardTitle>
                    <CardDescription>
                        We've sent a verification link to your email address. Please click the link to activate your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        The link will expire in 1 minute. If you don't see the email, please check your spam folder or request a new link.
                    </p>
                    <Button onClick={handleResend} className="w-full">
                        Resend Verification Link
                    </Button>
                </CardContent>
                <CardFooter className="flex-col gap-4 text-sm">
                    <p>Once your email is verified, you can log in.</p>
                     <Button variant="outline" asChild>
                        <Link href="/auth/login">
                           Go to Login
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
