import { Controller } from "../types/handlers";
import * as userService from "../services/user.service";
import { UserQuerySchema } from "@relay/shared";

export const getUsers: Controller = async (req, res, next) => {
  try {
    const data = await userService.getUsers(
      req.user!.id,
      UserQuerySchema.parse(req.query),
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
