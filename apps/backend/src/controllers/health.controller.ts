import { Controller } from "../types/handlers";

import * as healthService from "../services/health.service";

export const live: Controller = async (req, res, next) => {
  res.status(200).json({ status: "ok" });
};

export const ready: Controller = async (req, res, next) => {
  const result = await healthService.checkReadiness();

  if (result.status === "not_ready") {
    res.status(503).json({ result });
    return;
  }

  res.status(200).json({ result });
};
