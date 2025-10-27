
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast.tsx';
import { format } from "date-fns";

export type POItem = {
    productId: string;
    productName: string;
    quantity: number;
    cost: number;
};

export type PurchaseOrder = {
  id: string;
  supplier: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Draft';
  total: number;
  itemCount: number;
  items: POItem[];
};

type PurchaseOrderTableProps = { 
    purchaseOrders: PurchaseOrder[];
    onEdit: (po: PurchaseOrder) => void;
};


export function PurchaseOrderTable({ purchaseOrders, onEdit }: PurchaseOrderTableProps) {
  const { toast } = useToast();

  const handleAction = (message: string) => {
    toast({
      title: 'Action Triggered (Simulated)',
      description: message,
    });
  };

  const getStatusBadge = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">Completed</Badge>;
      case 'Pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
       case 'Draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PO Number</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchaseOrders.map((po) => (
          <TableRow key={po.id}>
            <TableCell className="font-medium">{po.id}</TableCell>
            <TableCell>{po.supplier}</TableCell>
            <TableCell>{format(new Date(po.date), 'dd/MM/yyyy')}</TableCell>
            <TableCell>{getStatusBadge(po.status)}</TableCell>
            <TableCell className="text-right">₦{po.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
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
                  <DropdownMenuItem onClick={() => handleAction(`Viewing details for ${po.id}`)}>View Details</DropdownMenuItem>
                  {po.status === 'Draft' && <DropdownMenuItem onClick={() => onEdit(po)}>Edit</DropdownMenuItem>}
                  {po.status === 'Pending' && <DropdownMenuItem onClick={() => handleAction(`Marking ${po.id} as completed.`)}>Mark as Completed</DropdownMenuItem>}
                  {po.status !== 'Completed' && po.status !== 'Cancelled' && <DropdownMenuItem onClick={() => handleAction(`Cancelling ${po.id}.`)}>Cancel</DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
