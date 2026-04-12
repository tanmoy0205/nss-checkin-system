import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, message: "Server configuration error" }, { status: 500 });
  }

  const data = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', parsed.data.email)
    .single();

  if (!user || user.password !== parsed.data.password) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
