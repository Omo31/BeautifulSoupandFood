'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Trash2, Volume2 } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio && result) {
      const playAudio = () => audio.play();
      const pauseAudio = () => audio.pause();
      const syncAudioTime = () => {
        if(Math.abs(video.currentTime - audio.currentTime) > 0.1) {
             audio.currentTime = video.currentTime;
        }
      };

      video.addEventListener('play', playAudio);
      video.addEventListener('pause', pauseAudio);
      video.addEventListener('seeking', syncAudioTime);
      
      // Cleanup
      return () => {
        video.removeEventListener('play', playAudio);
        video.removeEventListener('pause', pauseAudio);
        video.removeEventListener('seeking', syncAudioTime);
      };
    }
  }, [result]);


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
                    {loadingProgress < 20 ? "Writing script..." : loadingProgress < 60 ? "Generating video and voiceover..." : "Finalizing and encoding..."}
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
        <CardDescription>Review the generated video ad for your campaign. Unmute the video to hear the voiceover.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3 aspect-video w-full overflow-hidden rounded-lg border bg-black">
                <video
                    ref={videoRef}
                    src={result.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                />
                {result.audioUrl && <audio ref={audioRef} src={result.audioUrl} className="hidden" />}
            </div>
            <div className="md:col-span-2">
                <h3 className="font-semibold flex items-center gap-2 mb-2"><Volume2 className="h-5 w-5" /> Voiceover Script</h3>
                <div className="prose prose-sm max-w-none h-48 overflow-auto rounded-md border bg-muted/30 p-4">
                    <p className="whitespace-pre-wrap font-body text-sm text-foreground">
                        {result.script}
                    </p>
                </div>
            </div>
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
