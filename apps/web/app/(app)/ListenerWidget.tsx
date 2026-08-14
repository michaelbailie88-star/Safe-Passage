"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  resources?: { label: string; href: string }[];
};

export function ListenerWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/listener/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setIsSending(false);
        return;
      }

      setSessionId(data.sessionId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.responseText, resources: data.resources },
      ]);
    } catch {
      setError("Couldn't reach The Listener. Check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-storm-700 bg-storm-900 shadow-2xl sm:right-6">
          <div className="flex items-center justify-between border-b border-storm-700 bg-storm-800/60 px-4 py-3">
            <span className="font-display text-base italic text-mist-50">The Listener</span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="text-fog-300 transition hover:text-mist-100"
            >
              ✕
            </button>
          </div>

          <div className="border-b border-storm-700 bg-storm-800/30 px-4 py-2">
            <p className="text-[11px] leading-snug text-fog-500">
              The Listener isn&apos;t a therapist or a crisis line. It offers pre-written support and
              points you to real help. In an emergency, call 911 or go to your nearest ER.
            </p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <p className="mt-2 text-sm leading-relaxed text-fog-300">
                Say what&apos;s going on. There&apos;s no wrong way to start.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-beam-500 px-3 py-2 text-sm text-[#080D16]"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-storm-700 bg-storm-800/60 px-3 py-2 text-sm text-mist-100"
                  }
                >
                  <p className="leading-relaxed">{m.content}</p>
                  {m.resources && m.resources.length > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-storm-700 pt-2.5">
                      {m.resources.map((r) => (
                        <a
                          key={r.href}
                          href={r.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg border border-signal-500/40 bg-signal-500/10 px-2.5 py-1.5 text-xs font-medium text-signal-400 transition hover:bg-signal-500/20"
                        >
                          {r.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isSending && <p className="text-xs text-fog-500">The Listener is finding the right response…</p>}
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </div>

          <div className="border-t border-storm-700 bg-storm-800/40 p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type here…"
                rows={1}
                maxLength={2000}
                className="max-h-24 flex-1 resize-none rounded-xl border border-storm-700 bg-storm-900/60 px-3 py-2 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={isSending || !input.trim()}
                className="shrink-0 rounded-full bg-beam-500 px-4 py-2 text-sm font-semibold text-[#080D16] transition hover:bg-beam-400 disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close The Listener" : "Open The Listener"}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-beam-500 text-[#080D16] shadow-lg transition hover:bg-beam-400 sm:right-6"
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path
              d="M12 3C7.03 3 3 6.58 3 11c0 2.39 1.19 4.53 3.06 5.98-.1.99-.5 2.36-1.56 3.52a.5.5 0 00.42.85c2.06-.31 3.63-1.2 4.63-1.94A10.8 10.8 0 0012 19c4.97 0 9-3.58 9-8s-4.03-8-9-8z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    </>
  );
}
