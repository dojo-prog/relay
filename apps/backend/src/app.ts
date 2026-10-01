import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware";
import ENV from "./config/env";

import authRouter from "./routers/auth.routes";
import userRouter from "./routers/user.routes";
import conversationRouter from "./routers/conversation.routes";
import conversationMemberRouter from "./routers/conversation_member.routes";
import messageRouter from "./routers/message.routes";
import notificationRouter from "./routers/notification.routes";
import healthRouter from "./routers/health.routes";

const app = express();

// Cors
const allowableOrigin = [ENV.CLIENT_URL, ENV.DEV_CLIENT_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowableOrigin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Parsers
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/conversations", conversationMemberRouter);
app.use("/api/v1/", messageRouter);
app.use("/api/v1/notifications", notificationRouter);

// Health Router
app.use("/health", healthRouter);

// Error Handler
app.use(errorMiddleware);

export default app;
