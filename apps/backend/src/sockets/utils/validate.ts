import { ZodType } from "zod";
import AppError from "../../utils/AppError";

const validate = <T>(schema: ZodType<T>, data: Record<string, unknown>) => {
  const result = schema.safeParse(data);

  if (result.error) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const firstError = result.error.issues[0];

    throw new AppError(400, firstError.message, fieldErrors);
  }

  return result.data;
};

export default validate;
