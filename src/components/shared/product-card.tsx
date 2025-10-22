'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Ban, Star } from "lucide-react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: ImagePlaceholder;
  rating?: number;
  reviewCount?: number;
  category: string;
}

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg relative group">
      <Link href={`/shop/${product.id}`} className="flex flex-col h-full">
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 right-2 z-10">Out of Stock</Badge>
        )}
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={product.image.imageUrl}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'grayscale' : ''}`}
            data-ai-hint={product.image.imageHint}
          />
          {isOutOfStock && <div className="absolute inset-0 bg-black/30"></div>}
        </div>
        <CardContent className="flex-1 p-4">
          <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors">{product.name}</CardTitle>
           {product.rating !== undefined && product.reviewCount !== undefined && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-xs">({product.reviewCount} reviews)</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <p className="text-xl font-semibold text-primary">
            ${product.price.toFixed(2)}
          </p>
          <Button size="sm" disabled={isOutOfStock} onClick={(e) => { e.preventDefault(); /* TODO: Add to cart logic */ }}>
            {isOutOfStock ? <Ban className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
            {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
