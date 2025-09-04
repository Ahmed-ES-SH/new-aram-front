import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  ChangeEvent,
} from "react";
import { FaArrowLeft, FaCheck, FaCloudUploadAlt, FaLink } from "react-icons/fa";
import { toast } from "sonner";

interface Props {
  mainVideo: string | File;
  setMainVideo: Dispatch<SetStateAction<string | File>>;
}

export default function EditVideo({ setMainVideo }: Props) {
  const [step, setStep] = useState(0); // 0: اختيار الطريقة، 1: إدخال الفيديو، 2: التأكيد
  const [selectedMethod, setSelectedMethod] = useState<"file" | "url" | null>(
    null
  );
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [showbtns, setShowbtns] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // معالجة اختيار طريقة الإدخال
  const handleMethodSelect = (method: "file" | "url") => {
    setSelectedMethod(method);
    setStep(1);
    setError("");
  };

  // معالجة تغيير رابط الفيديو
  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    setError("");
  };

  // معالجة اختيار ملف الفيديو
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // التحقق من أن الملف هو فيديو
      if (!file.type.startsWith("video/")) {
        setError("الرجاء اختيار ملف فيديو صحيح");
        return;
      }
      setVideoFile(file);
      setError("");
    }
  };

  // معالجة الخطوة التالية
  const handleNext = () => {
    if (selectedMethod === "url") {
      // التحقق من صحة رابط اليوتيوب
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      if (!youtubeRegex.test(videoUrl)) {
        setError("الرجاء إدخال رابط يوتيوب صحيح");
        return;
      }
      setMainVideo(videoUrl);
    } else if (selectedMethod === "file" && videoFile) {
      setMainVideo(videoFile);
    } else {
      setError("الرجاء اختيار فيديو أولاً");
      return;
    }
    setStep(2);
  };

  // معالجة العودة للخطوة السابقة
  const handleBack = () => {
    if (step === 1) {
      setStep(0);
      setSelectedMethod(null);
      setVideoUrl("");
      setVideoFile(null);
    } else if (step === 2) {
      setStep(1);
    }
    setError("");
  };

  // معالجة تأكيد الاختيار
  const handleConfirm = () => {
    toast.success(
      "تم حفظ الفيديو الجديد ضمن الذاكرة فى انتظار حفظ الاعدادات لتيم التأكيد"
    );
    setShowbtns(false);
  };

  // معالجة إعادة التعيين والبدء من جديد
  const handleReset = () => {
    setStep(0);
    setSelectedMethod(null);
    setVideoUrl("");
    setVideoFile(null);
    setMainVideo("");
    setError("");
  };

  // عرض معاينة الفيديو
  const renderVideoPreview = () => {
    if (selectedMethod === "url" && videoUrl) {
      // استخراج معرف فيديو اليوتيوب من الرابط
      const videoId = videoUrl.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      );
      if (videoId) {
        return (
          <div className="mt-4 ">
            <label className="block text-gray-600 font-medium mb-2">
              معاينة الفيديو:
            </label>
            <iframe
              width="100%"
              height="240"
              src={`https://www.youtube.com/embed/${videoId[1]}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-md h-[40vh]"
            ></iframe>
          </div>
        );
      }
    } else if (selectedMethod === "file" && videoFile) {
      return (
        <div className="mt-4">
          <label className="block text-gray-600 font-medium mb-2">
            معاينة الفيديو:
          </label>
          <video
            src={URL.createObjectURL(videoFile)}
            controls
            className="w-full h-60 rounded-md object-contain bg-black"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        إعداد الفيديو الرئيسي
      </h2>

      {/* مؤشر التقدم */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 -z-10"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-sky-500 transform -translate-y-1/2 -z-10 transition-all duration-300"
          style={{ width: step === 0 ? "0%" : step === 1 ? "50%" : "100%" }}
        ></div>

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex flex-col items-center relative ${
              i === 1 ? "ml-0" : i === 3 ? "mr-0" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= i - 1
                  ? "bg-sky-500 border-sky-500 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {i}
            </div>
            <span className="text-xs mt-1 text-gray-600">
              {i === 1
                ? "اختيار الطريقة"
                : i === 2
                ? "إدخال الفيديو"
                : "التأكيد"}
            </span>
          </div>
        ))}
      </div>

      {/* الخطوة 1: اختيار طريقة الإدخال */}
      {step === 0 && (
        <div className="step-container">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            كيف تريد إضافة الفيديو؟
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Upload File Option */}
            <div
              className={`flex flex-col items-center justify-center cursor-pointer rounded-2xl border-2 p-6 w-full md:w-1/2 transition-all duration-300 shadow-sm 
      ${
        selectedMethod === "file"
          ? "border-sky-500 bg-sky-100 shadow-md scale-105"
          : "border-gray-300 hover:border-sky-400 hover:bg-sky-50 hover:shadow"
      }`}
              onClick={() => handleMethodSelect("file")}
            >
              <FaCloudUploadAlt
                className={`text-3xl mb-2 transition-colors duration-300 ${
                  selectedMethod === "file" ? "text-sky-600" : "text-gray-500"
                }`}
              />
              <span
                className={`font-medium transition-colors duration-300 ${
                  selectedMethod === "file" ? "text-sky-700" : "text-gray-700"
                }`}
              >
                رفع ملف فيديو
              </span>
            </div>

            {/* Youtube URL Option */}
            <div
              className={`flex flex-col items-center justify-center cursor-pointer rounded-2xl border-2 p-6 w-full md:w-1/2 transition-all duration-300 shadow-sm 
      ${
        selectedMethod === "url"
          ? "border-sky-500 bg-sky-100 shadow-md scale-105"
          : "border-gray-300 hover:border-sky-400 hover:bg-sky-50 hover:shadow"
      }`}
              onClick={() => handleMethodSelect("url")}
            >
              <FaLink
                className={`text-3xl mb-2 transition-colors duration-300 ${
                  selectedMethod === "url" ? "text-sky-600" : "text-gray-500"
                }`}
              />
              <span
                className={`font-medium transition-colors duration-300 ${
                  selectedMethod === "url" ? "text-sky-700" : "text-gray-700"
                }`}
              >
                إضافة رابط يوتيوب
              </span>
            </div>
          </div>
        </div>
      )}

      {/* الخطوة 2: إدخال الفيديو */}
      {step === 1 && (
        <div className="step-container">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {selectedMethod === "url"
              ? "أدخل رابط فيديو اليوتيوب"
              : "اختر ملف الفيديو"}
          </h3>

          {selectedMethod === "url" ? (
            <div className="mb-4">
              <input
                type="text"
                value={videoUrl}
                onChange={handleUrlChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          ) : (
            <div className="mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
              />
              <div
                className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaCloudUploadAlt className="text-3xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">انقر لاختيار ملف الفيديو</p>
                {videoFile && (
                  <p className="text-sm text-sky-600 mt-2">
                    تم اختيار الملف: {videoFile.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {renderVideoPreview()}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FaArrowLeft /> السابق
            </button>
            <button
              onClick={handleNext}
              disabled={
                (selectedMethod === "url" && !videoUrl) ||
                (selectedMethod === "file" && !videoFile)
              }
              className="flex items-center gap-2 px-4 py-2 text-white bg-sky-500 rounded-md hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي <FaCheck />
            </button>
          </div>
        </div>
      )}

      {/* الخطوة 3: تأكيد الاختيار */}
      {step === 2 && (
        <div className="step-container">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            تأكيد اختيار الفيديو
          </h3>

          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <p className="text-gray-600 mb-2">
              <span className="font-medium">طريقة الإضافة:</span>
              {selectedMethod === "url" ? " رابط يوتيوب" : " ملف مرفوع"}
            </p>

            {selectedMethod === "url" ? (
              <p className="text-gray-600 break-words">
                <span className="font-medium">الرابط:</span> {videoUrl}
              </p>
            ) : (
              videoFile && (
                <p className="text-gray-600">
                  <span className="font-medium">الملف:</span> {videoFile.name}
                </p>
              )
            )}
          </div>

          {renderVideoPreview()}

          {showbtns && (
            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <FaArrowLeft /> السابق
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  بدء من جديد
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                >
                  تأكيد <FaCheck />
                </button>
              </div>
            </div>
          )}

          {!showbtns && (
            <button
              onClick={handleReset}
              className="px-4 py-2 mt-4 bg-red-300 text-white  rounded-md hover:bg-red-400 transition-colors"
            >
              بدء من جديد
            </button>
          )}
        </div>
      )}
    </div>
  );
}
