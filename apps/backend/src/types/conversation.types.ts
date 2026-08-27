import {
  Conversation,
  ConversationType,
  ConversationWithRelations,
} from "@relay/shared";
import { PaginationResult, UpdateResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface CreateConversationParams {
  userId: string;
  type: ConversationType;
  name?: string | null;
  memberIds?: string[];
}

export interface GetConversationParams {
  userId: string;
  conversationId: string;
}

export interface UpdateConversationParams {
  userId: string;
  conversationId: string;
  modified: Partial<Conversation>;
}

export interface DeleteConversationParams {
  userId: string;
  conversationId: string;
}

export interface LeaveConversationParams {
  userId: string;
  conversationId: string;
}

export interface GetLatestMessageParams {
  userId: string;
  conversationId: string;
}

export interface GetUnreadCountParams {
  conversationId: string;
  userId: string;
}

export interface MarkAsReadParams {
  conversationId: string;
  userId: string;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateConversationData {
  type: ConversationType;
  name?: string | null;
  created_by: string;
}

// =======================================
// RESULT
// =======================================

export interface GetConversationsResult extends PaginationResult {
  conversations: ConversationWithRelations[];
}

export interface UpdateConversationResult extends UpdateResult<Conversation> {
  conversation: ConversationWithRelations;
}
