import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm">
              Delivering fresh, high-quality produce and gourmet products right to your door.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-card-foreground">Shop</h4>
            <Link href="/shop" className="text-sm hover:text-primary">All Products</Link>
            <Link href="/custom-order" className="text-sm hover:text-primary">Custom Orders</Link>
            <Link href="#" className="text-sm hover:text-primary">Featured</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-card-foreground">Support</h4>
            <Link href="#" className="text-sm hover:text-primary">Contact Us</Link>
            <Link href="#" className="text-sm hover:text-primary">FAQ</Link>
            <Link href="#" className="text-sm hover:text-primary">Shipping & Returns</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-card-foreground">Legal</h4>
            <Link href="#" className="text-sm hover:text-primary">Terms of Service</Link>
            <Link href="#" className="text-sm hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} BeautifulSoup&Food. All rights reserved.</p>
          {/* Add social media icons here if needed */}
        </div>
      </div>
    </footer>
  );
}
