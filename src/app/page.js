"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Krdebhay from "@/components/frontpage1";

export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to the dashboard with or without a URL
    router.push(`/dashboard?url=${encodeURIComponent(urlInput)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to YUbot</h1>
        <p className="text-center text-gray-600 mb-8">
          Discover amazing features and explore our services.
        </p>
        {/* <Krdebhay /> */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center mt-8">
          <input
            type="url"
            placeholder="Enter a URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <p className="text-sm text-gray-500 mb-4">
            If you don't have a URL and want to search for a video, just click "Go to Dashboard".
          </p>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
          >
            Go to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
