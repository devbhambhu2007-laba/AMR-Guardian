import { useState } from "react";
import { sendMessage } from "../utils/chatApi";

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm AMR Guardian. Ask me anything about antibiotics or antimicrobial resistance.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  async function ask(question) {
    if (!question.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setLoading(true);

    try {
      const result = await sendMessage(question);

       console.log("BACKEND RESPONSE:", result);

       setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to connect to backend.",
        },
      ]);
    }

    setLoading(false);
  }

  return {
    messages,
    loading,
    ask,
  };
}