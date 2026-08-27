import AppError from "../../utils/AppError";
import { Ack, AckFailure } from "../types/ack";

const handleError = (error: unknown, ack: Ack) => {
  if (error instanceof AppError) {
    const payload: AckFailure = {
      success: false,
      message: error.message,
    };

    if (error.errors) {
      payload.errors = error.errors;
    }

    ack(payload);

    return;
  }

  if (error instanceof Error) {
    ack({
      success: false,
      message: error.message,
    });

    return;
  }

  ack({
    success: false,
    message: "Internal Server Error",
  });
};

export default handleError;
