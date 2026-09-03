export default function AdminLoading() {
  return (
    <div className="p-5 lg:p-8" aria-label="Loading admin">
      <div className="shimmer h-8 w-48 rounded-lg" />
      <div className="mt-2 shimmer h-4 w-72 rounded" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shimmer h-24 rounded-xl" />
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="shimmer h-64 rounded-xl" />
        <div className="shimmer h-64 rounded-xl" />
      </div>
    </div>
  );
}
