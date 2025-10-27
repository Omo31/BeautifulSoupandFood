
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockTransactions } from "@/lib/mock-data";
import { Download, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from '@/components/accounting/add-transaction-dialog';
import type { Transaction } from '@/components/accounting/add-transaction-dialog';
import { format } from 'date-fns';

export default function AdminAccountingPage() {
    const [transactions, setTransactions] = useState(mockTransactions);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const getFinancialSummary = () => {
        const totalRevenue = transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const netIncome = totalRevenue - totalExpenses;
        return { totalRevenue, totalExpenses, netIncome };
    };

    const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
        const transactionWithId = {
            ...newTransaction,
            id: `txn${transactions.length + 1}`,
        };
        setTransactions(prev => [transactionWithId, ...prev]);
    };

    const summary = getFinancialSummary();

  return (
    <>
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
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export Report
                        </Button>
                         <Button onClick={() => setIsDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Transaction
                        </Button>
                    </div>
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
                                <TableCell>{format(new Date(t.date), 'dd/MM/yyyy')}</TableCell>
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
        <AddTransactionDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            onAddTransaction={handleAddTransaction}
        />
    </>
  );
}
