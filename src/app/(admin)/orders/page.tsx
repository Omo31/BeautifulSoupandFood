
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { OrderTable } from "@/components/orders/order-table";
import { mockOrders } from "@/lib/mock-data";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 5;

export default function AdminOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = mockOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and process all customer orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <OrderTable orders={paginatedOrders} />
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
  );
}
