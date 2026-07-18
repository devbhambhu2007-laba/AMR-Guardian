import { useState } from "react";
import useChat from "../../hooks/useChat";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, loading, ask } = useChat();

  const handleSend = async () => {
    if (!input.trim()) return;

    const question = input;
    setInput("");

    await ask(question);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      await handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-blue-600 text-3xl text-white shadow-xl hover:bg-blue-700 transition"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="bg-blue-600 p-4 text-white">
            <h2 className="text-lg font-bold">
              🤖 AMR Guardian
            </h2>

            <p className="text-sm opacity-80">
              Antibiotic Awareness Assistant
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-black"
                  }`}
                >
                  {msg.content}

                  {msg.sources && (
                    <div className="mt-3 border-t pt-2 text-xs text-gray-600">
                      <strong>Sources</strong>

                      {msg.sources.map((source, i) => (
                        <div key={i}>
                          📄 {source.source.split("/").pop()} (Page {source.page})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="rounded-xl bg-white p-3 border">
                🤖 Thinking...
              </div>
            )}

          </div>

          {/* Input */}
          <div className="border-t bg-white p-3">

            <div className="flex gap-2">

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about antibiotics..."
                className="flex-1 rounded-xl border px-3 py-2 text-black bg-white outline-none focus:border-blue-500"
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                Send
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default Chatbot;