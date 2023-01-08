import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import corsOptions from "./config/corsOptions";
import LogMaintainer from "./middleware/LogMaintainer";
console.log("server");

const server = express();
server.use(cors(corsOptions));
server.use(LogMaintainer);
server.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("hello user");
});

server.listen(5000);
