'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, BarChart2 } from 'lucide-react';
import type { GenerateMarketingFlyerOutput } from '@/ai/flows/generate-marketing-flyers';
import { useToast } from '@/hooks/use-toast';

type FlyerDisplayProps = {
  result: GenerateMarketingFlyerOutput | null;
  loading: boolean;
};

export function FlyerDisplay({ result, loading }: FlyerDisplayProps) {
  const { toast } = useToast();

  const handleAction = (message: string) => {
    toast({
      title: 'Action Triggered (Simulated)',
      description: message,
    });
  };

  if (loading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="mt-8 flex flex-col items-center justify-center py-12">
        <CardContent className="text-center">
            <p className="text-muted-foreground">Your generated flyer will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your Generated Flyer</CardTitle>
        <CardDescription>Review the generated content and image for your marketing campaign.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
            <Image
              src={result.imageUrl}
              alt="Generated Flyer Image"
              fill
              className="object-cover"
            />
          </div>
          <div className="prose prose-sm max-w-none rounded-md border bg-muted/30 p-4">
            <pre className="whitespace-pre-wrap font-body text-sm text-foreground">
              {result.flyerText}
            </pre>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 bg-muted/30 p-4">
         <Button onClick={() => handleAction('Downloading flyer assets.')}>
          <Download className="mr-2 h-4 w-4" />
          Download Assets
        </Button>
        <Button variant="outline" onClick={() => handleAction('Navigating to performance analytics.')}>
          <BarChart2 className="mr-2 h-4 w-4" />
          Monitor Performance
        </Button>
      </CardFooter>
    </Card>
  );
}
