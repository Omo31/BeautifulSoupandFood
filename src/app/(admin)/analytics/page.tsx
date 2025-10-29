
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOrders, initialUsers } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingCart, Users, Activity, Target } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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

const statusColors: Record<string, string> = {
    Delivered: "bg-green-500",
    Pending: "bg-yellow-500",
    "Awaiting Confirmation": "bg-blue-500",
    Rejected: "bg-red-500",
};

export default function AdminAnalyticsPage() {
    const data = getAnalyticsData();

    const maxStatusCount = Math.max(...Object.values(data.orderStatusCounts), 1);

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
                    <CardContent className="space-y-4">
                       {Object.entries(data.orderStatusCounts).map(([status, count]) => (
                            <div key={status} className="space-y-1">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{status}</span>
                                    <span className="text-muted-foreground">{count}</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2.5">
                                    <div 
                                        className={cn("h-2.5 rounded-full", statusColors[status] || "bg-gray-400")} 
                                        style={{ width: `${(count / maxStatusCount) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
