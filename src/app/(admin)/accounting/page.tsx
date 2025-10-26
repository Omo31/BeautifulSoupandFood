
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockTransactions } from "@/lib/mock-data";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const getFinancialSummary = () => {
    const totalRevenue = mockTransactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = mockTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    return { totalRevenue, totalExpenses, netIncome };
}

export default function AdminAccountingPage() {
    const summary = getFinancialSummary();
    const transactions = mockTransactions;

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                    <CardDescription>Gross income from all sales.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">₦{summary.totalRevenue.toLocaleString()}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Total Expenses</CardTitle>
                    <CardDescription>Costs for supplies and services.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-destructive">₦{summary.totalExpenses.toLocaleString()}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Net Income</CardTitle>
                    <CardDescription>Revenue minus expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-primary">₦{summary.netIncome.toLocaleString()}</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>A log of all financial activities.</CardDescription>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {transactions.map(t => (
                         <TableRow key={t.id}>
                            <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                            <TableCell className="font-medium">{t.description}</TableCell>
                            <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                            <TableCell>
                                <Badge variant={t.type === 'sale' ? 'default' : 'secondary'} className={t.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                    {t.type}
                                </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-medium ${t.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'expense' && '-' }₦{t.amount.toLocaleString()}
                            </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">Showing the last {transactions.length} transactions.</p>
            </CardFooter>
        </Card>
    </div>
  );
}
