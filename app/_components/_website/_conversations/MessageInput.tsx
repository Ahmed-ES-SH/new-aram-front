"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import FilePreview from "./FilePreview";
import { FiMic, FiPaperclip, FiSend } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";

export default function MessageInput() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const userType = searchParams.get("userType");
  const receiverId = searchParams.get("receiverId");
  const receiverType = searchParams.get("receiverType");
  const conversationId = searchParams.get("conversationId");

  const recordedChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isAudio = file.type.startsWith("audio/");
      const isPDF = file.type === "application/pdf";

      if (!isImage && !isAudio && !isPDF) {
        setError(
          "Unsupported file type. Only images, audio, and PDFs are allowed."
        );
        return;
      }

      setError(null); // Clear previous error

      const fileType = isImage ? "image" : isAudio ? "audio" : "pdf";

      setSelectedFile({
        name: file.name,
        type: fileType,
        url: URL.createObjectURL(file),
        size: file.size,
        file: file,
      });
    }
  };

  const handleRecord = async () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recordedChunksRef.current = []; // ✅ إعادة تعيين كل مرة

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data); // ✅ نضيف للـ ref مباشرة
        }
      };

      recorder.onstop = () => {
        const fileName = `voice_${new Date().getTime()}.webm`;

        const audioBlob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const audioFile = new File([audioBlob], fileName, {
          type: "audio/webm",
          lastModified: Date.now(),
        });

        setSelectedFile({
          name: fileName,
          type: "audio",
          url: audioUrl,
          size: audioBlob.size,
          blob: audioBlob,
          file: audioFile,
        });

        // إيقاف الميكروفون
        stream.getTracks().forEach((track) => track.stop());

        recordedChunksRef.current = []; // ✅ نظف بعد الاستخدام
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mic permission denied or error:", error);
      alert("Microphone access denied or not supported.");
    }
  };

  const hasContactInfo = (text: string): boolean => {
    if (!text) return false;

    const patterns = [
      /\b\d{7,15}\b/, // any phone-like number (7–15 digits)
      /\b[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}\b/, // email
      /(https?:\/\/[^\s]+|www\.[^\s]+)/i, // urls
      /\b(?:facebook|twitter|instagram|tiktok|snapchat|linkedin|wa\.me|whatsapp|telegram)\b/i, // social platforms
      /@[A-Za-z0-9_.-]{3,}/, // usernames like @username
    ];

    return patterns.some((pattern) => pattern.test(text));
  };

  const handleSendMessage = async () => {
    try {
      if (message.trim() || selectedFile) {
        let messageType = "text";

        // Check if message contains contact info
        if (message && hasContactInfo(message)) {
          toast.error("❌ غير مسموح بإرسال معلومات الاتصال!");
          setMessage("");
          return;
        }

        if (selectedFile) {
          const fileType = selectedFile.type;

          if (fileType.startsWith("image/") || fileType === "image") {
            messageType = "image";
          } else if (fileType === "pdf") {
            messageType = "pdf";
          } else if (
            fileType.startsWith("audio/") ||
            fileType === "audio" ||
            fileType === "audio/webm" ||
            fileType === "video/webm" // some browsers record audio as video/webm
          ) {
            messageType = "audio";
          } else {
            toast.error("❌ Attachment type not supported!");
            return;
          }
        }

        const formData = new FormData();
        formData.append("message_type", messageType);
        if (conversationId) formData.append("conversation_id", conversationId);
        if (userId) formData.append("sender_id", userId);
        if (userType) formData.append("sender_type", userType);
        if (receiverId) formData.append("receiver_id", receiverId);
        if (receiverType) formData.append("receiver_type", receiverType);
        if (selectedFile) formData.append("attachment", selectedFile?.file);
        if (message) formData.append("message", message);

        const response = await instance.post(`/send-message`, formData);
        if (response.status === 201) {
          setSelectedFile(null);
          setMessage("");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("❌ Failed to send message!");
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  }, [error]);

  return (
    <div className="backdrop-blur bg-white/70 border-t border-gray-200 p-3">
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4"
          >
            <FilePreview
              file={selectedFile}
              onRemove={() => setSelectedFile(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Input Area */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full outline-none px-4 py-2 pr-12 bg-white/60 backdrop-blur border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm transition-colors"
            rows={1}
            style={{ maxHeight: "100px" }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,audio/*,.pdf"
            className="hidden"
          />

          {/* Attach File */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiPaperclip size={20} />
          </motion.button>

          {/* Record */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleRecord}
            className={`p-2 rounded-full transition-colors ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            <FiMic size={20} />
          </motion.button>

          {/* Send */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={!message.trim() && !selectedFile}
            className={`p-2 rounded-full transition-colors ${
              message.trim() || selectedFile
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiSend size={18} />
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm"
          >
            <div className="flex items-center gap-1 max-md:flex-col">
              <MdErrorOutline className="size-6" />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
