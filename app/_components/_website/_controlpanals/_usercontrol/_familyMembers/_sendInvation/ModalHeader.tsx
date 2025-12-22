import { FiX } from "react-icons/fi";
import { ModalHeaderProps } from "./types";

export default function ModalHeader({
  title,
  onClose,
  closeButtonText,
}: ModalHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-300 p-4 bg-white">
      <h2 id="send-invitation-title" className="text-lg font-semibold">
        {title}
      </h2>
      <button
        onClick={onClose}
        aria-label={closeButtonText}
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        <FiX size={20} />
      </button>
    </div>
  );
}
