"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="w-full min-h-screen mt-20 bg-gray-50 pb-20">
      {/* Hero Skeleton */}
      <section className="relative mt-12 h-[50vh] w-full bg-white overflow-hidden mb-12">
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="max-w-4xl w-full flex flex-col items-center gap-6">
            {/* Badge Skeleton */}
            <div className="w-32 h-8 bg-gray-200 rounded-full animate-pulse" />

            {/* Title Skeleton */}
            <div className="w-3/4 h-16 bg-gray-200 rounded-lg animate-pulse" />

            {/* Subtitle Skeleton */}
            <div className="w-1/2 h-6 bg-gray-200 rounded-lg animate-pulse" />

            {/* Buttons Skeleton */}
            <div className="flex gap-4 mt-4">
              <div className="w-40 h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-gray-50 to-transparent" />
      </section>

      {/* Grid Skeleton */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 h-48 border border-gray-100 shadow-sm flex flex-col justify-between animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="space-y-3">
                <div className="w-3/4 h-6 bg-gray-200 rounded-lg" />
                <div className="w-1/2 h-4 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
