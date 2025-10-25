'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Order } from './order-table';

export function OrderDetails({ order }: { order: Order }) {

    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'Delivered':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Delivered</Badge>;
            case 'Pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'Awaiting Confirmation':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100/80">Awaiting Confirmation</Badge>;
            case 'Rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl">Order {order.id}</CardTitle>
                        <CardDescription>
                            Date: {new Date(order.date).toLocaleDateString()}
                        </CardDescription>
                    </div>
                    {getStatusBadge(order.status)}
                </div>
            </CardHeader>
            <CardContent>
                {order.isCustom && order.customOrderDetails ? (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Custom Item Request</h3>
                        <div className="grid grid-cols-2 gap-4 p-4 border rounded-md bg-muted/50">
                            <div>
                                <p className="text-sm text-muted-foreground">Item Name</p>
                                <p className="font-medium">{order.customOrderDetails.itemName}</p>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Quantity / Measure</p>
                                <p className="font-medium">{order.customOrderDetails.quantity} {order.customOrderDetails.measure}</p>
                            </div>
                        </div>
                        {order.customOrderDetails.notes && (
                             <div>
                                <p className="text-sm text-muted-foreground">Customer Notes</p>
                                <p className="font-medium whitespace-pre-wrap">{order.customOrderDetails.notes}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Items ({order.items})</h3>
                        <p className="text-sm text-muted-foreground">[Standard item list would go here]</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
