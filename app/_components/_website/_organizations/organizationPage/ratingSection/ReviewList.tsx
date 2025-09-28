import ReviewItem from "./ReviewItem";

interface Review {
  id: number;
  head_line: string;
  content: string;
  stars: number;
  like_counts: number;
  created_at: string;
  user?: { id: number; name: string; image?: string };
}

interface Props {
  reviews: Review[];
  userReacts: number[];
  expandedReviews: Record<string, boolean>;
  toggleExpand: (id: number) => void;
  toggleReaction: (reviewId: number, isReacted: boolean) => void;
  children?: React.ReactNode;
}

export default function ReviewList({
  reviews,
  userReacts,
  expandedReviews,
  toggleExpand,
  toggleReaction,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          isExpanded={expandedReviews[review.id] || false}
          isReacted={userReacts.includes(review.id)}
          toggleExpand={toggleExpand}
          toggleReaction={toggleReaction}
        />
      ))}
      <div className="w-fit mx-auto">{children}</div>
    </div>
  );
}
