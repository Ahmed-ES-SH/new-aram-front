export default function Loading() {
  return (
    <div className="min-h-screen w-full mt-20 bg-gray-50 animate-pulse pb-20">
      {/* Header Section Skeleton */}
      <div className="relative h-[35vh] w-full bg-linear-to-br from-gray-200 to-gray-300 mb-12 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-4">
          <div className="h-10 w-48 bg-gray-300/70 rounded-lg"></div>
          <div className="h-6 w-2/3 max-w-lg bg-gray-300/70 rounded-lg"></div>
          {/* Search Bar Skeleton */}
          <div className="h-12 w-full max-w-xl bg-gray-300/70 rounded-full mt-2"></div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filter/Sort Options Skeleton */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-28 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Offers Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden h-[320px] border border-gray-100 shadow-sm"
            >
              <div className="h-40 bg-gray-200 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="pt-3 flex justify-between items-center">
                  <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Organizations Slider Skeleton */}
        <div className="mb-16">
          <div className="h-8 w-56 bg-gray-200 rounded-lg mb-6"></div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="shrink-0 w-40 h-40 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 p-4"
              >
                <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3"
            >
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
