import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  isAdminAuthenticated,
  setAdminSession,
  clearAdminSession,
} from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  return NextResponse.json({
    authenticated: isAuth,
    user: isAuth ? { username: "admin", name: "Store Administrator" } : null,
  });
}

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

    const token = createAdminToken(user.username);

    // Also set server cookieStore
    await setAdminSession(user.username);

    const response = NextResponse.json({
      success: true,
      token,
      user: { username: user.username, name: user.name, role: user.role },
    });

    // Explicitly set cookie on NextResponse headers
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
