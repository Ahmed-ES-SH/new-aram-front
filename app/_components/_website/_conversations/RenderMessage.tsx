import React from "react";
import { AiOutlineAudio } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { PiFilePdfLight } from "react-icons/pi";

export default function RenderMessage({
  messageType,
  message,
}: {
  messageType: string;
  message: string;
}) {
  switch (messageType) {
    case "text":
      return (
        <span className="truncate">
          {message && message.length > 20
            ? message?.slice(0, 20) + "..."
            : message}
        </span>
      );
    case "image":
      return (
        <span className="flex items-center gap-1 text-gray-600">
          <CiImageOn className="w-4 h-4" />
          <span>Image</span>
        </span>
      );
    case "audio":
      return (
        <span className="flex items-center gap-1 text-red-600">
          <AiOutlineAudio className="w-4 h-4" />
          <span>Audio</span>
        </span>
      );
    case "pdf":
      return (
        <span className="flex items-center gap-1 text-green-500">
          <PiFilePdfLight className="w-5 h-5" />
          <span>PDF</span>
        </span>
      );
    default:
      return <span>Unsupported message</span>;
  }
}
