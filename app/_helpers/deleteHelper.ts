import { instance } from "./axios";
interface DeleteProps {
  endpoint: string;
  id: number | null | undefined;
  setStateFunction: React.Dispatch<React.SetStateAction<any[]>>;
  onShowSuccessAlert?: () => void;
  onClosePopup?: () => void;
  onShowErrorAlert?: () => void;
  nestedKey?: string;
  setError: React.Dispatch<React.SetStateAction<any>>;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
}

export const handleDeleteItem = async ({
  endpoint,
  id,
  setStateFunction,
  onShowSuccessAlert,
  onClosePopup,
  setSuccess,
  onShowErrorAlert,
  setError,
  nestedKey, // المفتاح الخاص بالمصفوفة الفرعية (اختياري)
}: DeleteProps & { nestedKey?: string }) => {
  if (!id) return;

  try {
    const response = await instance.delete(`${endpoint}/${id}`);

    if (response.status === 200) {
      setStateFunction(
        (prevData) =>
          prevData
            .map((item) => {
              // إذا لم يكن هناك مفتاح مصفوفة فرعية، احذف العنصر مباشرةً من القائمة الرئيسية
              if (!nestedKey) {
                return item.id === id ? null : item;
              }

              // إذا كان هناك مفتاح للمصفوفة الفرعية، تأكد من تحديث المصفوفة داخله فقط
              if (Array.isArray(item[nestedKey])) {
                return {
                  ...item,
                  [nestedKey]: item[nestedKey].filter(
                    (nestedItem: any) => nestedItem.id !== id
                  ),
                };
              }

              return item;
            })
            .filter(Boolean) // إزالة العناصر المحذوفة
      );

      setSuccess("تمت حذف العنصر بنجاح.");
      if (onShowSuccessAlert) onShowSuccessAlert();
      if (onClosePopup) onClosePopup();
    }
  } catch (error: any) {
    if (onShowErrorAlert) onShowErrorAlert();
    if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else {
      setError(error.message || "خطأ غير متوقع");
    }
  }
};
