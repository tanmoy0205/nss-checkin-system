import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN" || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ ok: false, message: "Missing ID or invalid status" }, { status: 400 });
    }

    // Get the check-in details before updating
    const { data: checkin, error: fetchError } = await supabaseAdmin
      .from('checkins')
      .select('user_id, hours, status')
      .eq('id', id)
      .single();

    if (fetchError || !checkin) throw new Error("Check-in not found");

    // Only update stats if we are moving from PENDING to APPROVED
    if (status === 'APPROVED' && checkin.status !== 'APPROVED') {
      const { error: rpcError } = await supabaseAdmin.rpc('increment_user_stats', { 
        user_id_param: checkin.user_id, 
        hours_param: checkin.hours 
      });
      if (rpcError) console.error("Stats increment failed:", rpcError);
    } 
    // If we are moving from APPROVED to REJECTED or PENDING
    else if (status !== 'APPROVED' && checkin.status === 'APPROVED') {
      const { error: rpcError } = await supabaseAdmin.rpc('decrement_user_stats', {
        user_id_param: checkin.user_id,
        hours_param: checkin.hours
      });
      if (rpcError) console.error("Stats decrement failed:", rpcError);
    }

    const { error } = await supabaseAdmin
      .from('checkins')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin Verify API Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
