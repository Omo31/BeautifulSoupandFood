
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { mockOrders, initialUsers } from "@/lib/mock-data";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Helper to format date for charts
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// --- Data Processing for Charts ---

// 1. Revenue Over Time
const revenueData = mockOrders
    .filter(o => o.status === 'Delivered')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, order) => {
        const date = formatDate(order.date);
        const existing = acc.find(item => item.date === date);
        if (existing) {
            existing.revenue += order.total;
        } else {
            acc.push({ date, revenue: order.total });
        }
        return acc;
    }, [] as { date: string; revenue: number }[]);

const revenueChartConfig = {
    revenue: {
        label: "Revenue (₦)",
        color: "hsl(var(--chart-1))",
    },
};

// 2. New Users Over Time
const usersData = initialUsers
    .sort((a, b) => new Date(a.joined).getTime() - new Date(b.joined).getTime())
    .reduce((acc, user) => {
        const date = formatDate(user.joined);
        const existing = acc.find(item => item.date === date);
        if (existing) {
            existing.users += 1;
        } else {
            acc.push({ date, users: 1 });
        }
        return acc;
    }, [] as { date: string; users: number }[]);

const usersChartConfig = {
    users: {
        label: "New Users",
        color: "hsl(var(--chart-2))",
    },
};

// 3. Top Selling Categories (Mock)
const categorySalesData = [
    { category: 'Shop', sales: 125000 },
    { category: 'Soup', sales: 78000 },
    { category: 'Custom', sales: 95000 },
];
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

const categoryChartConfig = {
    sales: { label: "Sales (₦)"},
    Shop: { label: "Shop", color: "hsl(var(--chart-1))" },
    Soup: { label: "Soup", color: "hsl(var(--chart-2))" },
    Custom: { label: "Custom", color: "hsl(var(--chart-3))" },
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle>Total Orders</CardTitle>
                    <CardDescription>All time</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{mockOrders.length}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Pending Orders</CardTitle>
                    <CardDescription>Awaiting fulfillment</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{mockOrders.filter(o => o.status === 'Pending').length}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Total Customers</CardTitle>
                    <CardDescription>All registered users</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{initialUsers.length}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Conversion Rate</CardTitle>
                    <CardDescription>Mock data</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">3.4%</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
                        <LineChart data={revenueData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `₦${value/1000}k`} />
                            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                            <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>New Users</CardTitle>
                </CardHeader>
                 <CardContent>
                    <ChartContainer config={usersChartConfig} className="h-[300px] w-full">
                        <LineChart data={usersData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                            <Line dataKey="users" type="monotone" stroke="var(--color-users)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Top Selling Categories</CardTitle>
                    <CardDescription>Based on revenue from delivered orders.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={categoryChartConfig} className="h-[350px] w-full">
                        <BarChart data={categorySalesData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} />
                            <XAxis type="number" tickFormatter={(value) => `₦${value/1000}k`} />
                            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                            <Bar dataKey="sales" fill="var(--color-Shop)" radius={4}>
                               {categorySalesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                     <CardDescription>Mock data for demonstration.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="h-[350px] w-full">
                        <PieChart>
                            <Pie data={[{name: 'Google', value: 400}, {name: 'Facebook', value: 300}, {name: 'Direct', value: 300}, {name: 'Other', value: 200}]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                {[{name: 'Google', value: 400}, {name: 'Facebook', value: 300}, {name: 'Direct', value: 300}, {name: 'Other', value: 200}].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip content={<ChartTooltipContent />} />
                             <Legend />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
             </Card>
        </div>
    </div>
  );
}
