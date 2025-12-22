import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FaStarHalfAlt } from "react-icons/fa";

interface props {
  rating: number;
}

export default function RenderStars({ rating }: props) {
  const currentRating = Number(Number(rating).toFixed(1));

  return Array.from({ length: 5 }, (_, i) => {
    const current = i + 1;

    if (currentRating >= current) {
      return <AiFillStar key={i} className="w-4 h-4 text-yellow-400" />;
    } else if (currentRating >= current - 0.5) {
      return <FaStarHalfAlt key={i} className="w-4 h-4 text-yellow-400" />;
    } else {
      return <AiOutlineStar key={i} className="w-4 h-4 text-gray-300" />;
    }
  });
}
