import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  eventDate: z.string().optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email || !supabaseAdmin) return NextResponse.json({ ok: false }, { status: 401 });
  
  const { data: current } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('email', session.user.email)
    .single();

  if (current?.role !== "ADMIN") return NextResponse.json({ ok: false }, { status: 403 });
  
  const data = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  
  const update: Record<string, string | number | boolean | null> = {};
  if (parsed.data.title) update.title = parsed.data.title;
  if (parsed.data.description) update.description = parsed.data.description;
  if (parsed.data.location) update.location = parsed.data.location;
  if (parsed.data.eventDate) update.date = new Date(parsed.data.eventDate).toISOString();
  
  const { error } = await supabaseAdmin
    .from('events')
    .update(update)
    .eq('id', parsed.data.id);

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  
  return NextResponse.json({ ok: true });
}
