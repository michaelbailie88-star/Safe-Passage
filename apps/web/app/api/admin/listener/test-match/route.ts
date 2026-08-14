import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { matchMessage } from "@/lib/listener/match";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { data: requester } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!requester?.is_admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { messages } = (await request.json()) as { messages: string[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages must be a non-empty array" }, { status: 400 });
    }

    const results = [];
    for (const message of messages) {
      const result = await matchMessage(message);
      results.push({ message, result });
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Test match error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
