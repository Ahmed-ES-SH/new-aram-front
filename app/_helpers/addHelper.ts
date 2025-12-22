import { instance } from "./axios";

interface AddItemProps {
  endpoint: string;
  newItem: any;
  setStateFunction: React.Dispatch<React.SetStateAction<any[]>>;
  setSuccess: React.Dispatch<React.SetStateAction<any>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onClosePopup: () => void;
  onShowErrorAlert: () => void;
  onShowSuccessAlert: () => void;
  parentId?: number | null; // إذا كان العنصر الجديد تابعًا لعنصر رئيسي معين
  nestedKey?: string; // مفتاح المصفوفة الفرعية داخل العنصر الرئيسي
}

export const handleAddItem = async ({
  endpoint,
  newItem,
  setStateFunction,
  setSuccess,
  setError,
  onClosePopup,
  onShowErrorAlert,
  onShowSuccessAlert,
  parentId,
  nestedKey,
  setLoading,
}: AddItemProps): Promise<void> => {
  if (!newItem) return;
  try {
    setLoading(true);
    const response = await instance.post(endpoint, newItem);
    if (response.status === 201 || response.status === 200) {
      setStateFunction((prevData) =>
        prevData.map((item) => {
          // إذا لم يتم تحديد مفتاح المصفوفة الفرعية، أضف العنصر إلى القائمة الرئيسية
          if (!nestedKey) {
            return [...prevData, response.data.data];
          }
          // إذا تم تحديد `parentId`، قم بإضافة العنصر الجديد إلى العنصر الصحيح داخل المصفوفة الفرعية
          if (item.id === parentId && Array.isArray(item[nestedKey])) {
            return {
              ...item,
              [nestedKey]: [...item[nestedKey], response.data.data],
            };
          }

          return item;
        })
      );

      setSuccess("تمت إضافة العنصر بنجاح.");
      onClosePopup();
      onShowSuccessAlert();
    }
  } catch (error: any) {
    if (onShowErrorAlert) onShowErrorAlert();
    if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else {
      setError(error.message || "خطأ غير متوقع");
    }
  } finally {
    setLoading(false);
  }
};
