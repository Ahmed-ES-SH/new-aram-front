import { Dispatch, SetStateAction } from "react";

export interface FamilyMember {
  id: number;
  family_member_id: number;
  user_id: number;
  member: {
    id: number;
    name: string;
    birth_date: string;
    gender: "male" | "female";
    image: string;
    phone: string;
  };
  user: {
    id: number;
    name: string;
    birth_date: string;
    gender: "male" | "female";
    image: string;
    phone: string;
  };
  relationship: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface FamilyCardProps {
  member: FamilyMember;
  setMembers: Dispatch<SetStateAction<FamilyMember[]>>;
}
