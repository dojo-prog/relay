import express from "express";

import * as healtController from "../controllers/health.controller";

const router = express.Router();

router.get("/live", healtController.live);

router.get("/ready", healtController.ready);

export default router;
