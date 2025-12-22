// Utility function to append nested objects/arrays into FormData

export const appendFormData = (
  formData: FormData,
  data: Record<string, any>,
  parentKey = ""
) => {
  if (!data || typeof data !== "object") return;

  Object.entries(data).forEach(([key, value]) => {
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File || value instanceof Blob) {
      // Handle files and blobs
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      // Handle arrays
      value.forEach((item, index) => {
        const itemKey = `${formKey}[${index}]`;
        if (item instanceof File || item instanceof Blob) {
          formData.append(itemKey, item);
        } else if (item !== null && typeof item === "object") {
          appendFormData(formData, item, itemKey);
        } else {
          formData.append(itemKey, String(item));
        }
      });
    } else if (value !== null && typeof value === "object") {
      // Handle nested objects (recursion)
      appendFormData(formData, value, formKey);
    } else if (typeof value === "boolean") {
      // Convert booleans to 1/0
      formData.append(formKey, value ? "1" : "0");
    } else if (value !== undefined && value !== null) {
      // Handle primitive values (string, number, etc.)
      formData.append(formKey, String(value));
    }
  });
};
