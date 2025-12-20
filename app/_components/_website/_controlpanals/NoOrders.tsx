import Link from "next/link";
import React from "react";
import { FiShoppingBag } from "react-icons/fi";

export default function NoOrders() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
        <FiShoppingBag size={48} />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
      <p className="text-gray-500 max-w-md mb-8">
        It looks like you haven't placed any orders yet. Explore our services
        and find what you need.
      </p>
      <Link
        href="/services"
        className="px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
      >
        Browse Services
      </Link>
    </div>
  );
}
