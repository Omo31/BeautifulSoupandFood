'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Film, Trash2 } from 'lucide-react';
import type { GenerateVideoAdOutput } from '@/ai/flows/generate-video-ad';
import { useToast } from '@/hooks/use-toast.tsx';
import { Progress } from '../ui/progress';

type VideoDisplayProps = {
  result: GenerateVideoAdOutput | null;
  loading: boolean;
  onDelete: () => void;
  progress: number;
};

export function VideoDisplay({ result, loading, onDelete, progress }: VideoDisplayProps) {
  const { toast } = useToast();

  const handleAction = (message: string) => {
    toast({
      title: 'Action Triggered (Simulated)',
      description: message,
    });
  };
  
  const downloadDataURI = (dataURI: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataURI;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Generating Your Video Ad...</CardTitle>
          <CardDescription>The AI is working its magic. This may take up to a minute.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-full max-w-md space-y-4">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
                <p className="text-sm animate-pulse">Generating script... creating scenes... rendering video...</p>
            </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="mt-8 flex flex-col items-center justify-center py-20 text-center">
        <CardContent>
            <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Your generated video ad will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your Generated Video Ad</CardTitle>
        <CardDescription>Review the generated video and voiceover script.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-black">
          <video
            src={result.videoUrl}
            controls
            className="w-full h-full"
          />
        </div>
         <div className="prose prose-sm max-w-none rounded-md border bg-muted/30 p-4">
            <h3 className="font-headline text-lg not-prose mb-2">Generated Script</h3>
            <pre className="whitespace-pre-wrap font-body text-sm text-foreground bg-transparent p-0 m-0">
              {result.script}
            </pre>
          </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 p-4">
        <div className="flex gap-2">
            <Button onClick={() => downloadDataURI(result.videoUrl, 'video_ad.mp4')}>
              <Download className="mr-2 h-4 w-4" />
              Download Video
            </Button>
            <Button variant="outline" onClick={() => downloadDataURI(result.audioUrl, 'voiceover.wav')}>
              <Download className="mr-2 h-4 w-4" />
              Download Audio
            </Button>
        </div>
        <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
