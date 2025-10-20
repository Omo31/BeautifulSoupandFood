'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const router = useRouter();

  return (
    <div className="container py-12">
       <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">My Orders</CardTitle>
          <CardDescription>View your standard and custom order history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            <p>You have no past orders.</p>
            <p className="text-sm">Once you place an order, it will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
