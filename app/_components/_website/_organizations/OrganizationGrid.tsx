"use client";

import { motion } from "framer-motion";
import OrganizationCard from "./OrganizationCard";
import { Organization } from "../../_dashboard/_organizations/types/organization";
import NoDataFound from "../_global/NoDataFound";

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

  if (!organizations || organizations.length === 0) {
    return <NoDataFound isEmpty={true} />;
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
          <OrganizationCard
            index={index}
            organization={organization}
            isAble={true}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
