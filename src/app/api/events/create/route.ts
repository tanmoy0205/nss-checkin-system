import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().min(1),
  eventDate: z.string().min(1),
  hoursGranted: z.number().min(0),
  maxParticipants: z.number().min(1),
  certificateLayoutUrl: z.string().optional(),
  category: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email || !supabaseAdmin) return NextResponse.json({ ok: false }, { status: 401 });
  
  const { data: current } = await supabaseAdmin
    .from('users')
    .select('id, role')
    .eq('email', session.user.email)
    .single();

  if (current?.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });
  
  const data = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ ok: false, errors: parsed.error.format() }, { status: 400 });
  
  const { data: event, error } = await supabaseAdmin
    .from('events')
    .insert({
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      date: new Date(parsed.data.eventDate).toISOString(),
      hours_granted: parsed.data.hoursGranted,
      max_participants: parsed.data.maxParticipants,
      certificate_layout_url: parsed.data.certificateLayoutUrl,
      category: parsed.data.category,
      created_by: current.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  
  return NextResponse.json({ ok: true, id: event.id });
}
