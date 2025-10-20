'use client';

import { CustomOrderForm } from "@/components/custom-order/custom-order-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomOrderPage() {
  const router = useRouter();

  return (
    <div className="container py-12">
       <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Request a Custom Order</CardTitle>
          <CardDescription>
            Looking for something specific? Fill out the form below and our team will get back to you with a custom quote.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomOrderForm />
        </CardContent>
      </Card>
    </div>
  );
}
