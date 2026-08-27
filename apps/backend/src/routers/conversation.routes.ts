import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import {
  ConversationParamsSchema,
  ConversationQuerySchema,
  CreateConversationBodySchema,
  UpdateConversationBodySchema,
} from "../schemas/conversations";
import {
  createConversation,
  deleteConversation,
  getConversationById,
  getUserConversations,
  leaveConversation,
  markConversationAsRead,
  updateConversation,
} from "../controllers/conversation.controller";

const router = express.Router();

router.use(protectRoute);

router
  .route("/")
  .get(validate({ query: ConversationQuerySchema }), getUserConversations)
  .post(validate({ body: CreateConversationBodySchema }), createConversation);

router
  .route("/:conversationId")
  .get(validate({ params: ConversationParamsSchema }), getConversationById)
  .patch(
    validate({
      params: ConversationParamsSchema,
      body: UpdateConversationBodySchema,
    }),
    updateConversation,
  )
  .delete(validate({ params: ConversationParamsSchema }), deleteConversation);

router.post(
  "/:conversationId/leave",
  validate({
    params: ConversationParamsSchema,
  }),
  leaveConversation,
);

router.post(
  "/:conversationId/read",
  validate({ params: ConversationParamsSchema }),
  markConversationAsRead,
);

export default router;
