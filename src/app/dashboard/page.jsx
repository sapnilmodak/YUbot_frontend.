"use client";

import React, { useState, useEffect } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState(null);

  useEffect(() => {
    // Extract the URL parameter from the query string
    const queryParams = new URLSearchParams(window.location.search);
    const urlParam = queryParams.get("url");
    if (urlParam) {
      setUrl(decodeURIComponent(urlParam));
    }
  }, []);

  useEffect(() => {
    // Update videoId whenever the url changes
    if (url) {
      const id = getYouTubeVideoId(url);
      setVideoId(id);
    }
    // Log the new URL
    console.log("New URL:", url);
  }, [url]);

  const handleSend = async () => {
    if (!input.trim()) return; // Prevent empty messages

    // Add user message to the chat
    setMessages((prevMessages) => [...prevMessages, { text: input, sender: "user" }]);

    try {
      let videoLink = url;

      if (!videoLink) {
        // Make a request to the search endpoint with the query
        const searchResponse = await fetch("https://backend-fd.onrender.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input }) // Ensure the query is included
        });

        if (!searchResponse.ok) {
          throw new Error("Failed to fetch video link");
        }

        const searchData = await searchResponse.json();
        videoLink = searchData.video_link;

        // Update chat with bot response if no video found
        if (!videoLink) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "No video found for the given query.", sender: "bot" }
          ]);
          return;
        }

        // Set the fetched video link as the URL
        setUrl(videoLink);
      }

      // Make a request to the summarize endpoint with the video link
      const summarizeResponse = await fetch("https://backend-fd.onrender.com/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: videoLink, // Use the video link obtained
          input: input // Send additional input
        })
      });

      if (!summarizeResponse.ok) {
        throw new Error("Failed to fetch summary");
      }

      const summarizeData = await summarizeResponse.json();
      const botResponse = summarizeData.summary || "Sorry, I couldn't summarize this video.";

      // Combine video link and summary in the bot response
      const combinedResponse = `Video Link: ${videoLink}\n\nSummary: ${botResponse}`;

      // Update chat with bot response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: combinedResponse, sender: "bot" }
      ]);

    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "⚠️ Error: Unable to fetch data.", sender: "bot" }
      ]);
    }

    setInput(""); // Clear input after sending
  };

  const getYouTubeVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "www.youtube.com" || urlObj.hostname === "youtube.com") {
        return urlObj.searchParams.get("v");
      } else if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">💬 YUBot</h1>
        
        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto border p-4 rounded-md bg-gray-100 mt-4 shadow-inner">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg text-sm transition-all duration-300 ${
                msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-gray-800 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Box & Send Button */}
        <div className="flex mt-4">
          <input
            type="text"
            className="flex-grow p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-all duration-300"
          >
            Send
          </button>
        </div>

        {/* YouTube Video Embed */}
        {videoId && (
          <div className="mt-6 w-full">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
