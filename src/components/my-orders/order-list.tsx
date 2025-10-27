
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast.tsx";
import { format } from "date-fns";

type Order = {
    id: string;
    date: string;
    status: 'Delivered' | 'Pending' | 'Rejected' | 'Awaiting Confirmation';
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
    const { toast } = useToast();

    if (orders.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-12 rounded-lg bg-muted/50">
                <p>{emptyMessage}</p>
                <p className="text-sm">Once you place an order, it will appear here.</p>
            </div>
        );
    }

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
    
    const handleActionClick = (message: string) => {
        toast({
            title: 'Action Triggered (Simulated)',
            description: message,
        });
    };

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <Card key={order.id}>
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <div>
                            <CardTitle className="text-lg">Order {order.id}</CardTitle>
                            <CardDescription>
                                Date: {format(new Date(order.date), 'PPP')}
                            </CardDescription>
                        </div>
                         {getStatusBadge(order.status)}
                    </CardHeader>
                    <CardContent className="pt-2">
                        <Separator className="mb-4" />
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{order.items} item(s)</p>
                                {order.isCustom && <Badge variant="outline" className="mt-1">Custom Order</Badge>}
                            </div>
                            <p className="text-xl font-semibold">₦{order.total.toFixed(2)}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 flex-wrap">
                         <Button variant="outline" size="sm" onClick={() => handleActionClick(`Displaying details for order ${order.id}.`)}>View Details</Button>
                        {order.status === 'Delivered' && !order.needsReview && <Button variant="secondary" size="sm" onClick={() => handleActionClick(`Opening tracking information for order ${order.id}.`)}>Track Order</Button>}
                        {order.needsReview && <Button size="sm" onClick={() => handleActionClick(`Navigating to review page for order ${order.id}.`)}>Write a Review</Button>}
                        {order.status === 'Awaiting Confirmation' && (
                           <>
                             <Button size="sm" onClick={() => handleActionClick(`Accepting quote for order ${order.id}.`)}>Accept</Button>
                             <Button variant="destructive" size="sm" onClick={() => handleActionClick(`Rejecting quote for order ${order.id}.`)}>Reject</Button>
                             <Button variant="outline" size="sm" onClick={() => handleActionClick(`Requesting edit for order ${order.id}.`)}>Edit</Button>
                           </>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
