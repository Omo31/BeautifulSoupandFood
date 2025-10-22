import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/shared/product-card";

const allProducts = [
  { id: "1", name: "Artisan Sourdough", price: 8.50, stock: 20, image: PlaceHolderImages.find(img => img.id === 'product-1')!, rating: 4.8, reviewCount: 25 },
  { id: "2", name: "Organic Vegetable Box", price: 35.00, stock: 15, image: PlaceHolderImages.find(img => img.id === 'product-2')!, rating: 4.9, reviewCount: 42 },
  { id: "3", name: "Aged Parmesan Wheel", price: 22.00, stock: 3, image: PlaceHolderImages.find(img => img.id === 'product-3')!, rating: 4.7, reviewCount: 18 },
  { id: "4", name: "Extra Virgin Olive Oil", price: 15.75, stock: 30, image: PlaceHolderImages.find(img => img.id === 'product-4')!, rating: 4.9, reviewCount: 55 },
  { id: "5", name: "Fresh Berry Medley", price: 12.00, stock: 0, image: PlaceHolderImages.find(img => img.id === 'product-5')!, rating: 4.6, reviewCount: 31 },
  { id: "6", name: "Vintage Red Wine", price: 45.00, stock: 8, image: PlaceHolderImages.find(img => img.id === 'product-6')!, rating: 4.8, reviewCount: 12 },
];

export default function ShopPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Our Collection</h1>
        <p className="text-muted-foreground mt-2">Browse our hand-picked selection of gourmet products.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
