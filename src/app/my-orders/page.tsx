import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyOrdersPage() {
  return (
    <div className="container py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">My Orders</CardTitle>
          <CardDescription>View your standard and custom order history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            <p>You have no past orders.</p>
            <p className="text-sm">Once you place an order, it will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
