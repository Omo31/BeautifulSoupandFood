'use client';

type YouTubeVideoSectionProps = {
  videoId: string;
  title?: string;
  description?: string;
};

export function YouTubeVideoSection({ videoId, title, description }: YouTubeVideoSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-muted/50">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="space-y-4">
            {title && (
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground text-lg">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
