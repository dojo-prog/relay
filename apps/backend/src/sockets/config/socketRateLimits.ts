export const socketRateLimits = {
  // Conversations
  "conversation:create": {
    maxEvents: 5,
    windowMs: 10_000,
  },

  "conversation:update": {
    maxEvents: 10,
    windowMs: 10_000,
  },

  "conversation:delete": {
    maxEvents: 5,
    windowMs: 10_000,
  },

  "conversation:add_member": {
    maxEvents: 10,
    windowMs: 10_000,
  },

  "conversation:remove_member": {
    maxEvents: 10,
    windowMs: 10_000,
  },

  // Messages
  "message:send": {
    maxEvents: 20,
    windowMs: 10_000,
  },

  "message:update": {
    maxEvents: 10,
    windowMs: 10_000,
  },

  "message:delete": {
    maxEvents: 10,
    windowMs: 10_000,
  },
} as const;
