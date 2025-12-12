"use client";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import PopupHeader from "./PopupHeader";
import StepIndicator from "./StepIndicator";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import LastStep from "./LastStep";
import { instance } from "@/app/_helpers/axios";

interface EditVideoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  setMainVideo: (video: string | File | null | any) => void;
  video_id: string;
  title?: string;
}

export default function EditVideoPopup({
  isOpen,
  onClose,
  video_id,
  setMainVideo,
  title = "إعداد الفيديو الرئيسي",
}: EditVideoPopupProps) {
  const [step, setStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<"file" | "url" | null>(
    null
  );
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<any>(null);
  const [error, setError] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  const steps = [
    { label: "اختيار الطريقة" },
    { label: "إدخال الفيديو" },
    { label: "التأكيد" },
  ];

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setStep(0);
    setSelectedMethod(null);
    setVideoUrl("");
    setVideoFile(null);
    setError("");
    setIsConfirmed(false);
  };

  const handleMethodSelect = (method: "file" | "url") => {
    setSelectedMethod(method);
    setStep(1);
    setError("");
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    setError("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("video/")) {
        setError("الرجاء اختيار ملف فيديو صحيح");
        return;
      }

      setVideoFile(file);
      setError("");
    }
  };

  const validateInput = (): boolean => {
    if (selectedMethod === "url" && !youtubeRegex.test(videoUrl)) {
      setError("الرجاء إدخال رابط يوتيوب صحيح");
      return false;
    }

    if (selectedMethod === "file" && !videoFile) {
      setError("الرجاء اختيار ملف الفيديو");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateInput()) return;

    if (selectedMethod === "url") {
      setMainVideo(videoUrl);
    } else if (selectedMethod === "file" && videoFile) {
      setMainVideo(videoFile);
    }

    setStep(2);
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
      setSelectedMethod(null);
    } else if (step === 2) {
      setStep(1);
    }
    setError("");
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setUploadProgress(0); // بدء التقدم من 0

      const formData = new FormData();
      if (videoFile instanceof File) formData.append("video", videoFile);
      if (videoUrl.length > 5) formData.append("video_url", videoUrl);
      formData.append("aspect_ratio", aspectRatio);
      formData.append("video_id", video_id);
      formData.append(
        "video_type",
        selectedMethod == "file" ? "file" : "youtube"
      );
      formData.append("is_file", selectedMethod == "file" ? "1" : "0");

      // استخدام axios مع تتبع التقدم
      const response = await instance.post(`/update-video`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        },
      });

      if (response.status == 200) {
        setIsConfirmed(true);
        toast.success("تم حفظ الفيديو بنجاح");
        setMainVideo((prev: any) => ({
          ...prev,
          video_url: response.data.data.video_url,
        }));
        setTimeout(() => onClose(), 1500);
      }
    } catch (error: any) {
      console.log(error);
      const message =
        error?.response?.data?.message ?? "حدث خطا اثناء عملية التحديث";
      toast.error(message);
    } finally {
      setLoading(false);
      // إعادة تعيين التقدم بعد الانتهاء
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleReset = () => {
    resetForm();
    setMainVideo("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999999 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Popup Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-xl"
          >
            <div className="p-6">
              <PopupHeader title={title} onClose={onClose} />

              <StepIndicator currentStep={step} steps={steps} />

              <AnimatePresence mode="wait">
                <div className="w-full max-h-[55vh] overflow-y-auto">
                  {/* Step 1: Method Selection */}
                  {step === 0 && (
                    <FirstStep
                      selectedMethod={selectedMethod}
                      onMethodSelect={handleMethodSelect}
                    />
                  )}

                  {/* Step 2: Video Input */}
                  {step === 1 && (
                    <SecondStep
                      error={error}
                      fileInputRef={fileInputRef}
                      handleBack={handleBack}
                      handleFileChange={handleFileChange}
                      handleUrlChange={handleUrlChange}
                      handleNext={handleNext}
                      selectedMethod={selectedMethod}
                      videoFile={videoFile}
                      aspectRatio={aspectRatio}
                      videoUrl={videoUrl}
                      key={"editVideoSecondStep"}
                    />
                  )}

                  {/* Step 3: Confirmation */}
                  {step === 2 && (
                    <LastStep
                      handleBack={handleBack}
                      handleConfirm={handleConfirm}
                      handleReset={handleReset}
                      isConfirmed={isConfirmed}
                      onClose={onClose}
                      selectedMethod={selectedMethod}
                      videoFile={videoFile}
                      aspectRatio={aspectRatio}
                      setAspectRatio={setAspectRatio}
                      videoUrl={videoUrl}
                      loading={loading}
                      uploadProgress={uploadProgress}
                      key={`lastStep`}
                    />
                  )}
                </div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
