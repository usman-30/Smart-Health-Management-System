import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaRobot, FaTimes } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const ChatBot = () => {
  const { backendUrl } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Typing Effect (SAFE)
  const typeMessage = (text) => {
    if (!text) return;

    let index = 0;
    let tempText = "";

    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);
        return;
      }

      tempText += text[index];
      index++;

      setMessages((prev) => {
        const updated = [...prev];
        if (!updated.length) return prev;

        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: tempText,
        };

        return updated;
      });
    }, 20);
  };

  //   Initial message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: "bot", text: "" }]);

      setTimeout(() => {
        typeMessage("Hello 👋 Write your symptoms...");
      }, 100);
    }
  }, [isOpen]);

  //   SEND MESSAGE WITH CONTEXT
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };

    // Convert UI → API format
    const history = [
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: input },
    ];

    // Limit history (important)
    const trimmedHistory = history.slice(-8);

    // Update UI
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/chat`, {
        messages: trimmedHistory,
      });

      const reply =
        res.data?.reply || "Sorry, I didn't understand that.";

      // Add empty bot message
      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

      setTimeout(() => {
        typeMessage(reply);
      }, 100);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error getting response ❌" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer z-[9999]"
        >
          <FaRobot size={20} />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 w-80 shadow-2xl rounded-2xl bg-white flex flex-col z-[9999]">

          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-2xl flex justify-between items-center">
            <span className="font-semibold">Hospital Assistant 🤖</span>
            <FaTimes onClick={() => setIsOpen(false)} className="cursor-pointer" />
          </div>

          {/* Chat Body */}
          <div className="h-80 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-gray-500 text-sm">Typing...</div>
            )}
          </div>

          {/* Input */}
          <div className="flex border-t">
            <input
              type="text"
              className="flex-1 p-2 outline-none"
              placeholder="Write your symptoms..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;