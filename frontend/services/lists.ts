import { apiRequest } from "@/lib/api";
import type { ApiMessage } from "@/types/common";
import type { CreateListRequest, ListsData } from "@/types/lists";

export function getLists(): Promise<ListsData> {
  return apiRequest<ListsData>("/api/lists");
}

export function createList(payload: CreateListRequest): Promise<ApiMessage> {
  return apiRequest<ApiMessage>("/api/lists", {
    method: "POST",
    body: payload,
  });
}

export function archiveList(listId: number): Promise<ApiMessage> {
  return apiRequest<ApiMessage>(`/api/lists/${listId}/archive`, {
    method: "POST",
  });
}
