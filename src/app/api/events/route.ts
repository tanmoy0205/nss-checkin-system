import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !supabaseAdmin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('id');

  if (!eventId) {
    return NextResponse.json({ ok: false, message: "Missing Event ID" }, { status: 400 });
  }

  try {
    // Fetch basic event details (accessible to volunteers for auto-fill)
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select(`
        id,
        title,
        category,
        location,
        hours_granted,
        date
      `)
      .eq('id', eventId)
      .single();

    if (eventError) {
      console.error("Event Fetch Error:", eventError);
      return NextResponse.json({ ok: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, event });
  } catch (error: any) {
    console.error("Public Event API Error:", error);
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 });
  }
}
