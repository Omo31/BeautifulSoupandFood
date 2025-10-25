
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, SlidersHorizontal } from 'lucide-react';
import { ProductTable } from '@/components/inventory/product-table';
import { AddProductDialog } from '@/components/inventory/add-product-dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Mock data, to be replaced with data from a database
const initialProducts = [
  { id: "1", name: "Artisan Sourdough", price: 8.50, stock: 20, category: 'Shop', lowStockThreshold: 5, image: PlaceHolderImages.find(img => img.id === 'product-1')! },
  { id: "2", name: "Organic Vegetable Box", price: 35.00, stock: 15, category: 'Shop', lowStockThreshold: 5, image: PlaceHolderImages.find(img => img.id === 'product-2')! },
  { id: "3", name: "Aged Parmesan Wheel", price: 22.00, stock: 3, category: 'Shop', lowStockThreshold: 5, image: PlaceHolderImages.find(img => img.id === 'product-3')! },
  { id: "4", name: "Extra Virgin Olive Oil", price: 15.75, stock: 30, category: 'Shop', lowStockThreshold: 10, image: PlaceHolderImages.find(img => img.id === 'product-4')! },
  { id: "5", name: "Fresh Berry Medley", price: 12.00, stock: 0, category: 'Shop', lowStockThreshold: 5, image: PlaceHolderImages.find(img => img.id === 'product-5')! },
  { id: "6", name: "Vintage Red Wine", price: 45.00, stock: 8, category: 'Shop', lowStockThreshold: 5, image: PlaceHolderImages.find(img => img.id === 'product-6')! },
  { id: '7', name: 'Tomato Basil Soup', price: 7.50, stock: 25, category: 'Soup', lowStockThreshold: 10, image: PlaceHolderImages.find(img => img.id === 'product-7')! },
  { id: '8', name: 'Chicken Noodle Soup', price: 9.00, stock: 4, category: 'Soup', lowStockThreshold: 5, image: PlaceHolderImages.find(img => img.id === 'product-8')! },
  { id: '9', name: 'French Baguette', price: 4.50, stock: 50, category: 'Shop', image: {id: '9', imageUrl: 'https://picsum.photos/seed/baguette/400/300', imageHint: 'french baguette'} },
  { id: '10', name: 'Gourmet Coffee Beans', price: 18.00, stock: 40, category: 'Shop', image: {id: '10', imageUrl: 'https://picsum.photos/seed/coffee-beans/400/300', imageHint: 'coffee beans'} },
  { id: '11', name: 'Butternut Squash Soup', price: 8.00, stock: 12, category: 'Soup', image: {id: '11', imageUrl: 'https://picsum.photos/seed/butternut-soup/400/300', imageHint: 'butternut soup'} },
];

const ITEMS_PER_PAGE = 5;

export default function AdminInventoryPage() {
  const [products, setProducts] = useState(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ name: '', category: 'all', stockStatus: 'all' });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(filters.name.toLowerCase());
    const categoryMatch = filters.category === 'all' || product.category === filters.category;
    const stockStatusMatch = filters.stockStatus === 'all' ||
      (filters.stockStatus === 'in-stock' && product.stock > 0) ||
      (filters.stockStatus === 'low-stock' && product.lowStockThreshold && product.stock > 0 && product.stock <= product.lowStockThreshold) ||
      (filters.stockStatus === 'out-of-stock' && product.stock === 0);
    return nameMatch && categoryMatch && stockStatusMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const addProduct = (newProduct: any) => {
    setProducts(prev => [...prev, { ...newProduct, id: String(prev.length + 1) }]);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Collapsible className="space-y-4">
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </CollapsibleTrigger>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
            <Input
              placeholder="Filter by name..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Shop">Shop</SelectItem>
                <SelectItem value="Soup">Soup</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.stockStatus} onValueChange={(value) => handleFilterChange('stockStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by stock status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Statuses</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>Add, edit, and manage products.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductTable products={paginatedProducts} />
        </CardContent>
        {totalPages > 1 && (
           <CardFooter>
             <Pagination>
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
           </CardFooter>
        )}
      </Card>
      <AddProductDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onAddProduct={addProduct}
      />
    </>
  );
}
