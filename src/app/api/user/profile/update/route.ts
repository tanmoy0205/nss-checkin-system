import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  phone: z.string().optional(),
  course: z.string().optional(),
  semester: z.string().optional(),
  gender: z.string().optional(),
  caste: z.string().optional(),
  hobbies: z.string().optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email || !supabaseAdmin) return NextResponse.json({ ok: false }, { status: 401 });
  
  const data = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      phone: parsed.data.phone,
      course: parsed.data.course,
      semester: parsed.data.semester,
      gender: parsed.data.gender,
      caste: parsed.data.caste,
      hobbies: parsed.data.hobbies,
    })
    .eq('email', session.user.email);

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  
  return NextResponse.json({ ok: true });
}
