"use client";

import { motion } from "framer-motion";
import OrganizationCard from "./OrganizationCard";
import { Organization } from "../../_dashboard/_organizations/types/organization";

interface OrganizationGridProps {
  organizations: Organization[];
  loading?: boolean;
}

export default function OrganizationGrid({
  organizations,
  loading,
}: OrganizationGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg h-80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No organizations found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {organizations.map((organization, index) => (
        <motion.div
          key={organization.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <OrganizationCard index={index} organization={organization} />
        </motion.div>
      ))}
    </motion.div>
  );
}
