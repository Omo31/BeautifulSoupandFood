'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Home } from 'lucide-react';
import type { Order } from './order-table';

type CustomerInfoProps = {
  customer: Order['customer'];
  shippingAddress?: {
    address: string;
  };
};

export function CustomerInfo({ customer, shippingAddress }: CustomerInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
            </div>
             <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>[Customer phone number]</span>
            </div>
        </div>

        {shippingAddress && (
            <div className="space-y-2 pt-2 border-t">
                <h4 className="font-semibold flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Shipping Address
                </h4>
                <div className="text-sm text-muted-foreground">
                    <p className="whitespace-pre-wrap">{shippingAddress.address}</p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
