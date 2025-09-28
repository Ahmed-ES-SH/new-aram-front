export default function LoadingOffers() {
  return (
    <div className="w-full  mt-8 grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 max-sm:grid-cols-1 grid-cols-2 justify-items-center gap-5 py-2 lg:p-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"
        />
      ))}
    </div>
  );
}
