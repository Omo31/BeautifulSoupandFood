
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountNavItems } from "@/lib/nav-links";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="md:col-span-1">
                    <Card className="p-4">
                        <nav className="flex flex-col gap-1">
                            {accountNavItems.map(item => (
                                <Button
                                    key={item.href}
                                    variant={pathname === item.href ? "default" : "ghost"}
                                    className="justify-start gap-2"
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </Card>
                </aside>
                <main className="md:col-span-3">
                    {children}
                </main>
            </div>
        </div>
    )
}
