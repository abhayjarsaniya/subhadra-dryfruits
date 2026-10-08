import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "store_admin_session";
const SESSION_SECRET = "subhadra_ecom_admin_secret_key_2026";

export async function setAdminSession(username: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, `${username}:${Date.now()}:${SESSION_SECRET}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  if (!session?.value) return false;

  const parts = session.value.split(":");
  if (parts.length === 3 && parts[2] === SESSION_SECRET) {
    return true;
  }
  return false;
}
