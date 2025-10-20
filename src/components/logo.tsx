import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <ShoppingBasket className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline text-foreground">
        GourmetBasket
      </span>
    </Link>
  );
}
