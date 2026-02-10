import { useState } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import axios from "../api/axios";

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi 👋 I'm Hospify Assistant. How can I help you book an appointment?" }
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { from: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setTyping(true);

        try {
            const res = await axios.post("/chatbot/message", { message: userMsg.text });

            setTimeout(() => {
                setMessages((prev) => [...prev, { from: "bot", text: res.data.reply }]);
                setTyping(false);
            }, 800);
        } catch (error) {
            setTimeout(() => {
                setMessages((prev) => [...prev, { from: "bot", text: "Sorry, I'm having trouble connecting. Please try again." }]);
                setTyping(false);
            }, 800);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 hover:shadow-blue-500/50"
            >
                {open ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Panel */}
            {open && (
                <div className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-slideUp">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-5 font-semibold flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-lg p-2 rounded-xl">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <div className="font-bold">Hospify Assistant</div>
                            <div className="text-xs text-blue-100">Online • Ready to help</div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-96 bg-gradient-to-b from-gray-50 to-white">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs px-5 py-3 rounded-2xl shadow-md ${msg.from === "user"
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm"
                                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {typing && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 px-5 py-3 rounded-2xl shadow-md border border-gray-200">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 flex gap-2 border-t border-gray-200 bg-white">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
        </>
    );
}
