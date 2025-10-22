
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderList } from "@/components/my-orders/order-list";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from '@/components/ui/pagination';


// Mock data for orders, in a real app this would come from a database.
export const mockOrders = [
    { id: 'ORD001', date: '2023-10-26', status: 'Delivered', total: 43.50, items: 2, customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } },
    { id: 'ORD006', date: '2023-10-27', status: 'Awaiting Confirmation', total: 95.50, items: 1, isCustom: true, customer: { name: 'John Smith', email: 'john.smith@example.com' } },
    { id: 'ORD002', date: '2023-10-24', status: 'Pending', total: 85.00, items: 1, isCustom: true, customer: { name: 'Alice Johnson', email: 'alice.j@example.com' } },
    { id: 'ORD003', date: '2023-10-22', status: 'Rejected', total: 22.00, items: 1, customer: { name: 'Bob Williams', email: 'bob.w@example.com' } },
    { id: 'ORD004', date: '2023-10-20', status: 'Delivered', total: 15.75, items: 1, needsReview: true, customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } },
    { id: 'ORD005', date: '2023-10-18', status: 'Delivered', total: 12.00, items: 1, customer: { name: 'Charlie Brown', email: 'charlie.b@example.com' } },
    { id: 'ORD007', date: '2023-11-01', status: 'Delivered', total: 55.00, items: 3, customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } },
    { id: 'ORD008', date: '2023-11-02', status: 'Pending', total: 18.25, items: 1, customer: { name: 'John Smith', email: 'john.smith@example.com' } },
];

const ITEMS_PER_PAGE = 4;

export default function MyOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState('all');

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

  const activeOrders = getOrdersForTab(currentTab);
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


  return (
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>View your standard and custom order history.</CardDescription>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
                <Button variant="outline">
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
      </Card>
  );
}
