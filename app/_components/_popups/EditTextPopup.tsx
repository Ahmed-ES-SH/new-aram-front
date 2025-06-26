import React from "react";
import { GiTireIronCross } from "react-icons/gi";
import { AnimatePresence, motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";

interface InputType {
  name: string;
  type: string;
  value: string | number;
  placeholder?: string;
  label: string;
}

interface EditTextPopupProps {
  inputs: InputType[];
  onChange: (name: string, value: string | number) => void;
  showPopup: boolean;
  loadingState: boolean;
  operationType: string;
  onClose: () => void;
  onSave?: () => void;
  onAdd?: () => void;
}

export default function EditTextPopup({
  inputs,
  onChange,
  showPopup,
  loadingState,
  operationType,
  onClose,
  onSave,
  onAdd,
}: EditTextPopupProps) {
  // كائن يحدد كيف يتم عرض كل نوع من الحقول
  const renderInputField = (input: InputType, index: number) => {
    switch (input.type) {
      case "short-text":
        return (
          <input
            key={index}
            className="input-style"
            name={input.name}
            value={input.value}
            onChange={(e) => onChange(input.name, e.target.value)}
            placeholder={input.placeholder || ""}
          />
        );
      case "long-text":
        return (
          <textarea
            key={index}
            className="input-style  h-24"
            name={input.name}
            value={input.value}
            onChange={(e) => onChange(input.name, e.target.value)}
            placeholder={input.placeholder || ""}
          />
        );
      case "number":
        return (
          <input
            key={index}
            type="number"
            className="input-style"
            name={input.name}
            value={input.value}
            onChange={(e) => onChange(input.name, Number(e.target.value))}
            placeholder={input.placeholder || ""}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ direction: "rtl" }}
          className="popup-main-bg"
        >
          <motion.div
            initial={{ opacity: 0, y: -500 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0, y: -500 }}
            className={`w-1/2 max-lg:w-3/4 max-md:w-[90%] max-sm:w-[98%] bg-white rounded-md shadow-md shadow-white h-fit overflow-y-auto flex flex-col gap-4 relative p-4`}
          >
            <div onClick={onClose} className="close-btn">
              <GiTireIronCross className="size-6" />
            </div>
            <h2 className="text-lg font-semibold text-center">تحرير النص</h2>
            {inputs &&
              inputs.map((input, index) => (
                <>
                  <label className="input-label">{input.label}</label>
                  {renderInputField(input, index)}
                </>
              ))}
            <button
              disabled={loadingState}
              onClick={operationType == "edit" ? onSave : onAdd}
              className="mt-4 p-2 h-fit flex items-center justify-center bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              {loadingState ? (
                <motion.div
                  animate={{ rotate: "360deg" }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <VscLoading className="size-5 text-white" />
                </motion.div>
              ) : operationType == "edit" ? (
                "حفظ التعديلات"
              ) : (
                "إضافة"
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
