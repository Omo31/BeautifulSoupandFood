import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-1");

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter !leading-tight">
          Exceptional Quality, Delivered Fresh
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
          Discover the finest selection of gourmet produce, artisan goods, and pantry essentials from local and global sources.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg" asChild>
            <Link href="/shop">Shop Now</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/custom-order">Request a Custom Order</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
