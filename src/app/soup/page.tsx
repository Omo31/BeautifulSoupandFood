'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductCard } from '@/components/shared/product-card';

const soupProducts = [
  {
    id: '7',
    name: 'Tomato Basil Soup',
    price: 7.5,
    stock: 25,
    image: PlaceHolderImages.find((img) => img.id === 'product-7')!,
  },
  {
    id: '8',
    name: 'Chicken Noodle Soup',
    price: 9.0,
    stock: 4,
    image: PlaceHolderImages.find((img) => img.id === 'product-8')!,
  },
];

export default function SoupPage() {
  const router = useRouter();

  return (
    <div className="container py-12">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go back
      </Button>
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Hearty Soups</h1>
        <p className="text-muted-foreground mt-2">
          Warm up with our delicious, freshly made soups.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {soupProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
