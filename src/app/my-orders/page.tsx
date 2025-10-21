'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderList } from "@/components/my-orders/order-list";

// Mock data for orders, in a real app this would come from a database.
const mockOrders = [
    { id: 'ORD001', date: '2023-10-26', status: 'Delivered', total: 43.50, items: 2 },
    { id: 'ORD006', date: '2023-10-27', status: 'Awaiting Confirmation', total: 95.50, items: 1, isCustom: true },
    { id: 'ORD002', date: '2023-10-24', status: 'Pending', total: 85.00, items: 1, isCustom: true },
    { id: 'ORD003', date: '2023-10-22', status: 'Rejected', total: 22.00, items: 1 },
    { id: 'ORD004', date: '2023-10-20', status: 'Delivered', total: 15.75, items: 1, needsReview: true },
    { id: 'ORD005', date: '2023-10-18', status: 'Delivered', total: 12.00, items: 1 },
];

export default function MyOrdersPage() {
  const router = useRouter();

  const deliveredOrders = mockOrders.filter(o => o.status === 'Delivered');
  const pendingOrders = mockOrders.filter(o => ['Pending', 'Awaiting Confirmation'].includes(o.status));
  const cancelledOrders = mockOrders.filter(o => o.status === 'Rejected');
  const reviewOrders = mockOrders.filter(o => o.needsReview);

  return (
    <div className="container py-12">
       <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back
        </Button>
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle className="font-headline text-3xl">My Orders</CardTitle>
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
            <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
                    <TabsTrigger value="all">All ({mockOrders.length})</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered ({deliveredOrders.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <OrderList orders={mockOrders} />
                </TabsContent>
                <TabsContent value="delivered">
                    <OrderList orders={deliveredOrders} emptyMessage="You have no delivered orders." />
                </TabsContent>
                 <TabsContent value="pending">
                    <OrderList orders={pendingOrders} emptyMessage="You have no pending orders." />
                </TabsContent>
                <TabsContent value="cancelled">
                    <OrderList orders={cancelledOrders} emptyMessage="You have no cancelled or rejected orders." />
                </TabsContent>
            </Tabs>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Orders Awaiting Review ({reviewOrders.length})</h3>
                 <OrderList orders={reviewOrders} emptyMessage="You have no orders waiting for review." />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
