"use client";
import { instance } from "@/app/_helpers/axios";
import { useState } from "react";
import LoadingSpin from "../../LoadingSpin";

interface ComposeNewsletterStepProps {
  selectedEmails: string[];
  onBack: () => void;
  onSuccess: () => void;
  newsletterId?: string | number | null; // Optional if needed
}

export default function ComposeNewsletterStep({
  selectedEmails,
  onBack,
  onSuccess,
  newsletterId,
}: ComposeNewsletterStepProps) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (loading)
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-4">
        <LoadingSpin />
        <p className="text-gray-500 animate-pulse">Sending newsletter...</p>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <form className="flex flex-col gap-4 h-full">
        {/* Summary Info */}
        <div className="bg-green-50 /20 p-3 rounded-md text-sm text-green-800  mb-2">
          Sending to <span className="font-bold">{selectedEmails.length}</span>{" "}
          recipients.
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700  mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Newsletter Subject"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700  mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your newsletter content here..."
            required
            className="w-full h-full min-h-[150px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none   -none"
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-between items-center mt-2 pt-2 border-t ">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-800  -200 transition"
          >
            &larr; Back to Selection
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition shadow-lg shadow-green-500/30"
          >
            Send Newsletter
          </button>
        </div>
      </form>
    </div>
  );
}
