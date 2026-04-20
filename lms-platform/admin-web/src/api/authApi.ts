import { httpJson } from "./httpClient";
import type { ApiEnvelope, AuthResponseBody } from "./types";

export async function loginRequest(email: string, password: string): Promise<AuthResponseBody> {
  const env = await httpJson<ApiEnvelope<AuthResponseBody>>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!env.success || !env.data) {
    throw new Error(env.error?.message ?? "Sign-in failed");
  }
  return env.data;
}
