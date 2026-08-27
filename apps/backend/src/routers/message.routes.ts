import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import validate from "../middlewares/validation.middleware";
import { ConversationParamsSchema } from "../schemas/conversations";
import {
  deleteMessage,
  getConversationMessages,
  updateMessage,
} from "../controllers/message.controller";
import {
  DeleteMessageBodySchema,
  MessageIdParamsSchema,
} from "../schemas/messages";
import { messageLimiter } from "../middlewares/rate.limit.middleware";

const router = express.Router();

router.use(protectRoute, messageLimiter);

router.get(
  "/conversations/:conversationId/messages",
  validate({ params: ConversationParamsSchema }),
  getConversationMessages,
);

router
  .route("/messages/:messageId")
  .patch(validate({ params: MessageIdParamsSchema }), updateMessage)
  .delete(
    validate({ params: MessageIdParamsSchema, body: DeleteMessageBodySchema }),
    deleteMessage,
  );

export default router;
