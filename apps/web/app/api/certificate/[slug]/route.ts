import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import { getProgram } from "@/lib/courses";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const program = getProgram(params.slug);
    if (!program) {
      return NextResponse.json({ error: "Unknown program" }, { status: 404 });
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { data: progress } = await supabase
      .from("program_progress")
      .select("week_number, completed_at")
      .eq("user_id", user.id)
      .eq("program_slug", program.slug);

    const completedWeeks = new Set((progress ?? []).map((r) => r.week_number));
    if (completedWeeks.size < 8) {
      return NextResponse.json(
        { error: "Program not yet completed" },
        { status: 403 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    const recipientName = profile?.full_name || profile?.email || "Safe Passage Member";

    const completionDate = (progress ?? [])
      .map((r) => new Date(r.completed_at))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    const formattedDate = (completionDate ?? new Date()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // --- Build the PDF ---
    const NAVY = rgb(11 / 255, 18 / 255, 32 / 255);
    const GOLD = rgb(229 / 255, 165 / 255, 38 / 255);
    const GOLD_LIGHT = rgb(242 / 255, 184 / 255, 75 / 255);
    const MIST = rgb(233 / 255, 238 / 255, 244 / 255);
    const FOG = rgb(141 / 255, 160 / 255, 181 / 255);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([792, 612]); // landscape letter
    const { width, height } = page.getSize();

    const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const timesBoldItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
    const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawRectangle({ x: 0, y: 0, width, height, color: NAVY });

    // borders
    page.drawRectangle({
      x: 28,
      y: 28,
      width: width - 56,
      height: height - 56,
      borderColor: GOLD,
      borderWidth: 2,
    });
    page.drawRectangle({
      x: 36,
      y: 36,
      width: width - 72,
      height: height - 72,
      borderColor: GOLD_LIGHT,
      borderWidth: 0.75,
    });

    function centered(text: string, y: number, font: typeof timesBold, size: number, color = MIST) {
      const textWidth = font.widthOfTextAtSize(text, size);
      page.drawText(text, { x: (width - textWidth) / 2, y, size, font, color });
    }

    // logo
    try {
      const logoPath = path.join(process.cwd(), "public", "logo.png");
      const logoBytes = await readFile(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoSize = 78;
      page.drawImage(logoImage, {
        x: width / 2 - logoSize / 2,
        y: height - 118,
        width: logoSize,
        height: logoSize,
      });
    } catch {
      // logo missing shouldn't block certificate issuance
    }

    const logoBottomY = height - 118;

    centered("SAFE PASSAGE", logoBottomY - 18, timesBold, 15);
    centered("Certificate of Completion", logoBottomY - 55, timesBoldItalic, 28, GOLD_LIGHT);
    centered("THIS CERTIFIES THAT", logoBottomY - 90, helvetica, 12, FOG);
    centered(recipientName, logoBottomY - 130, timesBoldItalic, 34);

    const lineY = logoBottomY - 140;
    page.drawLine({
      start: { x: width / 2 - 130, y: lineY },
      end: { x: width / 2 + 130, y: lineY },
      thickness: 1,
      color: GOLD,
    });

    centered("has successfully completed the Safe Passage program", logoBottomY - 168, helvetica, 12, FOG);
    centered(program.name.toUpperCase(), logoBottomY - 196, timesBold, 20, GOLD);
    centered(`Completed ${formattedDate}`, logoBottomY - 222, helvetica, 11, FOG);

    const fy = logoBottomY - 258;
    page.drawLine({ start: { x: width / 2 - 90, y: fy }, end: { x: width / 2 - 20, y: fy }, thickness: 0.75, color: GOLD });
    page.drawLine({ start: { x: width / 2 + 20, y: fy }, end: { x: width / 2 + 90, y: fy }, thickness: 0.75, color: GOLD });
    page.drawCircle({ x: width / 2, y: fy, size: 3, color: GOLD });

    centered("\u201cThe comeback is always greater than the setback.\u201d", fy - 55, timesItalic, 15);
    centered("safepassage.com  \u00b7  The Lighthouse for Men Navigating Life's Storms", fy - 77, helvetica, 9, FOG);

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="safe-passage-${program.slug}-certificate.pdf"`,
      },
    });
  } catch (err) {
    console.error("Certificate generation error:", err);
    const message =
      err instanceof Error ? err.message : "Something went wrong generating the certificate.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
