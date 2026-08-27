import { Socket } from "socket.io";
import checkRateLimit from "../middlewares/socket.rate.limit.middleware";
import { socketRateLimits } from "../config/socketRateLimits";

const rateLimitAck = (
  socket: Socket,
  event: string,
  ack: (response: unknown) => void,
) => {
  if (!checkRateLimit(socket, event, socketRateLimits)) {
    ack({
      success: false,
      status: 429,
      message: "RATE_LIMIT_EXCEEDED",
    });

    return false;
  }

  return true;
};

export default rateLimitAck;
