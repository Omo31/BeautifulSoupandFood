
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, SlidersHorizontal, Calendar as CalendarIcon } from 'lucide-react';
import { PurchaseOrderTable } from '@/components/purchase-orders/po-table';
import { AddPurchaseOrderDialog } from '@/components/purchase-orders/add-po-dialog';
import { mockPurchaseOrders } from '@/lib/mock-data';
import type { PurchaseOrder } from '@/components/purchase-orders/po-table';
import { useToast } from '@/hooks/use-toast.tsx';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 5;

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    supplier: '',
    status: 'all',
    dateRange: undefined as DateRange | undefined,
  });

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };
  
  const handleResetFilters = () => {
    setFilters({ supplier: '', status: 'all', dateRange: undefined });
    setCurrentPage(1);
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const supplierMatch = po.supplier.toLowerCase().includes(filters.supplier.toLowerCase());
    const statusMatch = filters.status === 'all' || po.status === filters.status;
    const dateMatch = !filters.dateRange?.from ||
      (new Date(po.date) >= filters.dateRange.from && (!filters.dateRange.to || new Date(po.date) <= filters.dateRange.to));

    return supplierMatch && statusMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredPurchaseOrders.length / ITEMS_PER_PAGE);
  const paginatedPurchaseOrders = filteredPurchaseOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenNewDialog = () => {
    setEditingPO(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (po: PurchaseOrder) => {
    setEditingPO(po);
    setIsDialogOpen(true);
  };

  const handleAddOrUpdatePurchaseOrder = (poData: Omit<PurchaseOrder, 'id'>, status: 'Draft' | 'Pending') => {
    const newStatus = editingPO ? status : poData.status;

    if (editingPO) {
        // Update existing PO
        const updatedPO = { ...editingPO, ...poData, status: status, date: format(poData.date, 'yyyy-MM-dd') };
        setPurchaseOrders(prev => prev.map(p => p.id === editingPO.id ? updatedPO : p));
        toast({
            title: 'Purchase Order Updated',
            description: `PO ${updatedPO.id} has been updated.`,
        });
    } else {
        // Add new PO
        const poWithId: PurchaseOrder = {
        ...poData,
        id: `PO${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
        status: status,
        date: format(poData.date, 'yyyy-MM-dd'),
        };
        setPurchaseOrders(prev => [poWithId, ...prev]);
        toast({
        title: 'Purchase Order Created',
        description: `PO ${poWithId.id} has been saved as ${status}.`,
        });
    }
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
             <Button onClick={handleOpenNewDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Purchase Order
            </Button>
        </div>
        <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                <Input
                    placeholder="Filter by supplier..."
                    value={filters.supplier}
                    onChange={(e) => handleFilterChange('supplier', e.target.value)}
                    className="md:col-span-2"
                />
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange?.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                            {format(filters.dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(filters.dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange?.from}
                      selected={filters.dateRange}
                      onSelect={(range) => handleFilterChange('dateRange', range)}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <div className="md:col-span-4 flex justify-end">
                    <Button variant="ghost" onClick={handleResetFilters}>Reset Filters</Button>
                </div>
            </div>
        </CollapsibleContent>
      </Collapsible>
      <Card className="mt-4">
        <CardHeader>
          <div>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>Create and manage orders for your inventory suppliers.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <PurchaseOrderTable purchaseOrders={paginatedPurchaseOrders} onEdit={handleOpenEditDialog} />
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
      <AddPurchaseOrderDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onAddPurchaseOrder={handleAddOrUpdatePurchaseOrder}
        editingPO={editingPO}
      />
    </>
  );
}
