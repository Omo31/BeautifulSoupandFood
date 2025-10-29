'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Trash2, Wand2 } from 'lucide-react';
import type { GenerateMarketingFlyerOutput } from '@/ai/flows/generate-marketing-flyers';

type FlyerDisplayProps = {
  result: GenerateMarketingFlyerOutput | null;
  loading: boolean;
  onDelete: () => void;
};

export function FlyerDisplay({ result, loading, onDelete }: FlyerDisplayProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center items-center mb-4">
             <Wand2 className="h-6 w-6 mr-2 animate-pulse" />
             <p className="text-muted-foreground">Generating your flyer...</p>
          </div>
          <Skeleton className="aspect-[3/4] w-full max-w-sm mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const { flyerHtml, flyerText, flyerImage } = result;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Generated Flyer</CardTitle>
                <CardDescription>Review the AI-generated content and image below.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
                <Button variant="destructive" size="sm" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
            {flyerImage && (
                 <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border">
                    <Image src={flyerImage} alt="Generated Flyer" fill className="object-cover" />
                </div>
            )}
           
            <div className="prose">
                <div dangerouslySetInnerHTML={{ __html: flyerHtml }} />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
