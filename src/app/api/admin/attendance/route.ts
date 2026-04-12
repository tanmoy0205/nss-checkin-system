import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN" || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    // Parallelize queries to improve performance and stability
    const [
      { data: pending, error: pendingError },
      { data: recent, error: recentError },
      { count: approvedTodayCount }
    ] = await Promise.all([
      // 1. Fetch PENDING check-ins
      supabaseAdmin
        .from('checkins')
        .select(`
          *,
          users ( name, email, profile_picture ),
          events ( title, location )
        `)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false }),

      // 2. Fetch RECENT check-ins
      supabaseAdmin
        .from('checkins')
        .select(`
          *,
          users ( name, email, profile_picture ),
          events ( title, location )
        `)
        .neq('status', 'PENDING')
        .order('created_at', { ascending: false })
        .limit(10),

      // 3. Count APPROVED check-ins today
      supabaseAdmin
        .from('checkins')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'APPROVED')
        .gte('created_at', new Date().toISOString().split('T')[0])
    ]);

    if (pendingError || recentError) throw pendingError || recentError;

    return NextResponse.json({ 
      ok: true, 
      pending: pending || [],
      recent: recent || [],
      approvedTodayCount: approvedTodayCount || 0
    });
  } catch (error) {
    console.error("Admin Attendance API Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
