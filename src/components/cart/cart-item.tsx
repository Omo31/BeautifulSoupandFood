'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, Bookmark } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import type { CartItem as CartItemType } from '@/hooks/use-cart';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeFromCart, saveForLater } = useCart();

  return (
    <div className="flex items-start sm:items-center gap-4 py-4 flex-col sm:flex-row">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item.image.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          ₦{item.price.toFixed(2)}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-bold">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 self-end sm:self-center">
        <p className="font-bold text-lg">₦{(item.price * item.quantity).toFixed(2)}</p>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
            onClick={() => saveForLater(item.id)}
          >
            <Bookmark className="h-4 w-4 mr-1" />
            Save for Later
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-9 w-9"
            onClick={() => removeFromCart(item.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
