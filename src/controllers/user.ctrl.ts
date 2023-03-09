import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import userModel from "../models/userModel";
import { customError } from "../utils/customError";

const getUser = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const user = await userModel.findById(id);

    // user not found error
    if (!user) {
      throw new customError(404, "getUser failed: requested user not found");
    }

    // response
    res.status(200).json({
      statusText: "success",
      statusCode: 200,
      message: "getUser success",
      payload: user,
    });
  }
);

export const userCtrl = { getUser };
