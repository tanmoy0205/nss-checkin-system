import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN" || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('id');

  try {
    if (eventId) {
      // Fetch specific event details with participant analytics
      const { data: event, error: eventError } = await supabaseAdmin
        .from('events')
        .select(`
          *,
          event_registrations (
            id,
            status,
            created_at,
            users (
              id,
              name,
              email,
              gender,
              caste,
              profile_picture
            )
          )
        `)
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      return NextResponse.json({ ok: true, event });
    }

    // Fetch all events for the list
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        event_registrations ( count )
      `)
      .order('date', { ascending: false });

    if (eventsError) throw eventsError;

    return NextResponse.json({ ok: true, events });
  } catch (error: any) {
    console.error("Admin Events API Error:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN" || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ ok: false, message: "Missing Event ID" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('events')
      .update({
        title: updates.title,
        description: updates.description,
        location: updates.location,
        date: updates.eventDate ? new Date(updates.eventDate).toISOString() : undefined,
        hours_granted: updates.hoursGranted,
        max_participants: updates.maxParticipants,
        certificate_layout_url: updates.certificateLayoutUrl,
        category: updates.category,
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Admin Event Update Error:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN" || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ ok: false, message: "Missing Event ID" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Admin Event Delete Error:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
