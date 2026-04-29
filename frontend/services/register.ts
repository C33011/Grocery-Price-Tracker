import { apiRequest } from "@/lib/api";
import type { ApiMessage } from "@/types/common";
import type { RegisterRequest } from "@/types/register";

export function register(payload: RegisterRequest): Promise<ApiMessage> {
  return apiRequest<ApiMessage>("/api/auth/register", {
    method: "POST",
    body: payload,
  });
}
