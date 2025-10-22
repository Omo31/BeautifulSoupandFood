
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderTable } from "@/components/orders/order-table";
import { mockOrders } from "@/app/(main)/account/orders/page";

export default function AdminOrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and process all customer orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <OrderTable orders={mockOrders} />
      </CardContent>
    </Card>
  );
}
