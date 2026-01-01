"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { FaTimes } from "react-icons/fa";
import SuccessAlart from "../../_popups/SuccessAlart";
import ComposeNewsletterStep from "./ComposeNewsletterStep";
import MemberSelectionStep from "./MemberSelectionStep";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import LoadingSpin from "../../LoadingSpin";

interface NewsletterWizardProps {
  newsletterId: string | number | null;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function NewsletterWizard({
  newsletterId,
  show,
  setShow,
}: NewsletterWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setShow(false);
    // Reset state after a delay for animation, or immediately
    setTimeout(() => {
      setStep(1);
      setSelectedEmails([]);
      setSelectAll(false);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload = {
        emails: JSON.stringify(selectedEmails), // API needs to support this
        newsletterId: newsletterId || null,
      };

      const response = await instance.post(
        `/newsletters/${newsletterId}/send`,
        payload
      );
      if (response.status === 200) {
        setShowSuccess(true);
        toast.success("تم ارسال النشرة بنجاح");
        handleClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send newsletter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {show &&
          (loading ? (
            <LoadingSpin />
          ) : (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            >
              <motion.div
                className="relative bg-white -800 w-[95%] max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", bounce: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b -700 flex justify-between items-center bg-gray-50 -700/50">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 -100">
                      {step === 1 ? "Select Recipients" : "Compose Newsletter"}
                    </h2>
                    <p className="text-xs text-gray-500 -400 mt-1">
                      Step {step} of 2
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <MemberSelectionStep
                        selectedEmails={selectedEmails}
                        setSelectedEmails={setSelectedEmails}
                        selectAll={selectAll}
                        setSelectAll={setSelectAll}
                        onSubmit={handleSubmit}
                        onCancel={handleClose}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          ))}
      </AnimatePresence>

      <SuccessAlart
        showAlart={showSuccess}
        Message={"Newsletter sent successfully!"}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
