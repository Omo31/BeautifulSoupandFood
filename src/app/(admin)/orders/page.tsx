
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { OrderTable } from "@/components/orders/order-table";
import { mockOrders } from "@/lib/mock-data";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 5;

export default function AdminOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    customer: '',
    status: 'all',
    dateRange: undefined as DateRange | undefined,
  });

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const filteredOrders = mockOrders.filter(order => {
    const customerMatch = order.customer.name.toLowerCase().includes(filters.customer.toLowerCase()) ||
                          order.customer.email.toLowerCase().includes(filters.customer.toLowerCase());
    const statusMatch = filters.status === 'all' || order.status === filters.status;
    const dateMatch = !filters.dateRange?.from || 
        (new Date(order.date) >= filters.dateRange.from && (!filters.dateRange.to || new Date(order.date) <= filters.dateRange.to));
    
    return customerMatch && statusMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleResetFilters = () => {
    setFilters({ customer: '', status: 'all', dateRange: undefined });
    setCurrentPage(1);
  };

  return (
    <>
      <Collapsible className="space-y-4">
        <div className="flex items-center">
            <CollapsibleTrigger asChild>
                <Button variant="outline">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                <Input
                    placeholder="Filter by customer..."
                    value={filters.customer}
                    onChange={(e) => handleFilterChange('customer', e.target.value)}
                    className="md:col-span-2"
                />
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Awaiting Confirmation">Awaiting Confirmation</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
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
    </>
  );
}
