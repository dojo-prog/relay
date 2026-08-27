import { Controller } from "../types/handlers";
import * as conversationMemberService from "../services/conversation_member.service";
import { ConversationMemberQuerySchema } from "../schemas/conversation_members";

export const getConversationMembers: Controller = async (req, res, next) => {
  try {
    const data = await conversationMemberService.getConversationMembers(
      req.params.conversationId as string,
      req.user!.id,
      ConversationMemberQuerySchema.parse(req.query),
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addMember: Controller = async (req, res, next) => {
  try {
    const params = {
      userId: req.user!.id,
      conversationId: req.params.conversationId as string,
      memberId: req.params.userId as string,
    };

    const conversation_member =
      await conversationMemberService.addMember(params);

    res.status(201).json({
      success: true,
      message: "Member added",
      data: { conversation_member },
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember: Controller = async (req, res, next) => {
  try {
    const params = {
      userId: req.user!.id,
      conversationId: req.params.conversationId as string,
      memberId: req.params.userId as string,
    };

    const conversation_member =
      await conversationMemberService.removeMember(params);

    res.status(200).json({
      success: true,
      message: "Member removed",
      data: { conversation_member },
    });
  } catch (error) {
    next(error);
  }
};
