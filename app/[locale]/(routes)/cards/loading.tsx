export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-gray-50 animate-pulse pb-20">
      {/* Hero Section Skeleton */}
      <div className="relative h-[40vh] w-full bg-gray-200 mb-12 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4">
          <div className="h-8 w-32 bg-gray-300 rounded-full"></div>
          <div className="h-12 w-3/4 max-w-2xl bg-gray-300 rounded-lg"></div>
          <div className="h-6 w-1/2 max-w-xl bg-gray-300 rounded-lg"></div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Categories Skeleton */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-32 bg-gray-200 rounded-full"></div>
          ))}
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden h-[400px] border border-gray-100 shadow-sm"
            >
              <div className="h-48 bg-gray-200 w-full"></div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="pt-4 flex justify-between items-center mt-auto">
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
