import { NextFunction, Request, Response } from "express";

export const customErrorHandler = async (err: any, req: Request, res:Response, next: NextFunction) => {
    let errstatus;
    if (err.status >= 100 && err.status < 600){
        errstatus = err.status
    }
    else{
      errstatus = 500
  }
    const message = err.message
    const stack = err.stack ? err.stack : "no stack is provided."
    
    console.log("ceh end.");
    res.status(errstatus).json({
        errstatus, message, stack
    })
}