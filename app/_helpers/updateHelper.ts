import { instance } from "./axios";

interface props {
  endpoint: string;
  id: number | string;
  updatedData: any;
  setStateFunction?: React.Dispatch<React.SetStateAction<any[]>>;
  setSuccess?: React.Dispatch<React.SetStateAction<any>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
  setErrors?: React.Dispatch<React.SetStateAction<any>>;
  onClosePopup?: () => void;
  onShowErrorAlert: () => void;
  onShowSuccessAlart: () => void;
  nestedKey?: string;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>; // ✅ إضافة setLoading
}

export const handleUpdateItem = async ({
  endpoint,
  id,
  updatedData,
  setStateFunction,
  onClosePopup,
  setSuccess,
  setError,
  setErrors,
  onShowErrorAlert,
  onShowSuccessAlart,
  nestedKey,
  setLoading, // ✅ تمرير setLoading
}: props): Promise<void> => {
  if (!id || !updatedData) return;

  // ✅ بدء التحميل
  if (setLoading) setLoading(true);

  try {
    const formData = new FormData();
    Object.entries(updatedData).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        key !== "created_at" &&
        key !== "updated_at"
      ) {
        const formattedValue = Array.isArray(value)
          ? JSON.stringify(value)
          : value;
        formData.append(key, formattedValue as string | Blob);
      }
    });

    const response = await instance.post(`${endpoint}/${id}`, formData);

    if (response.status === 200 && setStateFunction && nestedKey) {
      setStateFunction((prevData) =>
        prevData.map((item) => {
          // نبحث داخل مصفوفة العناصر الفرعية عن العنصر المطلوب تحديثه
          if (Array.isArray(item[nestedKey])) {
            const subList = item[nestedKey];
            const hasTargetItem = subList.some((sub) => sub.id === id);

            if (hasTargetItem) {
              return {
                ...item,
                [nestedKey]: subList.map((subItem) =>
                  subItem.id === id ? { ...subItem, ...updatedData } : subItem
                ),
              };
            }
          }

          return item;
        })
      );

      if (setSuccess) setSuccess("تم تعديل البيانات بنجاح.");
      if (onClosePopup) onClosePopup();
      onShowSuccessAlart();
    }
  } catch (error: any) {
    onShowErrorAlert();
    if (error.response?.data?.message || error.response?.data?.errors) {
      setError(error.response.data.message);
      if (setErrors) setErrors(error.response.data.errors);
    } else {
      setError(error.message || "خطأ غير متوقع");
    }
  } finally {
    // ✅ إيقاف التحميل بعد انتهاء العملية
    if (setLoading) setLoading(false);
  }
};
