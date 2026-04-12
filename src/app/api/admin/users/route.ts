import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN" || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (userId) {
      // Fetch detailed info for a specific volunteer
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          checkins ( hours, status, created_at, events ( title ) )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return NextResponse.json({ ok: true, user });
    }

    // Fetch basic roster info for all volunteers with accurate hours from APPROVED checkins
    const { data: usersData, error } = await supabaseAdmin
      .from('users')
      .select(`
        id, name, email, phone, course, semester, gender, caste, hobbies, 
        profile_picture, role, joined_at,
        checkins ( hours, status )
      `)
      .eq('role', 'VOLUNTEER')
      .order('joined_at', { ascending: false });

    if (error) throw error;

    // Calculate accurate total_hours for each user based on APPROVED status
    const users = usersData.map((user: any) => {
      const total_hours = user.checkins
        ?.filter((c: any) => c.status === 'APPROVED')
        ?.reduce((acc: number, curr: any) => acc + (curr.hours || 0), 0) || 0;
      
      // Remove checkins from the response to keep it light
      const { checkins, ...userWithoutCheckins } = user;
      return { ...userWithoutCheckins, total_hours };
    });

    return NextResponse.json({ ok: true, users });
  } catch (error) {
    console.error("Admin Users API Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN" || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ ok: false, message: "Missing User ID" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Admin User Update Error:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN" || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ ok: false, message: "Missing User ID" }, { status: 400 });

    // 1. Delete checkins first (since no CASCADE in schema)
    const { error: checkinError } = await supabaseAdmin
      .from('checkins')
      .delete()
      .eq('user_id', id);

    if (checkinError) throw checkinError;

    // 2. Delete the user
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Admin User Delete Error:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
