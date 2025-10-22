import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/shared/product-card";

// Mock data, to be replaced with data from a database
const featuredProducts = [
  { id: "1", name: "Artisan Sourdough", price: 8.50, stock: 20, image: PlaceHolderImages.find(img => img.id === 'product-1')!, rating: 4.8, reviewCount: 25 },
  { id: "2", name: "Organic Vegetable Box", price: 35.00, stock: 15, image: PlaceHolderImages.find(img => img.id === 'product-2')!, rating: 4.9, reviewCount: 42 },
  { id: "3", name: "Aged Parmesan Wheel", price: 22.00, stock: 3, image: PlaceHolderImages.find(img => img.id === 'product-3')!, rating: 4.7, reviewCount: 18 },
  { id: "4", name: "Extra Virgin Olive Oil", price: 15.75, stock: 30, image: PlaceHolderImages.find(img => img.id === 'product-4')!, rating: 4.9, reviewCount: 55 },
];

export function FeaturedProducts() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold">
            Featured Products
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Hand-picked selections from our finest collection of gourmet goods.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
