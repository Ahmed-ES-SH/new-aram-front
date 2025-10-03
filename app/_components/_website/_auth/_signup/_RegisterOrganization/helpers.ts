// Utility function to append nested objects/arrays into FormData
export const appendFormData = (
  formData: FormData,
  data: Record<string, any>,
  parentKey = ""
) => {
  Object.entries(data).forEach(([key, value]) => {
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File) {
      // Handle files
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      // Handle arrays
      value.forEach((item, index) => {
        formData.append(`${formKey}[${index}]`, item);
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
