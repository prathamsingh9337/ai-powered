import React, { useState, useEffect } from "react";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Function to call backend and save chat
  const sendChatToBackend = async (userMessage, botReply) => {
    try {
      await fetch("https://ai-powered-api-dgnb.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage, botReply }),
      });
    } catch (error) {
      console.error("❌ Failed to save chat", error);
    }
  };

  // Function to simulate AI response and handle submit
  const handleSend = async () => {
    const userMessage = input;
    const botReply = `This is a mock reply to: "${userMessage}"`; // Replace this with your real AI function

    setChatHistory((prev) => [...prev, { userMessage, botReply }]);
    setInput(""); // Clear input

    // Save to backend
    await sendChatToBackend(userMessage, botReply);
  };

  // Load previous chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat");
        const data = await res.json();
        setChatHistory(data);
      } catch (err) {
        console.error("❌ Failed to load chat history", err);
      }
    };

    fetchChatHistory();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Health Assistant 💬</h1>

      <div className="space-y-3">
        {chatHistory.map((chat, i) => (
          <div key={i}>
            <p><strong>You:</strong> {chat.userMessage}</p>
            <p><strong>AI:</strong> {chat.botReply}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-4 ml-2"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
