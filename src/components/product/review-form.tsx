'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating.'),
  comment: z.string().min(10, 'Comment must be at least 10 characters long.').max(500, 'Comment cannot exceed 500 characters.'),
});

type ReviewFormProps = {
  productId: string;
  isAuthenticated: boolean;
};

export function ReviewForm({ productId, isAuthenticated }: ReviewFormProps) {
  const { toast } = useToast();
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });
  
  const currentRating = form.watch('rating');

  const onSubmit = (values: z.infer<typeof reviewSchema>) => {
    // TODO: Connect to Firestore to save the review.
    console.log({ ...values, productId });
    toast({
      title: 'Review Submitted!',
      description: 'Thank you for your feedback. Your review has been submitted for approval.',
    });
    form.reset();
  };
  
  if (!isAuthenticated) {
    return (
        <div className="text-center">
            <h3 className="text-lg font-semibold">Want to share your thoughts?</h3>
            <p className="text-muted-foreground text-sm mt-1">
                You must be logged in to write a review.
            </p>
            <Button asChild className="mt-4">
                <Link href="/auth/login">Login to Review</Link>
            </Button>
        </div>
    );
  }

  return (
    <div>
        <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Rating</FormLabel>
                        <FormControl>
                            <div 
                                className="flex items-center gap-1"
                                onMouseLeave={() => setHoveredRating(0)}
                            >
                                {[...Array(5)].map((_, i) => {
                                    const ratingValue = i + 1;
                                    return (
                                        <Star
                                            key={ratingValue}
                                            className={cn(
                                                'w-7 h-7 cursor-pointer transition-colors',
                                                ratingValue <= (hoveredRating || currentRating)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-muted-foreground/50'
                                            )}
                                            onClick={() => field.onChange(ratingValue)}
                                            onMouseEnter={() => setHoveredRating(ratingValue)}
                                        />
                                    );
                                })}
                            </div>
                        </FormControl>
                         <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Review</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Tell us what you thought about the product..."
                                {...field}
                                rows={4}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit">Submit Review</Button>
        </form>
        </Form>
    </div>
  );
}
