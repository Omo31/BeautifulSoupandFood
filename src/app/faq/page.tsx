
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const faqItems = [
    {
        question: "What types of products do you sell?",
        answer: "We offer a curated selection of gourmet produce, artisan goods, pantry essentials, freshly made soups, and other high-quality food items sourced locally and globally."
    },
    {
        question: "How does the 'Set Shipping Fee' option work?",
        answer: "For custom or large orders, the 'Set Shipping Fee' option allows you to submit your order without upfront payment. Our team will calculate the best possible shipping rate based on your address and order size, and then send you a final quote for your approval and payment."
    },
    {
        question: "What is your return policy?",
        answer: "Due to the perishable nature of many of our products, we do not accept returns. However, if you are unsatisfied with your order or an item is damaged, please contact our support team within 24 hours of delivery, and we will be happy to assist you with a refund or replacement."
    },
    {
        question: "Can I place a custom order for an item not listed on your site?",
        answer: "Absolutely! We encourage you to use our 'Custom Order' form for any special requests. Provide as much detail as you can, and our procurement team will do their best to source the item for you and provide a quote."
    },
    {
        question: "What are your opening hours for pickup?",
        answer: "Our pickup hours are Monday to Friday from 9am to 6pm, and Saturday from 10am to 4pm. You will be notified via email when your order is ready for collection."
    }
]

export default function FaqPage() {
  return (
    <div className="container py-12">
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back home
            </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions about our products, services, and policies.</CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                     <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
                        <AccordionContent className="prose max-w-none text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
