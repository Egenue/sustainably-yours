import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export const RatingDisplay = ({ 
  rating, 
  maxRating = 5, 
  size = "md",
  showNumber = true 
}: RatingDisplayProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            sizeClasses[size],
            index < Math.floor(rating)
              ? "fill-accent text-accent"
              : index < rating
              ? "fill-accent/50 text-accent"
              : "fill-none text-muted-foreground"
          )}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm font-semibold text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
