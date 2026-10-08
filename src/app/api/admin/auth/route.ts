import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { setAdminSession, clearAdminSession } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const db = getDb();
    const user = db.prepare("SELECT * FROM admin_users WHERE username = ?").get(username) as any;

    if (!user || user.password_hash !== password) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    await setAdminSession(user.username);
    return NextResponse.json({ success: true, user: { username: user.username, name: user.name } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
