import mongoose from "mongoose";
import { z } from "zod";
import { paramsMongooseIdCheck } from "./event.vali.sche";

// get all comments
const getAll = paramsMongooseIdCheck;

// create comment
const create = z.object({
  body: z.object({
    userId: z
      .string({ required_error: "userId is a required field" })
      .refine((userId) => mongoose.isValidObjectId(userId), {
        message: "comment creteation failed: userId is not a valid mongoose id",
      }),
    workoutId: z
      .string({ required_error: "workoutId is a required field" })
      .refine((workoutId) => mongoose.isValidObjectId(workoutId), {
        message:
          "comment creteation failed: workoutId is not a valid mongoose id",
      }),
    content: z.string({ required_error: "content is a required field" }),
  }),
});

// update comment
const update = paramsMongooseIdCheck.extend({
  body: z.object({
    content: z.string({ required_error: "content is a required field" }),
  }),
});

// delete comment
const deleteWComment = paramsMongooseIdCheck;

export const wCommentvalische = {
  getAll,
  create,
  update,
  deleteWComment,
};
