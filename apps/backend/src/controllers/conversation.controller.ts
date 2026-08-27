import { Controller } from "../types/handlers";
import * as conversationService from "../services/conversation.service";
import {
  ConversationQuerySchema,
  CreateConversationBody,
  UpdateConversationBody,
} from "@relay/shared";

export const getUserConversations: Controller = async (req, res, next) => {
  try {
    const data = await conversationService.getUserConversations(
      req.user!.id,
      ConversationQuerySchema.parse(req.query),
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createConversation: Controller = async (req, res, next) => {
  try {
    const { type, name, memberIds } = req.body as CreateConversationBody;

    const params = {
      userId: req.user!.id,
      type,
      name,
      memberIds,
    };

    const conversation = await conversationService.createConversation(params);

    res.status(201).json({
      success: true,
      message: "Conversation created",
      data: { conversation },
    });
  } catch (error) {
    next(error);
  }
};

export const getConversationById: Controller = async (req, res, next) => {
  try {
    const params = {
      userId: req.user!.id,
      conversationId: req.params.conversationId as string,
    };

    const conversation = await conversationService.getConversationById(params);

    res.status(200).json({ success: true, data: { conversation } });
  } catch (error) {
    next(error);
  }
};

export const updateConversation: Controller = async (req, res, next) => {
  try {
    const params = {
      userId: req.user!.id,
      conversationId: req.params.conversationId as string,
      modified: req.body as UpdateConversationBody,
    };

    const data = await conversationService.updateConversation(params);

    res
      .status(200)
      .json({ success: true, message: "Conversation updated", data });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation: Controller = async (req, res, next) => {
  try {
    const params = {
      userId: req.user!.id,
      conversationId: req.params.conversationId as string,
    };

    const conversation = await conversationService.deleteConversation(params);

    res.status(200).json({
      success: true,
      message: "Conversation deleted",
      data: { conversation },
    });
  } catch (error) {
    next(error);
  }
};

export const leaveConversation: Controller = async (req, res, next) => {
  try {
    const params = {
      userId: req.user!.id,
      conversationId: req.params.conversationId as string,
    };

    const conversation = await conversationService.leaveConversation(params);

    res.status(200).json({
      success: true,
      message: "Left conversation",
      data: { conversation },
    });
  } catch (error) {
    next(error);
  }
};

export const markConversationAsRead: Controller = async (req, res, next) => {
  try {
    await conversationService.markAsRead({
      userId: req.user!.id,
      conversationId: req.params.conversationId as string,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
