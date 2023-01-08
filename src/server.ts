import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import LogMaintainer from "./middleware/LogMaintainer";
import log from "./utils/logger";
import { PORT } from "./config/ENV";
console.log("server");

const server = express();
server.use(cors(corsOptions));
server.use(LogMaintainer);
server.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("hello user");
});

server.listen(PORT, () => {
  log.info(`server started at port: ${PORT}`);
});
