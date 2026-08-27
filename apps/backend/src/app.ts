import cookieParser from "cookie-parser";
import express from "express";
import errorMiddleware from "./middlewares/error.middleware";

import authRouter from "./routers/auth.routes";
import conversationRouter from "./routers/conversation.routes";
import conversationMemberRouter from "./routers/conversation_member.routes";
import messageRouter from "./routers/message.routes";
import notificationRouter from "./routers/notification.routes";

const app = express();

// Parsers
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/conversations", conversationMemberRouter);
app.use("/api/v1/", messageRouter);
app.use("/api/v1/notifications", notificationRouter);

// Error Handler
app.use(errorMiddleware);

export default app;
