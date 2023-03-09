import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

const customReqLogger = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method}   ${req.url}`);
    console.log(req.body);

    next();
  }
);

export default customReqLogger;
