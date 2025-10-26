'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShoppingCart, Ban, Minus, Plus, Star, Heart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast.tsx';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  image: (typeof PlaceHolderImages)[0];
  rating?: number;
  reviewCount?: number;
  category: string;
};

export function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      stock: product.stock,
      category: product.category,
    });
    toast({
      title: `${quantity} x ${product.name} added to cart.`,
    });
  };

  const handleWishlist = () => {
    toast({
        title: 'Added to Wishlist (Simulated)',
        description: `${product.name} has been added to your wishlist.`,
    });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
        <Image
          src={product.image.imageUrl}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-300 ${isOutOfStock ? 'grayscale' : ''}`}
          data-ai-hint={product.image.imageHint}
        />
        {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-3 right-3 z-10 text-lg px-4 py-1">Out of Stock</Badge>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">{product.name}</h1>
        
        {product.rating !== undefined && product.reviewCount !== undefined && product.reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">
              ({product.rating.toFixed(1)} from {product.reviewCount} reviews)
            </span>
          </div>
        )}

        <p className="text-muted-foreground text-lg">{product.description}</p>
        
        <p className="text-4xl font-bold text-primary">₦{product.price.toFixed(2)}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-bold w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setQuantity(quantity + 1)}
              disabled={isOutOfStock || quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
        </div>

        <div className="flex gap-2">
          <Button size="lg" disabled={isOutOfStock} onClick={handleAddToCart} className="flex-1">
            {isOutOfStock ? <Ban className="mr-2 h-5 w-5" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
            {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
          </Button>
          <Button variant="outline" size="lg" onClick={handleWishlist}>
              <Heart className="mr-2 h-5 w-5" />
              Wishlist
          </Button>
        </div>
      </div>
    </div>
  );
}
