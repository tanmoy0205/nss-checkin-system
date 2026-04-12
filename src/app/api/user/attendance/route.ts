import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email || !supabaseAdmin) return NextResponse.json({ ok: false }, { status: 401 });
  
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single();

  if (!user) return NextResponse.json({ ok: false }, { status: 404 });
  
  const { data: attendance } = await supabaseAdmin
    .from('checkins')
    .select('*, events(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ ok: true, attendance });
}
