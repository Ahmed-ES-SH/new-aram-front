"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Hero Section Skeleton */}
      <section className="relative h-[60vh] md:h-[70vh] w-full bg-white overflow-hidden mb-12">
        {/* Cover Image Placeholder */}
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-gray-50 via-gray-50/80 to-transparent" />

        <div className="container mx-auto px-4 h-full flex flex-col justify-end relative z-10 pb-12">
          <div className="flex flex-col md:flex-row items-end md:items-end gap-6 md:gap-8">
            {/* Logo Skeleton */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-lg p-2 flex items-center justify-center -mb-8 md:mb-0">
              <div className="w-full h-full bg-gray-200 rounded-xl animate-pulse" />
            </div>

            {/* Info Text Skeleton */}
            <div className="flex-1 space-y-4 mb-2 w-full">
              <div className="w-2/3 md:w-1/3 h-10 bg-gray-300 rounded-lg animate-pulse" />
              <div className="w-full md:w-1/2 h-6 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex gap-3 mt-2">
                <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
              <div className="w-full md:w-36 h-12 bg-gray-300 rounded-xl animate-pulse" />
              <div className="w-full md:w-36 h-12 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 space-y-12">
        {/* About Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
            <div className="w-1/4 h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
              <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
              <div className="w-5/6 h-4 bg-gray-100 rounded animate-pulse" />
              <div className="w-4/6 h-4 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>

          {/* Sidebar / Info Cards Skeleton */}
          <div className="space-y-4">
            <div className="h-40 bg-white rounded-2xl border border-gray-100 shadow-xs animate-pulse" />
            <div className="h-40 bg-white rounded-2xl border border-gray-100 shadow-xs animate-pulse" />
          </div>
        </div>

        {/* Offers Section Skeleton */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="w-48 h-10 bg-gray-300 rounded-lg animate-pulse" />
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 h-[300px] border border-gray-100 shadow-sm flex flex-col gap-4 animate-pulse"
              >
                <div className="w-full h-40 bg-gray-200 rounded-xl" />
                <div className="space-y-3 px-2">
                  <div className="w-3/4 h-6 bg-gray-200 rounded-lg" />
                  <div className="flex justify-between mt-2">
                    <div className="w-1/3 h-4 bg-gray-100 rounded-lg" />
                    <div className="w-1/4 h-4 bg-gray-100 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
