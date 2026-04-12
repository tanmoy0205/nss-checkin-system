import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  id: z.string().min(1),
});

export async function DELETE(req: Request) {
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
  
  await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', parsed.data.id);

  return NextResponse.json({ ok: true });
}
