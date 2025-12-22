export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-white animate-pulse">
      {/* Video Hero Skeleton */}
      <div className="relative h-screen w-full bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Main Sections Skeleton */}
      <div className="container mx-auto px-4 py-20">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32 last:mb-0 ${
              i % 2 === 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image Side Skeleton */}
            <div className="w-full lg:w-1/2">
              <div className="h-[400px] lg:h-[500px] w-full bg-gray-200 rounded-2xl"></div>
            </div>

            {/* Content Side Skeleton */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
              </div>

              <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-1 w-20 bg-gray-200 rounded-full"></div>

              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
