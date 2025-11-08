import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const { data: admin, error } = await supabase
        .from("admins")
        .select("*")
        .eq("username", username)
        .single();

    if (error || !admin)
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    const valid = await bcrypt.compare(password, admin.password_hash);

    if (!valid)
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });

    const res = NextResponse.json({ message: "OK" });
    res.cookies.set("admin", "true", {
      httpOnly: false,
      sameSite: "strict",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
