import { apiRequest } from "@/lib/api";
import type { ApiMessage } from "@/types/common";
import type { AddItemRequest, CheckedRequest, ListDetailData } from "@/types/list-detail";

export function getListDetail(listId: number): Promise<ListDetailData> {
  return apiRequest<ListDetailData>(`/api/lists/${listId}`);
}

export function addListItem(listId: number, payload: AddItemRequest): Promise<ApiMessage> {
  return apiRequest<ApiMessage>(`/api/lists/${listId}/items`, {
    method: "POST",
    body: payload,
  });
}

export function removeListItem(listId: number, itemId: number): Promise<ApiMessage> {
  return apiRequest<ApiMessage>(`/api/lists/${listId}/items/${itemId}`, {
    method: "DELETE",
  });
}

export function updateListItemChecked(
  listId: number,
  itemId: number,
  payload: CheckedRequest,
): Promise<ApiMessage> {
  return apiRequest<ApiMessage>(`/api/lists/${listId}/items/${itemId}/checked`, {
    method: "PATCH",
    body: payload,
  });
}
