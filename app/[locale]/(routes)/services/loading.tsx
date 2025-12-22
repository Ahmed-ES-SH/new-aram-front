export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-white animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative h-[60vh] w-full bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        {/* Search Bar Skeleton */}
        <div className="w-full max-w-3xl mx-auto h-16 bg-white rounded-full shadow-lg border border-gray-100 mb-12"></div>

        {/* Categories Filter Skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-12 justify-center">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="w-32 h-12 bg-gray-100 rounded-full shrink-0"
            ></div>
          ))}
        </div>

        {/* Services Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-[400px]"
            >
              <div className="h-48 bg-gray-200 w-full"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between pt-4">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
