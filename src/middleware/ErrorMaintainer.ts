import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

const errorWriter = async (
  message: string,
  fileName: string
): Promise<void> => {
  const time: string = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");
  const data: string = `${time}\t${uuid()}\t${message}\n`;
  if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
    await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
  }
  await fsPromises.appendFile(
    path.join(__dirname, "..", "logs", fileName),
    data
  );
  return;
};

const ErrorMaintainer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const message = `${req.method}\t${req.path}\t${req.headers.origin}`;
  console.error(message);
  await errorWriter(message, "errors.log");
  return next();
};

export default ErrorMaintainer;
