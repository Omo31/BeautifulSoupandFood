import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";

interface Product {
  id: string;
  name: string;
  price: number;
  image: ImagePlaceholder;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={product.image.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          data-ai-hint={product.image.imageHint}
        />
      </div>
      <CardContent className="flex-1 p-4">
        <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-xl font-semibold text-primary">
          ${product.price.toFixed(2)}
        </p>
        <Button size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
