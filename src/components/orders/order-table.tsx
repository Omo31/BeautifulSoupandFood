
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast.tsx";

export type Order = {
  id: string;
  date: string;
  status: 'Delivered' | 'Pending' | 'Rejected' | 'Awaiting Confirmation';
  total: number;
  items: number;
  isCustom?: boolean;
  needsReview?: boolean;
  customer: {
    name: string;
    email: string;
  };
};

type OrderTableProps = {
  orders: Order[];
};

export function OrderTable({ orders }: OrderTableProps) {
  const { toast } = useToast();

  const handleAction = (message: string) => {
    toast({
      title: 'Action Triggered (Simulated)',
      description: message,
    });
  };

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
              {order.id}
              {order.isCustom && <Badge variant="outline" className="ml-2">Custom</Badge>}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 hidden sm:flex">
                        <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                        <div>{order.customer.name}</div>
                        <div className="text-sm text-muted-foreground hidden md:block">{order.customer.email}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell>{getStatusBadge(order.status)}</TableCell>
            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleAction(`Viewing details for order ${order.id}.`)}>View Details</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAction(`Approving order ${order.id}.`)}>Approve</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction(`Rejecting order ${order.id}.`)}>Reject</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
