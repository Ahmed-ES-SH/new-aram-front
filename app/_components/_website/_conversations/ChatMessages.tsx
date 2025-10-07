"use client";
import { AnimatePresence, motion } from "framer-motion";
import { MessageType } from "./ChatPage";
import { FiDownload } from "react-icons/fi";
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
            className="block max-w-[380px] text-sm"
          >
            {content}
          </p>
        );

      case "image":
        return file ? (
          <Img
            src={file}
            alt="Image message"
            className="2xl:w-80 xl:w-72 w-56 max-md:w-full rounded-lg shadow"
          />
        ) : (
          <div className="text-red-500 text-sm">Image not found</div>
        );

      case "audio":
        return file ? (
          <audio controls className="w-96 max-lg:w-full">
            <source src={file} />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <div className="text-red-500 text-sm">Audio not found</div>
        );

      case "pdf":
        return file ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <FaFilePdf className="text-red-500 text-2xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {file.split("/").pop()}
              </p>
              <p className="text-xs text-gray-500">PDF Document</p>
            </div>
            <a
              href={file}
              download
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Download"
            >
              <FiDownload className="text-gray-600" />
            </a>
          </motion.div>
        ) : (
          <div className="text-red-500 text-sm">PDF not found</div>
        );

      default:
        return (
          <p className="text-sm italic text-gray-500">Unsupported message</p>
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
      className="flex-1 overflow-y-auto hidden-scrollbar p-4 space-y-4"
    >
      {userId && (
        <AnimatePresence>
          {messages.map((message) => {
            const sender =
              message.sender_id == Number(userId) ? "user" : "other";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex  ${
                  sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`min-w-[140px] flex flex-col gap-3 px-4 py-2 rounded-2xl ${
                    message.message_type === "text"
                      ? sender === "user"
                        ? "bg-primary text-white"
                        : "bg-secondary/20 text-black"
                      : "bg-transparent text-black"
                  }`}
                >
                  {renderMessage(
                    message.message_type,
                    message.message,
                    message.attachment
                  )}
                  <p
                    className={`text-xs self-end w-fit ${
                      message.message_type === "text"
                        ? sender === "user"
                          ? "text-orange-100"
                          : "text-gray-500"
                        : "text-black/60"
                    }`}
                  >
                    {message.created_at && formatTime(message.created_at)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
