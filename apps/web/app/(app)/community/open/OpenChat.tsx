"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ReportButton } from "../ReportButton";

type Message = {
  id: string;
  user_id: string;
  display_name: string;
  content: string;
  created_at: string;
};

export function OpenChat({ userId, displayName }: { userId: string; displayName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("community_messages")
      .select("id, user_id, display_name, content, created_at")
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data }) => {
        setMessages(data ?? []);
        setLoading(false);
      });

    const channel = supabase
      .channel("community_messages_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    const supabase = createClient();
    await supabase.from("community_messages").insert({
      user_id: userId,
      display_name: displayName,
      content: input.trim(),
    });
    setInput("");
    setSending(false);
  }

  return (
    <div className="mt-6 flex flex-col rounded-2xl border border-storm-700 bg-storm-800/40">
      <div className="flex h-96 flex-col gap-3 overflow-y-auto p-5">
        {loading && <p className="text-center text-sm text-fog-300">Loading…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-center text-sm text-fog-500">
            No messages yet — be the first to say something.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.user_id === userId ? "text-right" : "text-left"}>
            <div
              className={`inline-block max-w-[80%] rounded-xl px-4 py-2 text-left text-sm ${
                m.user_id === userId
                  ? "bg-beam-500/20 text-mist-100"
                  : "bg-storm-700/60 text-mist-100"
              }`}
            >
              <p className="text-xs font-semibold text-signal-400">{m.display_name}</p>
              <p className="mt-0.5 whitespace-pre-wrap">{m.content}</p>
            </div>
            {m.user_id !== userId && (
              <div className="mt-1">
                <ReportButton reportedUserId={m.user_id} contentType="message" contentId={m.id} />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-storm-700 p-4">
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something…"
          className="flex-1 rounded-full border border-storm-700 bg-storm-800/60 px-4 py-2 text-sm text-mist-100 placeholder:text-fog-500 focus:border-beam-500"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="relative z-40 rounded-full bg-[#E5A526] px-5 py-2 text-sm font-semibold text-[#080D16] transition hover:bg-[#F2B84B] disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
