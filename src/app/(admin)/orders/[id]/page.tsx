
import { mockOrders } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { OrderDetails } from '@/components/orders/order-details';
import { CustomerInfo } from '@/components/orders/customer-info';
import { QuoteForm } from '@/components/orders/quote-form';
import { Separator } from '@/components/ui/separator';

async function getOrderById(id: string) {
    // In a real app, this would fetch from Firestore.
    return mockOrders.find(o => o.id === id) || null;
}

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
    const order = await getOrderById(params.id);

    if (!order) {
        notFound();
    }

    const isCustomQuote = order.isCustom && order.status === 'Awaiting Confirmation';

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <OrderDetails order={order} />
                {isCustomQuote && <QuoteForm order={order} />}
            </div>
            <div className="space-y-8">
                 <CustomerInfo customer={order.customer} shippingAddress={order.shippingAddress} />
                 
                 {/* Placeholder for order history timeline */}
                 <Card>
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">[Timeline of order status changes will go here]</p>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}

