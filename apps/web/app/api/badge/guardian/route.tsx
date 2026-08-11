import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Not signed in", { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, guardian_status")
      .eq("id", user.id)
      .single();

    if (!profile?.guardian_status) {
      return new Response("Guardian status not yet earned", { status: 403 });
    }

    const recipientName = profile.full_name || profile.email || "Safe Passage Member";

    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoBytes = await readFile(logoPath);
    const logoDataUri = `data:image/png;base64,${logoBytes.toString("base64")}`;

    const NAVY = "#0B1220";
    const NAVY_DEEP = "#080D16";
    const GOLD = "#E5A526";
    const GOLD_LIGHT = "#F2B84B";
    const GOLD_PALE = "#FFE09E";
    const MIST = "#E9EEF4";
    const FOG = "#8DA0B5";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1080px",
            height: "1080px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(circle at 50% 38%, ${NAVY} 0%, ${NAVY_DEEP} 70%)`,
          }}
        >
          {/* outer metallic ring — layered gradients simulate a brushed-gold sheen */}
          <div
            style={{
              display: "flex",
              width: "620px",
              height: "620px",
              borderRadius: "9999px",
              background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD} 22%, #8a5f16 45%, ${GOLD_LIGHT} 60%, ${GOLD} 78%, ${GOLD_PALE} 100%)`,
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 80px 10px rgba(229,165,38,0.35)",
            }}
          >
            {/* inner ring, slightly recessed */}
            <div
              style={{
                display: "flex",
                width: "560px",
                height: "560px",
                borderRadius: "9999px",
                background: `linear-gradient(135deg, #7a5312 0%, ${GOLD} 30%, ${GOLD_LIGHT} 50%, ${GOLD} 70%, #7a5312 100%)`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* medallion face */}
              <div
                style={{
                  display: "flex",
                  width: "500px",
                  height: "500px",
                  borderRadius: "9999px",
                  background: NAVY_DEEP,
                  alignItems: "center",
                  justifyContent: "center",
                  border: `4px solid ${GOLD}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoDataUri} width={420} height={420} style={{ borderRadius: "9999px" }} />
              </div>
            </div>
          </div>

          {/* ribbon banner */}
          <div
            style={{
              display: "flex",
              marginTop: "38px",
              padding: "16px 48px",
              borderRadius: "9999px",
              background: `linear-gradient(135deg, ${GOLD_PALE} 0%, ${GOLD} 50%, #8a5f16 100%)`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <span
              style={{
                fontSize: "34px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: NAVY_DEEP,
                textTransform: "uppercase",
              }}
            >
              A Guardian to the Still Lost
            </span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "28px",
              fontSize: "30px",
              color: MIST,
              fontStyle: "italic",
            }}
          >
            {recipientName}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "14px",
              fontSize: "18px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: FOG,
            }}
          >
            Safe Passage
          </div>
        </div>
      ),
      { width: 1080, height: 1080 }
    );
  } catch (err) {
    console.error("Guardian badge generation error:", err);
    return new Response("Something went wrong generating the badge.", { status: 500 });
  }
}
