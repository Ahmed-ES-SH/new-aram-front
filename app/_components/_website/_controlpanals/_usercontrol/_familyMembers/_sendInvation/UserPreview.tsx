import { FiSend, FiUser } from "react-icons/fi";
import { UserPreviewProps } from "./types";
import Avatar from "./Avatar";

export default function UserPreview({
  selected,
  onSend,
  onClose,
  loading = false,
  relationship,
  onRelationshipChange,
  previewTitle,
  noSelectedPreviewText,
  sendButtonText,
  cancelButtonText,
  relationshipText,
  relationshipPlaceholder,
  relationshipOptions,
}: UserPreviewProps) {
  const isFormValid = selected && relationship;

  return (
    <aside className="md:col-span-1">
      <div className="rounded-lg border border-gray-300 p-4">
        <h3 className="mb-2 text-sm font-semibold">{previewTitle}</h3>

        {!selected && (
          <div className="text-sm text-gray-500">{noSelectedPreviewText}</div>
        )}

        {selected && (
          <div className="space-y-4">
            {/* معلومات المستخدم */}
            <div className="flex items-center gap-3">
              <Avatar user={selected} size="md" />
              <div>
                <div className="text-sm font-medium">{selected.name}</div>
                <div className="text-xs text-gray-500">{selected.email}</div>
              </div>
            </div>

            {/* اختيار صلة القرابة */}
            <div className="space-y-2">
              <label
                htmlFor="relationship"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <FiUser className="text-gray-500" />
                {relationshipText}
              </label>
              <select
                id="relationship"
                value={relationship}
                onChange={(e) => onRelationshipChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{relationshipPlaceholder}</option>
                {Object.entries(relationshipOptions).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              {!relationship && selected && (
                <p className="text-xs text-red-500">يرجى اختيار صلة القرابة</p>
              )}
            </div>

            {/* معاينة البيانات */}
            <div className="border-t pt-3">
              <h4 className="text-xs font-medium text-gray-500 mb-2">
                معاينة البيانات:
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">الاسم:</span>
                  <span className="font-medium">{selected.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">البريد الإلكتروني:</span>
                  <span className="font-medium">{selected.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">صلة القرابة:</span>
                  <span className="font-medium">
                    {relationship
                      ? relationshipOptions[relationship]
                      : "غير محدد"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={onSend}
            disabled={!isFormValid || loading}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <FiSend />
                {sendButtonText}
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </aside>
  );
}
