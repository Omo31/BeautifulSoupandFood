
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalyticsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>Review sales, user, and traffic analytics.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground py-12">[Analytics charts and data will be here]</p>
      </CardContent>
    </Card>
  );
}
