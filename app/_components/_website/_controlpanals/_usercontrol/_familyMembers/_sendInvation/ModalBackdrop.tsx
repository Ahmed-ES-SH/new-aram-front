import { motion } from "framer-motion";

type ModalBackdropProps = {
  onClose: () => void;
};

export default function ModalBackdrop({ onClose }: ModalBackdropProps) {
  return (
    <motion.div
      className="absolute inset-0 bg-black/50 backdrop-blur-md"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-hidden="true"
    />
  );
}
