// =======================================
// RESULT
// =======================================

export type ReadinessResult = {
  status: "ready" | "not_ready";
  checks: {
    database: "up" | "down";
  };
};
