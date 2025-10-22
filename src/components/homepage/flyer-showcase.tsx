import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";

// Mock data for the flyer. In a real app, this might be fetched from a CMS or settings.
const flyerData = {
    headline: "Weekly Special: The Organic Veggie Box",
    description: "Get a curated box of the freshest seasonal vegetables delivered to your door. Perfect for healthy, home-cooked meals.",
    callToAction: "Order Now & Get 10% Off",
    imageUrl: PlaceHolderImages.find(img => img.id === 'product-2')?.imageUrl ?? "https://picsum.photos/seed/flyer-veggie/800/600",
    imageHint: "organic vegetables",
    link: "/shop/2"
};

export function FlyerShowcase() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container">
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] w-full">
                    <Image 
                        src={flyerData.imageUrl}
                        alt="Promotional Flyer"
                        fill
                        className="object-cover"
                        data-ai-hint={flyerData.imageHint}
                    />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold leading-tight">
                        {flyerData.headline}
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        {flyerData.description}
                    </p>
                    <div className="mt-6">
                        <Button size="lg" asChild>
                            <Link href={flyerData.link}>
                                {flyerData.callToAction}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
      </div>
    </section>
  );
}
