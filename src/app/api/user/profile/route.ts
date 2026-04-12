import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email || !supabaseAdmin) return NextResponse.json({ ok: false }, { status: 401 });
  
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', session.user.email)
    .single();

  if (!user) return NextResponse.json({ ok: false }, { status: 404 });

  // Recalculate stats based only on APPROVED check-ins
  const { data: approvedCheckins } = await supabaseAdmin
    .from('checkins')
    .select('hours')
    .eq('user_id', user.id)
    .eq('status', 'APPROVED');

  const realTotalHours = approvedCheckins?.reduce((sum, c) => sum + (c.hours || 0), 0) || 0;
  const realTotalCheckins = approvedCheckins?.length || 0;

  return NextResponse.json({ 
    ok: true, 
    user: {
      ...user,
      total_hours: realTotalHours,
      total_checkins: realTotalCheckins
    } 
  });
}
