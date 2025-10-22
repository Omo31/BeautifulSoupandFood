'use client';

import { Star, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export function ProductReviews({ reviews }: { reviews: Review[] }) {
  return (
    <div>
      <h2 className="font-headline text-3xl font-bold mb-6">Customer Reviews</h2>
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={review.id}>
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={`https://picsum.photos/seed/${review.author}/40/40`} alt={review.author} />
                  <AvatarFallback>
                    <UserCircle />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{review.author}</p>
                    <p className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-muted-foreground">{review.comment}</p>
                </div>
              </div>
              {index < reviews.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">This product has no reviews yet.</p>
          <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
