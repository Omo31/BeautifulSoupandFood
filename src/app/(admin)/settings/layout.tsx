'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminSettingsNavItems } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

export default function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto">
                {adminSettingsNavItems.map(item => (
                    <Link
                        href={item.href}
                        key={item.href}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                        )}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
            {children}
        </div>
    )
}
