import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Ban } from "lucide-react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: ImagePlaceholder;
}

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg relative">
      {isOutOfStock && (
        <Badge variant="destructive" className="absolute top-2 right-2 z-10">Out of Stock</Badge>
      )}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={product.image.imageUrl}
          alt={product.name}
          fill
          className={`object-cover ${isOutOfStock ? 'grayscale' : ''}`}
          data-ai-hint={product.image.imageHint}
        />
        {isOutOfStock && <div className="absolute inset-0 bg-black/30"></div>}
      </div>
      <CardContent className="flex-1 p-4">
        <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-xl font-semibold text-primary">
          ${product.price.toFixed(2)}
        </p>
        <Button size="sm" disabled={isOutOfStock}>
          {isOutOfStock ? <Ban className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
