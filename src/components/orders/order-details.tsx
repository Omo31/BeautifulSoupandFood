
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Order } from './order-table';
import { Separator } from '../ui/separator';
import { format } from 'date-fns';

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
                            Date: {format(new Date(order.date), 'PPP')}
                        </CardDescription>
                    </div>
                    {getStatusBadge(order.status)}
                </div>
            </CardHeader>
            <CardContent>
                {order.isCustom && order.customOrderDetails ? (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Custom Request Details</h3>
                        
                        {order.customOrderDetails.items.length > 0 && (
                            <div className='space-y-2'>
                                <h4 className="font-medium">Requested Items</h4>
                                <div className="space-y-2 rounded-md border bg-muted/50 p-4">
                                {order.customOrderDetails.items.map(item => (
                                    <div key={item.id} className="flex justify-between">
                                        <span>{item.name}</span>
                                        <span className="text-muted-foreground">{item.quantity} x {item.measure}</span>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}

                        {order.customOrderDetails.services.length > 0 && (
                             <div className='space-y-2'>
                                <h4 className="font-medium">Requested Services</h4>
                                 <div className="space-y-2 rounded-md border bg-muted/50 p-4">
                                    {order.customOrderDetails.services.map(service => (
                                        <div key={service.id} className="flex justify-between">
                                            <span>{service.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {order.customOrderDetails.notes && (
                            <div className='space-y-2'>
                                <h4 className="font-medium">Customer Notes</h4>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap border p-4 rounded-md">{order.customOrderDetails.notes}</p>
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
