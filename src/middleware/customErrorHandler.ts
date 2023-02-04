import { NextFunction, Request, Response } from "express";

export const customErrorHandler = async (err: any, req: Request, res:Response, next: NextFunction) => {
    let statusCode;
    if (err.status >= 100 && err.status < 600){
        statusCode = err.status
    }
    else{
      statusCode = 500
  }
    const message = err.message
    const stack = err.stack ? err.stack : "no stack is provided."
    
    console.log("ceh end.");
    res.status(statusCode).json({
        statusText: "failure", statusCode, message, stack
    })
}