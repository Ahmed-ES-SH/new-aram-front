"use client";
import { AnimatePresence, motion } from "framer-motion";
import { MessageType } from "./ChatPage";
import { FiDownload, FiCheck, FiCheckCircle } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { useSearchParams } from "next/navigation";
import { FaFilePdf } from "react-icons/fa";
import Img from "../_global/Img";
import { formatTime } from "@/app/_helpers/helpers";

interface props {
  messages: MessageType[] | null;
}

export default function ChatMessages({ messages: initialMessages }: props) {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const userId = searchParams.get("userId");

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<MessageType[]>(
    initialMessages as MessageType[]
  );

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`conversation.${conversationId}`);

    channel.bind("MessageSent", (data: MessageType) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [conversationId]);

  const renderMessage = (message_type, content, file) => {
    switch (message_type) {
      case "text":
        return (
          <p
            style={{ overflowWrap: "anywhere" }}
            className="block max-w-[380px] text-sm leading-relaxed"
          >
            {content}
          </p>
        );

      case "image":
        return file ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="overflow-hidden rounded-2xl shadow-lg"
          >
            <Img
              src={file}
              alt="Image message"
              className="2xl:w-80 xl:w-72 w-56 max-md:w-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="text-red-400 text-sm bg-red-50 px-3 py-2 rounded-lg">
            Image not found
          </div>
        );

      case "audio":
        return file ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 shadow-sm">
            <audio controls className="w-80 max-lg:w-full">
              <source src={file} />
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : (
          <div className="text-red-400 text-sm bg-red-50 px-3 py-2 rounded-lg">
            Audio not found
          </div>
        );

      case "pdf":
        return file ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-md min-w-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <FaFilePdf className="text-red-500 text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {file.split("/").pop()}
              </p>
              <p className="text-xs text-gray-500">PDF Document</p>
            </div>
            <a
              href={file}
              download
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              title="Download"
            >
              <FiDownload className="text-gray-600 size-5" />
            </a>
          </motion.div>
        ) : (
          <div className="text-red-400 text-sm bg-red-50 px-3 py-2 rounded-lg">
            PDF not found
          </div>
        );

      default:
        return (
          <p className="text-sm italic text-gray-400">Unsupported message</p>
        );
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto hidden-scrollbar px-4 py-6 space-y-4"
    >
      {userId && (
        <AnimatePresence>
          {messages.map((message, index) => {
            const sender =
              message.sender_id == Number(userId) ? "user" : "other";
            const isUser = sender === "user";
            const showAvatar =
              index === 0 ||
              messages[index - 1]?.sender_id !== message.sender_id;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {/* Message bubble */}
                <div
                  className={`relative max-w-[70%] ${
                    message.message_type === "text"
                      ? `px-4 py-3 shadow-md ${
                          isUser
                            ? "bg-gradient-to-br from-primary to-primary/90 text-white rounded-2xl rounded-br-md"
                            : "bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-100"
                        }`
                      : "bg-transparent"
                  }`}
                >
                  {/* Message content */}
                  {renderMessage(
                    message.message_type,
                    message.message,
                    message.attachment
                  )}

                  {/* Timestamp and read status */}
                  <div
                    className={`flex items-center gap-1.5 mt-2 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span
                      className={`text-[10px] ${
                        message.message_type === "text"
                          ? isUser
                            ? "text-white/70"
                            : "text-gray-400"
                          : "text-gray-400"
                      }`}
                    >
                      {message.created_at && formatTime(message.created_at)}
                    </span>
                    {isUser && (
                      <span
                        className={`${
                          message.is_read ? "text-white" : "text-white/50"
                        }`}
                      >
                        {message.is_read ? (
                          <FiCheckCircle className="size-3" />
                        ) : (
                          <FiCheck className="size-3" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Bubble tail for text messages */}
                  {message.message_type === "text" && (
                    <div
                      className={`absolute bottom-0 w-4 h-4 ${
                        isUser
                          ? "right-0 translate-x-1/2 bg-gradient-to-br from-primary to-primary/90"
                          : "left-0 -translate-x-1/2 bg-white border-l border-b border-gray-100"
                      }`}
                      style={{
                        clipPath: isUser
                          ? "polygon(0 0, 0% 100%, 100% 100%)"
                          : "polygon(100% 0, 0% 100%, 100% 100%)",
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
