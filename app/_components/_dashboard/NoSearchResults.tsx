import React from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

export default function NoSearchResults() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="bg-gray-50 p-6 rounded-full mb-4">
        <HiMagnifyingGlass className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        لا توجد نتائج مطابقة
      </h3>
      <p className="text-gray-500 max-w-md">
        نأسف، لم نتمكن من العثور على أي مقالات تطابق بحثك. حاول استخدام كلمات
        مفتاحية مختلفة أو إزالة بعض الفلاتر.
      </p>
    </div>
  );
}
