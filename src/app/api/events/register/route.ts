import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email || !supabaseAdmin) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { eventId } = await req.json();
    if (!eventId) return NextResponse.json({ ok: false, message: "Missing Event ID" }, { status: 400 });

    // 1. Get User ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) throw new Error("User not found");

    // 2. Check Event Capacity
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('max_participants, event_registrations(count)')
      .eq('id', eventId)
      .single();

    if (eventError || !event) throw new Error("Event not found");

    const currentCount = event.event_registrations?.[0]?.count || 0;
    if (currentCount >= event.max_participants) {
      return NextResponse.json({ ok: false, message: "Event is already full" }, { status: 400 });
    }

    // 3. Register User
    const { error: regError } = await supabaseAdmin
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: user.id,
        status: 'REGISTERED'
      });

    if (regError) {
      if (regError.code === '23505') {
        return NextResponse.json({ ok: false, message: "You are already registered for this event" }, { status: 409 });
      }
      throw regError;
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Event Registration Error:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = (session.user as any).id;

    // Fetch all upcoming events with registration status for this user
    const { data: events, error } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        event_registrations ( count ),
        user_registration: event_registrations ( id )
      `)
      .eq('user_registration.user_id', userId)
      .order('date', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ ok: true, events });
  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
