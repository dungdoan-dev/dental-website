type StarRatingProps = {
  rating: number;
  className?: string;
};

export function StarRating({ rating, className = "" }: StarRatingProps) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div aria-label={`${rating} trên 5 sao`} className={`flex items-center gap-1 text-amber-500 ${className}`} role="img">
      {Array.from({ length: 5 }, (_, index) => <span aria-hidden="true" key={index}>{index < roundedRating ? "★" : "☆"}</span>)}
    </div>
  );
}
