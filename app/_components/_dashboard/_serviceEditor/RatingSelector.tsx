"use client";
import { FiStar } from "react-icons/fi";

export default function RatingSelector({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">التقييم</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 transition-transform hover:scale-110"
          >
            <FiStar
              size={24}
              className={
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}
