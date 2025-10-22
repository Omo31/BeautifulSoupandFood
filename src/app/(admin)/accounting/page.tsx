
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAccountingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounting</CardTitle>
        <CardDescription>Manage financial records and generate reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground py-12">[Accounting tools and reports will be here]</p>
      </CardContent>
    </Card>
  );
}
