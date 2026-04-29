import { apiRequest } from "@/lib/api";
import type { ApiMessage } from "@/types/common";
import type { CreatePostRequest, ForumData } from "@/types/forum";

export function getForum(): Promise<ForumData> {
  return apiRequest<ForumData>("/api/forum");
}

export function createPost(payload: CreatePostRequest): Promise<ApiMessage> {
  return apiRequest<ApiMessage>("/api/forum", {
    method: "POST",
    body: payload,
  });
}
