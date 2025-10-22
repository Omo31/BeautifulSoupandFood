'use client';

import { useState } from 'react';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ProductCard } from "@/components/shared/product-card";
import { ShopFilters } from '@/components/shop/shop-filters';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';


const allProducts = [
  { id: "1", name: "Artisan Sourdough", price: 8.50, stock: 20, image: PlaceHolderImages.find(img => img.id === 'product-1')!, rating: 4.8, reviewCount: 25, category: 'Shop' },
  { id: "2", name: "Organic Vegetable Box", price: 35.00, stock: 15, image: PlaceHolderImages.find(img => img.id === 'product-2')!, rating: 4.9, reviewCount: 42, category: 'Shop' },
  { id: "3", name: "Aged Parmesan Wheel", price: 22.00, stock: 3, image: PlaceHolderImages.find(img => img.id === 'product-3')!, rating: 4.7, reviewCount: 18, category: 'Shop' },
  { id: "4", name: "Extra Virgin Olive Oil", price: 15.75, stock: 30, image: PlaceHolderImages.find(img => img.id === 'product-4')!, rating: 4.9, reviewCount: 55, category: 'Shop' },
  { id: "5", name: "Fresh Berry Medley", price: 12.00, stock: 0, image: PlaceHolderImages.find(img => img.id === 'product-5')!, rating: 4.6, reviewCount: 31, category: 'Shop' },
  { id: "6", name: "Vintage Red Wine", price: 45.00, stock: 8, image: PlaceHolderImages.find(img => img.id === 'product-6')!, rating: 4.8, reviewCount: 12, category: 'Shop' },
  { id: '7', name: 'Tomato Basil Soup', price: 7.50, stock: 25, image: PlaceHolderImages.find(img => img.id === 'product-7')!, rating: 4.7, reviewCount: 38, category: 'Soup' },
  { id: '8', name: 'Chicken Noodle Soup', price: 9.00, stock: 4, image: PlaceHolderImages.find(img => img.id === 'product-8')!, rating: 4.8, reviewCount: 45, category: 'Soup' },
  { id: '9', name: 'French Baguette', price: 4.50, stock: 50, category: 'Shop', image: {id: '9', imageUrl: 'https://picsum.photos/seed/baguette/400/300', imageHint: 'french baguette'} },
  { id: '10', name: 'Gourmet Coffee Beans', price: 18.00, stock: 40, category: 'Shop', image: {id: '10', imageUrl: 'https://picsum.photos/seed/coffee-beans/400/300', imageHint: 'coffee beans'} },
  { id: '11', name: 'Butternut Squash Soup', price: 8.00, stock: 12, category: 'Soup', image: {id: '11', imageUrl: 'https://picsum.photos/seed/butternut-soup/400/300', imageHint: 'butternut soup'} },
];

const ITEMS_PER_PAGE = 6;

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const pageQuery = searchParams.get('page') || '1';

  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 100] as [number, number],
    stockStatus: [] as string[],
  });

  const [currentPage, setCurrentPage] = useState(parseInt(pageQuery, 10));

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category);

    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

    const matchesStock = filters.stockStatus.length === 0 || 
        (filters.stockStatus.includes('in-stock') && product.stock > 0) ||
        (filters.stockStatus.includes('out-of-stock') && product.stock === 0);

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/shop?${params.toString()}`);
  }
  
  const handleSetFilters = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }

  return (
    <div className="container py-12">
       <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go back
      </Button>
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Our Collection</h1>
        <p className="text-muted-foreground mt-2">Browse our hand-picked selection of gourmet products.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <ShopFilters filters={filters} setFilters={handleSetFilters} />
        </aside>
        <main className="md:col-span-3">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(Math.max(1, currentPage - 1)); }} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(Math.min(totalPages, currentPage + 1)); }} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
             <div className="text-center py-24 px-6 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}
