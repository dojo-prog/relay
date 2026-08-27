// socket/middleware/socketRateLimiter.ts

import { Socket } from "socket.io";

type RateLimitConfig = {
  maxEvents: number;
  windowMs: number;
};

const socketRateLimits = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

// TODO apply redis for production

const checkRateLimit = (
  socket: Socket,
  event: string,
  limits: Record<string, RateLimitConfig>,
): boolean => {
  const config = limits[event];

  if (!config) return true;

  const { maxEvents, windowMs } = config;

  const key = `${socket.user.id}:${event}`;
  const now = Date.now();

  const record = socketRateLimits.get(key);

  // First request or window expired
  if (!record || now >= record.resetAt) {
    socketRateLimits.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return true;
  }

  // Limit exceeded
  if (record.count >= maxEvents) {
    return false;
  }

  record.count++;

  return true;
};

export default checkRateLimit;
