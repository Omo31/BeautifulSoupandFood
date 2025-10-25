
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { initialUsers, mockOrders } from "@/lib/mock-data";

// In a real app, this data would be fetched and calculated from a live database.
function getDashboardStats() {
  const totalRevenue = mockOrders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = mockOrders.filter(o => ['Pending', 'Awaiting Confirmation'].includes(o.status));
  const newOrdersCount = pendingOrders.length;
  
  const pendingCustomOrdersCount = pendingOrders.filter(o => o.isCustom).length;

  const newUsersCount = initialUsers.length; 

  // For demonstration, simulating some change from last month
  const revenueChange = 12.5; 
  const userChange = 5;

  return {
    totalRevenue,
    newOrdersCount,
    newUsersCount,
    pendingCustomOrdersCount,
    revenueChange,
    userChange,
  };
}


export default function AdminDashboardPage() {
  const stats = getDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, Admin!</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">+{stats.revenueChange}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.newOrdersCount}</p>
            <p className="text-xs text-muted-foreground">{stats.newOrdersCount} pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.newUsersCount}</p>
            <p className="text-xs text-muted-foreground">+{stats.userChange}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Custom Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.pendingCustomOrdersCount}</p>
            <p className="text-xs text-muted-foreground">Awaiting your response</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
