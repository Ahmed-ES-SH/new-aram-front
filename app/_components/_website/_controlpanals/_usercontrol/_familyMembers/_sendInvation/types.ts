import { Dispatch, SetStateAction } from "react";
import { FamilyMember } from "../types";

export type User = {
  id: number;
  name: string;
  image: string | null;
  email: string;
  phone?: string | null;
  role?: string;
  status?: string;
  gender?: string;
  created_at: string;
};

export type SendInvitationProps = {
  open: boolean;
  onClose: () => void;
  singleSelect?: true;
  setMembers: Dispatch<SetStateAction<FamilyMember[]>>;
  initialSelected?: User | null;
  debounceMs?: number;
};

export type ModalHeaderProps = {
  title: string;
  onClose: () => void;
  closeButtonText: string;
};

export type SearchSectionProps = {
  query: string;
  onQueryChange: (value: string) => void;
  selectedCount: number;
  searchInputRef: React.RefObject<HTMLInputElement>;
  searchPlaceholder: string;
  selectedText: string;
};

export type UserListProps = {
  results: User[];
  loading: boolean;
  error: string | null;
  query: string;
  selected: User | null;
  highlightedIndex: number;
  onSelectUser: (user: User) => void;
  onHighlightUser: (index: number) => void;
  onRetry: () => void;
  columns: {
    name: string;
    email: string;
  };
  retryText: string;
  noResultsText: string;
  loadingText: string;
  errorText: string;
};

export type UserPreviewProps = {
  selected: User | null;
  onSend: () => void;
  onClose: () => void;
  loading?: boolean;
  relationship: string;
  onRelationshipChange: (relationship: string) => void;
  previewTitle: string;
  noSelectedPreviewText: string;
  sendButtonText: string;
  cancelButtonText: string;
  relationshipText: string;
  relationshipPlaceholder: string;
  relationshipOptions: Record<string, string>;
};

export type AvatarProps = {
  user: User;
  size?: "sm" | "md" | "lg";
};
