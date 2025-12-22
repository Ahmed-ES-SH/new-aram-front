"use client";
import { motion } from "framer-motion";
import FamilyMemberCard from "./FamilyMemberCard";
import { FamilyMember } from "./types";
import { directionMap } from "@/app/constants/_website/global";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import SendInvitation from "./_sendInvation/SendInvitation";
import { useAppDispatch, useAppSelector } from "@/app/Store/hooks";
import { setShowSendPopup } from "@/app/Store/variablesSlice";

interface FamilyGridProps {
  members: FamilyMember[];
}

export default function FamilyMembersGrid({ members: data }: FamilyGridProps) {
  const locale = useLocale();
  const { showSendPopup } = useAppSelector((state) => state.variables);
  const dispatch = useAppDispatch();

  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    if (data) {
      setMembers(data);
    }
  }, [data]);

  return (
    <div dir={directionMap[locale]} className="min-h-screen  my-6">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  2xl:grid-cols-4 gap-6 justify-items-center">
          {members.map((member, index) => (
            <motion.div
              className="w-full"
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FamilyMemberCard member={member} setMembers={setMembers} />
            </motion.div>
          ))}
        </div>
      </div>
      <SendInvitation
        open={showSendPopup}
        setMembers={setMembers}
        onClose={() => dispatch(setShowSendPopup(false))}
      />
    </div>
  );
}
