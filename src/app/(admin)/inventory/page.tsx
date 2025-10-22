'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ProductTable } from '@/components/inventory/product-table';
import { AddProductDialog } from '@/components/inventory/add-product-dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
];

export default function AdminInventoryPage() {
  const [products, setProducts] = useState(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addProduct = (newProduct: any) => {
    // In a real app, this would also save to the database.
    setProducts(prev => [...prev, { ...newProduct, id: String(prev.length + 1) }]);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Add, edit, and manage products.</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <ProductTable products={products} />
        </CardContent>
      </Card>
      <AddProductDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onAddProduct={addProduct}
      />
    </>
  );
}
