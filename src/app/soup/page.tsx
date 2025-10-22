import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/shared/product-card";

const soupProducts = [
  { id: "7", name: "Tomato Basil Soup", price: 7.50, image: PlaceHolderImages.find(img => img.id === 'product-7')! },
  { id: "8", name: "Chicken Noodle Soup", price: 9.00, image: PlaceHolderImages.find(img => img.id === 'product-8')! },
];

export default function SoupPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Hearty Soups</h1>
        <p className="text-muted-foreground mt-2">Warm up with our delicious, freshly made soups.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {soupProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
