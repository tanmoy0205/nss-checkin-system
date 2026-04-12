import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email || !supabaseAdmin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ ok: false, message: "No file provided" }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `checkins/${fileName}`;

    // Convert File to Buffer for Supabase upload
    const buffer = await file.arrayBuffer();

    const { error: uploadError, data } = await supabaseAdmin.storage
      .from('checkin-photos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Admin Upload Error:", uploadError);
      return NextResponse.json({ ok: false, message: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('checkin-photos')
      .getPublicUrl(filePath);

    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ ok: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}
