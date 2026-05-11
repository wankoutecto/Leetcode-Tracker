import { APIRequestContext } from "@playwright/test";

export async function loginViaApi(request: APIRequestContext) {
  const base = process.env.BASE_URL || "http://localhost:8080";
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASS || "password";
  const resp = await request.post(`${base}/api/auth/login`, {
    data: { username: user, password: pass },
  });
  if (resp.ok()) {
    const body = await resp.json();
    // body structure: { data: { token: '...' }, message: ... }
    const token =
      body?.data?.token || body?.token || (body?.data && body.data.token);
    return token;
  }
  return null;
}
