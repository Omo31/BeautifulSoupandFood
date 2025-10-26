'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Trash2 } from 'lucide-react';
import type { GenerateVideoAdOutput } from '@/ai/flows/generate-video-ad';
import { useToast } from '@/hooks/use-toast.tsx';
import { Progress } from '../ui/progress';

type VideoDisplayProps = {
  result: GenerateVideoAdOutput | null;
  loading: boolean;
  loadingProgress: number;
  onDelete: () => void;
};

export function VideoDisplay({ result, loading, loadingProgress, onDelete }: VideoDisplayProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.videoUrl;
    link.download = `video_ad_${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: 'Download Started',
      description: 'Your video ad is being downloaded.',
    });
  };

  if (loading) {
    return (
      <Card className="mt-8">
        <CardHeader>
           <CardTitle className="font-headline text-2xl">Generating Your Video...</CardTitle>
           <CardDescription>This may take up to a minute. Please be patient.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <Progress value={loadingProgress} className="w-full" />
                <p className="text-muted-foreground text-sm">
                    {loadingProgress < 30 ? "Initializing model..." : loadingProgress < 70 ? "Generating video frames..." : "Finalizing and encoding..."}
                </p>
            </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="mt-8 flex flex-col items-center justify-center py-16">
        <CardContent className="text-center">
            <p className="text-muted-foreground">Your generated video ad will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your Generated Video</CardTitle>
        <CardDescription>Review the generated video ad for your campaign.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black">
          <video
            src={result.videoUrl}
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 p-4">
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Video
        </Button>
        <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
