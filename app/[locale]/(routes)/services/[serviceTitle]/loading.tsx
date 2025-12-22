export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-white animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative h-[60vh] w-full bg-gray-100 overflow-hidden mb-12">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="w-1/3 h-12 bg-gray-200 rounded mb-4"></div>
          <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Content Sections Skeleton */}
        <div className="space-y-16 mb-20">
          {/* Gallery / Features area approximation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-80 bg-gray-100 rounded-2xl"></div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-100 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="h-20 bg-gray-50 rounded-xl"></div>
                <div className="h-20 bg-gray-50 rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Another content section approximation */}
          <div className="p-8 bg-gray-50 rounded-3xl space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-40 bg-white rounded-xl"></div>
              <div className="h-40 bg-white rounded-xl"></div>
              <div className="h-40 bg-white rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Services Slider Skeleton */}
        <div className="mb-20 pt-10 border-t border-gray-100">
          <div className="flex flex-col items-center mb-10 space-y-4">
            <div className="w-48 h-10 bg-gray-100 rounded"></div>
            <div className="w-64 h-6 bg-gray-100 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[400px] bg-white border border-gray-100 rounded-2xl overflow-hidden"
              >
                <div className="h-48 bg-gray-100 w-full mb-4"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
