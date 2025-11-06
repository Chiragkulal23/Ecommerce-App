import { Star, CheckCircle } from "lucide-react";
import { Review } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";

interface ProductReviewsProps {
  reviews: Review[];
  rating: number;
}

const ProductReviews = ({ reviews, rating }: ProductReviewsProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-accent text-accent" : "text-muted"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-6 pb-6 border-b border-border">
        <div className="text-center">
          <div className="text-5xl font-playfair font-bold text-primary mb-2">
            {rating.toFixed(1)}
          </div>
          <div className="flex gap-1 mb-1">{renderStars(Math.round(rating))}</div>
          <p className="text-sm text-muted-foreground">
            Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="text-xl font-playfair font-semibold">Customer Reviews</h3>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.author}</span>
                        {review.verified && (
                          <div className="flex items-center gap-1 text-primary text-xs">
                            <CheckCircle className="h-3 w-3" />
                            <span>Verified Purchase</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">{renderStars(review.rating)}</div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-foreground/90">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
