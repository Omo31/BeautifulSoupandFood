'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type YouTubeVideoSectionProps = {
  videoId: string;
};

export function YouTubeVideoSection({ videoId }: YouTubeVideoSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-muted/50">
      <div className="container">
        <Card className="overflow-hidden shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl md:text-4xl">See Our Quality in Action</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video">
                    <iframe
                        className="w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
