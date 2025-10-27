
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Temporarily Unavailable</CardTitle>
        <CardDescription>
          The charting library has been removed to resolve a build issue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12">
          <BarChart className="h-16 w-16 mb-4" />
          <p>The analytics and reporting feature is currently under maintenance.</p>
          <p className="text-sm">We are working to restore it as soon as possible.</p>
        </div>
      </CardContent>
    </Card>
  );
}
