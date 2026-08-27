import { Controller } from "../types/handlers";
import * as messageService from "../services/message.service";
import { MessageQuerySchema, UpdateMessageBody } from "../schemas/messages";

export const getConversationMessages: Controller = async (req, res, next) => {
  try {
    const data = await messageService.getConversationMessages(
      req.user!.id,
      req.params.conversationId as string,
      MessageQuerySchema.parse(req.query),
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateMessage: Controller = async (req, res, next) => {
  try {
    const { conversationId, ...rest } = req.body;

    const params = {
      userId: req.user!.id,
      conversationId,
      messageId: req.params.messageId as string,
      modified: rest,
    };

    const data = await messageService.updateMessage(params);

    res.status(200).json({ success: true, message: "Message updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage: Controller = async (req, res, next) => {
  try {
    const params = {
      userId: req.user!.id,
      conversationId: req.body.conversationId,
      messageId: req.params.messageId as string,
    };

    const message = await messageService.deleteMessage(params);

    res
      .status(200)
      .json({ success: true, message: "Message deleted", data: { message } });
  } catch (error) {
    next(error);
  }
};
