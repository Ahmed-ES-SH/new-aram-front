import { FaStar } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface Props {
  locale: string;
  title: string;
  content: string;
  rating: number;
  setTitle: (val: string) => void;
  setContent: (val: string) => void;
  setRating: (val: number) => void;
  handleSubmit: () => void;
  errorMessage: string;
  successMessage: string;
}

export default function ReviewForm({
  locale,
  title,
  content,
  rating,
  setTitle,
  setContent,
  setRating,
  handleSubmit,
  errorMessage,
  successMessage,
}: Props) {
  const t = useTranslations("reviews");

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`cursor-pointer size-6 ${
          i + 1 <= rating ? "text-yellow-500" : "text-gray-300"
        }`}
        onClick={() => setRating(i + 1)}
      />
    ));

  return (
    <div
      dir={locale === "en" ? "ltr" : "rtl"}
      className="w-full mx-auto p-4  border-gray-300 rounded-md shadow-lg mt-6"
    >
      <h2 className="text-2xl tajawal-bold border-b border-gray-300  pb-3 mb-4 text-center">
        {t("addReview")}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block font-semibold">{t("reviewTitle")}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold">{t("reviewContent")}</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md mt-2 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold">{t("rating")}</label>
          <div className="flex gap-2 mt-2">{renderStars()}</div>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-primary text-white rounded-md hover:bg-orange-300"
        >
          {t("submitReview")}
        </button>

        {errorMessage && (
          <p className="text-red-400 text-center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-400 text-center">{successMessage}</p>
        )}
      </form>
    </div>
  );
}
