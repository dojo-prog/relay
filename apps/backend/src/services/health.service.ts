import { ReadinessResult } from "../types/health.types";

import * as healtRepository from "../repositories/health.repository";

export const checkReadiness = async (): Promise<ReadinessResult> => {
  const database = await healtRepository.database();

  if (!database) {
    return {
      status: "not_ready",
      checks: {
        database: "down",
      },
    };
  }

  return {
    status: "ready",
    checks: {
      database: "up",
    },
  };
};
