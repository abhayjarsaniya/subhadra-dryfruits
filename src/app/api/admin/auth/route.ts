import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  isAdminAuthenticated,
  setAdminSession,
  clearAdminSession,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated(req);
    return NextResponse.json({
      authenticated: isAuth,
      user: isAuth ? { username: "admin", name: "Store Administrator" } : null,
    });
  } catch (error: any) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    let isValid = false;
    let userRecord = {
      username: "admin",
      name: "Store Administrator",
      role: "admin",
    };

    // 1. Direct master credentials verification
    if (username.trim() === "admin" && password.trim() === "admin123") {
      isValid = true;
    } else {
      // 2. Database verification
      try {
        const db = getDb();
        const user = db.prepare("SELECT * FROM admin_users WHERE username = ?").get(username) as any;
        if (user && user.password_hash === password) {
          isValid = true;
          userRecord = {
            username: user.username,
            name: user.name || "Store Administrator",
            role: user.role || "admin",
          };
        }
      } catch (dbErr) {
        console.warn("DB user check fallback:", dbErr);
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const token = createAdminToken(userRecord.username);

    // Set server cookieStore
    await setAdminSession(userRecord.username);

    const response = NextResponse.json({
      success: true,
      token,
      user: userRecord,
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
  try {
    await clearAdminSession();
  } catch {}
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
