import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomOrderPage() {
  return (
    <div className="container py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Request a Custom Order</CardTitle>
          <CardDescription>
            Looking for something specific? Fill out the form below and our team will get back to you with a custom quote.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-12">
            [Custom order form will be here]
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
