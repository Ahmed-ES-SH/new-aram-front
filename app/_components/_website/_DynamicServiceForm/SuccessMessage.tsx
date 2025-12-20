import { FiCheckCircle } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface SuccessMessageProps {
  onReset: () => void;
}

export const SuccessMessage = ({ onReset }: SuccessMessageProps) => {
  const t = useTranslations("servicePage.dynamicServiceForm");

  return (
    <div className="text-center p-8 bg-green-50 rounded-xl">
      <FiCheckCircle className="mx-auto text-green-500 mb-2" size={32} />
      <h3 className="font-bold text-green-800">{t("submittedSuccessfully")}</h3>
      <button
        onClick={onReset}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        {t("submitAnother")}
      </button>
    </div>
  );
};
