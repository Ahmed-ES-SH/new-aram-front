import React from "react";

interface props {
  fileUrl?: string | null;
  file?: File | null;
  openFilePicker: () => void;
}

export default function FilePreview({ fileUrl, file, openFilePicker }: props) {
  return (
    <>
      {fileUrl ? (
        <div
          className="relative w-72 h-80 rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl"
          onClick={() => openFilePicker()}
        >
          {/* Background with linear overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-emerald-50 z-0"></div>

          {/* File info overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="font-semibold text-lg mb-1">{file?.name}</p>
              <p className="text-sm text-blue-200">اضغط لتغيير الملف</p>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-5 h-full flex flex-col">
            {/* Status badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                ملف مضاف
              </span>
            </div>

            {/* PDF preview */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="relative">
                {/* PDF icon with decorative background */}
                <div className="relative w-24 h-24 mb-4">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-emerald-500 rounded-2xl transform rotate-6 opacity-20"></div>
                  <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-emerald-400 rounded-2xl shadow-lg flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>

                {/* File name with truncation */}
                <div className="max-w-full px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                  <p
                    className="text-gray-800 font-medium truncate text-center"
                    title={file?.name}
                  >
                    {file?.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {file?.size
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "PDF ملف"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action hint */}
            <div className="p-4 bg-linear-to-r from-blue-50 to-emerald-50 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
                انقر للتعديل
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => openFilePicker()}
          className="w-72 h-80 rounded-xl border-3 border-dashed border-blue-300 flex flex-col justify-center items-center cursor-pointer group bg-linear-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-emerald-50 transition-all duration-300 hover:border-blue-400 hover:shadow-lg"
        >
          {/* Animated background element */}
          <div className="absolute w-40 h-40 bg-linear-to-r from-blue-200 to-emerald-200 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

          {/* Icon with animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:scale-105 transform">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            {/* Plus icon indicator */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-blue-200">
              <svg
                className="w-4 h-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>

          {/* Text content */}
          <div className="text-center px-6 relative z-10">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              إضافة ملف PDF
            </h3>
            <p className="text-gray-600 mb-4">انقر هنا لرفع ملف PDF جديد</p>

            {/* File requirements */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                يدعم ملفات PDF حتى 10MB
              </p>
            </div>
          </div>

          {/* Hover effect indicator */}
          <div className="absolute bottom-6 text-sm text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
            <span>انقر للبدء</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}
