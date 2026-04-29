import { apiRequest } from "@/lib/api";
import type { ApiMessage } from "@/types/common";
import type { LoginRequest, LoginResponse } from "@/types/login";

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function logout(): Promise<ApiMessage> {
  return apiRequest<ApiMessage>("/api/auth/logout", {
    method: "POST",
  });
}
