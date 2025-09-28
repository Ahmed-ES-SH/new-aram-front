import { FaStar } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import Img from "../../../_global/Img";

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
  review: Review;
  isExpanded: boolean;
  isReacted: boolean;
  toggleExpand: (id: number) => void;
  toggleReaction: (reviewId: number, isReacted: boolean) => void;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function ReviewItem({
  review,
  isExpanded,
  isReacted,
  toggleExpand,
  toggleReaction,
}: Props) {
  const words = review.content.split(" ");
  const isLong = words.length > 50;
  const content = isExpanded
    ? review.content
    : words.slice(0, 50).join(" ") + (isLong ? "..." : "");

  return (
    <div className="w-full border border-gray-300 shadow-md rounded-md p-3">
      <h1 className="tajawal-bold my-2">{review.head_line}</h1>
      <p className="mb-3 break-words">{content}</p>

      {isLong && (
        <button
          onClick={() => toggleExpand(review.id)}
          className="text-blue-500 underline"
        >
          {isExpanded ? "إخفاء" : "قراءة المزيد"}
        </button>
      )}

      <div className="w-full border-t border-gray-300 pt-2 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Img
            src={review?.user?.image ?? "/defaults/male-noimage.jpg"}
            errorSrc="/defaults/male-noimage.jpg"
            className="w-8 h-8 rounded-full"
          />
          <p>{review?.user?.name || "Unknown User"}</p>
          <p>{formatDate(review.created_at)}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            <span>{review.stars} / 5</span>
          </div>
          <div className="flex items-center gap-1">
            {isReacted ? (
              <AiFillLike
                onClick={() => toggleReaction(review.id, true)}
                className="size-7 text-sky-400 cursor-pointer hover:scale-125 transition"
              />
            ) : (
              <AiOutlineLike
                onClick={() => toggleReaction(review.id, false)}
                className="size-7 text-gray-300 cursor-pointer hover:scale-125 transition"
              />
            )}
            <span>{review.like_counts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
