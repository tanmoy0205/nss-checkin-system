import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN" || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Parallelize all requests to reduce total connection time and handle potential timeouts
    const [
      { count: totalVolunteers },
      { count: recentVolunteers },
      { data: totalHoursData },
      { data: weeklyHoursData },
      { count: pendingVerifications },
      { count: activeEvents },
      { data: topVolunteers, error: topError },
      { data: recentEvents },
      { data: recentActivity }
    ] = await Promise.all([
      // 1. Total Volunteers
      supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'VOLUNTEER'),

      // 1b. Growth
      supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'VOLUNTEER')
        .gte('joined_at', thirtyDaysAgo.toISOString()),

      // 2. Total Hours
      supabaseAdmin
        .from('users')
        .select('total_hours')
        .eq('role', 'VOLUNTEER'),

      // 2b. Weekly Hours
      supabaseAdmin
        .from('checkins')
        .select('hours')
        .eq('status', 'APPROVED')
        .gte('created_at', sevenDaysAgo.toISOString()),

      // 3. Pending Verifications
      supabaseAdmin
        .from('checkins')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING'),

      // 4. Active Events Today
      supabaseAdmin
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('date', new Date().toISOString().split('T')[0]),

      // 5. Elite Squad (Top 3)
      supabaseAdmin
        .from('users')
        .select('id, name, profile_picture, total_hours')
        .eq('role', 'VOLUNTEER')
        .order('total_hours', { ascending: false })
        .limit(3),

      // 6. Recent Events (Latest 4)
      supabaseAdmin
        .from('events')
        .select('*')
        .order('date', { ascending: false })
        .limit(4),

      // 7. Recent Attendance (Latest 5)
      supabaseAdmin
        .from('checkins')
        .select(`
          id,
          created_at,
          hours,
          status,
          users ( name, profile_picture ),
          events ( title )
        `)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    if (topError) throw topError;

    const totalHours = totalHoursData?.reduce((acc, curr) => acc + (curr.total_hours || 0), 0) || 0;
    const weeklyHours = weeklyHoursData?.reduce((acc, curr) => acc + (curr.hours || 0), 0) || 0;

    return NextResponse.json({
      ok: true,
      stats: {
        totalVolunteers: totalVolunteers || 0,
        volunteerGrowth: recentVolunteers || 0,
        totalHours,
        weeklyHours,
        pendingVerifications: pendingVerifications || 0,
        activeCheckins: activeEvents || 0,
      },
      topVolunteers: topVolunteers || [],
      recentEvents: recentEvents || [],
      recentActivity: recentActivity || []
    });
  } catch (error) {
    console.error("Admin Dashboard API Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
