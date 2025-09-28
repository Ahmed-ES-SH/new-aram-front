"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Props {
  expandedSections: {
    category: boolean;
    rating: boolean;
    location: boolean;
    time: boolean;
  };
  toggleSection: (section: keyof Props["expandedSections"]) => void;
}

export default function TimeFilterSection({
  expandedSections,
  toggleSection,
}: Props) {
  const locale = useLocale();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // ---------------------------
  // Time-related local state
  // ---------------------------
  const [openNow, setOpenNow] = useState(false);
  const [timeValue, setTimeValue] = useState(""); // format: "HH:MM" for the <input type="time" />
  const [openTimeValue, setOpenTimeValue] = useState("");
  const [closeTimeValue, setCloseTimeValue] = useState("");

  // Keep local inputs in sync with URL searchParams when they change externally
  useEffect(() => {
    const spTime = searchParams.get("time") ?? "";
    const spOpen = searchParams.get("open_time") ?? "";
    const spClose = searchParams.get("close_time") ?? "";

    // slice to HH:MM if seconds are present
    setTimeValue(spTime ? spTime.slice(0, 5) : "");
    setOpenTimeValue(spOpen ? spOpen.slice(0, 5) : "");
    setCloseTimeValue(spClose ? spClose.slice(0, 5) : "");

    // note: we don't try to detect "openNow" automatically (that would require storing special value),
    // so openNow stays true only when user explicitly toggles it.
  }, [searchParams]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const formatToSeconds = (hhmmOrFull: string) => {
    if (!hhmmOrFull) return "";
    // if already HH:MM:SS -> return as-is
    if (/^\d{2}:\d{2}:\d{2}$/.test(hhmmOrFull)) return hhmmOrFull;
    // if HH:MM -> add :00
    if (/^\d{2}:\d{2}$/.test(hhmmOrFull)) return `${hhmmOrFull}:00`;
    return hhmmOrFull;
  };

  const setTimeParam = (hhmm: string) => {
    const timeParam = formatToSeconds(hhmm);
    const params = new URLSearchParams(searchParams.toString());
    if (timeParam) {
      params.set("time", timeParam);
      params.delete("open_time");
      params.delete("close_time");
    } else {
      params.delete("time");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const setRangeParam = (openHHMM: string, closeHHMM: string) => {
    const ot = formatToSeconds(openHHMM);
    const ct = formatToSeconds(closeHHMM);
    const params = new URLSearchParams(searchParams.toString());
    if (ot && ct) {
      params.set("open_time", ot);
      params.set("close_time", ct);
      params.delete("time");
    } else {
      params.delete("open_time");
      params.delete("close_time");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const toggleOpenNow = () => {
    if (openNow) {
      // turning off -> remove 'time'
      const params = new URLSearchParams(searchParams.toString());
      params.delete("time");
      router.replace(`${pathname}?${params.toString()}`);
      setOpenNow(false);
      setTimeValue("");
    } else {
      // set current local time as HH:MM:SS
      const now = new Date();
      const hh = pad(now.getHours());
      const mm = pad(now.getMinutes());
      const ss = pad(now.getSeconds());
      const current = `${hh}:${mm}:${ss}`;
      const params = new URLSearchParams(searchParams.toString());
      params.set("time", current);
      params.delete("open_time");
      params.delete("close_time");
      router.replace(`${pathname}?${params.toString()}`);
      setOpenNow(true);
      setTimeValue(`${hh}:${mm}`);
    }
  };

  const clearTimes = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("time");
    params.delete("open_time");
    params.delete("close_time");
    router.replace(`${pathname}?${params.toString()}`);
    setTimeValue("");
    setOpenTimeValue("");
    setCloseTimeValue("");
    setOpenNow(false);
  };
  return (
    <>
      {/* Working Hours (time) */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("time")}
          className="flex items-center justify-between w-full text-left mb-2"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">
              {locale === "en" ? "Working hours" : "ساعات العمل"}
            </span>
          </div>
          {expandedSections.time ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        <AnimatePresence initial={false}>
          {expandedSections.time && (
            <motion.div
              key="time-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-3"
            >
              {/* Open Now */}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={openNow}
                    onChange={toggleOpenNow}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      {locale === "en" ? "Open now" : "مفتوح الآن"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {locale === "en"
                        ? "Use current time"
                        : "استخدام الوقت الحالي"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearTimes}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  {locale === "en" ? "Clear" : "مسح"}
                </button>
              </div>

              {/* Specific Time */}
              <div className="bg-white p-3 rounded border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {locale === "en" ? "Specific time" : "وقت معين"}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    step={1}
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    className="w-full p-2 border rounded border-gray-200"
                  />
                  <button
                    onClick={() => {
                      setTimeParam(timeValue);
                      setOpenNow(false);
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {locale === "en" ? "Apply" : "تطبيق"}
                  </button>
                </div>
              </div>

              {/* Time Range */}
              <div className="bg-white p-3 rounded border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {locale === "en"
                    ? "Open / Close range"
                    : "نطاق الفتح / الإغلاق"}
                </div>
                <div className="flex  flex-col items-start gap-2">
                  <div className="w-full">
                    <label className="text-xs text-gray-500">
                      {locale === "en" ? "Open" : "يفتح"}
                    </label>
                    <input
                      type="time"
                      step={1}
                      value={openTimeValue}
                      onChange={(e) => setOpenTimeValue(e.target.value)}
                      className="w-full p-2 border rounded border-gray-200"
                    />
                  </div>
                  <div className="w-full">
                    <label className="text-xs text-gray-500">
                      {locale === "en" ? "Close" : "يغلق"}
                    </label>
                    <input
                      type="time"
                      step={1}
                      value={closeTimeValue}
                      onChange={(e) => setCloseTimeValue(e.target.value)}
                      className="w-full p-2 border rounded border-gray-200"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setRangeParam(openTimeValue, closeTimeValue)}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {locale === "en" ? "Apply range" : "تطبيق النطاق"}
                  </button>
                  <button
                    onClick={clearTimes}
                    className="px-3 py-2 border rounded border-gray-200 text-sm"
                  >
                    {locale === "en" ? "Clear" : "مسح"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
