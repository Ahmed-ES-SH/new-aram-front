"use client";

interface StatusBadgeProps {
  status: "published" | "not_published" | "under_review";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "not_published":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles()}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
