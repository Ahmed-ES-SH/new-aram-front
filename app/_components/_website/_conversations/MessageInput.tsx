"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import FilePreview from "./FilePreview";
import { FiMic, FiPaperclip, FiSend, FiSmile } from "react-icons/fi";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

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
      setRecordingTime(0);
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

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  }, [error]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 z-10">
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <FilePreview
              file={selectedFile}
              onRemove={() => setSelectedFile(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 flex items-center justify-center gap-3 py-3 bg-red-50 rounded-2xl border border-red-100"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
              <span className="text-red-600 font-medium text-sm">
                Recording...
              </span>
            </div>
            <span className="text-red-500 font-mono text-lg">
              {formatRecordingTime(recordingTime)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`flex items-end gap-3 p-2 rounded-2xl transition-all duration-300 ${
          isFocused ? "bg-white shadow-lg ring-2 ring-primary/20" : "bg-gray-50"
        }`}
      >
        {/* Input Area */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-transparent border-none outline-none resize-none text-sm text-gray-700 placeholder-gray-400"
            rows={1}
            style={{ maxHeight: "120px" }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 pb-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,audio/*,.pdf"
            className="hidden"
          />

          {/* Attach File */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="p-2.5 text-gray-400 hover:text-primary rounded-xl hover:bg-primary/10 transition-all duration-200"
          >
            <FiPaperclip size={20} />
          </motion.button>

          {/* Record */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRecord}
            type="button"
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isRecording
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : "text-gray-400 hover:text-primary hover:bg-primary/10"
            }`}
          >
            <FiMic size={20} />
          </motion.button>

          {/* Send */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!message.trim() && !selectedFile}
            type="button"
            className={`p-3 rounded-xl transition-all duration-300 ${
              message.trim() || selectedFile
                ? "bg-linear-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiSend size={18} />
          </motion.button>
        </div>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-5 py-3 rounded-2xl shadow-xl z-50 text-sm"
          >
            <div className="flex items-center gap-2">
              <MdErrorOutline className="size-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
