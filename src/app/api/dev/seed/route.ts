import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  if (process.env.NODE_ENV !== "development" || !supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const adminEmail = "admin@inspiria.edu.in";
  const volunteerEmail = "volunteer@inspiria.edu.in";

  // Upsert Admin User
  const { data: adminUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', adminEmail)
    .single();

  let adminId = adminUser?.id;

  if (!adminUser) {
    const { data: newUser } = await supabaseAdmin
      .from('users')
      .insert({
        email: adminEmail,
        name: "Test Admin",
        role: "ADMIN",
        password: "admin123",
      })
      .select()
      .single();
    adminId = newUser?.id;
  } else {
    await supabaseAdmin
      .from('users')
      .update({ role: "ADMIN", password: "admin123", name: "Test Admin" })
      .eq('email', adminEmail);
  }

  if (adminId) {
    await supabaseAdmin
      .from('admins')
      .upsert({ user_id: adminId, role: 'Core Team' }, { onConflict: 'user_id' });
  }

  // Upsert Volunteer User
  const { data: volUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', volunteerEmail)
    .single();

  if (!volUser) {
    await supabaseAdmin
      .from('users')
      .insert({
        email: volunteerEmail,
        name: "Test Volunteer",
        role: "VOLUNTEER",
        password: "vol123",
      });
  } else {
    await supabaseAdmin
      .from('users')
      .update({ role: "VOLUNTEER", password: "vol123", name: "Test Volunteer" })
      .eq('email', volunteerEmail);
  }

  return NextResponse.json({ ok: true });
}
