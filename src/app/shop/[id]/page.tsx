import { ProductDetails } from '@/components/product/product-details';
import { ProductReviews } from '@/components/product/product-reviews';
import { ReviewForm } from '@/components/product/review-form';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// MOCK DATA - In a real app, this would be fetched from Firestore
const allProducts = [
  { id: "1", name: "Artisan Sourdough", description: "A classic sourdough with a chewy crust and tangy flavor, perfect for sandwiches or toast.", price: 8.50, stock: 20, image: PlaceHolderImages.find(img => img.id === 'product-1')!, rating: 4.8, reviewCount: 25 },
  { id: "2", name: "Organic Vegetable Box", description: "A weekly selection of the freshest organic vegetables sourced from local farms. Contents vary by season.", price: 35.00, stock: 15, image: PlaceHolderImages.find(img => img.id === 'product-2')!, rating: 4.9, reviewCount: 42 },
  { id: "3", name: "Aged Parmesan Wheel", description: "A rich and nutty Parmigiano-Reggiano, aged for 24 months. Perfect for grating over pasta or enjoying on its own.", price: 22.00, stock: 3, image: PlaceHolderImages.find(img => img.id === 'product-3')!, rating: 4.7, reviewCount: 18 },
  { id: "4", name: "Extra Virgin Olive Oil", description: "Cold-pressed from the finest Italian olives, this EVOO has a fruity, peppery flavor profile.", price: 15.75, stock: 30, image: PlaceHolderImages.find(img => img.id === 'product-4')!, rating: 4.9, reviewCount: 55 },
  { id: "5", name: "Fresh Berry Medley", description: "A delightful mix of seasonal berries including strawberries, blueberries, and raspberries.", price: 12.00, stock: 0, image: PlaceHolderImages.find(img => img.id === 'product-5')!, rating: 4.6, reviewCount: 31 },
  { id: "6", name: "Vintage Red Wine", description: "A full-bodied Cabernet Sauvignon with notes of dark cherry, vanilla, and oak. Pairs well with red meat.", price: 45.00, stock: 8, image: PlaceHolderImages.find(img => img.id === 'product-6')!, rating: 4.8, reviewCount: 12 },
  { id: '7', name: 'Tomato Basil Soup', description: "A creamy and comforting classic, made with vine-ripened tomatoes and fresh basil.", price: 7.50, stock: 25, image: PlaceHolderImages.find(img => img.id === 'product-7')!, rating: 4.7, reviewCount: 38 },
  { id: '8', name: 'Chicken Noodle Soup', description: "The ultimate comfort food, with tender chicken, egg noodles, and a rich, savory broth.", price: 9.00, stock: 4, image: PlaceHolderImages.find(img => img.id === 'product-8')!, rating: 4.8, reviewCount: 45 },
];

// MOCK DATA
const mockReviews = {
  "1": [
    { id: 'r1', author: 'Jane D.', rating: 5, comment: 'Absolutely the best sourdough I have ever had. The crust is perfect!', date: '2023-10-25' },
    { id: 'r2', author: 'John S.', rating: 4, comment: 'Great flavor, a little dense for my taste but still delicious.', date: '2023-10-22' },
  ],
  "2": [
    { id: 'r3', author: 'Emily R.', rating: 5, comment: 'So fresh and a great variety! Makes my weekly meal prep so much easier.', date: '2023-10-24' },
  ],
  "4": [
      { id: 'r4', author: 'Michael B.', rating: 5, comment: 'This olive oil is incredible. You can really taste the quality. I use it on everything!', date: '2023-10-20' }
  ]
};

async function getProductById(id: string) {
  // In a real app, this would fetch from Firestore.
  return allProducts.find(p => p.id === id) || null;
}

async function getReviewsByProductId(id: string) {
  // In a real app, this would fetch from the reviews subcollection in Firestore.
  return (mockReviews as any)[id] || [];
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  const reviews = await getReviewsByProductId(params.id);
  
  // In a real app, check auth state
  const isAuthenticated = true; 

  if (!product) {
    return <div className="container py-12 text-center">Product not found.</div>;
  }

  return (
    <div className="container py-12">
      <ProductDetails product={product} />
      <Separator className="my-12" />
      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
            <ProductReviews reviews={reviews} />
        </div>
        <div>
            <Card>
                <CardContent className="p-6">
                    <ReviewForm productId={product.id} isAuthenticated={isAuthenticated} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
