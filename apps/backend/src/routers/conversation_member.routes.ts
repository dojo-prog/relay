import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import { ConversationParamsSchema } from "../schemas/conversations";
import { UserIdParamsSchema } from "../schemas/users";
import { ConversationMemberQuerySchema } from "../schemas/conversation_members";
import {
  addMember,
  getConversationMembers,
  removeMember,
} from "../controllers/conversation_member.controller";

const router = express.Router();

router.use(protectRoute);

router.get(
  "/:conversationId/members",
  validate({
    params: ConversationParamsSchema,
    query: ConversationMemberQuerySchema,
  }),
  getConversationMembers,
);

router
  .route("/:conversationId/members/:userId")
  .post(
    validate({ params: ConversationParamsSchema.merge(UserIdParamsSchema) }),
    addMember,
  )
  .delete(
    validate({ params: ConversationParamsSchema.merge(UserIdParamsSchema) }),
    removeMember,
  );

export default router;
