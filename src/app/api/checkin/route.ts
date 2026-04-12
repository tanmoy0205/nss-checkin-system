import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  eventName: z.string().min(1),
  activityType: z.string(),
  location: z.string(),
  hours: z.string(),
  notes: z.string().optional(),
  imageUrl: z.string().optional(),
  eventId: z.string().optional(), // Added support for explicit event ID
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email || !supabaseAdmin) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  
  try {
    const data = await req.json();
    const parsed = schema.safeParse(data);
    if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid data", errors: parsed.error.format() }, { status: 400 });
    
    // Get or Create Event based on ID (preferred) or name
    let eventId = parsed.data.eventId;
    let hoursGranted = 0;

    if (eventId) {
      const { data: event, error: eventError } = await supabaseAdmin
        .from('events')
        .select('id, hours_granted')
        .eq('id', eventId)
        .single();
      
      if (eventError || !event) throw new Error("Event not found");
      hoursGranted = event.hours_granted || 0;
    } else {
      let { data: event, error: eventError } = await supabaseAdmin
        .from('events')
        .select('id, hours_granted')
        .eq('title', parsed.data.eventName)
        .maybeSingle();

      if (eventError) {
        console.error("Event Fetch Error:", eventError);
        throw eventError;
      }

      if (!event) {
        console.log("Event not found, creating new one:", parsed.data.eventName);
        // Create a temporary event if it doesn't exist
        const { data: newEvent, error: createError } = await supabaseAdmin
          .from('events')
          .insert({
            title: parsed.data.eventName,
            description: parsed.data.notes || "Volunteer check-in",
            location: parsed.data.location,
            category: parsed.data.activityType,
            date: new Date().toISOString(),
            hours_granted: parseInt(parsed.data.hours) // Fallback to provided hours for new event creation
          })
          .select('id, hours_granted')
          .single();
        
        if (createError) {
          console.error("Event Creation Error:", createError);
          throw createError;
        }
        eventId = newEvent.id;
        hoursGranted = newEvent.hours_granted || 0;
      } else {
        eventId = event.id;
        hoursGranted = event.hours_granted || 0;
      }
    }

    // Get user ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      console.error("User Fetch Error:", userError);
      throw new Error("User not found");
    }
    
    // Check if already checked in for this event today
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('checkins')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingError) {
      console.error("Existing Check-in Error:", existingError);
      throw existingError;
    }

    if (existing) {
      return NextResponse.json({ ok: false, message: "You have already checked in for this event." }, { status: 409 });
    }
    
    // Insert check-in (Status defaults to 'PENDING')
    console.log("Inserting check-in for user:", user.id, "event:", eventId);
    const { error: checkinError } = await supabaseAdmin
      .from('checkins')
      .insert({ 
        user_id: user.id, 
        event_id: eventId, 
        hours: hoursGranted,
        image_url: parsed.data.imageUrl,
        notes: parsed.data.notes,
        status: 'PENDING'
      });

    if (checkinError) {
      console.error("Check-in Insert Error:", checkinError);
      throw checkinError;
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Check-in API error:", error);
    return NextResponse.json({ ok: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}
