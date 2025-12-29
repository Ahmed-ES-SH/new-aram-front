"use client";
import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { FiPlus, FiSave, FiUpload } from "react-icons/fi";
import { AdminServiceOrder, TrackingPhase, OrderStatus } from "./types";
import { toast } from "sonner";
import { instance } from "@/app/_helpers/axios";
import { useAppSelector } from "@/app/Store/hooks";
import { VscLoading } from "react-icons/vsc";
import FilePreviewItem, {
  FileUploadState,
  FileUploadStatus,
  generateFileId,
} from "./FilePreviewItem";
import CustomSelect from "./CustomSelect";

interface AddTrackingFormProps {
  order: AdminServiceOrder;
  setOrder: Dispatch<SetStateAction<AdminServiceOrder>>;
}

export default function AddTrackingForm({
  order,
  setOrder,
}: AddTrackingFormProps) {
  const { user } = useAppSelector((state) => state.user);

  const [phase, setPhase] = useState<TrackingPhase>("initiation");
  const [status, setStatus] = useState<OrderStatus>("in_progress");
  const [notes, setNotes] = useState("");
  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
  const [loading, setLoading] = useState(false);

  // Check if all files are uploaded successfully
  const allFilesUploaded = fileStates.every(
    (fs) => fs.status === "success" || fs.status === "pending"
  );
  const hasFailedFiles = fileStates.some((fs) => fs.status === "failed");
  const isUploading = fileStates.some((fs) => fs.status === "uploading");
  const hasPendingFiles = fileStates.some((fs) => fs.status === "pending");

  // Get all successfully uploaded file IDs
  const uploadedFileIds = fileStates
    .filter((fs) => fs.status === "success" && fs.uploadedFileId)
    .map((fs) => fs.uploadedFileId!);

  // Update a specific file's state
  const updateFileState = useCallback(
    (fileId: string, updates: Partial<FileUploadState>) => {
      setFileStates((prev) =>
        prev.map((fs) => (fs.id === fileId ? { ...fs, ...updates } : fs))
      );
    },
    []
  );

  // Upload a single file
  const uploadSingleFile = useCallback(
    async (fileState: FileUploadState): Promise<void> => {
      const { id, file } = fileState;

      // Mark as uploading
      updateFileState(id, {
        status: "uploading",
        progress: 0,
        error: undefined,
      });

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("service_order_id", order.id.toString());

        const response = await instance.post("/uploads/temp", formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              updateFileState(id, { progress });
            }
          },
        });

        if (response.status === 200 || response.status === 201) {
          updateFileState(id, {
            status: "success",
            progress: 100,
            uploadedFileId: response.data.data?.id || response.data.id,
          });
        } else {
          throw new Error("Upload failed");
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "فشل رفع الملف";
        updateFileState(id, {
          status: "failed",
          error: errorMessage,
        });
      }
    },
    [order.id, updateFileState]
  );

  // Handle file selection - add files to queue
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newFileStates: FileUploadState[] = newFiles.map((file) => ({
        id: generateFileId(),
        file,
        status: "pending" as FileUploadStatus,
        progress: 0,
      }));

      setFileStates((prev) => [...prev, ...newFileStates]);

      // Auto-start upload for new files
      newFileStates.forEach((fs) => {
        uploadSingleFile(fs);
      });
    }
    // Reset input value to allow selecting same file again
    e.target.value = "";
  };

  // Remove a file from the queue
  const handleRemoveFile = useCallback((fileId: string) => {
    setFileStates((prev) => prev.filter((fs) => fs.id !== fileId));
  }, []);

  // Retry a failed upload
  const handleRetryFile = useCallback(
    (fileId: string) => {
      const fileState = fileStates.find((fs) => fs.id === fileId);
      if (fileState) {
        uploadSingleFile(fileState);
      }
    },
    [fileStates, uploadSingleFile]
  );

  // Retry all failed uploads
  const handleRetryAllFailed = useCallback(() => {
    const failedFiles = fileStates.filter((fs) => fs.status === "failed");
    failedFiles.forEach((fs) => {
      uploadSingleFile(fs);
    });
  }, [fileStates, uploadSingleFile]);

  // Final form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if files are still uploading
    if (isUploading) {
      toast.error("يرجى انتظار اكتمال رفع جميع الملفات");
      return;
    }

    // Warn about failed files
    if (hasFailedFiles) {
      toast.error("بعض الملفات فشلت في الرفع. يرجى إعادة المحاولة أو إزالتها");
      return;
    }

    try {
      setLoading(true);

      const metadata = {
        notes,
        priority: "high",
      };

      const payload = {
        service_id: order.service.id,
        service_order_id: order.id,
        user_id: user?.id,
        user_type: user?.account_type,
        current_phase: phase,
        status: status,
        metadata: metadata,
        file_ids: uploadedFileIds, // Send only the file IDs
      };

      const response = await instance.post("/add-service-tracking", payload);

      if (response.status === 201) {
        toast.success("تم اضافة التحديث بنجاح");
        setOrder({
          ...order,
          trackings: [...order.trackings, response.data.data],
        });

        // Reset form
        setFileStates([]);
        setNotes("");
        setPhase("initiation");
        setStatus("in_progress");
      }
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message ?? "حدث خطا اثناء اجراء العملية";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Check if form can be submitted
  const canSubmit =
    !loading &&
    !isUploading &&
    !hasFailedFiles &&
    (fileStates.length === 0 ||
      fileStates.every((fs) => fs.status === "success"));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiPlus className="text-primary" />
        إضافة تحديث تتبع
      </h3>

      <form className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Phase */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المرحلة
            </label>
            <CustomSelect
              value={phase}
              onChange={(value) => setPhase(value as TrackingPhase)}
              options={[
                { value: "initiation", label: "البدء" },
                { value: "planning", label: "التخطيط" },
                { value: "execution", label: "التنفيذ" },
                { value: "delivery", label: "التسليم" },
              ]}
              placeholder="اختر المرحلة"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ملاحظات / بيانات إضافية
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-all text-sm resize-none"
            placeholder="أدخل ملاحظات حول هذا التحديث..."
          />
        </div>

        {/* Files */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المرفقات
          </label>
          <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group">
            <div className="flex flex-col items-center">
              <FiUpload
                className="text-gray-400 group-hover:text-primary mb-2"
                size={24}
              />
              <span className="text-sm text-gray-500">اضغط لرفع الملفات</span>
              <span className="text-xs text-gray-400 mt-1">
                يدعم: صور، PDF، Word، Excel، PowerPoint، ملفات مضغوطة وغيرها
              </span>
            </div>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.txt,.rtf"
            />
          </label>

          {/* File Previews */}
          {fileStates.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">
                  الملفات ({fileStates.length})
                  {isUploading && (
                    <span className="text-xs text-primary mr-2">
                      • جاري الرفع...
                    </span>
                  )}
                </div>
                {hasFailedFiles && (
                  <button
                    type="button"
                    onClick={handleRetryAllFailed}
                    className="text-xs text-primary hover:underline"
                  >
                    إعادة محاولة الكل
                  </button>
                )}
              </div>

              {/* Upload Summary */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  مكتمل:{" "}
                  {fileStates.filter((fs) => fs.status === "success").length}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  جاري:{" "}
                  {fileStates.filter((fs) => fs.status === "uploading").length}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  فشل:{" "}
                  {fileStates.filter((fs) => fs.status === "failed").length}
                </span>
              </div>

              {/* File List */}
              <div className="grid grid-cols-1 gap-3">
                {fileStates.map((fileState) => (
                  <FilePreviewItem
                    key={fileState.id}
                    fileState={fileState}
                    onRemove={handleRemoveFile}
                    onRetry={handleRetryFile}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
            canSubmit
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <VscLoading className="animate-spin" />
          ) : isUploading ? (
            <div className="flex items-center gap-2">
              <VscLoading className="animate-spin" />
              <span>جاري رفع الملفات...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FiSave />
              <span>حفظ التحديث</span>
            </div>
          )}
        </button>

        {/* Status Message */}
        {hasFailedFiles && (
          <p className="text-xs text-red-500 text-center">
            بعض الملفات فشلت في الرفع. يرجى إعادة المحاولة أو إزالتها للمتابعة.
          </p>
        )}
      </form>
    </div>
  );
}
