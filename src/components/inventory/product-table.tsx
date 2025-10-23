'use client';

import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: 'Shop' | 'Soup';
  lowStockThreshold?: number;
  image: ImagePlaceholder;
};

export function ProductTable({ products }: { products: Product[] }) {
  const { toast } = useToast();

  const handleAction = (message: string) => {
    toast({
      title: 'Action Triggered (Simulated)',
      description: message,
    });
  };

  const getStockStatus = (stock: number, threshold?: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (threshold && stock <= threshold) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80">Low Stock</Badge>;
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">In Stock</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="hidden md:table-cell">Stock</TableHead>
          <TableHead className="hidden md:table-cell">Category</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="hidden sm:table-cell">
              <Image
                alt={product.name}
                className="aspect-square rounded-md object-cover"
                height="64"
                src={product.image.imageUrl}
                width="64"
              />
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{getStockStatus(product.stock, product.lowStockThreshold)}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
            <TableCell className="hidden md:table-cell">
              <Badge variant="outline">{product.category}</Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleAction(`Editing product: ${product.name}`)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction(`Deleting product: ${product.name}`)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
