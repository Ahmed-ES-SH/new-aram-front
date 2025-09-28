"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useAppSelector } from "@/app/Store/hooks";
import { instance } from "@/app/_helpers/axios";
import { LuLoaderCircle, LuNotebookPen } from "react-icons/lu";
import ReviewList from "./ReviewList";
import PaginationWithoutNumbers from "../../../_global/paginationWithOutnumbers";
import ReviewForm from "./ReviewForm";
import CheckCurrentUserPopup from "../../../_global/CheckCurrentUserPopup";

// Types
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
  orgId: number | string | null;
}

export default function ReviewsContent({ orgId }: Props) {
  const locale = useLocale();
  const t = useTranslations("reviews");
  const { user } = useAppSelector((state) => state.user);
  const userId = user?.id;

  // States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReacts, setUserReacts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkCurrentUser, setCheckCurrentUser] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Expanded reviews
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (id: number) =>
    setExpandedReviews((prev) => ({ ...prev, [id]: !prev[id] }));

  // Fetch reviews
  useEffect(() => {
    if (!orgId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [reviewsRes, reactsRes] = await Promise.all([
          instance.get(`/org-reviews/${orgId}?page=${currentPage}`),
          instance.get(`/review-like-user/${orgId}/${userId}`),
        ]);

        if (reviewsRes.status === 200) {
          setReviews(reviewsRes.data.data);
          setCurrentPage(reviewsRes.data.pagination.current_page);
          setLastPage(reviewsRes.data.pagination.last_page);
        }

        if (reactsRes.status === 200) {
          setUserReacts(reactsRes.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId, userId, currentPage]);

  // Handle Submit Review
  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!user) return setCheckCurrentUser(true);
    if (!title.trim() || !content.trim() || rating === 0) {
      return setErrorMessage(t("validation.fillAll"));
    }

    try {
      const newReview = {
        stars: rating,
        head_line: title,
        content,
        user_id: userId,
        organization_id: orgId,
      };

      const res = await instance.post(`/add-review`, newReview);

      if (res.status === 201) {
        setReviews((prev) => [...prev, { ...res.data.data, like_counts: 0 }]);
        setTitle("");
        setContent("");
        setRating(0);
        setSuccessMessage(t("success"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Like
  const toggleReaction = async (reviewId: number, isReacted: boolean) => {
    try {
      if (isReacted) {
        const res = await instance.delete(`/review-like/${reviewId}/${userId}`);
        if (res.status === 200) {
          setUserReacts((prev) => prev.filter((id) => id !== reviewId));
          setReviews((prev) =>
            prev.map((r) =>
              r.id === reviewId ? { ...r, like_counts: r.like_counts - 1 } : r
            )
          );
        }
      } else {
        const res = await instance.post(`/react-review`, {
          user_id: userId,
          review_id: reviewId,
          organization_id: orgId,
        });
        if (res.status === 201) {
          setUserReacts((prev) => [...prev, reviewId]);
          setReviews((prev) =>
            prev.map((r) =>
              r.id === reviewId ? { ...r, like_counts: r.like_counts + 1 } : r
            )
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Loading
  if (loading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <LuLoaderCircle className="size-32 text-primary" />
        </motion.div>
      </div>
    );

  return (
    <>
      {/* Reviews Section */}
      <div className="w-full py-2">
        {reviews.length > 0 ? (
          <ReviewList
            reviews={reviews}
            userReacts={userReacts}
            expandedReviews={expandedReviews}
            toggleExpand={toggleExpand}
            toggleReaction={toggleReaction}
          >
            <PaginationWithoutNumbers
              currentPage={currentPage}
              totalPages={lastPage}
              onPageChange={setCurrentPage}
            />
          </ReviewList>
        ) : (
          <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-3">
            <LuNotebookPen className="size-32 text-gray-400" />
            <p>{t("noReviews")}</p>
          </div>
        )}

        {/* Add Review Form */}
        <ReviewForm
          locale={locale}
          title={title}
          content={content}
          rating={rating}
          setTitle={setTitle}
          setContent={setContent}
          setRating={setRating}
          handleSubmit={handleSubmit}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </div>

      {/* Popup */}
      {checkCurrentUser && (
        <CheckCurrentUserPopup
          isOpen={checkCurrentUser}
          onClose={() => setCheckCurrentUser(false)}
        />
      )}
    </>
  );
}
