"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";

export type Keyword = {
  id: number;
  title: string;
};

export default function KeywordSelector({
  selectedKeywords,
  setSelectedKeywords,
}: {
  selectedKeywords: Keyword[];
  setSelectedKeywords: (keywords: Keyword[]) => void;
}) {
  const locale = "ar";
  const maxLengthError = {
    ar: "الحد الأقصى للكلمات المفتاحية هو 5 كلمات",
    en: "Maximum keywords are 5 words.",
  };
  const label = {
    ar: "حدد كلمات مفتاحية للبطاقة بحد أقصى 5 كلمات",
    en: "Specify a maximum of 5 keywords for the service.",
  };

  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [displayedKeys, setDisplayedKeys] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    instance.get("/keywords").then((res) => {
      setKeywords(res.data.data);
    });
  }, []);

  const handleSelect = (keyword: Keyword) => {
    const isExist = selectedKeywords.find((k) => k.id === keyword.id);

    let updated: Keyword[];

    if (!isExist) {
      if (selectedKeywords.length === 5) {
        toast.error(maxLengthError[locale]);
        return;
      }
      updated = [...selectedKeywords, keyword];
    } else {
      updated = selectedKeywords.filter((k) => k.id !== keyword.id);
    }

    setSelectedKeywords(updated);
  };

  // Filter keywords by search term (case-insensitive)
  const filteredKeywords = keywords.filter((k) =>
    k.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const restNumber = filteredKeywords.slice(20).length;

  const handleShowALl = () => {
    if (displayedKeys === filteredKeywords.length - 1) {
      setDisplayedKeys(20);
    } else {
      setDisplayedKeys(filteredKeywords.length - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex flex-col gap-1">
        <label className="my-2 pb-1 border-b w-fit border-b-primary">
          {label[locale]}
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            locale === "ar" ? "ابحث عن كلمة مفتاحية..." : "Search keywords..."
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Selected Keywords */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {selectedKeywords.map((k) => (
            <motion.div
              key={k.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full cursor-pointer"
              onClick={() => handleSelect(k)}
            >
              <span>{k.title}</span>
              <FaTimes className="text-xs" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Filtered Keywords */}
      <div className="flex flex-wrap gap-3 min-h-[40px]">
        {filteredKeywords.length > 0 ? (
          <>
            {[...filteredKeywords]
              .sort((a, b) => {
                const aSelected = selectedKeywords.some(
                  (sel) => sel.title === a.title
                );
                const bSelected = selectedKeywords.some(
                  (sel) => sel.title === b.title
                );
                return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
              })
              .slice(0, displayedKeys)
              .map((k) => {
                const isSelected = selectedKeywords.some(
                  (sel) => sel.title === k.title
                );

                return (
                  <motion.div
                    key={k.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(k)}
                    className={`px-4 py-2 cursor-pointer rounded-full border transition ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {k.title}
                  </motion.div>
                );
              })}
            {restNumber > 0 && (
              <motion.div
                whileTap={{ scale: 0.95 }}
                onClick={handleShowALl}
                className={`px-4 py-1 cursor-pointer flex items-center justify-center rounded-full border transition bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200`}
              >
                {displayedKeys == filteredKeywords.length - 1
                  ? "Show less"
                  : `+ ${restNumber}`}
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-sm text-gray-500 mt-2">
            {locale === "ar"
              ? "لا توجد كلمات مفتاحية مطابقة"
              : "No matching keywords found"}
          </div>
        )}
      </div>
    </div>
  );
}
