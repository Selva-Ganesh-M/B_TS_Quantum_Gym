import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import LogMaintainer from "./middleware/LogMaintainer";
import log from "./utils/logger";
import { PORT } from "./config/ENV";
import { connectToDB } from "./db/connectToDb";
import { customErrorHandler } from "./middleware/customErrorHandler";
import { authRouter } from "./routes/auth";
import customReqLogger from "./utils/customRequestLogger";
import { eventsRouter } from "./routes/events.router";
import cookies from "cookie-parser";
import workoutRouter from "./routes/workout.route";
import { wCommentCtrl } from "./controllers/wcomments.ctrl";
import { wCommentRouter } from "./routes/wcomment.router";
console.log("server");

const server = express();
server.use(express.json());
server.use(customReqLogger);
server.use(cors(corsOptions));
server.use(cookies());

// just for now stopping log LogMaintainer
// server.use(LogMaintainer);

// custom routes
// auth routes
server.use("/api/auth", authRouter);
// event routes
server.use("/api/events", eventsRouter);
// workout routes
server.use("/api/workouts", workoutRouter);
// comments router
server.use("/api/wComments", wCommentRouter);

// custom error handler
server.use(customErrorHandler);

server.listen(PORT, async () => {
  try {
    await connectToDB();
    log.info("connected to mongoose.");
    server.listen(5000, () =>
      console.log(`server started listening at port ${PORT}`)
    );
  } catch (error: any) {
    log.info(error.message);
  }
});
