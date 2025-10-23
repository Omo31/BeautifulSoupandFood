'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import type { CartItem as CartItemType } from '@/hooks/use-cart';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';

export function SavedItem({ item }: { item: CartItemType }) {
  const { moveToCart, removeFromSaved } = useCart();

  return (
    <Card className="flex flex-col">
        <Link href={`/shop/${item.id}`} className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
            <Image
            src={item.image.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            />
        </Link>
        <CardContent className="p-4 flex-1">
            <CardTitle className="text-base font-headline mb-1 hover:text-primary">
                <Link href={`/shop/${item.id}`}>{item.name}</Link>
            </CardTitle>
            <p className="text-lg font-semibold text-primary">${item.price.toFixed(2)}</p>
        </CardContent>
      <CardFooter className="p-2 pt-0 flex flex-col gap-2 items-stretch">
        <Button size="sm" onClick={() => moveToCart(item.id)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Move to Cart
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => removeFromSaved(item.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
        </Button>
      </CardFooter>
    </Card>
  );
}
