import { ConversationMemberWithRelations } from "@relay/shared";
import { PaginationResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface GetAllMemberIds {
  conversationId: string;
  userId: string;
}

export interface AddConversationMemberParams {
  userId: string;
  conversationId: string;
  memberId: string;
}

export interface RemoveConversationMemberParams {
  userId: string;
  conversationId: string;
  memberId: string;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface AddConversationMemberData {
  conversation_id: string;
  user_id: string;
}

// =======================================
// RESULT
// =======================================

export interface GetConversationMembersResult extends PaginationResult {
  conversation_members: ConversationMemberWithRelations[];
}
