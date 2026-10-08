import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "store_admin_session";
export const SESSION_SECRET = "subhadra_ecom_admin_secret_key_2026";

export function createAdminToken(username: string): string {
  return `${username}:${Date.now()}:${SESSION_SECRET}`;
}

export function verifyAdminToken(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length === 3 && parts[2] === SESSION_SECRET) {
    return true;
  }
  return false;
}

export async function setAdminSession(username: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, createAdminToken(username), {
      httpOnly: false, // Allow client-side sync as well for maximum reliability
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch {
    // In contexts where cookies() is read-only
  }
}

export async function clearAdminSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
  } catch {}
}

export async function isAdminAuthenticated(req?: NextRequest | Request): Promise<boolean> {
  // 1. Check custom header (from client localStorage token)
  if (req) {
    const headerToken = req.headers.get("x-admin-token");
    if (headerToken && verifyAdminToken(headerToken)) {
      return true;
    }

    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      const bearerToken = authHeader.replace(/^Bearer\s+/i, "");
      if (verifyAdminToken(bearerToken)) {
        return true;
      }
    }

    // 2. Check NextRequest cookies
    if ("cookies" in req && req.cookies) {
      const cookieVal = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
      if (cookieVal && verifyAdminToken(cookieVal)) {
        return true;
      }
    }
  }

  // 3. Fallback to server cookies() API
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME);
    if (session?.value && verifyAdminToken(session.value)) {
      return true;
    }
  } catch {}

  return false;
}
