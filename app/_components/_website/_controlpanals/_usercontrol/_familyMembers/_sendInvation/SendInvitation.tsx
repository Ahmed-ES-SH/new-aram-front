"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { instance } from "@/app/_helpers/axios";
// Types
import { User, SendInvitationProps } from "./types";
// Components
import ModalBackdrop from "./ModalBackdrop";
import ModalHeader from "./ModalHeader";
import SearchSection from "./SearchSection";
import UserList from "./UserList";
import UserPreview from "./UserPreview";
import Avatar from "./Avatar";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/Store/hooks";
import { setShowSendPopup } from "@/app/Store/variablesSlice";

export default function SendInvitation({
  open = true,
  onClose,
  setMembers,
  initialSelected = null,
  debounceMs = 300,
}: SendInvitationProps) {
  const t = useTranslations("SendInvitation");
  const locale = useLocale();

  const dispatch = useAppDispatch();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<User | null>(initialSelected);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [relationship, setRelationship] = useState<string>("");
  const [sendLoading, setSendLoading] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Debounce search
  useEffect(() => {
    const controller = new AbortController();
    setError(null);

    if (query.trim() === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const id = setTimeout(() => {
      instance
        .post(`/search-for-user-by-name?query=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        })
        .then((res) => {
          setResults(res.data.data ?? []);
          setLoading(false);
        })
        .catch((err) => {
          if (axios.isCancel(err)) return;
          setError(
            err?.response?.data?.message ?? "Failed to fetch users. Try again."
          );
          setLoading(false);
        });
    }, debounceMs);

    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query, debounceMs]);

  // Focus management & keyboard
  useEffect(() => {
    if (!open) return;

    setTimeout(() => searchInputRef.current?.focus(), 0);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          selectUser(results[highlightedIndex]);
        }
      } else if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, results, highlightedIndex, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setLoading(false);
      setError(null);
      setHighlightedIndex(-1);
      setRelationship("");
      setSendLoading(false);
    }
  }, [open]);

  const selectUser = (user: User) => {
    if (selected?.id === user.id) {
      setSelected(null);
      setRelationship("");
    } else {
      setSelected(user);
      // إعادة تعيين علاقة القرابة عند اختيار مستخدم جديد
      setRelationship("");
    }
  };

  const handleSend = async () => {
    if (!selected || !relationship) return;

    setSendLoading(true);
    try {
      const data = {
        family_member_id: selected.id,
        relationship: relationship,
      };
      const response = await instance.post(`/add-family-member`, data);
      if (response.status == 201) {
        const data = response.data.data;
        setMembers((prev) => [data, ...prev]);
        setSelected(null);
        setRelationship("");
        dispatch(setShowSendPopup(false));
        toast.success(
          "تم ارسال رابط الدعوة الى المستخدم المحدد بنجاح فى انتظار الرد !"
        );
      }
    } catch (e: any) {
      console.error(e);
      const message =
        e?.response?.data?.message[locale] ??
        e?.response?.data?.message[locale] ??
        "جدث خطا اثناء محاولة ارسال الطلب الرجاء المحاولة لاحقا !";
      toast.error(message);
    } finally {
      setSendLoading(false);
    }
  };

  const handleCancel = () => {
    setRelationship("");
    onClose();
  };

  const handleRetry = () => {
    setQuery((q) => q + " ");
    setQuery((q) => q.trim());
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={!open}
        >
          <ModalBackdrop onClose={handleCancel} />

          <motion.div
            className="relative z-10 w-[98%] max-w-7xl rounded-2xl bg-white shadow-xl"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="send-invitation-title"
            ref={modalRef}
          >
            <ModalHeader
              title={t("title")}
              onClose={handleCancel}
              closeButtonText={t("closeButton")}
            />

            <div className="p-4">
              <SearchSection
                query={query}
                onQueryChange={(value) => {
                  setQuery(value);
                  setHighlightedIndex(-1);
                }}
                selectedCount={selected ? 1 : 0}
                searchInputRef={searchInputRef as any}
                searchPlaceholder={t("searchPlaceholder")}
                selectedText={
                  selected ? t("selected", { count: 1 }) : t("noSelected")
                }
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <UserList
                  results={results}
                  loading={loading}
                  error={error}
                  query={query}
                  selected={selected}
                  highlightedIndex={highlightedIndex}
                  onSelectUser={selectUser}
                  onHighlightUser={setHighlightedIndex}
                  onRetry={handleRetry}
                  columns={{
                    name: t("columns.name"),
                    email: t("columns.email"),
                  }}
                  retryText={t("retry")}
                  noResultsText={t("noResults")}
                  loadingText={t("loading")}
                  errorText={error || t("error")}
                />

                <UserPreview
                  selected={selected}
                  onSend={handleSend}
                  onClose={handleCancel}
                  loading={sendLoading}
                  relationship={relationship}
                  onRelationshipChange={setRelationship}
                  previewTitle={t("previewTitle")}
                  noSelectedPreviewText={t("noSelectedPreview")}
                  sendButtonText={t("sendButton")}
                  cancelButtonText={t("cancelButton")}
                  relationshipText={t("relationship")}
                  relationshipPlaceholder={t("relationshipPlaceholder")}
                  relationshipOptions={t.raw("relationshipOptions")}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Avatar };
