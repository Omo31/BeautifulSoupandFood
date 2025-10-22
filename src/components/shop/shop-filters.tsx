
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '../ui/button';
import { ListFilter } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '../ui/sheet';

type ShopFiltersProps = {
  filters: {
    categories: string[];
    priceRange: [number, number];
    stockStatus: string[];
  };
  setFilters: (filters: any) => void;
};

const categories = ['Shop', 'Soup'];
const stockOptions = [
  { id: 'in-stock', label: 'In Stock' },
  { id: 'out-of-stock', label: 'Out of Stock' },
];

function FiltersContent({ filters: appliedFilters, setFilters: setAppliedFilters }: ShopFiltersProps) {
  const [localFilters, setLocalFilters] = useState(appliedFilters);

  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters]);

  const handleCategoryChange = (categoryId: string, checked: boolean | 'indeterminate') => {
    setLocalFilters((prev: any) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((c: string) => c !== categoryId),
    }));
  };
  
  const handleStockChange = (stockId: string, checked: boolean | 'indeterminate') => {
    setLocalFilters((prev: any) => ({
      ...prev,
      stockStatus: checked
        ? [...prev.stockStatus, stockId]
        : prev.stockStatus.filter((s: string) => s !== stockId),
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setLocalFilters((prev: any) => ({
        ...prev,
        priceRange: value
    }));
  };
  
  const handleApply = () => {
    setAppliedFilters(localFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category}`}
                  checked={localFilters.categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                />
                <Label htmlFor={`cat-${category}`} className="font-normal">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Price Range</h3>
          <Slider
            min={0}
            max={100}
            step={5}
            value={localFilters.priceRange}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${localFilters.priceRange[0]}</span>
            <span>${localFilters.priceRange[1]}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Stock Status</h3>
          <div className="space-y-2">
            {stockOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={localFilters.stockStatus.includes(option.id)}
                  onCheckedChange={(checked) => handleStockChange(option.id, checked)}
                />
                <Label htmlFor={option.id} className="font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
       <CardFooter>
        <Button onClick={handleApply} className="w-full">Apply Filters</Button>
      </CardFooter>
    </Card>
  )
}

export function ShopFilters({ filters, setFilters }: ShopFiltersProps) {
  const [open, setOpen] = useState(false);

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setOpen(false); // Close the sheet on mobile after applying
  };

  return (
    <>
      <div className="hidden md:block">
        <FiltersContent filters={filters} setFilters={setFilters} />
      </div>
      <div className="md:hidden mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="flex-1">
                   <FiltersContent filters={filters} setFilters={handleApplyFilters} />
                </div>
            </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
