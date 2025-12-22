"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { Organization } from "@/app/_components/_dashboard/_organizations/types/organization";

/* Reusable Contact Item */
function ContactItem({
  icon,
  label,
  value,
  isLink,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="font-medium">{label}</p>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            {value}
          </a>
        ) : (
          <p className="text-muted-foreground text-sm">{value}</p>
        )}
      </div>
    </div>
  );
}

interface props {
  organization: Organization;
  t: any;
}

export default function ContactInfo({ organization, t }: props) {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };
  return (
    <>
      <motion.div
        className="py-8 border-b border-gray-200 space-y-5"
        variants={fadeInUp}
      >
        <h2 className="text-xl font-semibold">{t("contactInfo")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {organization.location.address && (
            <ContactItem
              icon={<FaMapMarkerAlt className="text-primary" />}
              label={t("address")}
              value={organization.location.address}
            />
          )}
          {organization.phone_number && (
            <ContactItem
              icon={<FaPhone className="text-primary" />}
              label={t("phone")}
              value={organization.phone_number}
            />
          )}
          {organization.email && (
            <ContactItem
              icon={<FaEnvelope className="text-primary" />}
              label={t("email")}
              value={organization.email}
            />
          )}
          {organization.url && (
            <ContactItem
              icon={<FaGlobe className="text-primary" />}
              label={t("website")}
              value={organization.url}
              isLink
            />
          )}
        </div>
      </motion.div>
    </>
  );
}
