export function getAdminHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("subhadra_admin_token") || "" : "";
  return {
    "Content-Type": "application/json",
    "x-admin-token": token,
  };
}

export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("subhadra_admin_token") || "" : "";
  const existingHeaders = (options.headers as Record<string, string>) || {};
  return fetch(url, {
    ...options,
    headers: {
      ...existingHeaders,
      "x-admin-token": token,
    },
  });
}
