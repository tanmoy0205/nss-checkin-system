import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  if (!supabaseAdmin) return NextResponse.json({ ok: false }, { status: 500 });

  try {
    const { data: regs, error } = await supabaseAdmin
      .from('event_registrations')
      .select(`
        event_id,
        events (
          id,
          title,
          date,
          location,
          hours_granted,
          category
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const registrations = regs?.map(r => r.events).filter(Boolean) || [];

    return NextResponse.json({ ok: true, registrations });
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 });
  }
}
