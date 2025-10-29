
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOrders, initialUsers } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingCart, Users, Activity, Target } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

// In a real app, this data would be fetched and computed from a database.
const getAnalyticsData = () => {
    const totalSales = mockOrders
        .filter(o => o.status === 'Delivered')
        .reduce((sum, order) => sum + order.total, 0);
    
    const totalOrders = mockOrders.length;
    
    const averageOrderValue = totalOrders > 0 ? totalSales / mockOrders.filter(o => o.status === 'Delivered').length : 0;

    const totalCustomers = initialUsers.filter(u => u.role === 'Customer').length;

    const orderStatusCounts = mockOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // This is a simplified mock of top products.
    const topProducts = [
        { id: "1", name: "Artisan Sourdough", sales: 150, image: PlaceHolderImages.find(img => img.id === 'product-1')! },
        { id: "4", name: "Extra Virgin Olive Oil", sales: 120, image: PlaceHolderImages.find(img => img.id === 'product-4')! },
        { id: "2", name: "Organic Vegetable Box", sales: 90, image: PlaceHolderImages.find(img => img.id === 'product-2')! },
        { id: '8', name: 'Chicken Noodle Soup', sales: 85, image: PlaceHolderImages.find(img => img.id === 'product-8')! },
        { id: '7', name: 'Tomato Basil Soup', sales: 75, image: PlaceHolderImages.find(img => img.id === 'product-7')! },
    ];

    const monthlyGoal = 200000;
    const goalProgress = (totalSales / monthlyGoal) * 100;
    
    return {
        totalSales,
        totalOrders,
        averageOrderValue,
        totalCustomers,
        orderStatusCounts,
        topProducts,
        monthlyGoal,
        goalProgress
    };
};

export default function AdminAnalyticsPage() {
    const data = getAnalyticsData();

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₦{data.totalSales.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">From delivered orders</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">Across all statuses</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.totalCustomers}</div>
                    <p className="text-xs text-muted-foreground">All registered customers</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₦{data.averageOrderValue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Based on delivered orders</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
             <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                    <CardDescription>
                        Your most popular products based on sales volume.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Sales</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.topProducts.map(product => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Image src={product.image.imageUrl} alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                                            <span className="font-medium">{product.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{product.sales}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Goal</CardTitle>
                        <CardDescription>Progress towards your monthly sales target.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Progress value={data.goalProgress} aria-label={`${data.goalProgress.toFixed(0)}% of goal reached`} />
                        <p className="text-sm font-medium text-muted-foreground text-center">
                            <span className="text-primary font-bold">{data.goalProgress.toFixed(1)}%</span> of ₦{data.monthlyGoal.toLocaleString()} goal
                        </p>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Order Status Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableBody>
                                {Object.entries(data.orderStatusCounts).map(([status, count]) => (
                                    <TableRow key={status}>
                                        <TableCell>
                                            <Badge variant={
                                                status === 'Delivered' ? 'default' :
                                                status === 'Rejected' ? 'destructive' :
                                                'secondary'
                                            } className={
                                                status === 'Delivered' ? 'bg-green-100 text-green-800' : ''
                                            }>{status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
