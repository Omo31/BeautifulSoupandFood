
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ListFilter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderList } from "@/components/my-orders/order-list";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from '@/components/ui/pagination';
import { OrderFilterDialog, type OrderFilters } from '@/components/my-orders/order-filter-dialog';
import { DateRange } from 'react-day-picker';
import { mockOrders } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';


const ITEMS_PER_PAGE = 4;

export default function MyOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({ statuses: [], dateRange: undefined });
  const router = useRouter();

  const deliveredOrders = mockOrders.filter(o => o.status === 'Delivered');
  const pendingOrders = mockOrders.filter(o => ['Pending', 'Awaiting Confirmation'].includes(o.status));
  const cancelledOrders = mockOrders.filter(o => o.status === 'Rejected');
  const reviewOrders = mockOrders.filter(o => o.needsReview);

  const getOrdersForTab = (tab: string) => {
    switch (tab) {
      case 'delivered':
        return deliveredOrders;
      case 'pending':
        return pendingOrders;
      case 'cancelled':
        return cancelledOrders;
      case 'all':
      default:
        return mockOrders;
    }
  }

  const filteredOrdersByTab = getOrdersForTab(currentTab);

  const applyAllFilters = (orders: typeof mockOrders) => {
    return orders.filter(order => {
      const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(order.status);
      const dateMatch = !filters.dateRange?.from || 
        (new Date(order.date) >= filters.dateRange.from && (!filters.dateRange.to || new Date(order.date) <= filters.dateRange.to));
      return statusMatch && dateMatch;
    });
  }
  
  const activeOrders = applyAllFilters(filteredOrdersByTab);

  const totalPages = Math.ceil(activeOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = activeOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setCurrentPage(1); // Reset to first page on tab change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleApplyFilters = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };


  return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
        </Button>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>View your standard and custom order history.</CardDescription>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filter Orders
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="all" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
                    <TabsTrigger value="all">All ({mockOrders.length})</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered ({deliveredOrders.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <OrderList orders={paginatedOrders} />
                </TabsContent>
                <TabsContent value="delivered">
                    <OrderList orders={paginatedOrders} emptyMessage="You have no delivered orders." />
                </TabsContent>
                 <TabsContent value="pending">
                    <OrderList orders={paginatedOrders} emptyMessage="You have no pending orders." />
                </TabsContent>
                <TabsContent value="cancelled">
                    <OrderList orders={paginatedOrders} emptyMessage="You have no cancelled or rejected orders." />
                </TabsContent>
            </Tabs>

             {totalPages > 1 && (
                <Pagination className="mt-6">
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

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Orders Awaiting Review ({reviewOrders.length})</h3>
                 <OrderList orders={reviewOrders} emptyMessage="You have no orders waiting for review." />
            </div>
        </CardContent>
         <OrderFilterDialog 
            isOpen={isFilterOpen} 
            setIsOpen={setIsFilterOpen} 
            onApplyFilters={handleApplyFilters}
            currentFilters={filters}
        />
      </Card>
      </div>
  );
}
