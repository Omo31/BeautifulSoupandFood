'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Order = {
    id: string;
    date: string;
    status: 'Delivered' | 'Pending' | 'Rejected';
    total: number;
    items: number;
    isCustom?: boolean;
    needsReview?: boolean;
};

type OrderListProps = {
    orders: Order[];
    emptyMessage?: string;
};

export function OrderList({ orders, emptyMessage = "You have no past orders." }: OrderListProps) {
    if (orders.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-12 rounded-lg bg-muted/50">
                <p>{emptyMessage}</p>
                <p className="text-sm">Once you place an order, it will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <Card key={order.id}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-lg">Order {order.id}</CardTitle>
                            <CardDescription>
                                Date: {new Date(order.date).toLocaleDateString()}
                            </CardDescription>
                        </div>
                         <Badge 
                            variant={
                                order.status === 'Delivered' ? 'default' : 
                                order.status === 'Pending' ? 'secondary' : 'destructive'
                            }
                            className="capitalize bg-green-100 text-green-800"
                         >
                            {order.status}
                         </Badge>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <Separator className="mb-4" />
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{order.items} item(s)</p>
                                {order.isCustom && <Badge variant="outline" className="mt-1">Custom Order</Badge>}
                            </div>
                            <p className="text-xl font-semibold">${order.total.toFixed(2)}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        {order.status === 'Delivered' && !order.needsReview && <Button variant="secondary" size="sm">Track Order</Button>}
                        {order.needsReview && <Button size="sm">Write a Review</Button>}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
