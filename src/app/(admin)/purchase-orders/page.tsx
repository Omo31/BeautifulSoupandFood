
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PurchaseOrderTable } from '@/components/purchase-orders/po-table';
import { AddPurchaseOrderDialog } from '@/components/purchase-orders/add-po-dialog';
import { mockPurchaseOrders } from '@/lib/mock-data';
import type { PurchaseOrder } from '@/components/purchase-orders/po-table';
import { useToast } from '@/hooks/use-toast.tsx';

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddPurchaseOrder = (newPO: Omit<PurchaseOrder, 'id'>) => {
    const poWithId: PurchaseOrder = {
      ...newPO,
      id: `PO${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
    };
    setPurchaseOrders(prev => [poWithId, ...prev]);
    toast({
      title: 'Purchase Order Created',
      description: `PO ${poWithId.id} for ${poWithId.supplier} has been created.`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>Create and manage orders for your inventory suppliers.</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Purchase Order
          </Button>
        </CardHeader>
        <CardContent>
          <PurchaseOrderTable purchaseOrders={purchaseOrders} />
        </CardContent>
        {purchaseOrders.length > 5 && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">Showing the last {purchaseOrders.length} purchase orders.</p>
            </CardFooter>
        )}
      </Card>
      <AddPurchaseOrderDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onAddPurchaseOrder={handleAddPurchaseOrder}
      />
    </>
  );
}
