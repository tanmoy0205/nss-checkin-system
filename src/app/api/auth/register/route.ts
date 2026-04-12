import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  course: z.string().optional(),
  semester: z.string().optional(),
  gender: z.string().min(1),
});

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, message: "Server configuration error" }, { status: 500 });
  }

  const data = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid data", errors: parsed.error.format() }, { status: 400 });
  }
  
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', parsed.data.email)
    .single();

  if (existing) return NextResponse.json({ ok: false, message: "Email already registered" }, { status: 409 });
  
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      phone: parsed.data.phone,
      course: parsed.data.course,
      semester: parsed.data.semester,
      gender: parsed.data.gender,
      role: "VOLUNTEER",
      provider: 'credentials',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  
  return NextResponse.json({ ok: true, id: user.id });
}
