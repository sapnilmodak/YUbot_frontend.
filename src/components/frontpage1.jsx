"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Krdebhay() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const router = useRouter();

  const handleChatRedirect = () => {
    router.push(`/dashboard?url=${encodeURIComponent(youtubeUrl)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl bg-white shadow-lg rounded-2xl p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">🎥 YouTube Summarizer</h1>
        <p className="text-gray-600 mt-2">
          Paste a **YouTube URL** below, and we'll summarize its key points for you!
        </p>

        {/* YouTube URL Input */}
        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter YouTube URL..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </div>

        {/* Start Chatting Button */}
        <button
          onClick={handleChatRedirect}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Start Chatting 💬
        </button>
      </div>
    </div>
  );
}
